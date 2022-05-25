module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // prevent errors of function argument defined by type
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],

    'import/extensions': ['error', 'ignorePackages', {
      ts: 'never',
    }],

    'no-use-before-define': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
