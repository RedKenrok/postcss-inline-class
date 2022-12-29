const os = require('os')
const {
  getPseudoClass,
  splitSelectors
} = require('./utilities/selector.js')

const plugin = (options = {}) => {
  if (options) {
    if (typeof (options) !== 'object' || Array.isArray(options)) {
      throw new Error('Plugin options are of an invalid type.')
    }
    if (options.pseudoClass) {
      // Ensure pseudo class name is lowercase.
      options.pseudoClass = options.pseudoClass.toLowerCase()
    }
  }
  // Merge options with default.
  options = Object.assign({
    pseudoClass: 'or',
  }, options ? options : {})

  return {
    postcssPlugin: 'postcss-reuse',

    Rule: (rule, { result }) => {
      let selectorsFinal = []
      let selectorsToCheck = splitSelectors(rule.selector)
      let changed = false
      do {
        const selectorsIntermittent = []
        for (let i = 0; i < selectorsToCheck.length; i++) {
          const selector = selectorsToCheck[i]
          // Get pseudo class data.
          let pseudoData = null
          try {
            pseudoData = getPseudoClass(selector, options.pseudoClass)
          } catch {
            rule.warn(result, 'Failed to parse selector "' + rule.selector + '"')
          }
          if (!pseudoData) {
            selectorsFinal.push(selector)
            continue
          }
          changed = true

          // Segment the content and process it.
          const contentSegments = splitSelectors(pseudoData.content)
          for (let i = 0; i < contentSegments.length; i++) {
            const contentSegment = contentSegments[i].trim()
            // Create new selectors.
            selectorsIntermittent.push(
              selector.substring(0, pseudoData.start) +
              contentSegment +
              selector.substring(pseudoData.end)
            )
          }
        }
        selectorsToCheck = selectorsIntermittent
      } while (selectorsToCheck.length > 0)

      // Check if rule has changed.
      if (!changed) {
        return
      }

      // Update rule.
      rule.replaceWith(
        rule.clone({
          selector: selectorsFinal.join(',' + os.EOL)
        })
      )
    },
  }
}

plugin.postcss = true

module.exports = plugin
