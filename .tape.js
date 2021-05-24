module.exports = {
  'basic/test': {
    message: 'basic',
  },
  'complex/test': {
    message: 'complex',
  },
  'copiesAllDeclarations/test': {
    message: 'copiesAllDeclarations',
  },
  'doesNotOverwriteOverlappingNames/test': {
    message: 'doesNotOverwriteOverlappingNames',
  },
  'modeClass/test': {
    message: 'modeClass',
    options: {
      mode: 'class',
    },
  },
  'modeClassEscaping/test': {
    message: 'modeClassEscaping',
    options: {
      mode: 'class',
    },
  },
  'multipleSelectors/test': {
    message: 'multipleSelectors',
  },
  'removesRuleIfCannotFindClass/test': {
    message: 'removesRuleIfCannotFindClass',
    warnings: {
      text: 'No rules found matching selector: ".c".',
    },
  },
  'selectorWithEscapedCharacter/test': {
    message: 'selectorWithEscapedCharacter',
  },
  'supportsMediaQueries/test': {
    message: 'supportsMediaQueries',
  },
  'supportsMediaQueriesMultiple/test': {
    message: 'supportsMediaQueriesMultiple',
  },
  'supportsCombinatorSelectors/test': {
    message: 'supportsCombinatorSelectors',
  },
  'supportsMultipleClassSelector/test': {
    message: 'supportsMultipleClassSelector',
  },
};
