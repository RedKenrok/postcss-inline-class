const replaceClassName = require('./utils/replaceClassName.js')
const findInlineDeclarations = require('./utils/findInlineDeclarations.js')
const findNestedRules = require('./utils/findNestedRules.js')
const findMediaQueries = require('./utils/findMediaQueries.js')

const plugin = (options = {}) => {
  options = Object.assign({
    atRuleName: 'reuse',
  }, options)

  return {
    postcssPlugin: 'postcss-reuse',

    Once (root) {
      const newNodes = []
      const atRuleWalker = (atRule) => {
        // Deconstruct selectors.
        const targetSelectors = atRule.params.split(',').map(param => param.trim())

        // Find declarations to replace with.
        const matchedDeclarations = findInlineDeclarations(root, targetSelectors)

        // Create additional rules for media and nested queries.
        for (const targetSelector of targetSelectors) {
          const nestedRules = findNestedRules(root, targetSelector)
          for (const nestedRule of nestedRules) {
            nestedRule.selector = replaceClassName(
              nestedRule.selector,
              targetSelector,
              atRule.parent.selector
            )
          }
          newNodes.push(...nestedRules)

          const mediaQueries = findMediaQueries(root, targetSelector)
          for (const mediaQuery of mediaQueries) {
            for (const node of mediaQuery.nodes) {
              node.selectors = node.selectors.map((selector) => replaceClassName(selector, targetSelector, atRule.parent.selector))
            }
          }
          newNodes.push(...mediaQueries)
        }

        // Replace at rule with matched declarations.
        atRule.replaceWith(matchedDeclarations)
      }

      // Start walking the tree.
      root.walkRules((rule) => rule.walkAtRules(options.atRuleName, atRuleWalker))

      // Append new nodes to tree.
      root.append(...newNodes)
    },
  }
}

plugin.postcss = true

module.exports = plugin
