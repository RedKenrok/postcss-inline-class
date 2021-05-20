module.exports = {
  'basic/test': {
    message: 'can inline rules from same file',
  },
  'copiesAllDeclarations/test': {
    message: 'copies all statements, even if they are spread throughout multiple blocks',
  },
  'removesRuleIfCannotFindClass/test': {
    message: 'removes statements that cannot be resolved',
    warnings: {
      text: "Could not find class '.c'",
    },
  },
  'doesNotOverwriteOverlappingNames/test': {
    message: 'does not overwrite overlapping names',
  },
  'supportsMediaQueries/test': {
    message: 'supports media queries',
  },
  'supportsCombinatorSelectors/test': {
    message: 'supports combinator selectors',
  },
  'supportsMultipleClassSelector/test': {
    message: 'supports multiple class selectors',
  },
  'complex/test': {
    message: 'all combined',
  },
};
