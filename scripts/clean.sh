#!/bin/bash
# =============================================================================
# Clean Script - TEMPLATE
# =============================================================================
# IT Agent: Customize this script to clean build artifacts.
#
# Instructions:
# 1. Identify what build artifacts the project creates
# 2. Add the appropriate clean commands below
# 3. Remove these instructions when done
#
# Examples by technology:
# - Node.js:    rm -rf node_modules dist .next
# - Python:     rm -rf __pycache__ *.egg-info .pytest_cache dist build
# - Go:         go clean OR rm -rf bin/
# - Rust:       cargo clean
# - Java:       mvn clean OR gradle clean
# - C/C++:      make clean
#
echo "=========================================="
echo "Cleaning build artifacts..."
echo "=========================================="

# Clean global artifacts
echo "Cleaning global output directories..."
rm -rf output/debug/* output/release/*

# Clean joke website module
if [ -d "modules/joke-website" ]; then
    echo "Cleaning joke website module..."
    cd modules/joke-website
    
    # Clean build artifacts
    rm -rf build/
    rm -rf node_modules/.cache/
    rm -rf src/data/jokes.db*  # Remove database files (will be recreated)
    
    # Clean logs if they exist
    rm -rf logs/
    
    cd ../..
    echo "✅ Joke website artifacts cleaned"
fi

# Clean any temporary files
echo "Cleaning temporary files..."
find . -name "*.tmp" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true

echo "=========================================="
echo "Clean complete!"
echo "=========================================="
# =============================================================================

echo "=========================================="
echo "Cleaning build artifacts..."
echo "=========================================="

# TODO: IT Agent - Add clean commands here based on tech stack
echo "ERROR: Clean script not configured."
echo "IT Agent must customize this script for the project."
exit 1
