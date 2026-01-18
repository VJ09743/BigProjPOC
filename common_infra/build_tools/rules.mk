# Reusable Build Rules
# This makefile contains common build patterns used across all modules

# Include common variables
include $(REPO_ROOT)/common_infra/build_tools/common.mk

# Default target
.PHONY: all
all: build

# Create necessary directories
.PHONY: dirs
dirs:
	@mkdir -p $(BUILD_DIR)
	@mkdir -p $(RELEASE_DIR)

# Thrift code generation rule
# Usage: $(call thrift_gen,<thrift_file>,<language>)
define thrift_gen
	$(MSG_GEN) Generating $(2) code from $(1)
	$(THRIFT) $(THRIFT_$(shell echo $(2) | tr '[:lower:]' '[:upper:]')_OPTIONS) -out $(GEN_$(shell echo $(2) | tr '[:lower:]' '[:upper:]')_DIR) $(1)
endef

# Pattern rule for .thrift files -> C++ code
gen-cpp/%.cpp: %.thrift
	$(MSG_GEN) $<
	@mkdir -p gen-cpp
	$(THRIFT) $(THRIFT_CPP_OPTIONS) -out gen-cpp $<

# Clean generated code
.PHONY: clean-gen
clean-gen:
	$(MSG_CLEAN) Generated code
	@rm -rf $(GEN_CPP_DIR) $(GEN_JAVA_DIR) $(GEN_PY_DIR)

# Clean build artifacts
.PHONY: clean-build
clean-build:
	$(MSG_CLEAN) Build artifacts
	@rm -rf $(BUILD_DIR)

# Clean release artifacts
.PHONY: clean-release
clean-release:
	$(MSG_CLEAN) Release artifacts
	@rm -rf $(RELEASE_DIR)

# Full clean
.PHONY: clean
clean: clean-gen clean-build
	$(MSG_CLEAN) All artifacts

# Help target
.PHONY: help
help:
	@echo "Common Build Targets:"
	@echo "  all          - Build everything (default)"
	@echo "  dirs         - Create build directories"
	@echo "  clean-gen    - Remove generated code"
	@echo "  clean-build  - Remove build artifacts"
	@echo "  clean-release- Remove release artifacts"
	@echo "  clean        - Remove all generated and build artifacts"
	@echo "  help         - Show this help message"
	@echo ""
	@echo "Thrift generation:"
	@echo "  Use: \$$(call thrift_gen,<file.thrift>,<cpp|java|py>)"

# Prevent deletion of intermediate files
.SECONDARY:

# Make will use bash for executing recipes
SHELL := /bin/bash
