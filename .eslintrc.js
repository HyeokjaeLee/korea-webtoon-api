module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    node: true,
    es6: true,
  },
};
