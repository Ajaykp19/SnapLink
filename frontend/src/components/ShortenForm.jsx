import { useState } from 'react';
import './ShortenForm.css';

export default function ShortenForm({ onShorten, loading, error }) {
  const [url, setUrl] = useState('');
  const [expiryDays, setExpiryDays] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onShorten({ url: url.trim(), expiryDays });
  };

  return (
    <div className="form-card">
      <div className="form-card-header">
        <h2 className="form-title">Shorten your link</h2>
        <p className="form-subtitle">Paste any long URL and get a clean, shareable short link instantly.</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className={`url-input-wrap ${focused ? 'focused' : ''} ${error ? 'has-error' : ''}`}>
          <span className="url-prefix">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6.5 9.5L9.5 6.5M7.5 4.5L8.207 3.793C9.17 2.83 10.748 2.83 11.71 3.793C12.672 4.755 12.672 6.333 11.71 7.296L11 8M9 8L8.293 8.707C7.33 9.67 5.752 9.67 4.79 8.707C3.827 7.745 3.827 6.167 4.79 5.204L5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="text"
            className="url-input"
            placeholder="https://your-very-long-url.com/with/lots/of/parameters?and=stuff"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {url && (
            <button type="button" className="clear-btn" onClick={() => setUrl('')}>
              ✕
            </button>
          )}
        </div>

        {error && (
          <div className="error-msg" style={{ animation: 'slideIn 0.3s ease' }}>
            <span>⚠</span> {error}
          </div>
        )}

        <div className="form-options">
          <div className="expiry-wrap">
            <label className="option-label">
              <span className="option-icon">⏱</span>
              Expiry
            </label>
            <select
              className="expiry-select"
              value={expiryDays}
              onChange={(e) => setExpiryDays(e.target.value)}
            >
              <option value="">Never</option>
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
          </div>

          <button
            type="submit"
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading || !url.trim()}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <span>Generate Link</span>
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
