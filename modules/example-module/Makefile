# =============================================================================
# Module Makefile Template
# =============================================================================
# Customize this Makefile for your module's needs.
# Replace 'example-module' with your actual module name.
# =============================================================================

# Module name
MODULE_NAME := example-module

# Compiler settings (customize for your language/toolchain)
CC := gcc
CXX := g++
CFLAGS := -Wall -Wextra
CXXFLAGS := -Wall -Wextra -std=c++17

# Directories
SRC_DIR := src
TEST_DIR := test
RELEASE_DIR := release
DEBUG_DIR := debug
BUILD_CONFIG_DIR := build-config

# Source files (customize file extensions as needed)
SOURCES := $(wildcard $(SRC_DIR)/*.c) $(wildcard $(SRC_DIR)/*.cpp)
HEADERS := $(wildcard $(SRC_DIR)/*.h) $(wildcard $(SRC_DIR)/*.hpp)

# =============================================================================
# Build Targets
# =============================================================================

.PHONY: all release debug test clean help

# Default target
all: release debug

# Release build (optimized)
release:
	@echo "Building $(MODULE_NAME) [RELEASE]..."
	@mkdir -p $(RELEASE_DIR)
	# Add your release build commands here
	# Example: $(CXX) $(CXXFLAGS) -O2 -o $(RELEASE_DIR)/$(MODULE_NAME) $(SOURCES)
	@echo "Release build complete: $(RELEASE_DIR)/"

# Debug build (with debug symbols)
debug:
	@echo "Building $(MODULE_NAME) [DEBUG]..."
	@mkdir -p $(DEBUG_DIR)
	# Add your debug build commands here
	# Example: $(CXX) $(CXXFLAGS) -g -O0 -DDEBUG -o $(DEBUG_DIR)/$(MODULE_NAME) $(SOURCES)
	@echo "Debug build complete: $(DEBUG_DIR)/"

# Run tests
test:
	@echo "Running tests for $(MODULE_NAME)..."
	# Add your test commands here
	# Example: cd $(TEST_DIR) && ./run_tests.sh
	@echo "Tests complete."

# Clean build artifacts
clean:
	@echo "Cleaning $(MODULE_NAME)..."
	rm -rf $(RELEASE_DIR)/* $(DEBUG_DIR)/*
	@echo "Clean complete."

# Help
help:
	@echo "$(MODULE_NAME) Build System"
	@echo ""
	@echo "Targets:"
	@echo "  all      - Build release and debug versions"
	@echo "  release  - Build optimized release version"
	@echo "  debug    - Build debug version with symbols"
	@echo "  test     - Run module tests"
	@echo "  clean    - Remove build artifacts"
	@echo "  help     - Show this help message"
