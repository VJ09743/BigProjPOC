#!/bin/bash
# =============================================================================
# Run Script
# =============================================================================
# Always run the latest release artifact if present.
# =============================================================================

set -e

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
RELEASE_RUN="$ROOT_DIR/output/release/run.sh"

echo "=========================================="
echo "Starting application from latest release..."
echo "=========================================="

if [ -x "$RELEASE_RUN" ]; then
	exec "$RELEASE_RUN"
fi

echo "ERROR: Latest release run script not found."
echo "Please build a release first (e.g., ./scripts/release-sudoku.sh <version>)."
exit 1
