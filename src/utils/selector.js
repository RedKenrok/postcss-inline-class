const utilSplit = require('./split.js')
const tokenizer = require('css-selector-tokenizer')

/**
 * Find start and end indices of one node list in another node list.
 * @param {Array} findNodes Node list to find.
 * @param {Array} scanNodes Node list to scan for the find nodes.
 * @returns {Array<Array<Int>>} Groups of start and end indices.
 */
const getRanges = (findNodes, scanNodes) => {
  const ranges = []

  // Do initial comparison to find starting indices.
  const scanLength = scanNodes.length - findNodes.length
  for (let scanIndex = 0; scanIndex <= scanLength; scanIndex++) {
    const scanNode = scanNodes[scanIndex]
    if (match(findNodes[0], scanNode)) {
      ranges.push([
        scanIndex,
        scanIndex,
      ])
    }
  }

  // Exit early if nothing is found.
  if (ranges.length === 0) {
    return ranges
  }

  // Start comparing with all other find nodes.
  for (let findIndex = 1; findIndex < findNodes.length; findIndex++) {
    const findNode = findNodes[findIndex]

    // Check for a match in the next node.
    for (let rangeIndex = ranges.length - 1; rangeIndex >= 0; rangeIndex--) {
      const range = ranges[rangeIndex]
      // Increment end range.
      range[1] += 1

      if (!match(findNode, scanNodes[range[1]])) {
        // Discard it as soon as a non-matching node is found.
        ranges.splice(rangeIndex, 1)
      }
    }

    // Exit early if nothing is found.
    if (ranges.length === 0) {
      return ranges
    }
  }

  return ranges
}

/**
 * Convert class name to a selector.
 * @param {String} className Class name.
 * @returns {String} Selector.
 */
const fromClass = (className) => {
  return '.' + className.replaceAll('.', '\\.').replaceAll(':', '\\:')
}

const match = (a, b) => {
  if (a.type !== b.type) {
    return false
  }

  switch (a.type) {
    case 'attribute':
      if (a.content !== b.content) {
        return false
      }
      break

    case 'class':
    case 'element':
    case 'id':
    case 'pseudo-element':
      if (a.name !== b.name) {
        return false
      }
      break

    case 'nested-pseudo-class':
      if (a.name !== b.name || !matchAll(a.nodes, b.nodes)) {
        return false
      } // These should always fully match.
      break

    case 'operator':
      if (a.operator !== b.operator) {
        return false
      }
      break

    case 'spacing':
      break

    default:
      return false
  }

  return true
}

/**
 * Check if node lists fully match.
 * @param {Array} aNodes Node list a.
 * @param {Array} bNodes Node list b.
 * @returns {Boolean} Whether the node lists match.
 */
const matchAll = (aNodes, bNodes) => {
  if (aNodes.length !== bNodes.length) {
    return false
  }

  for (let i = 0; i < aNodes.length; i++) {
    if (!match(aNodes[i], bNodes[i])) {
      return false
    }
  }

  return true
}

/**
 * Parse selector to its individual tokes.
 * @param {String} selectors Selectors to parse as a single string.
 * @param {Array} selectorsSplit Selectors to parse split to a list.
 * @returns {Object} Parsed selectors.
 */
const parse = (selectors, selectorsSplit = null) => {
  // Ensure we have the selectors individually and as a single string.
  if (!selectorsSplit) {
    if (Array.isArray(selectors)) {
      selectorsSplit = selectors
      selectors = selectors.join(', ')
    } else {
      selectorsSplit = utilSplit.comma(selectors)
    }
  }

  const root = tokenizer.parse(selectors)
  for (let i = 0; i < selectorsSplit.length; i++) {
    const rootNode = root.nodes[i]

    // Store selector node.
    rootNode.selector = selectorsSplit[i]
    // Remove nodes with invalid type.
    for (let i = rootNode.nodes.length - 1; i >= 0; i--) {
      // If the node after or before is an operator then remove the space.
      if (rootNode.nodes[i].type === 'spacing') {
        if ((i > 0 && rootNode.nodes[i - 1].type === 'operator') || (i < (rootNode.nodes.length - 1) && rootNode.nodes[i + 1].type === 'operator')) {
          rootNode.nodes.splice(i, 1)
        }
      }
    }
  }
  return root
}

/**
 * Replace segments of the selector.
 * @param {Object} selector Parsed selector.
 * @param {Array<Array<Int>>} ranges List of tart and end index of segments to replace.
 * @param {Array<Object>} replacements Selector nodes to place back.
 * @returns {Object} Changed selector.
 */
const replace = (selector, ranges, replacements) => {
  if (ranges.length <= 0) {
    return selector
  }

  let offset = 0
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i]

    // Calculate the start and end index of the replacement.
    const indexStart = range[0] + (offset * i)
    const indexEnd = (range[1] + 1 + (offset * i)) - indexStart

    // Add offset this replacements will introduce.
    offset += replacements.length - (indexEnd - indexStart)

    // Replace the nodes in the selector.
    selector.nodes.splice(indexStart, indexEnd, ...replacements)
  }

  return selector
}

/**
 * Stringifies parsed selector.
 * @param {Object} selector Selector to parse.
 * @returns {String} Selector as string.
 */
const stringify = (selector) => {
  return tokenizer.stringify(selector)
}

module.exports = {
  getRanges: getRanges,
  fromClass: fromClass,
  match: match,
  matchAll: matchAll,
  parse: parse,
  replace: replace,
  stringify: stringify,
}
