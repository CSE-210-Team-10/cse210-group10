import js from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  js.configs.recommended,
  {
    plugins: {
      jsdoc: jsdoc,
    },
    languageOptions: {
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        console: 'readonly', // Added for console
        HTMLElement: 'readonly', // Added for web components
        CSSStyleSheet: 'readonly', // Added for constructable stylesheets
        CustomEvent: 'readonly', // Added for custom events
        customElements: 'readonly', // Added for custom elements registry

        MouseEvent: 'readonly',
        InputEvent: 'readonly',
        HTMLInputElement: 'readonly',
        KeyboardEvent: 'readonly',
        SubmitEvent: 'readonly',
        FormData: 'readonly',
        HTMLSpanElement: 'readonly',
        NodeListOf: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLDialogElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLSlotElement: 'readonly',
        HTMLDetailsElement: 'readonly',
        HTMLSelectElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLAnchorElement: 'readonly',
        HTMLImageElement: 'readonly',
        HTMLVideoElement: 'readonly',
        Node: 'readonly',
        HTMLLIElement: 'readonly',

        // ES2021 globals
        Promise: 'readonly',
        Set: 'readonly',
        Map: 'readonly',
        WeakSet: 'readonly',
        WeakMap: 'readonly',
        BigInt: 'readonly',
        globalThis: 'readonly',

        // Jest globals
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
      ecmaVersion: 2022,
      sourceType: 'module',
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
      // 'no-console': 'warn', // Flag console.* usage

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
