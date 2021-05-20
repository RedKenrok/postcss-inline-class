const findInlineDeclarations = (root, targetSelectors) => {
  const inlineDeclarations = []

  root.walkRules((rule) => {
    for (const targetSelector of targetSelectors) {
      if (rule.selectors.includes(targetSelector) && rule.parent.type === 'root') {
        inlineDeclarations.push(rule)
      }
    }
  })

  return inlineDeclarations.map((match) => match.clone().nodes).flat()
}

module.exports = findInlineDeclarations
