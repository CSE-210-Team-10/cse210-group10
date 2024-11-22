import js from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  js.configs.recommended,
  {
    plugins: {
      jsdoc: jsdoc,
    },
    rules: {
      // Variables
      'no-unused-vars': 'error', // Prevent unused variables
      'no-undef': 'error', // Prevent undeclared variables
      'no-var': 'error', // Prefer let/const over var
      'prefer-const': 'error', // Use const if variable never reassigned

      // Functions
      'no-unused-expressions': 'error', // Prevent unused expressions
      'no-empty-function': 'warn', // Flag empty functions
      'func-style': [
        'error',
        'declaration',
        {
          allowArrowFunctions: true,
        },
      ], // Allow both declarations and arrows

      // Arrays & Objects
      'prefer-destructuring': 'error', // Use destructuring where possible
      'dot-notation': 'error', // Use dot notation when possible
      'no-array-constructor': 'error', // Avoid Array constructor

      // Code Style
      semi: ['error', 'always'], // Require semicolons
      quotes: ['error', 'single'], // Single quotes for strings
      indent: ['error', 2], // 2 space indentation
      'no-multiple-empty-lines': ['error', { max: 1 }],
      camelcase: 'error', // Use camelCase for variables

      // Best Practices
      eqeqeq: 'error', // Require === and !==
      'no-eval': 'error', // Prevent eval()
      'no-with': 'error', // Prevent with statements
      'no-alert': 'warn', // Flag alert/confirm/prompt
      'no-console': 'warn', // Flag console.* usage

      // ES6+
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-arrow-callback': 'error', // Use arrow functions for callbacks
      'prefer-template': 'error', // Use template literals
      'no-useless-constructor': 'error',

      // JSDoc Enforcement
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
      'jsdoc/require-param': 'error',
      'jsdoc/require-param-type': 'error',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-type': 'error',
      'jsdoc/valid-types': 'error',
      'jsdoc/check-types': 'error',
      'jsdoc/no-undefined-types': 'error',

      // Type Checking (using JSDoc types)
      'valid-typeof': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
    settings: {
      jsdoc: {
        mode: 'typescript', // Better type checking
      },
    },
  },
];