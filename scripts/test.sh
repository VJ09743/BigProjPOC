#!/bin/bash
# =============================================================================
# Test Script
# =============================================================================
# Runs all tests in the project.
# Customize this script for your technology stack.
# =============================================================================

set -e  # Exit on error

echo "=========================================="
echo "Running tests..."
echo "=========================================="

# Option 1: Use Makefile
if [ -f "Makefile" ] && grep -q "^test:" Makefile; then
    make test
    exit 0
fi

# Option 2: Node.js project
if [ -f "package.json" ]; then
    npm test
    exit 0
fi

# Option 3: Python project
if [ -f "setup.py" ] || [ -f "pyproject.toml" ]; then
    pytest
    exit 0
fi

# Option 4: Go project
if [ -f "go.mod" ]; then
    go test ./...
    exit 0
fi

# Option 5: Rust project
if [ -f "Cargo.toml" ]; then
    cargo test
    exit 0
fi

# Test individual modules
echo "Testing modules..."
for module_dir in modules/*/; do
    if [ -d "${module_dir}test" ]; then
        echo "Testing ${module_dir}..."
        if [ -f "${module_dir}Makefile" ] && grep -q "^test:" "${module_dir}Makefile"; then
            make -C "$module_dir" test
        fi
    fi
done

echo ""
echo "All tests complete!"
