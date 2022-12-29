/**
 * Get the start, length, end, and content of the first matching pseudo class found.
 * @param {string} selector selector to read from.
 * @param {string} pseudoClassName Name of the pseudo class to extract.
 * @returns {Object|false} Object with data about the pseudo class or false if none were found.
 */
const getPseudoClass = (selector, pseudoClassName) => {
  // Get the first instance of the pseudo class.
  const start = selector.indexOf(':' + pseudoClassName + '(')
  if (start < 0) {
    return false
  }

  // Walk until the accompanying closing parenthesis.
  let content = ''
  let parenthesis = 0
  for (let i = (start + pseudoClassName.length + 2); i < selector.length; i++) {
    if (selector[i] === '(') {
      parenthesis++
    }
    if (selector[i] === ')') {
      if (parenthesis > 0) {
        parenthesis--
      } else {
        // Found closing parenthesis.
        break
      }
    }
    content += selector[i]
  }
  const length = content.length + pseudoClassName.length + 4
  const end = start + length

  return {
    start: start,
    length: length,
    end: end,

    selector: selector,
    content: content,
  }
}

/**
 * Split selector on comma.
 * @param {string} selector Selector to split
 * @param {boolean} trim Whether to trim the selector.
 * @returns {Array<string>} Array of selectors.
 */
const splitSelectors = (selector, trim = true) => {
  const selectors = []

  let parenthesis = 0
  let selectorTemp = ''
  for (let i = 0; i < selector.length; i++) {
    if (selector[i] === '(') {
      parenthesis++
      selectorTemp += selector[i]
      continue;
    }

    if (selector[i] === ')') {
      parenthesis--
      selectorTemp += selector[i]
      continue;
    }

    if (parenthesis === 0 && selector[i] === ',') {
      if (trim) {
        selectorTemp = selectorTemp.trim()
      }

      selectors.push(selectorTemp)
      selectorTemp = ''
      continue
    }

    selectorTemp += selector[i]
  }

  if (trim) {
    selectorTemp = selectorTemp.trim()
  }
  selectors.push(selectorTemp)

  return selectors
}

module.exports = {
  getPseudoClass: getPseudoClass,
  splitSelectors: splitSelectors,
}
