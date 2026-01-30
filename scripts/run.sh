#!/bin/bash
# =============================================================================
# Run Script
# =============================================================================
# Runs the application.
# Customize this script for your project.
# =============================================================================

set -e  # Exit on error

echo "=========================================="
echo "Starting application..."
echo "=========================================="

# Option 1: Node.js project
if [ -f "package.json" ]; then
    npm start
    exit 0
fi

# Option 2: Python project
if [ -f "main.py" ]; then
    python main.py "$@"
    exit 0
fi

# Option 3: Go project
if [ -f "go.mod" ]; then
    go run . "$@"
    exit 0
fi

# Option 4: Rust project
if [ -f "Cargo.toml" ]; then
    cargo run "$@"
    exit 0
fi

# Option 5: Run from output directory
if [ -d "output/release/bin" ]; then
    echo "Available executables in output/release/bin/:"
    ls -la output/release/bin/
    echo ""
    echo "Run manually: ./output/release/bin/<executable>"
    exit 0
fi

# Option 6: Web project - serve static files
if [ -f "modules/*/index.html" ] || [ -f "index.html" ]; then
    echo "Web project detected. Starting simple HTTP server..."
    if command -v python3 &> /dev/null; then
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        python -m SimpleHTTPServer 8000
    else
        echo "Install Python to serve web files, or open index.html directly."
    fi
    exit 0
fi

echo "No runnable application found."
echo "Customize this script for your project."
