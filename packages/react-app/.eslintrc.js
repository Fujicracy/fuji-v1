const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './.prettierrc'), 'utf8'),
);

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 11,
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
  extends: ['plugin:prettier/recommended', 'prettier'],
  plugins: ['prettier', 'json', 'react-hooks', 'import'],
  rules: {
    'arrow-body-style': 'off',
    'brace-style': ['error', '1tbs'],
    'prettier/prettier': ['error', prettierOptions],
    'react/forbid-prop-types': 'off',
    'react/jsx-no-bind': 'off',
    'import/no-dynamic-require': 'off',
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
    'no-debugger': 'off',
    'no-nested-ternary': 'off',
    'jsx-a11y/accessible-emoji': ['off'],
    'jsx-a11y/label-has-associated-control': ['off'],
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-props-no-spreading': ['off'],
  },
};
