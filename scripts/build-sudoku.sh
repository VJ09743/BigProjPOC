#!/bin/bash

# Build script for Sudoku Webapp
# Builds both frontend and backend

set -e

echo "🔨 Building Sudoku Webapp..."

cd modules/sudoku-webapp

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

# Lint backend (no build needed for Node.js)
echo "✅ Validating backend..."
cd backend
npm run lint
cd ..

cd ../..

echo "✅ Build completed successfully!"
echo ""
echo "Build artifacts:"
echo "  Frontend: modules/sudoku-webapp/frontend/dist/"
