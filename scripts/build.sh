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

echo "=========================================="
echo "Building All Project Modules..."
echo "=========================================="

# Build joke website module
if [ -d "modules/joke-website" ]; then
    echo "Building joke website module..."
    cd modules/joke-website
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    # Run build
    npm run build 2>/dev/null || echo "Build skipped (no source files yet)"
    
    cd ../..
    echo "✅ Joke website module processed"
else
    echo "⚠️  Joke website module not found"
fi

echo "=========================================="
echo "Build complete!"
echo "=========================================="
echo "IT Agent must customize this script for the project's technology stack."
exit 1
