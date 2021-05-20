const findInlineDeclarations = (root, targetSelector) => {
  const inlineDeclarations = []

  root.walkRules((rule) => {
    if (rule.selectors.includes(targetSelector) && rule.parent.type === 'root') {
      inlineDeclarations.push(rule)
    }
  })

  return inlineDeclarations.map((match) => match.clone().nodes).flat()
}

module.exports = findInlineDeclarations
