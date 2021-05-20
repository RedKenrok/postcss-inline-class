const replaceClassName = require('./utils/replaceClassName.js')
const findInlineDeclarations = require('./utils/findInlineDeclarations.js')
const findNestedRules = require('./utils/findNestedRules.js')
const findMediaQueries = require('./utils/findMediaQueries.js')

const processAtRule = (atRule, root, targetSelector, onError) => {
  const matchedDeclarations = findInlineDeclarations(root, targetSelector)
  const nestedRules = findNestedRules(root, targetSelector)
  const mediaQueries = findMediaQueries(root, targetSelector)

  if (matchedDeclarations.length === 0 && nestedRules.length === 0) {
    onError(`Could not find class '${targetSelector}'`)
    return []
  }

  for (const nestedRule of nestedRules) {
    nestedRule.selector = replaceClassName(
      nestedRule.selector,
      targetSelector,
      atRule.parent.selector
    )
  }

  for (const mediaQuery of mediaQueries) {
    for (const node of mediaQuery.nodes) {
      node.selectors = node.selectors.map((selector) => replaceClassName(selector, targetSelector, atRule.parent.selector))
    }
  }

  atRule.replaceWith(matchedDeclarations)
  return [...nestedRules, ...mediaQueries]
}

const plugin = (options = {}) => {
  options = Object.assign({
    atRuleName: 'reuse',
  }, options)

  return {
    postcssPlugin: 'postcss-reuse',

    Once (root, { result }) {
      const newNodes = []
      const atRuleWalker = (atRule) => {
        const onError = (message) => {
          atRule.warn(result, message)
          atRule.remove()
        }

        const selectors = atRule.params.split(',')
        for (const selector of selectors) {
          newNodes.push(...processAtRule(atRule, root, selector.trim(), onError))
        }
      }

      root.walkRules((rule) => rule.walkAtRules(options.atRuleName, atRuleWalker))

      root.append(...newNodes)
    },
  }
}

plugin.postcss = true

module.exports = plugin
