#!/bin/bash

echo "🔗 Starting SnapLink URL Shortener..."
echo ""

# Install backend deps
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install frontend deps
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo ""
echo "🚀 Starting servers..."
echo ""

# Start backend in background
cd backend && npm start &
BACKEND_PID=$!

sleep 1

# Start frontend
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ SnapLink is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers."

# Wait for ctrl+c
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
