import { standardize_string } from '../src/index.js';

describe('standardize_string', () => {
  test('Should return an empty string when the input is an empty string', () => {
    const result = standardize_string('');
    expect(result).toBe('');
  });

  test('standardize_string returns the same string when input is already standardized', () => {
    const input = 'already lowercase string';
    const result = standardize_string(input);
    expect(result).toBe(input);
  });

  test('standardize_string removes leading and trailing whitespaces', () => {
    const input = '  Hello World  ';
    const expected = 'hello world';
    expect(standardize_string(input)).toBe(expected);
  });

  test('standardize_string should handle multiple whitespaces between words', () => {
    const input = 'Hello   World    Test';
    const expected = 'hello   world    test';
    const result = standardize_string(input);
    expect(result).toBe(expected);
  });

  test('standardize_string should throw a TypeError if input is null', () => {
    expect(() => standardize_string(null)).toThrow(TypeError);
    expect(() => standardize_string(null)).toThrow(
      "Cannot read properties of null (reading 'toLowerCase')"
    );
  });

  test('standardize_string should throw a TypeError if input is undefined', () => {
    expect(() => standardize_string(undefined)).toThrow(TypeError);
    expect(() => standardize_string(undefined)).toThrow(
      "Cannot read properties of undefined (reading 'toLowerCase')"
    );
  });

  test('standardize_string should convert uppercase letters to lowercase', () => {
    const input = 'HELLO WORLD';
    const expected = 'hello world';
    const result = standardize_string(input);
    expect(result).toBe(expected);
  });
});
