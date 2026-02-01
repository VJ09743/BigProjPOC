#!/bin/bash

# Test script for Sudoku Webapp
# Tests both backend unit tests and starts servers for manual testing

set -e

echo "🧪 Sudoku Webapp Test Suite"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to project root
cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)

echo -e "${BLUE}📍 Project root: ${PROJECT_ROOT}${NC}"
echo ""

# Test Backend
echo -e "${YELLOW}1️⃣  Running Backend Unit Tests...${NC}"
cd "${PROJECT_ROOT}/modules/sudoku-webapp/backend"

if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

echo "🧪 Running Jest tests..."
npm test -- --passWithNoTests

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend tests passed!${NC}"
else
    echo -e "${RED}❌ Backend tests failed!${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}2️⃣  Starting Backend Server (port 5001)...${NC}"
echo "   Press Ctrl+C to stop"
echo ""
echo "   After backend starts, open a NEW terminal and run:"
echo "   cd ${PROJECT_ROOT}/modules/sudoku-webapp/frontend"
echo "   npm run dev"
echo ""
echo "   Then open http://localhost:5173 in your browser"
echo ""

npm run dev
