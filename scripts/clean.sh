#!/bin/bash
# =============================================================================
# Clean Script - Viral Content Hub
# =============================================================================
# Cleans build artifacts and dependencies.
# =============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODULE_DIR="$PROJECT_ROOT/modules/viral-content-hub"
OUTPUT_DIR="$PROJECT_ROOT/output"

echo "=========================================="
echo "Cleaning build artifacts..."
echo "=========================================="

# Clean output directories
echo "Cleaning output directories..."
rm -rf "$OUTPUT_DIR/release/"*
rm -rf "$OUTPUT_DIR/debug/"*

# Clean node_modules (optional - uncomment to include)
# echo "Cleaning node_modules..."
# rm -rf "$MODULE_DIR/node_modules"

# Clean any generated files
echo "Cleaning generated files..."
rm -rf "$MODULE_DIR/dist"
rm -rf "$MODULE_DIR/.cache"

echo ""
echo "Clean complete!"
echo ""
echo "Note: node_modules preserved. To remove, run:"
echo "  rm -rf $MODULE_DIR/node_modules"
