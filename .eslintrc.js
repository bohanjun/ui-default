// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  plugins: [
    'babel',
    'react',
  ],
  env: {
    browser: true,
    es6: true,
    jquery: true,
    commonjs: true,
  },
  extends: [
    'airbnb',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 7,
    ecmaFeatures: {
      impliedStrict: true,
      experimentalObjectRestSpread: true,
      jsx: true,
      legacyDecorators: true,
    },
    babelOptions: {
      configFile: './babel.config.js',
    },
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            extensions: ['.js', '.jsx'],
            alias: {
              vj: path.resolve(__dirname),
            },
          },
        },
      },
    },
  },
  globals: {
    __webpack_public_path__: true,
    __webpack_require__: true,
    UiContext: true,
    UserContext: true,
    Context: true,
    LOCALES: true,
    window: true,
  },
  rules: {
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    indent: [
      'error',
      2,
      {
        SwitchCase: 0,
      },
    ],
    'max-len': ['error', 150],
    quotes: 'warn',
    'class-methods-use-this': 'off',
    'consistent-return': 'warn',
    'func-names': 'off',
    'import/first': 'off',
    'import/no-extraneous-dependencies': 'off',
    'max-classes-per-file': 'off',
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'no-continue': 'off',
    'no-mixed-operators': 'off',
    'no-multi-assign': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'no-underscore-dangle': 'off',
    'no-await-in-loop': 'off',
    'no-lonely-if': 'off',
    'no-param-reassign': 'off',
    'no-bitwise': 'off',
    'react/prefer-stateless-function': 'off',
    'react/static-property-placement': 'off',
    'react/self-closing-comp': 'off',
    'react/prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-string-refs': 'off',
    'react/require-default-props': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/destructuring-assignment': 'off',
    'react/button-has-type': 'off',
    'react/forbid-prop-types': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
  },
};
