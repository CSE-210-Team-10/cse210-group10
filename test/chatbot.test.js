import { fetchChatbotkey } from '../src/js/chatbot.js';

globalThis.fetch = jest.fn();

describe('fetchChatbotkey', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return API key when fetch is successful', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValue('mock-api-key'),
    });

    const result = await fetchChatbotkey();
    expect(result).toBe('mock-api-key');
    expect(globalThis.fetch).toHaveBeenCalledWith('https://chatbot-key.onrender.com/apikey', {
      method: 'GET',
      mode: 'cors',
    });
  });

  test('should return error message when fetch fails', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await fetchChatbotkey();
    expect(result).toBe(
      'ERROR: OPENAI API KEY is not available. Please try again or contact the owner.'
    );
  });

  test('should return error message when fetch throws an error', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchChatbotkey();
    expect(result).toBe(
      'ERROR: OPENAI API KEY is not available. Please try again or contact the owner.'
    );
  });
});
