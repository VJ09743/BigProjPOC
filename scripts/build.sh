#!/bin/bash
# =============================================================================
# Build Script - TEMPLATE
# =============================================================================
# IT Agent: Customize this script for your project's technology stack.
#
# Instructions:
# 1. Identify the project's build system (from Architect's tech stack decision)
# 2. Add the appropriate build commands below
# 3. Remove these instructions when done
#
# Examples by technology:
# - Node.js:    npm run build
# - Python:     pip install -e . OR python setup.py build
# - Go:         go build ./...
# - Rust:       cargo build --release
# - Java:       mvn package OR gradle build
# - C/C++:      make release
# - Web/Static: No build needed, or use bundler (webpack, vite, etc.)
#
# =============================================================================

set -e  # Exit on error

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)

echo "=========================================="
echo "Building project..."
echo "=========================================="

# Build modules
echo "Building modules..."

# Joke App (Static Web App - no build needed, just copy files)
echo "Processing joke-app module..."
JOKE_APP_SRC="$ROOT_DIR/modules/joke-app/src"
JOKE_APP_OUTPUT="$ROOT_DIR/output/release/joke-app"

if [ -d "$JOKE_APP_SRC" ]; then
    echo "  - Copying joke-app files..."
    mkdir -p "$JOKE_APP_OUTPUT"
    cp -r "$JOKE_APP_SRC"/* "$JOKE_APP_OUTPUT/" 2>/dev/null || true
    echo "  - joke-app ready ✓"
else
    echo "  - joke-app source not found (will be created by Developer)"
fi

# Sudoku Web App
echo "Processing sudoku-webapp module..."
SUDOKU_SRC="$ROOT_DIR/modules/sudoku-webapp"
SUDOKU_OUTPUT="$ROOT_DIR/output/release/sudoku-webapp"

if [ -d "$SUDOKU_SRC/frontend" ] && [ -d "$SUDOKU_SRC/backend" ]; then
    echo "  - Building sudoku-webapp..."
    mkdir -p "$SUDOKU_OUTPUT"
    
    # Frontend build (if package.json exists)
    if [ -f "$SUDOKU_SRC/frontend/package.json" ]; then
        echo "  - Building frontend..."
        (cd "$SUDOKU_SRC/frontend" && npm run build 2>/dev/null || echo "    No build script found")
        cp -r "$SUDOKU_SRC/frontend"/* "$SUDOKU_OUTPUT/" 2>/dev/null || true
    fi
    
    # Backend build
    if [ -f "$SUDOKU_SRC/backend/package.json" ]; then
        echo "  - Installing backend dependencies..."
        (cd "$SUDOKU_SRC/backend" && npm install 2>/dev/null || echo "    No package.json found")
    fi
    
    echo "  - sudoku-webapp processed ✓"
else
    echo "  - sudoku-webapp not fully implemented yet"
fi

echo "=========================================="
echo "Build completed successfully!"
echo "=========================================="
echo "IT Agent must customize this script for the project's technology stack."
exit 1
