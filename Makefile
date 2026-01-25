# =============================================================================
# Top-Level Project Makefile
# =============================================================================
# Builds all modules and combines output into the output/ directory.
# =============================================================================

# Output directories
OUTPUT_DIR := output
RELEASE_DIR := $(OUTPUT_DIR)/release
DEBUG_DIR := $(OUTPUT_DIR)/debug

# Find all modules (directories in modules/ that have a Makefile)
MODULES := $(wildcard modules/*/Makefile)
MODULE_DIRS := $(dir $(MODULES))

# =============================================================================
# Main Targets
# =============================================================================

.PHONY: all release debug test clean help list-modules

# Default: build everything
all: release debug

# Build all modules in release mode and combine output
release:
	@echo "=========================================="
	@echo "Building ALL modules [RELEASE]"
	@echo "=========================================="
	@mkdir -p $(RELEASE_DIR)/bin $(RELEASE_DIR)/lib
	@for dir in $(MODULE_DIRS); do \
		echo "Building $$dir..."; \
		$(MAKE) -C $$dir release || exit 1; \
	done
	@echo ""
	@echo "Combining outputs to $(RELEASE_DIR)/"
	@# Add commands here to copy/link module outputs to output/release/
	@# Example: cp modules/*/release/*.so $(RELEASE_DIR)/lib/ 2>/dev/null || true
	@# Example: cp modules/*/release/*.a $(RELEASE_DIR)/lib/ 2>/dev/null || true
	@# Example: cp modules/*/release/*[!.]*[!.so][!.a] $(RELEASE_DIR)/bin/ 2>/dev/null || true
	@echo "Release build complete!"

# Build all modules in debug mode and combine output
debug:
	@echo "=========================================="
	@echo "Building ALL modules [DEBUG]"
	@echo "=========================================="
	@mkdir -p $(DEBUG_DIR)/bin $(DEBUG_DIR)/lib
	@for dir in $(MODULE_DIRS); do \
		echo "Building $$dir..."; \
		$(MAKE) -C $$dir debug || exit 1; \
	done
	@echo ""
	@echo "Combining outputs to $(DEBUG_DIR)/"
	@# Add commands here to copy/link module outputs to output/debug/
	@echo "Debug build complete!"

# Run tests for all modules
test:
	@echo "=========================================="
	@echo "Running tests for ALL modules"
	@echo "=========================================="
	@for dir in $(MODULE_DIRS); do \
		echo "Testing $$dir..."; \
		$(MAKE) -C $$dir test || exit 1; \
	done
	@echo "All tests complete!"

# Clean all modules and output directory
clean:
	@echo "=========================================="
	@echo "Cleaning ALL modules and output"
	@echo "=========================================="
	@for dir in $(MODULE_DIRS); do \
		echo "Cleaning $$dir..."; \
		$(MAKE) -C $$dir clean || true; \
	done
	@rm -rf $(RELEASE_DIR)/bin/* $(RELEASE_DIR)/lib/*
	@rm -rf $(DEBUG_DIR)/bin/* $(DEBUG_DIR)/lib/*
	@echo "Clean complete!"

# List all modules
list-modules:
	@echo "Available modules:"
	@for dir in $(MODULE_DIRS); do \
		echo "  - $$dir"; \
	done

# Help
help:
	@echo "Project Build System"
	@echo ""
	@echo "Targets:"
	@echo "  all          - Build release and debug for all modules"
	@echo "  release      - Build all modules in release mode"
	@echo "  debug        - Build all modules in debug mode"
	@echo "  test         - Run tests for all modules"
	@echo "  clean        - Clean all modules and output"
	@echo "  list-modules - List all available modules"
	@echo "  help         - Show this help"
	@echo ""
	@echo "Output:"
	@echo "  output/release/  - Combined release builds"
	@echo "  output/debug/    - Combined debug builds"
	@echo ""
	@echo "To build a single module:"
	@echo "  make -C modules/module-name release"
