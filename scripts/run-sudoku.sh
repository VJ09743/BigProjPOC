#!/bin/bash

# Run Sudoku Webapp - starts both backend and frontend servers
# Press Ctrl+C to stop both servers

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to project root
cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)

echo -e "${BLUE}🎮 Starting Sudoku Webapp${NC}"
echo "============================"
echo ""

# Function to cleanup background processes
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Check and install backend dependencies
echo -e "${YELLOW}1️⃣  Checking backend dependencies...${NC}"
cd "${PROJECT_ROOT}/modules/sudoku-webapp/backend"
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Check and install frontend dependencies
echo -e "${YELLOW}2️⃣  Checking frontend dependencies...${NC}"
cd "${PROJECT_ROOT}/modules/sudoku-webapp/frontend"
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo ""
echo -e "${GREEN}✅ Dependencies ready${NC}"
echo ""

# Start backend server
echo -e "${YELLOW}3️⃣  Starting backend server (port 5001)...${NC}"
cd "${PROJECT_ROOT}/modules/sudoku-webapp/backend"
npm run dev > /tmp/sudoku-backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "   Waiting for backend to start..."
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Backend failed to start. Check logs: /tmp/sudoku-backend.log${NC}"
    exit 1
fi

# Start frontend server
echo -e "${YELLOW}4️⃣  Starting frontend server (port 5173)...${NC}"
cd "${PROJECT_ROOT}/modules/sudoku-webapp/frontend"
npm run dev > /tmp/sudoku-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
echo "   Waiting for frontend to start..."
sleep 3

# Check if frontend is running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Frontend failed to start. Check logs: /tmp/sudoku-frontend.log${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Both servers are running!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🌐 Open in browser: ${BLUE}http://localhost:5173${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Server Details:"
echo "   Backend:  http://localhost:5001/api/v1"
echo "   Frontend: http://localhost:5173"
echo ""
echo "📝 Logs:"
echo "   Backend:  /tmp/sudoku-backend.log"
echo "   Frontend: /tmp/sudoku-frontend.log"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Try to open browser (works on macOS)
if command -v open &> /dev/null; then
    echo "🌐 Opening browser..."
    sleep 2
    open http://localhost:5173
fi

# Keep script running
wait
