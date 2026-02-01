#!/bin/bash
# =============================================================================
# Run Script
# =============================================================================
# Automatically install dependencies for the latest release, then run it.
# =============================================================================

set -e

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
RELEASE_DIR="$ROOT_DIR/output/release"
RELEASE_INSTALL="$RELEASE_DIR/install.sh"
RELEASE_RUN="$RELEASE_DIR/run.sh"

echo "=========================================="
echo "Starting application from latest release..."
echo "=========================================="

if [ -x "$RELEASE_INSTALL" ]; then
  (cd "$RELEASE_DIR" && "$RELEASE_INSTALL")
fi

if [ -x "$RELEASE_RUN" ]; then
  exec "$RELEASE_RUN"
fi

echo "ERROR: Latest release run script not found."
echo "Please build a release first (e.g., ./scripts/release-sudoku.sh <version>)."
exit 1
