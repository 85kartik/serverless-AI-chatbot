import { getOpenAIClient } from '../config/openai.js';
import { SYSTEM_PROMPT } from '../utils/promptTemplate.js';

export async function generateReply(history) {
  const client = getOpenAIClient();
  const configuredModel = process.env.OPENAI_MODEL?.trim();
  const isGroq = process.env.OPENAI_BASE_URL?.includes('groq.com') || process.env.OPENAI_API_KEY?.startsWith('gsk_');
  // Older examples used model IDs that are no longer available to all Groq
  // accounts. Use a current Groq model when those old defaults are present.
  const oldGroqDefaults = ['gpt-4o-mini', 'llama-3.3-70b-versatile'];
  const model = isGroq && (!configuredModel || oldGroqDefaults.includes(configuredModel))
    ? 'openai/gpt-oss-120b'
    : configuredModel || 'gpt-4o-mini';
  const completion = await client.chat.completions.create({
    model,
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
    temperature: 0.7,
  });
  const reply = completion.choices[0]?.message?.content?.trim();
  if (!reply) throw new Error('The AI returned an empty response. Please try again.');
  return reply;
}
