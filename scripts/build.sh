#!/bin/bash
# =============================================================================
# Build Script - Viral Content Hub
# =============================================================================
# Static web project - no build step required for development.
# For production, this copies files to the output directory.
# =============================================================================

set -e  # Exit on error

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODULE_DIR="$PROJECT_ROOT/modules/viral-content-hub"
OUTPUT_DIR="$PROJECT_ROOT/output/release"

echo "=========================================="
echo "Building Viral Content Hub..."
echo "=========================================="

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Copy source files to output
echo "Copying files to $OUTPUT_DIR..."
cp -r "$MODULE_DIR/src/"* "$OUTPUT_DIR/"

echo ""
echo "Build complete!"
echo "Output: $OUTPUT_DIR"
echo ""
echo "To run locally, use: ./scripts/run.sh"
