import { useState, useEffect } from 'react';
import './App.css';
import ShortenForm from './components/ShortenForm.jsx';
import ResultCard from './components/ResultCard.jsx';
import HistoryTable from './components/HistoryTable.jsx';
import Header from './components/Header.jsx';
import Background from './components/Background.jsx';

const API = '';

export default function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('shorten');

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API}/api/urls`);
      const data = await res.json();
      setHistory(data);
    } catch {}
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleShorten = async ({ url, expiryDays }) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, expiryDays }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
      fetchHistory();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shortCode) => {
    await fetch(`${API}/api/urls/${shortCode}`, { method: 'DELETE' });
    fetchHistory();
  };

  return (
    <div className="app">
      <Background />
      <div className="app-inner">
        <Header />
        <nav className="tabs">
          <button
            className={`tab-btn ${tab === 'shorten' ? 'active' : ''}`}
            onClick={() => setTab('shorten')}
          >
            <span className="tab-icon">⚡</span> Shorten
          </button>
          <button
            className={`tab-btn ${tab === 'history' ? 'active' : ''}`}
            onClick={() => { setTab('history'); fetchHistory(); }}
          >
            <span className="tab-icon">📋</span> History
            {history.length > 0 && <span className="badge">{history.length}</span>}
          </button>
        </nav>

        <main className="main-content">
          {tab === 'shorten' && (
            <div className="shorten-view" style={{ animation: 'fadeIn 0.4s ease' }}>
              <ShortenForm onShorten={handleShorten} loading={loading} error={error} />
              {result && <ResultCard result={result} />}
            </div>
          )}
          {tab === 'history' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <HistoryTable urls={history} onDelete={handleDelete} onRefresh={fetchHistory} />
            </div>
          )}
        </main>

        <footer className="footer">
          <span>Built with</span>
          <span className="heart">♥</span>
          <span>React + Express + SQLite</span>
        </footer>
      </div>
    </div>
  );
}
