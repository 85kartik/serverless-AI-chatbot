import { ArrowUp, Paperclip } from 'lucide-react';

export default function ChatInput({ value, onChange, onSend, busy, onAttachment }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); onSend(); }
  };
  return <div className="composer-wrap">
    <div className="composer">
      <textarea value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={handleKeyDown}
        placeholder="Message Kindred…" rows={1} maxLength={4000} aria-label="Your message" />
      <div className="composer-actions"><label className="attach-button" aria-label="Attach a text file" title="Attach a text file"><Paperclip size={17} /><input type="file" accept=".txt,.md,text/plain,text/markdown" onChange={onAttachment} /></label>
        <span className="key-hint">↵ to send</span>
        <button className="send-button" type="button" onClick={onSend} disabled={busy || !value.trim()} aria-label="Send message"><ArrowUp size={19} /></button>
      </div>
    </div>
    <div className="composer-note">Kindred can make mistakes. Check important information.</div>
  </div>;
}
