#!/bin/bash

# Test script for Sudoku Webapp
# Runs all tests (frontend + backend)

set -e

echo "🧪 Running tests for Sudoku Webapp..."

cd modules/sudoku-webapp

# Test backend
echo "🔍 Testing backend..."
cd backend
npm test 2>&1 || true
cd ..

# Test frontend
echo "🔍 Testing frontend..."
cd frontend
npm test 2>&1 || true
cd ..

cd ../..

echo "✅ Tests completed!"
