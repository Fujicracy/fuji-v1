const fs = require('fs')
const path = require('path')

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './.prettierrc'), 'utf8'),
)

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb', 'plugin:prettier/recommended', 'prettier'],
  plugins: ['prettier', 'json', 'react', 'react-hooks'],
  rules: {
    'arrow-body-style': ['error', 'always'],
    'brace-style': ['error', '1tbs'],
    'prettier/prettier': ['error', prettierOptions],
    'react/forbid-prop-types': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    'prefer-destructuring': 'off',
    'prefer-template': 'off',
    'react/prop-types': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/sort-prop-types': [
      'error',
      {
        callbacksLast: true,
      },
    ],
    'react/destructuring-assignment': 'off',
    'no-console': 'off',
    'jsx-a11y/accessible-emoji': ['off'],
    'jsx-a11y/label-has-associated-control': ['off'],
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-props-no-spreading': ['off'],
  },
}
