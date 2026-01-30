#!/bin/bash
# =============================================================================
# Clean Script
# =============================================================================
# Removes build artifacts and temporary files.
# Customize this script for your technology stack.
# =============================================================================

echo "=========================================="
echo "Cleaning build artifacts..."
echo "=========================================="

# Option 1: Use Makefile
if [ -f "Makefile" ]; then
    make clean
fi

# Option 2: Node.js project
if [ -d "node_modules" ]; then
    echo "Removing node_modules..."
    rm -rf node_modules
fi
if [ -d "dist" ]; then
    echo "Removing dist..."
    rm -rf dist
fi

# Option 3: Python project
if [ -d "__pycache__" ]; then
    echo "Removing Python cache..."
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find . -type f -name "*.pyc" -delete 2>/dev/null || true
fi
if [ -d ".pytest_cache" ]; then
    rm -rf .pytest_cache
fi
if [ -d "*.egg-info" ]; then
    rm -rf *.egg-info
fi

# Option 4: Go project
if [ -d "go.mod" ]; then
    go clean
fi

# Option 5: Rust project
if [ -f "Cargo.toml" ]; then
    cargo clean
fi

# Clean output directories
if [ -d "output/release" ]; then
    echo "Removing output/release..."
    rm -rf output/release/*
fi
if [ -d "output/debug" ]; then
    echo "Removing output/debug..."
    rm -rf output/debug/*
fi

# Clean module build artifacts
for module_dir in modules/*/; do
    if [ -d "${module_dir}release" ]; then
        echo "Cleaning ${module_dir}release..."
        rm -rf "${module_dir}release/"*
    fi
    if [ -d "${module_dir}debug" ]; then
        echo "Cleaning ${module_dir}debug..."
        rm -rf "${module_dir}debug/"*
    fi
done

echo ""
echo "Clean complete!"
