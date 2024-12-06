import { standardizeString } from '../src/js/library.js';

describe('standardizeString', () => {
  test('Should return an empty string when the input is an empty string', () => {
    const result = standardizeString('');
    expect(result).toBe('');
  });

  test('standardizeString returns the same string when input is already standardized', () => {
    const input = 'already lowercase string';
    const result = standardizeString(input);
    expect(result).toBe(input);
  });

  test('standardizeString removes leading and trailing whitespaces', () => {
    const input = '  Hello World  ';
    const expected = 'hello world';
    expect(standardizeString(input)).toBe(expected);
  });

  test('standardizeString should handle multiple whitespaces between words', () => {
    const input = 'Hello   World    Test';
    const expected = 'hello   world    test';
    const result = standardizeString(input);
    expect(result).toBe(expected);
  });

  test('standardizeString should throw a TypeError if input is null', () => {
    expect(() => standardizeString(null)).toThrow(TypeError);
    expect(() => standardizeString(null)).toThrow(
      'Cannot read properties of null (reading \'toLowerCase\')'
    );
  });

  test('standardizeString should throw a TypeError if input is undefined', () => {
    expect(() => standardizeString(undefined)).toThrow(TypeError);
    expect(() => standardizeString(undefined)).toThrow(
      'Cannot read properties of undefined (reading \'toLowerCase\')'
    );
  });

  test('standardizeString should convert uppercase letters to lowercase', () => {
    const input = 'HELLO WORLD';
    const expected = 'hello world';
    const result = standardizeString(input);
    expect(result).toBe(expected);
  });
});
