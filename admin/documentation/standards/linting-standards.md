# Linting Standards

This document will outline the rules and conventions all written code should adhere to in order to pass the linting checks using ESLint (JS) and HTMLHint (HTML).

## ESLint (JS) Standards

### Variables
- All variables must be declared.
- All declared variables must be used.
- Use ```let```/```const``` over ```var```.
- Use ```const``` if the variable is never reassigned (static variable).

### Functions
- All functions should not be empty.
- All functions must be used.
- Both functions bound by declarations or arrow functions can be used.
  - Declaration: ```function exampleFunction() { code...; }```
  - Arrow Function: ```(ex) => { return ex + 1; }```

### Arrays and Objects
- Use destructuring to unpack values from arrays and properties from objects.
- Use dot notation to access properties and methods of objects.
- Do not use the ```Array``` constructor.

### Code Style
- Use semicolons to terminate statements.
- Use single quotes for strings: ```'string'```.
- Use 2-space indendation.
- Use a maximum of 1 empty line between statements.
- Use Camel Casing for variables: ```exampleVarEx```.

### Best Practices
- Use ```===``` and ```!==``` (strict equality without type conversion) to evaluate equality.
- Do not use ```eval()``` function.
- Do not use ```with``` statements.
- Do not use ```alert()```, ```confirm()```, or ```prompt()``` statements.
- Do not leave ```console.*``` statements in production build.

### ES6+
- Use arrow functions with braces (multiple statements) or without braces (single value).
  - Single value: ```let foo = () => 0;```
  - Multiple statements:
    ```
    let foo = (ex, prop) => {
      ex[prop] = true;
      return ex;
    };
    ```
- Use arrow functions for callbacks: ```foo(a => a);```.
- Use template literals for multi-line strings:
  ```
  `line 1
  line 2`
  ```
- Do not add an empty constructor or a constructor that delegates the class into its parent class.

### JSDoc Enforcement
- Use JSDoc for the following nodes:
  - Function declaration
  - Method definition
  - Class declaration
  - Arrow function expression
  - Function expression
 - Add missing parameters with types and descriptions: ```@param {boolean} foo A parameter Foo.```.
 - Add returns with types: ```@returns {boolean}```.
 - Use only valid JSDoc, Closure compiler, or TypeScript types/namepaths with the correct casing: ```symbol```, ```Array```, etc.
 - Do not use ```undefined``` types.

### Type Checking (using JSDoc types)
- Use a string of a valid type for ```typeof``` checking.
- Do not use implied ```eval()``` in methods, where Javascript code is sent as a string to be interpreted: ```function('foo('Hello world!');')```.
- Do not use ```new Function()```.

## HTMLHint (HTML) Standards

