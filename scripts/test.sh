#!/bin/bash
# =============================================================================
# Test Script - Viral Content Hub
# =============================================================================
# Runs tests for the web application.
# =============================================================================

set -e  # Exit on error

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODULE_DIR="$PROJECT_ROOT/modules/viral-content-hub"

echo "=========================================="
echo "Running tests for Viral Content Hub..."
echo "=========================================="

cd "$MODULE_DIR"

# Run npm tests if available
if [ -f "package.json" ]; then
    npm test
else
    echo "No tests configured yet."
    echo "Tests can be added using Jest or similar framework."
fi

echo ""
echo "Test run complete!"
