import { useState } from 'react';
import { Bot, Check, Copy, UserRound } from 'lucide-react';

export default function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true); window.setTimeout(() => setCopied(false), 1600);
    } catch { /* Clipboard may be unavailable on insecure origins. */ }
  };
  return <article className={`message-row ${isUser ? 'from-user' : 'from-assistant'}`}>
    <div className={`avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`} aria-hidden="true">
      {isUser ? <UserRound size={17} /> : <Bot size={18} />}
    </div>
    <div className="message-body">
      <div className="message-heading">{isUser ? 'You' : 'Kindred'}{!isUser && <span className="ai-label">AI</span>}</div>
      <div className="message-text">{message.content}</div>
      {!isUser && <button className="copy-button" onClick={copy} aria-label={copied ? 'Copied response' : 'Copy response'}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}</button>}
    </div>
  </article>;
}
