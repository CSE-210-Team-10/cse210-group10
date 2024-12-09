import { fetchChatbotkey } from '../src/js/chatbot.js';

describe('fetchChatbotkey', () => {
  let originalFetch;

  beforeAll(() => {
    // Save the original fetch function
    originalFetch = globalThis.fetch;
  });

  afterAll(() => {
    // Restore the original fetch function
    globalThis.fetch = originalFetch;
  });

  /**
   * Test case to ensure fetchChatbotkey returns the API key on a successful fetch.
   * Mocks the fetch function to return a successful response with a mock API key.
   */
  test('returns API key on successful fetch', async () => {
    /**
     * Mock fetch function for simulating a successful API response.
     * @returns {Promise<object>} A mock fetch response with `ok: true` and a mock API key.
     */
    globalThis.fetch = async () => ({
      ok: true,
      text: async () => 'mock-api-key',
    });

    const result = await fetchChatbotkey();
    expect(result).toBe('mock-api-key');
  });

  /**
   * Test case to verify fetchChatbotkey returns an error message for a non-200 status response.
   * Mocks the fetch function to simulate an API failure with a 500 status code.
   */
  test('returns error message when fetch fails with non-200 status', async () => {
    /**
     * Mock fetch function for simulating an API failure response.
     * @returns {Promise<object>} A mock fetch response with `ok: false` and a 500 status code.
     */
    globalThis.fetch = async () => ({
      ok: false,
      status: 500, // Line 29
    });

    const result = await fetchChatbotkey();
    expect(result).toBe(
      'ERROR: OPENAI API KEY is not available. Please try again or contact the owner.'
    );
  });

  /**
   * Test case to verify fetchChatbotkey returns an error message when fetch throws an error.
   * Mocks the fetch function to throw an error, simulating a network failure.
   */
  test('returns error message when fetch throws an error', async () => {
    /**
     * Mock fetch function for simulating a network error.
     * @throws {Error} A mock network error.
     */
    globalThis.fetch = async () => {
      throw new Error('Network error'); // Line 42
    };

    const result = await fetchChatbotkey();
    expect(result).toBe(
      'ERROR: OPENAI API KEY is not available. Please try again or contact the owner.'
    );
  });
});
