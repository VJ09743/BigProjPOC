#!/bin/bash
# =============================================================================
# Test Script
# =============================================================================
# Run tests for all modules in the project
# =============================================================================

set -e

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)

echo "=========================================="
echo "Running project tests..."
echo "=========================================="

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Joke App Tests
echo "Testing joke-app module..."
JOKE_APP_TEST_DIR="$ROOT_DIR/modules/joke-app/test"

if [ -d "$JOKE_APP_TEST_DIR" ] && [ -f "$JOKE_APP_TEST_DIR/run-tests.sh" ]; then
    echo "  - Running joke-app tests..."
    if (cd "$JOKE_APP_TEST_DIR" && ./run-tests.sh); then
        echo "  - joke-app tests: PASSED ✓"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "  - joke-app tests: FAILED ✗"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
elif [ -f "$JOKE_APP_TEST_DIR/test.html" ]; then
    echo "  - joke-app has browser tests (manual verification needed)"
    echo "  - Open: file://$JOKE_APP_TEST_DIR/test.html"
else
    echo "  - joke-app tests not implemented yet"
fi

# Sudoku Web App Tests
echo "Testing sudoku-webapp module..."
SUDOKU_TEST_DIR="$ROOT_DIR/modules/sudoku-webapp"

if [ -f "$SUDOKU_TEST_DIR/backend/package.json" ]; then
    echo "  - Running backend tests..."
    if (cd "$SUDOKU_TEST_DIR/backend" && npm test 2>/dev/null); then
        echo "  - sudoku backend tests: PASSED ✓"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "  - sudoku backend tests: FAILED ✗"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
else
    echo "  - sudoku backend tests not implemented yet"
fi

if [ -f "$SUDOKU_TEST_DIR/frontend/package.json" ]; then
    echo "  - Running frontend tests..."
    if (cd "$SUDOKU_TEST_DIR/frontend" && npm test 2>/dev/null); then
        echo "  - sudoku frontend tests: PASSED ✓"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "  - sudoku frontend tests: FAILED ✗"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
else
    echo "  - sudoku frontend tests not implemented yet"
fi

echo "=========================================="
echo "Test Summary:"
echo "  Total test suites: $TOTAL_TESTS"
echo "  Passed: $PASSED_TESTS"
echo "  Failed: $FAILED_TESTS"

if [ $TOTAL_TESTS -eq 0 ]; then
    echo "  Status: No tests implemented yet"
    exit 0
elif [ $FAILED_TESTS -eq 0 ]; then
    echo "  Status: ALL TESTS PASSED ✓"
    exit 0
else
    echo "  Status: SOME TESTS FAILED ✗"
    exit 1
fi

set -e  # Exit on error

echo "=========================================="
echo "Running tests..."
echo "=========================================="

# TODO: IT Agent - Add test commands here based on tech stack
echo "ERROR: Test script not configured."
echo "IT Agent must customize this script for the project's test framework."
exit 1
