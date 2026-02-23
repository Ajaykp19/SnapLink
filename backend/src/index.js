import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Database setup
const db = new Database(path.join(__dirname, '../urls.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
  )
`);

// Middleware
app.use(cors());
app.use(express.json());

// Create short URL
app.post('/api/shorten', (req, res) => {
  const { url, expiryDays } = req.body;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const shortCode = nanoid(7);
  let expiresAt = null;

  if (expiryDays && expiryDays > 0) {
    const d = new Date();
    d.setDate(d.getDate() + parseInt(expiryDays));
    expiresAt = d.toISOString();
  }

  const stmt = db.prepare(
    'INSERT INTO urls (short_code, original_url, expires_at) VALUES (?, ?, ?)'
  );
  stmt.run(shortCode, url, expiresAt);

  return res.json({
    shortUrl: `${BASE_URL}/r/${shortCode}`,
    shortCode,
    originalUrl: url,
    expiresAt,
    clicks: 0,
    createdAt: new Date().toISOString(),
  });
});

// Get URL stats
app.get('/api/stats/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const row = db.prepare('SELECT * FROM urls WHERE short_code = ?').get(shortCode);

  if (!row) return res.status(404).json({ error: 'URL not found' });

  res.json({
    shortUrl: `${BASE_URL}/r/${shortCode}`,
    shortCode: row.short_code,
    originalUrl: row.original_url,
    clicks: row.clicks,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  });
});

// Get all URLs
app.get('/api/urls', (req, res) => {
  const rows = db.prepare('SELECT * FROM urls ORDER BY created_at DESC LIMIT 50').all();
  res.json(rows.map(row => ({
    shortUrl: `${BASE_URL}/r/${row.short_code}`,
    shortCode: row.short_code,
    originalUrl: row.original_url,
    clicks: row.clicks,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  })));
});

// Redirect
app.get('/r/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const row = db.prepare('SELECT * FROM urls WHERE short_code = ?').get(shortCode);

  if (!row) return res.status(404).send('<h1>Short URL not found</h1>');

  if (row.expires_at && new Date(row.expires_at) < new Date()) {
    return res.status(410).send('<h1>This link has expired</h1>');
  }

  db.prepare('UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?').run(shortCode);
  res.redirect(row.original_url);
});

// Delete URL
app.delete('/api/urls/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  db.prepare('DELETE FROM urls WHERE short_code = ?').run(shortCode);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ URL Shortener API running at http://localhost:${PORT}`);
});
