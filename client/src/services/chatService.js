export async function sendMessage(message, history) {
  let response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The request failed. Please try again.');
  if (typeof data.reply !== 'string' || !data.reply.trim()) {
    throw new Error('The server returned an unreadable reply. Please try again.');
  }
  return data.reply;
}
