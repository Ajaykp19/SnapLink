import { useState } from 'react';
import './ResultCard.css';

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="result-card" style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="result-header">
        <div className="success-badge">
          <span className="success-icon">✓</span>
          <span>Link created!</span>
        </div>
        {result.expiresAt && (
          <div className="expiry-badge">
            ⏱ Expires {formatDate(result.expiresAt)}
          </div>
        )}
      </div>

      <div className="short-url-display">
        <a
          href={result.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="short-url-link"
        >
          {result.shortUrl}
        </a>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? (
            <><span className="copy-check">✓</span> Copied!</>
          ) : (
            <><span className="copy-icon">⎘</span> Copy</>
          )}
        </button>
      </div>

      <div className="original-url-row">
        <span className="original-label">Original URL</span>
        <span className="original-url">{result.originalUrl}</span>
      </div>

      <div className="result-stats">
        <div className="stat-chip">
          <span className="stat-icon">👆</span>
          <span className="stat-val">{result.clicks}</span>
          <span className="stat-label">clicks</span>
        </div>
        <div className="stat-chip">
          <span className="stat-icon">📅</span>
          <span className="stat-val">{formatDate(result.createdAt) || 'Today'}</span>
        </div>
        <div className="stat-chip">
          <span className="stat-icon">🔗</span>
          <span className="stat-val">{result.shortCode}</span>
        </div>
      </div>
    </div>
  );
}
