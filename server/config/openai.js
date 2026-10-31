import OpenAI from 'openai';

// Create the SDK client only when a key is configured, so the server can still
// start locally and return a helpful setup message when the key is missing.
export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error('The AI service is not configured. Add OPENAI_API_KEY to your environment.');
    error.status = 503;
    throw error;
  }
  // Groq offers an OpenAI-compatible API. Set OPENAI_BASE_URL to use it while
  // keeping the official OpenAI SDK and avoiding any key in browser code.
  const isGroqKey = apiKey.startsWith('gsk_');
  const baseURL = process.env.OPENAI_BASE_URL || (isGroqKey ? 'https://api.groq.com/openai/v1' : undefined);
  return new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
    timeout: 45_000,
    maxRetries: 2,
  });
}
