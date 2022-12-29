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
  'removesRuleIfNotFound/test': {
    message: 'removesRuleIfNotFound',
    warnings: {
      text: 'No rules found matching selector: ".c".',
    },
  },
  'renameSelectors/test': {
    message: 'renameSelectors',
  },
  'renameSelectorsModeClass/test': {
    message: 'renameSelectorsModeClass',
    options: {
      mode: 'class',
    },
  },
  'selectorWithEscapedCharacter/test': {
    message: 'selectorWithEscapedCharacter',
  },
  'supportsCombinatorSelectors/test': {
    message: 'supportsCombinatorSelectors',
  },
  'supportsMediaQueries/test': {
    message: 'supportsMediaQueries',
  },
  'supportsMediaQueriesMultiple/test': {
    message: 'supportsMediaQueriesMultiple',
  },
  'supportsMultipleClassSelector/test': {
    message: 'supportsMultipleClassSelector',
  },
}
