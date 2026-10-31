import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false, resetKey: 0 };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) {
      // Remounting clears in-memory chat data along with any saved data we remove.
      return <div key={this.state.resetKey}>{this.props.children}</div>;
    }
    const clearSavedData = () => {
      try {
        localStorage.removeItem('kindred-conversations');
        this.setState((state) => ({ failed: false, resetKey: state.resetKey + 1 }));
      } catch {
        window.location.reload();
      }
    };
    return <main className="app-crash-fallback" role="alert">
      <div className="crash-card">
        <h1>The chat hit a display error</h1>
        <p>Your saved conversations are still in this browser. Reload the chat, or clear saved chats if corrupted data is causing the problem.</p>
        <div className="crash-actions"><button onClick={() => window.location.reload()}>Reload chat</button><button className="secondary" onClick={clearSavedData}>Clear saved chats</button></div>
      </div>
    </main>;
  }
}
