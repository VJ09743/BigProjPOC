#!/bin/bash

# Run script for Sudoku Webapp
# Starts frontend and backend in development mode

set -e

cd modules/sudoku-webapp

echo "🚀 Starting Sudoku Webapp (Development Mode)..."
echo ""
echo "⚠️  Make sure PostgreSQL is running!"
echo ""

# Copy .env.example to .env.local if not exists
if [ ! -f .env.local ]; then
  echo "📋 Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "⚠️  Please update .env.local with your database credentials if needed"
fi

# Install dependencies if needed
if [ ! -d frontend/node_modules ]; then
  echo "📦 Installing frontend dependencies..."
  cd frontend
  npm install
  cd ..
fi

if [ ! -d backend/node_modules ]; then
  echo "📦 Installing backend dependencies..."
  cd backend
  npm install
  cd ..
fi

echo ""
echo "🔄 Starting services..."
echo "  Backend: http://localhost:5000 (API on http://localhost:5000/api/v1)"
echo "  Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Use npm concurrently to run both services
npm run dev
