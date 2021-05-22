const utilList = require('./utils/list.js')
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
  }, options)

  // Cache rules here for quick lookup.
  let rulesCache

  /**
   * Returns all rules matching the selector.
   */
  const getMatchingRules = (selector) => {
    const matchedRules = []
    for (const rule of rulesCache) {
      const matchedSelectors = []
      for (const ruleSelector of rule.selectors) {
        if (ruleSelector.indexOf(selector) >= 0) {
          matchedSelectors.push(ruleSelector)
        }
      }
      if (matchedSelectors.length >= 0) {
        matchedRules.push(Object.assign(rule, {
          matchedSelectors: matchedSelectors,
        }))
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
      [options.atRuleName]: (atRule, { AtRule, Rule }) => {
        const declarations = []
        let tail = atRule.parent
        let parentTail = atRule.parent

        // Split selector.
        const selectors = utilList.comma(atRule.params)
        for (const selector of selectors) {
          const rules = getMatchingRules(selector)
          for (const rule of rules) {
            // Clone nodes.
            const nodes = rule.nodes.map(node => node.clone())

            const newRules = []
            for (const matchedSelector of rule.matchedSelectors) {
              // If no parent to keep in mind that simply add to the replacement list.
              if (matchedSelector === selector) {
                declarations.push(...nodes)
                continue
              }

              const newRule = new Rule({
                nodes: nodes,
                selector: utilSelector.replace(matchedSelector, selector, atRule.parent.selector),
                type: atRule.parent.type,
              })

              if (!rule.parent) {
                atRule.parent.parent.insertAfter(tail, newRule)
                tail = newRule
                continue
              }

              newRules.push(newRule)
            }

            if (newRules.length > 0) {
              // TODO:: Recursively look up for other atRules.
              // Create a new parent rule.
              const parentRule = new AtRule({
                name: rule.parent.name,
                nodes: [newRules],
                params: rule.parent.params,
                type: rule.parent.type,
              })

              // Add parent after current tail.
              atRule.parent.parent.insertAfter(parentTail, parentRule)
              parentTail = parentRule
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
