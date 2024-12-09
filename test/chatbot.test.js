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

  test('returns API key on successful fetch', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      text: async () => 'mock-api-key',
    });

    const result = await fetchChatbotkey();
    expect(result).toBe('mock-api-key');
  });

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
