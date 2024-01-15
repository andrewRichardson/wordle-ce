module.exports = {
  extends: ['stylelint-prettier'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'no-descending-specificity': null,
    'color-no-invalid-hex': true,
  },
};
