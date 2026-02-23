# SnapLink — URL Shortener

A beautiful, full-stack URL shortener built with React + Express + SQLite.

## Features
- ⚡ Instant URL shortening
- 👆 Click counter for every link
- ⎘ One-click copy button
- ⏱ Optional expiry times (1/7/30/90 days)
- 📋 Full history with delete
- 🔗 Redirect engine built in
- 🎨 Animated dark UI with glassmorphism

## Tech Stack
- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite (via better-sqlite3)

---

## Quick Setup

### Prerequisites
- Node.js 18+
- npm

### Option A: Run both manually

**1. Start the backend**
```bash
cd backend
npm install
npm start
# API runs on http://localhost:3001
```

**2. Start the frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
# UI runs on http://localhost:5173
```

**3. Open** `http://localhost:5173` in your browser.

---

### Option B: Use the start script
```bash
# From the root directory
chmod +x start.sh
./start.sh
```

---

## How It Works

1. **Paste** a long URL in the input field
2. **Choose** an optional expiry time
3. **Click** "Generate Link" — get a short URL instantly
4. **Share** the short URL — it auto-redirects to the original
5. **Track** clicks and manage links in the History tab

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shorten` | Create short URL |
| GET | `/api/urls` | List all URLs |
| GET | `/api/stats/:code` | Get URL stats |
| DELETE | `/api/urls/:code` | Delete a URL |
| GET | `/r/:code` | Redirect to original |

### POST /api/shorten
```json
{
  "url": "https://your-long-url.com",
  "expiryDays": 7
}
```

## Environment Variables (Backend)
Create `backend/.env`:
```
PORT=3001
BASE_URL=http://localhost:3001
```
