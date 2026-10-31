import { useEffect, useRef } from 'react';
import { ArrowDown, Compass, Lightbulb, PenLine } from 'lucide-react';
import ChatMessage from './ChatMessage.jsx';
import ChatInput from './ChatInput.jsx';
import Loader from './Loader.jsx';

const suggestions = [
  { icon: Compass, title: 'Plan a weekend', text: 'Help me plan a relaxing weekend' },
  { icon: Lightbulb, title: 'Learn something', text: 'Explain a complex idea simply' },
  { icon: PenLine, title: 'Write together', text: 'Help me write a thoughtful email' },
];

export default function ChatWindow({ messages, value, onChange, onSend, busy, onSuggestion, onAttachment }) {
  const bottomRef = useRef(null);
  useEffect(() => {
    const bottom = bottomRef.current;
    // Some embedded browsers do not implement scrollIntoView on every element.
    try {
      if (typeof bottom?.scrollIntoView === 'function') {
        bottom.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    } catch { /* Scrolling is an enhancement; it must never break the chat render. */ }
  }, [messages, busy]);
  const empty = messages.length === 0;
  return <main className="chat-main">
    <div className={`conversation ${empty ? 'is-empty' : ''}`}>
      {empty ? <div className="welcome">
        <div className="welcome-mark"><span className="mark-spark">✳</span><span className="mark-dot" /></div>
        <div className="eyebrow">YOUR AI COMPANION</div>
        <h1>A little more clarity,<br /><em>one conversation</em> at a time.</h1>
        <p>Bring a question, a half-formed idea, or just a place to begin.<br className="desktop-break" /> I’m here to think it through with you.</p>
        <div className="suggestion-grid">{suggestions.map(({ icon: Icon, title, text }) => <button key={title} className="suggestion" onClick={() => onSuggestion(text)}>
          <span className="suggestion-icon"><Icon size={17} /></span><span><strong>{title}</strong><small>{text}</small></span><ArrowDown className="suggestion-arrow" size={15} /></button>)}</div>
      </div> : <div className="message-list">{messages.map((message) => <ChatMessage key={message.id} message={message} />)}{busy && <Loader />}<div ref={bottomRef} /></div>}
    </div>
    <ChatInput value={value} onChange={onChange} onSend={onSend} busy={busy} onAttachment={onAttachment} />
  </main>;
}
