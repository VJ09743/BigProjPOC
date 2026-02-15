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

echo "Release not found. Running development version..."

# Check for joke website module
if [ -d "modules/joke-website" ]; then
    echo "Starting joke website development server..."
    cd modules/joke-website
    npm run dev
else
    echo "ERROR: No runnable modules found."
    echo "Available options:"
    echo "  1. Build a release first: ./scripts/build.sh"
    echo "  2. Run development server: cd modules/joke-website && npm run dev"
    exit 1
fi
