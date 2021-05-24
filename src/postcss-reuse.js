const utilSplit = require('./utils/split.js')
const utilSelector = require('./utils/selector.js')

/**
 * Create plugin instance.
 * @param {Object} options plugin options.
 * @returns Plugin instance.
 */
const plugin = (options = {}) => {
  if (options && options.atRuleName) {
    // Ensure at rule name is lowercase.
    options.atRuleName = options.atRuleName.toLowerCase()
  }
  // Merge options with default.
  options = Object.assign({
    atRuleName: 'reuse',
    mode: 'selector', // 'class' or 'selector'.
  }, options)

  // Cache rules here for quick lookup.
  let rulesCache

  /**
   * Returns all rules matching the selector.
   */
  const getMatchingRules = (selectorParse) => {
    const matchedRules = []

    for (const rule of rulesCache) {
      // Lazily parse selectors.
      if (!rule.selectorsParsed) {
        rule.selectorsParsed = utilSelector.parse(rule.selectors).nodes
      }

      // Find matches with the rule's selectors.
      const matchedSelectors = []
      for (const ruleSelector of rule.selectorsParsed) {
        const ranges = utilSelector.getRanges(selectorParse.nodes, ruleSelector.nodes)
        if (ranges.length > 0) {
          matchedSelectors.push(
            Object.assign({}, ruleSelector, {
              ranges: ranges,
            })
          )
        }
      }

      // If a match is found add the rule to the results.
      if (matchedSelectors.length > 0) {
        matchedRules.push(
          Object.assign({}, rule, {
            matchedSelectors: matchedSelectors,
          })
        )
      }
    }

    return matchedRules
  }

  return {
    postcssPlugin: 'postcss-reuse',

    Once: () => {
      rulesCache = []
    },
    AtRule: {
      /**
       * Inline the declarations retrieved using the given selectors.
       */
      [options.atRuleName]: (atRule, { AtRule, Rule, result }) => {
        // Exit early if at rule not in a valid parent.
        if (!atRule.parent || atRule.parent.type !== 'rule') {
          result.warn('Parent of at rule not of type rule.')
          return
        }

        const atRuleSelectorParsed = utilSelector.parse(atRule.parent.selectors)
        const declarations = []
        let ruleTail = atRule.parent
        let rootTail = atRule.parent

        // Split selector.
        const selectors = (options.mode === 'class') ? utilSplit.space(atRule.params) : utilSplit.comma(atRule.params)
        for (let selector of selectors) {
          // Convert from class to selector.
          if (options.mode === 'class') {
            selector = utilSelector.fromClass(selector)
          }
          const selectorParse = utilSelector.parse(selector).nodes[0]

          const rules = getMatchingRules(selectorParse)
          if (rules.length === 0) {
            result.warn('No rules found matching selector: "' + selector + '".')
          }

          for (const rule of rules) {
            // Clone nodes.
            const nodes = rule.nodes.map(node => node.clone())

            const newRules = []
            for (const matchedSelector of rule.matchedSelectors) {
              // If no parent to keep in mind that simply add to the replacement list.
              if (!rule.parent && matchedSelector.ranges.length === 1 && matchedSelector.ranges[0][0] === 0 && matchedSelector.ranges[0][1] === (matchedSelector.nodes.length - 1)) {
                declarations.push(...nodes)
                continue
              }

              let newSelector = utilSelector.replace(matchedSelector, matchedSelector.ranges, atRuleSelectorParsed.nodes)
              newSelector = utilSelector.stringify(newSelector)
              const newRule = new Rule({
                nodes: nodes,
                selector: newSelector,
                type: atRule.parent.type,
              })

              if (!rule.parent) {
                ruleTail.parent.insertAfter(ruleTail, newRule)
                ruleTail = newRule
                continue
              }

              newRules.push(newRule)
            }

            if (newRules.length > 0) {
              // TODO: Look up for other atRules.
              // Create a new parent rule.
              const parentRule = new AtRule({
                name: rule.parent.name,
                nodes: [newRules],
                params: rule.parent.params,
                type: rule.parent.type,
              })

              // Add parent after current tail.
              rootTail.parent.insertAfter(rootTail, parentRule)
              rootTail = parentRule
            }
          }
        }

        // Replace declarations in the list.
        atRule.replaceWith(declarations)
      },
    },
    /**
     * Cache all nodes by its selector for easy look up later.
     */
    RuleExit (rule) {
      // Check if rule has nodes.
      if (!rule.nodes || rule.nodes.length === 0) {
        return
      }

      // Cache simplified.
      rulesCache.push({
        nodes: rule.nodes,
        parent: (rule.parent.type === 'atrule') ? rule.parent : null,
        selectors: rule.selectors,
      })
    },
  }
}

plugin.postcss = true

module.exports = plugin
