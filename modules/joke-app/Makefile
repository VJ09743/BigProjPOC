# =============================================================================
# Joke App Module Makefile
# =============================================================================
# Infrastructure and build configuration for joke app module
# =============================================================================

# Project paths
PROJECT_ROOT := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))/../..
SRC_DIR := $(PROJECT_ROOT)/modules/joke-app/src
OUTPUT_DIR := $(PROJECT_ROOT)/output/release/joke-app
TEST_DIR := $(PROJECT_ROOT)/modules/joke-app/test

# Development server settings
DEV_PORT := 8080

.PHONY: help dev build test clean setup

# Default target
help:
	@echo "Joke App Module - Available commands:"
	@echo "  make setup    - Set up development environment (create directories)"
	@echo "  make dev      - Start development server on port $(DEV_PORT)"
	@echo "  make build    - Copy files to output directory"
	@echo "  make test     - Run tests (when implemented by Developer)"
	@echo "  make clean    - Clean build artifacts"

# Set up development environment
setup:
	@echo "Setting up joke app development environment..."
	@mkdir -p $(SRC_DIR)/scripts
	@mkdir -p $(SRC_DIR)/styles
	@mkdir -p $(SRC_DIR)/assets/images
	@mkdir -p $(TEST_DIR)
	@echo "Directory structure created ✓"

# Start development server
dev:
	@echo "Starting development server for joke app..."
	@if [ ! -d "$(SRC_DIR)" ]; then \
		echo "ERROR: Source directory not found. Run 'make setup' first."; \
		exit 1; \
	fi
	@echo "Serving from: $(SRC_DIR)"
	@echo "URL: http://localhost:$(DEV_PORT)"
	@cd $(SRC_DIR) && \
	if command -v python3 >/dev/null 2>&1; then \
		python3 -m http.server $(DEV_PORT); \
	elif command -v python >/dev/null 2>&1; then \
		python -m SimpleHTTPServer $(DEV_PORT); \
	else \
		echo "ERROR: Python not found. Install Python to run dev server."; \
		echo "Alternative: Open $(SRC_DIR)/index.html in your browser."; \
		exit 1; \
	fi

# Build (copy files to output)
build:
	@echo "Building joke app..."
	@mkdir -p $(OUTPUT_DIR)
	@if [ -d "$(SRC_DIR)" ]; then \
		cp -r $(SRC_DIR)/* $(OUTPUT_DIR)/ 2>/dev/null || true; \
		echo "Files copied to $(OUTPUT_DIR) ✓"; \
	else \
		echo "WARNING: Source directory not found. Developer needs to create application files."; \
	fi

# Run tests
test:
	@echo "Running joke app tests..."
	@if [ -f "$(TEST_DIR)/run-tests.sh" ]; then \
		cd $(TEST_DIR) && ./run-tests.sh; \
	elif [ -f "$(TEST_DIR)/test.html" ]; then \
		echo "Opening test runner in browser..."; \
		open $(TEST_DIR)/test.html || xdg-open $(TEST_DIR)/test.html || start $(TEST_DIR)/test.html; \
	else \
		echo "No tests found. Developer needs to implement tests."; \
	fi

# Clean build artifacts
clean:
	@echo "Cleaning joke app build artifacts..."
	@rm -rf $(OUTPUT_DIR)
	@echo "Build artifacts cleaned ✓"

# Show project information
info:
	@echo "Joke App Module Information:"
	@echo "  Source Directory: $(SRC_DIR)"
	@echo "  Output Directory: $(OUTPUT_DIR)"
	@echo "  Test Directory: $(TEST_DIR)"
	@echo "  Development Port: $(DEV_PORT)"