import { fetchChatbotkey } from '../src/js/chatbot.js';

/**
 * Tests for the fetchChatbotkey function.
 */
describe('fetchChatbotkey', () => {
  let originalFetch;

  /**
   * Saves the original fetch function before tests run.
   */
  beforeAll(() => {
    // Save the original fetch function
    originalFetch = globalThis.fetch;
  });

  /**
   * Restores the original fetch function after all tests are completed.
   */
  afterAll(() => {
    // Restore the original fetch function
    globalThis.fetch = originalFetch;
  });

  /**
   * Test case: should return API key when fetch is successful.
   */
  test('returns API key on successful fetch', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      text: async () => 'mock-api-key',
    });

    const result = await fetchChatbotkey();
    expect(result).toBe('mock-api-key');
  });

  /**
   * Test case: should return an error message when fetch fails with a non-200 status.
   */
  test('returns error message when fetch fails with non-200 status', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 500,
    });

    const result = await fetchChatbotkey();
    expect(result).toBe(
      'ERROR: OPENAI API KEY is not available. Please try again or contact the owner.'
    );
  });

  /**
   * Test case: should return an error message when fetch throws an exception.
   */
  test('returns error message when fetch throws an error', async () => {
    globalThis.fetch = async () => {
      throw new Error('Network error');
    };

    const result = await fetchChatbotkey();
    expect(result).toBe(
      'ERROR: OPENAI API KEY is not available. Please try again or contact the owner.'
    );
  });
});
