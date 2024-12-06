/**
 * Standardizes a string by converting it to lowercase.
 *
 * @param {string} input - The string to be standardized.
 * @returns {string} The standardized string, converted to lowercase.
 */
export function standardizeString(input) {
  return input.toLowerCase().trim();
}

/**
 * Filter an array of JSON objects based on a key-value pair.
 *
 * @param {Array} array - The array of JSON objects to be filtered.
 * @param {string} key - The key to filter by.
 * @param {string} value - The value to filter by.
 * @returns {Array} The filtered array of JSON objects.
 */
export function filterByProperty(array, key, value) {
  return array.filter((item) => item[key] === value);
}
