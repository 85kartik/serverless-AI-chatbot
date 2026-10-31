import { Bot } from 'lucide-react';

export default function Loader() {
  return <div className="message-row from-assistant" role="status" aria-label="Assistant is thinking">
    <div className="avatar ai-avatar"><Bot size={18} /></div>
    <div className="message-body"><div className="message-heading">Kindred <span className="ai-label">AI</span></div>
      <div className="typing"><span /><span /><span /></div></div>
  </div>;
}
