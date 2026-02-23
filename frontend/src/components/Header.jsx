import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="url(#grad1)" strokeWidth="1.5"/>
            <path d="M8 16C8 11.582 11.582 8 16 8" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M24 16C24 20.418 20.418 24 16 24" stroke="#ff2d9b" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 8L19 11M16 8L13 11" stroke="#00c8ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 24L19 21M16 24L13 21" stroke="#ff2d9b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="16" cy="16" r="3.5" fill="url(#grad2)"/>
            <circle cx="16" cy="16" r="1.5" fill="#fff"/>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#00c8ff"/>
                <stop offset="100%" stopColor="#ff2d9b"/>
              </linearGradient>
              <linearGradient id="grad2" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#00c8ff"/>
                <stop offset="100%" stopColor="#00ff9d"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div className="logo-name">SNAP<span className="logo-accent">LINK</span></div>
          <div className="logo-tagline">// URL SHORTENER v2.0</div>
        </div>
      </div>
      <div className="header-right">
        <div className="status-bar">
          <div className="status-item">
            <span className="status-dot cyan" />
            <span>SYS_ONLINE</span>
          </div>
          <div className="status-divider" />
          <div className="status-item">
            <span className="status-dot green" />
            <span>DB_CONNECTED</span>
          </div>
        </div>
      </div>
    </header>
  );
}
