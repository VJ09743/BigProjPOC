#!/bin/bash
# =============================================================================
# Run Script
# =============================================================================
# Automatically build release if needed, then install dependencies and run.
# =============================================================================

set -e

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
RELEASE_DIR="$ROOT_DIR/output/release"
RELEASE_SCRIPT="$ROOT_DIR/scripts/release-sudoku.sh"

echo "=========================================="
echo "Starting application from latest release..."
echo "=========================================="

# Check if any release exists
if ! ls "$RELEASE_DIR"/sudoku-webapp-*/ >/dev/null 2>&1; then
  echo "📦 No release found. Building release v1.0.0..."
  
  # Install frontend dependencies if needed
  FRONTEND_DIR="$ROOT_DIR/modules/sudoku-webapp/frontend"
  if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    npm install --quiet
    cd "$ROOT_DIR"
  fi
  
  # Build the release
  "$RELEASE_SCRIPT" 1.0.0
fi

# Find the helper scripts
RELEASE_INSTALL="$RELEASE_DIR/install.sh"
RELEASE_RUN="$RELEASE_DIR/run.sh"

if [ -x "$RELEASE_INSTALL" ]; then
  (cd "$RELEASE_DIR" && "$RELEASE_INSTALL")
fi

if [ -x "$RELEASE_RUN" ]; then
  exec "$RELEASE_RUN"
fi

echo "ERROR: Latest release run script not found."
exit 1
