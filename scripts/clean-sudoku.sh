#!/bin/bash

# Error handling
set -e

echo "🧹 Cleaning Sudoku Webapp build artifacts..."

# Clean frontend
echo "📦 Cleaning frontend..."
rm -rf modules/sudoku-webapp/frontend/dist
rm -rf modules/sudoku-webapp/frontend/node_modules
rm -f modules/sudoku-webapp/frontend/package-lock.json

# Clean backend
echo "📦 Cleaning backend..."
rm -rf modules/sudoku-webapp/backend/node_modules
rm -f modules/sudoku-webapp/backend/package-lock.json

# Clean root
echo "📦 Cleaning root..."
rm -f modules/sudoku-webapp/.env.local

# Clean coverage
echo "📊 Cleaning coverage reports..."
rm -rf modules/sudoku-webapp/frontend/coverage
rm -rf modules/sudoku-webapp/backend/coverage

echo "✅ Cleanup completed!"
echo ""
echo "To reinstall dependencies, run:"
echo "  cd modules/sudoku-webapp && npm run install-all"
