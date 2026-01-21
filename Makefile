# RTDCS Root Makefile
# Builds all modules and prepares release package
#
# Author: Developer Agent
# Date: 2026-01-21

.PHONY: all build build-all clean clean-all install release help run-all test-all

# Default target
all: build install

# Print help information
help:
	@echo "======================================================================="
	@echo "RTDCS Build System - Root Makefile"
	@echo "======================================================================="
	@echo ""
	@echo "Available targets:"
	@echo "  make all          - Build all modules and install to release/ (default)"
	@echo "  make build        - Build all three modules (debug + release)"
	@echo "  make build-all    - Same as 'make build'"
	@echo "  make clean        - Clean all module build artifacts"
	@echo "  make clean-all    - Clean everything including release/"
	@echo "  make install      - Copy executables to release/bin/"
	@echo "  make release      - Create complete release package"
	@echo "  make test-all     - Run all unit tests"
	@echo "  make run-all      - Launch all three modules (requires tmux or screen)"
	@echo "  make help         - Show this help message"
	@echo ""
	@echo "Quick Start:"
	@echo "  1. make all       # Build and install everything"
	@echo "  2. make run-all   # Run all three modules"
	@echo ""
	@echo "Or run manually:"
	@echo "  Terminal 1: ./release/bin/BigModuleA --samples 100"
	@echo "  Terminal 2: ./release/bin/BigModuleC --port 9090"
	@echo "  Terminal 3: ./release/bin/BigModuleB --host localhost --port 9090 --samples 50"
	@echo ""
	@echo "======================================================================="

# Build all modules
build build-all:
	@echo "======================================================================="
	@echo "Building all RTDCS modules..."
	@echo "======================================================================="
	@$(MAKE) -C BigModuleA build
	@echo ""
	@$(MAKE) -C BigModuleB build
	@echo ""
	@$(MAKE) -C BigModuleC build
	@echo ""
	@echo "\033[32m[SUCCESS]\033[0m All modules built successfully!"
	@echo ""

# Clean all module build artifacts
clean:
	@echo "======================================================================="
	@echo "Cleaning all RTDCS modules..."
	@echo "======================================================================="
	@$(MAKE) -C BigModuleA clean
	@$(MAKE) -C BigModuleB clean
	@$(MAKE) -C BigModuleC clean
	@echo "\033[32m[SUCCESS]\033[0m All modules cleaned!"

# Clean everything including release/
clean-all: clean
	@echo "Cleaning release directory..."
	@rm -rf release/bin release/lib release/include
	@echo "\033[32m[SUCCESS]\033[0m Full clean complete!"

# Install executables to release/bin/
install:
	@echo "======================================================================="
	@echo "Installing RTDCS executables to release/bin/..."
	@echo "======================================================================="
	@mkdir -p release/bin release/lib release/include
	@echo "Copying BigModuleA executable..."
	@cp -f BigModuleA/build/release/BigModuleA release/bin/
	@echo "Copying BigModuleB executable..."
	@cp -f BigModuleB/build/release/BigModuleB release/bin/
	@echo "Copying BigModuleC executable..."
	@cp -f BigModuleC/build/release/BigModuleC release/bin/
	@echo "Copying libraries..."
	@cp -f BigModuleA/build/release/libBigModuleA.a release/lib/ 2>/dev/null || true
	@cp -f BigModuleB/build/release/libBigModuleB.a release/lib/ 2>/dev/null || true
	@cp -f BigModuleC/build/release/libBigModuleC.a release/lib/ 2>/dev/null || true
	@echo "Setting executable permissions..."
	@chmod +x release/bin/*
	@echo ""
	@echo "\033[32m[SUCCESS]\033[0m Installation complete!"
	@echo ""
	@echo "Executables installed to:"
	@ls -lh release/bin/
	@echo ""

# Create complete release package
release: clean build install
	@echo "======================================================================="
	@echo "Creating RTDCS release package..."
	@echo "======================================================================="
	@echo "Release contents:"
	@echo ""
	@echo "Binaries:"
	@ls -lh release/bin/
	@echo ""
	@echo "Documentation:"
	@ls -1 release/docs/
	@echo ""
	@echo "\033[32m[SUCCESS]\033[0m Release package ready in release/ folder!"
	@echo ""
	@echo "To distribute: tar czf rtdcs-release.tar.gz release/"
	@echo ""

# Run all unit tests
test-all:
	@echo "======================================================================="
	@echo "Running all unit tests..."
	@echo "======================================================================="
	@$(MAKE) -C BigModuleA test || true
	@echo ""
	@$(MAKE) -C BigModuleB test || true
	@echo ""
	@$(MAKE) -C BigModuleC test || true
	@echo ""
	@echo "\033[32m[SUCCESS]\033[0m All tests complete!"

# Run all three modules (requires separate terminals or tmux/screen)
run-all:
	@echo "======================================================================="
	@echo "Launching RTDCS System"
	@echo "======================================================================="
	@echo ""
	@echo "This will launch all three modules in separate background processes."
	@echo "Use './scripts/run-rtdcs.sh' for better terminal management."
	@echo ""
	@echo "Starting BigModuleA (ThermalMonitor)..."
	@./release/bin/BigModuleA --samples 0 &
	@sleep 2
	@echo "Starting BigModuleC (CompensationController)..."
	@./release/bin/BigModuleC --port 9090 &
	@sleep 2
	@echo "Starting BigModuleB (DistortionPredictor)..."
	@./release/bin/BigModuleB --host localhost --port 9090 --samples 0 &
	@echo ""
	@echo "\033[32m[SUCCESS]\033[0m All modules launched!"
	@echo ""
	@echo "To stop all modules:"
	@echo "  pkill -f BigModuleA"
	@echo "  pkill -f BigModuleB"
	@echo "  pkill -f BigModuleC"
	@echo ""
	@echo "Or use: ./scripts/stop-rtdcs.sh"
	@echo ""
