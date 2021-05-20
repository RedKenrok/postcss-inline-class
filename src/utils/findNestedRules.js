const findNestedRules = (root, targetSelector) => {
  const nestedMatches = []

  root.walkRules((rule) => {
    if (rule.parent.type !== 'root') {
      return
    }

    if (rule.selectors.includes(targetSelector)) {
      return
    }

    const isNestedRule = rule.selectors.find((selector) => selector.includes(targetSelector))

    if (isNestedRule) {
      nestedMatches.push(rule.clone())
    }
  })

  return nestedMatches.map((match) => match.clone()).flat()
}

module.exports = findNestedRules
