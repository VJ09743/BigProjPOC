#!/bin/bash
# =============================================================================
# Run Script - Viral Content Hub
# =============================================================================
# Starts a local development server with live reload.
# =============================================================================

set -e  # Exit on error

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODULE_DIR="$PROJECT_ROOT/modules/viral-content-hub"

echo "=========================================="
echo "Starting Viral Content Hub..."
echo "=========================================="

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed."
    echo "Please install Node.js and npm first."
    exit 1
fi

# Navigate to module directory
cd "$MODULE_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "Starting development server on http://localhost:3000"
echo "Press Ctrl+C to stop."
echo ""

# Start the development server
npm start
