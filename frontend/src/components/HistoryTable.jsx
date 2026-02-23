import { useState } from 'react';
import './HistoryTable.css';

export default function HistoryTable({ urls, onDelete, onRefresh }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = async (shortUrl, code) => {
    await navigator.clipboard.writeText(shortUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isExpired = (expiresAt) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  const truncate = (str, n) => str.length > n ? str.slice(0, n) + '…' : str;

  if (urls.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔗</div>
        <div className="empty-title">No links yet</div>
        <div className="empty-sub">Shorten your first URL to see it here</div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2 className="history-title">Your Links <span className="count-pill">{urls.length}</span></h2>
        <button className="refresh-btn" onClick={onRefresh}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12 7C12 9.761 9.761 12 7 12C4.239 12 2 9.761 2 7C2 4.239 4.239 2 7 2C8.45 2 9.76 2.58 10.713 3.513" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M11 1V4H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Refresh
        </button>
      </div>

      <div className="history-list">
        {urls.map((url, i) => (
          <div
            key={url.shortCode}
            className={`history-row ${isExpired(url.expiresAt) ? 'expired' : ''}`}
            style={{ animationDelay: `${i * 0.04}s`, animation: 'slideIn 0.35s ease both' }}
          >
            <div className="row-main">
              <div className="row-left">
                <a
                  href={url.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="row-short-url"
                >
                  {url.shortUrl.replace('http://localhost:3001', '')}
                </a>
                {isExpired(url.expiresAt) && (
                  <span className="expired-tag">Expired</span>
                )}
              </div>
              <div className="row-right">
                <span className="row-clicks">
                  <span className="click-dot">●</span>
                  {url.clicks} clicks
                </span>
                <span className="row-date">{formatDate(url.createdAt)}</span>
                <button
                  className={`row-copy-btn ${copiedCode === url.shortCode ? 'copied' : ''}`}
                  onClick={() => handleCopy(url.shortUrl, url.shortCode)}
                >
                  {copiedCode === url.shortCode ? '✓' : '⎘'}
                </button>
                <button
                  className="row-delete-btn"
                  onClick={() => onDelete(url.shortCode)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="row-original">{truncate(url.originalUrl, 80)}</div>
            {url.expiresAt && (
              <div className={`row-expiry ${isExpired(url.expiresAt) ? 'expired' : ''}`}>
                ⏱ {isExpired(url.expiresAt) ? 'Expired' : 'Expires'} {formatDate(url.expiresAt)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
