import { Menu, Sparkles } from 'lucide-react';

export default function Navbar({ onMenu, onModelInfo }) {
  return <header className="topbar">
    <button className="icon-button menu-toggle" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
    <div className="topbar-title"><span className="status-dot" /> AI Assistant <button className="model-pill" onClick={onModelInfo} title="About the AI model"><Sparkles size={12} /> GPT</button></div>
    <div className="topbar-right">A thoughtful space for ideas</div>
  </header>;
}
