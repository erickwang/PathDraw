module.exports = {
  parser: "babel-eslint",
  extends: [
    'eslint-config-airbnb-base',
    'eslint-config-airbnb-base/rules/strict',
    './react',
    './react-a11y',
  ].map(require.resolve),
  rules: {}
};