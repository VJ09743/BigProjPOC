#!/bin/bash
# =============================================================================
# Build Script
# =============================================================================
# Builds all modules in the project.
# Customize this script for your technology stack.
# =============================================================================

set -e  # Exit on error

echo "=========================================="
echo "Building project..."
echo "=========================================="

# Option 1: Use Makefile (default)
if [ -f "Makefile" ]; then
    make release
    exit 0
fi

# Option 2: Node.js project
if [ -f "package.json" ]; then
    npm install
    npm run build
    exit 0
fi

# Option 3: Python project
if [ -f "setup.py" ] || [ -f "pyproject.toml" ]; then
    pip install -e .
    exit 0
fi

# Option 4: Go project
if [ -f "go.mod" ]; then
    go build ./...
    exit 0
fi

# Option 5: Rust project
if [ -f "Cargo.toml" ]; then
    cargo build --release
    exit 0
fi

# Build individual modules if no project-level config
echo "Building modules..."
for module_dir in modules/*/; do
    if [ -f "${module_dir}Makefile" ]; then
        echo "Building ${module_dir}..."
        make -C "$module_dir" release
    fi
done

echo ""
echo "Build complete!"
