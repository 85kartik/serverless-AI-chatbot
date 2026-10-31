import { useEffect, useState } from 'react';
import { MessageSquarePlus, PanelLeftClose, PanelLeftOpen, Plus, Settings, Sparkles, Trash2, X } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import { sendMessage } from './services/chatService.js';

function newConversation() { return { id: crypto.randomUUID(), title: 'New conversation', messages: [] }; }
function safeStorageGet(key, fallback = null) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function safeStorageSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Storage can be disabled or full; keep the in-memory chat usable. */ }
}
function getRecentHistory(messages) {
  const recent = [];
  let characters = 0;
  for (const message of messages.slice(-12).reverse()) {
    if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string') continue;
    const content = message.content.slice(0, 4000);
    if (characters + content.length > 12000) continue;
    recent.unshift({ role: message.role, content });
    characters += content.length;
  }
  return recent;
}
function readSavedConversations() {
  try {
    const saved = JSON.parse(safeStorageGet('kindred-conversations', 'null'));
    if (Array.isArray(saved) && saved.length && saved.every((item) =>
      item && typeof item.id === 'string' && typeof item.title === 'string' && Array.isArray(item.messages) &&
      item.messages.every((message) => message && typeof message.id === 'string' &&
        ['user', 'assistant'].includes(message.role) && typeof message.content === 'string'),
    )) return saved;
  } catch { /* Ignore unavailable or malformed browser storage. */ }
  return [newConversation()];
}

export default function App() {
  const [conversations, setConversations] = useState(readSavedConversations);
  const [activeId, setActiveId] = useState(() => conversations[0].id);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => safeStorageGet('kindred-dark-mode') === 'true');
  const [attachmentNotice, setAttachmentNotice] = useState('');
  const active = conversations.find((conversation) => conversation.id === activeId) || conversations[0] || newConversation();
  const visibleMessages = Array.isArray(active.messages) ? active.messages.flatMap((message, index) => {
    if (!message || !['user', 'assistant'].includes(message.role)) return [];
    // Keep unexpected provider values from being rendered as raw React children.
    const content = typeof message.content === 'string'
      ? message.content
      : message.content == null ? '' : JSON.stringify(message.content);
    if (!content) return [];
    return [{ ...message, id: typeof message.id === 'string' ? message.id : `message-${index}`, content }];
  }) : [];

  useEffect(() => { safeStorageSet('kindred-conversations', JSON.stringify(conversations)); }, [conversations]);
  useEffect(() => { safeStorageSet('kindred-dark-mode', String(darkMode)); }, [darkMode]);
  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); startNew(); }
      if (event.key === 'Escape') { setSettingsOpen(false); setSidebarOpen(false); }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  });

  const updateActive = (updater) => setConversations((items) => items.map((item) => item.id === activeId ? updater(item) : item));
  const startNew = () => {
    const next = newConversation();
    setConversations((items) => [next, ...items]); setActiveId(next.id); setInput(''); setError(''); setAttachmentNotice(''); setSidebarOpen(false);
  };
  const clearConversation = () => {
    updateActive((item) => ({ ...item, title: 'New conversation', messages: [] })); setError('');
  };
  const removeConversation = (conversationId) => {
    const remaining = conversations.filter((item) => item.id !== conversationId);
    if (!remaining.length) remaining.push(newConversation());
    setConversations(remaining);
    if (activeId === conversationId) setActiveId(remaining[0].id);
  };
  const clearSavedData = () => {
    const next = newConversation();
    try { localStorage.removeItem('kindred-conversations'); } catch { /* Clearing local storage is optional. */ }
    setConversations([next]); setActiveId(next.id); setInput(''); setError(''); setSettingsOpen(false);
  };
  const handleAttachment = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 3000) { setError('Text files must be 3 KB or smaller.'); return; }
    try {
      const contents = await file.text();
      setInput((current) => `${current}${current ? '\n\n' : ''}Please use this attached text (${file.name}) as context:\n${contents}`);
      setAttachmentNotice(`Added ${file.name}`);
    } catch { setError('Could not read that file. Try a plain text file.'); }
  };
  const submit = async (override) => {
    const text = (override ?? input).trim();
    if (!text || busy) return;
    const conversationId = activeId;
    const history = getRecentHistory(active.messages);
    const userMessage = { id: crypto.randomUUID(), role: 'user', content: text };
    setInput(''); setError(''); setBusy(true);
    setConversations((items) => items.map((item) => item.id === conversationId ? {
      ...item,
      title: item.messages.length ? item.title : text.length > 32 ? `${text.slice(0, 32)}…` : text,
      messages: [...item.messages, userMessage],
    } : item));
    try {
      const reply = await sendMessage(text, history);
      setConversations((items) => items.map((item) => item.id === conversationId ? {
        ...item, messages: [...item.messages, { id: crypto.randomUUID(), role: 'assistant', content: reply }],
      } : item));
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong. Please try again.');
    } finally { setBusy(false); }
  };

  return <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''} ${darkMode ? 'dark-mode' : ''}`}>
    {sidebarOpen && <button className="mobile-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}
    <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
      <div className="brand-row"><a className="brand" href="#" onClick={(event) => event.preventDefault()}><span className="brand-icon"><Sparkles size={17} /></span><span>kindred<span className="brand-period">.</span></span></a>
        <button className="icon-button collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand history sidebar' : 'Collapse history sidebar'} title={collapsed ? 'Expand history' : 'Collapse history'}>{collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}</button>
        <button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button></div>
      <button className="new-chat-button" onClick={startNew}><Plus size={17} /><span>New conversation</span><kbd>⌘ K</kbd></button>
      <div className="history-heading"><span>YOUR SPACE</span><button className="icon-button history-add" onClick={startNew} aria-label="New conversation"><MessageSquarePlus size={16} /></button></div>
      <div className="history-list">{conversations.map((conversation) => <div key={conversation.id} className={`history-entry ${conversation.id === activeId ? 'selected' : ''}`}>
        <button className={`history-item ${conversation.id === activeId ? 'selected' : ''}`} onClick={() => { setActiveId(conversation.id); setInput(''); setError(''); setAttachmentNotice(''); setSidebarOpen(false); }}>
          <span className="history-item-icon"><MessageSquarePlus size={15} /></span><span className="history-title">{conversation.title}</span>{conversation.id === activeId && <span className="active-indicator" />}</button>
        <button className="history-delete" onClick={() => removeConversation(conversation.id)} aria-label={`Delete ${conversation.title}`} title="Delete conversation"><X size={13} /></button>
      </div>)}</div>
      <div className="sidebar-bottom"><button className="profile-card" onClick={() => setSettingsOpen(true)}><div className="profile-avatar">K</div><div className="profile-info"><strong>My workspace</strong><span>Settings & preferences</span></div><Settings className="profile-menu" size={16} /></button><div className="sidebar-footnote"><span className="footnote-dot" /> Your thoughts stay yours</div></div>
    </aside>
    <section className="main-panel"><Navbar onMenu={() => setSidebarOpen(true)} onModelInfo={() => setSettingsOpen(true)} />
      <ChatWindow messages={visibleMessages} value={input} onChange={setInput} onSend={() => submit()} onSuggestion={(text) => submit(text)} busy={busy} onAttachment={handleAttachment} />
      {error && <div className="error-toast" role="alert"><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss error"><X size={16} /></button></div>}
      {!collapsed && !visibleMessages.length ? null : visibleMessages.length > 0 && <button className="clear-button" onClick={clearConversation}><Trash2 size={14} /> Clear conversation</button>}
    </section>
    {attachmentNotice && <div className="attachment-toast" role="status">{attachmentNotice}<button onClick={() => setAttachmentNotice('')} aria-label="Dismiss attachment notice"><X size={14} /></button></div>}
    {settingsOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}>
      <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="modal-heading"><div><span className="settings-icon"><Settings size={17} /></span><div><h2 id="settings-title">Your workspace</h2><p>Make Kindred feel like yours.</p></div></div><button className="icon-button" onClick={() => setSettingsOpen(false)} aria-label="Close settings"><X size={18} /></button></div>
        <div className="setting-row"><div><strong>Dark appearance</strong><span>Use a darker color palette</span></div><button role="switch" aria-checked={darkMode} className={`toggle-switch ${darkMode ? 'on' : ''}`} onClick={() => setDarkMode((value) => !value)} aria-label="Toggle dark appearance"><span /></button></div>
        <div className="setting-row model-info"><div><strong>AI model</strong><span>Responses are generated by the configured OpenAI model.</span></div><span className="model-name">GPT</span></div>
        <div className="modal-footer"><span>Conversations are saved in this browser.</span><button onClick={clearSavedData}>Clear saved data</button></div>
      </section>
    </div>}
  </div>;
}
