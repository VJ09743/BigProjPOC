#!/bin/bash
# =============================================================================
# Test Script - TEMPLATE
# =============================================================================
# IT Agent: Customize this script for your project's test framework.
#
# Instructions:
# 1. Identify the project's test framework (from Architect's tech stack decision)
# 2. Add the appropriate test commands below
# 3. Remove these instructions when done
#
# Examples by technology:
# - Node.js:    npm test OR jest OR mocha
# - Python:     pytest OR python -m unittest
# - Go:         go test ./...
# - Rust:       cargo test
# - Java:       mvn test OR gradle test
# - C/C++:      make test OR ctest
#
# =============================================================================

set -e  # Exit on error

echo "=========================================="
echo "Running tests..."
echo "=========================================="

# Test joke website module
if [ -d "modules/joke-website" ]; then
    echo "Testing joke website module..."
    cd modules/joke-website
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    # Run tests
    npm test || echo "Tests not yet implemented"
    
    cd ../..
    echo "✅ Joke website module tested"
else
    echo "⚠️  Joke website module not found"
fi

echo "=========================================="
echo "Testing complete!"
echo "=========================================="
echo "=========================================="

# TODO: IT Agent - Add test commands here based on tech stack
echo "ERROR: Test script not configured."
echo "IT Agent must customize this script for the project's test framework."
exit 1
