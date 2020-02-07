module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  parser:  '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'jest',
  ],
  settings:  {
    react:  {
      version:  'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
      },
    },
  },
  rules: {
    // general eslint rules
    'no-console': ['warn', { allow: ['debug'] } ],
    'no-plusplus': 'off',
    'default-case': 'warn',
    'no-confusing-arrow': 'off',

    // indenting and layout rules - turn off default eslint and use typescript
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],
    'max-len': ['error', { code: 120, tabWidth: 2 }],
    'import/prefer-default-export': 'off',

    // Typesscript rules - turn off no-undef as not needed with typescript
    'no-undef': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      // allowHigherOrderFunctions: true, - does not seem to work...
    }],
    '@typescript-eslint/no-explicit-any': 'warn',

    // React rules
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/button-has-type': 'off',
    'react/destructuring-assignment': 'warn',
    'react/sort-comp': 'warn',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'ts': 'never',
        'tsx': 'never',
        'js': 'never',
        'jsx': 'never',
      }
    ],
    'react/jsx-curly-newline': 'off',
    'arrow-parens': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'react/jsx-props-no-spreading': 'off',
  },
};
