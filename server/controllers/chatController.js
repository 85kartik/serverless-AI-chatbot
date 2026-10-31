import { generateReply } from '../services/aiService.js';

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_CHARACTERS = 12000;

export async function postChat(req, res, next) {
  try {
    const { message, history = [] } = req.body ?? {};
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Please enter a message before sending.' });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(413).json({ error: `Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer.` });
    }
    if (!Array.isArray(history)) {
      return res.status(400).json({ error: 'Conversation history must be a list of messages.' });
    }

    // Accept only recent user/assistant text messages, and bound the payload.
    let historyCharacters = 0;
    const safeHistory = [];
    // Walk newest-to-oldest so the most recent context stays within the budget.
    for (const item of history.slice(-MAX_MESSAGES).reverse()) {
      if (!item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string') continue;
      const content = item.content.trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!content || historyCharacters + content.length > MAX_HISTORY_CHARACTERS) continue;
      historyCharacters += content.length;
      safeHistory.unshift({ role: item.role, content });
    }
    const reply = await generateReply([...safeHistory, { role: 'user', content: message.trim() }]);
    return res.json({ reply });
  } catch (error) {
    return next(error);
  }
}
