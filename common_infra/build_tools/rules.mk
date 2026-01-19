# Common Build Rules
# This file contains reusable build rules for all modules

# Phony targets (targets that don't represent files)
.PHONY: all generate build build-debug build-release clean install help

# Default target
.DEFAULT_GOAL := all

# Help target - displays available targets
help:
	@echo "Available targets:"
	@echo "  all          - Build everything (generate + build)"
	@echo "  generate     - Generate C++ code from Thrift interface files"
	@echo "  build        - Build both debug and release versions"
	@echo "  build-debug  - Build debug version"
	@echo "  build-release- Build release version"
	@echo "  clean        - Remove all build artifacts"
	@echo "  install      - Install built artifacts"
	@echo "  help         - Show this help message"

# Rule to create directories
$(BUILD_DIR) $(DEBUG_DIR) $(RELEASE_DIR) $(INT_GENERATED_DIR) $(INT_IMPL_DIR):
	@mkdir -p $@

# Rule to generate C++ from Thrift files
define THRIFT_GEN_RULE
@echo "\033[34m[INFO]\033[0m Generating C++ code from Thrift files..."
@mkdir -p $(INT_GENERATED_DIR)
@if [ -d "$(EXT_INTERFACE_DIR)" ] && [ -n "$$(ls -A $(EXT_INTERFACE_DIR)/*.thrift 2>/dev/null)" ]; then \
	for thrift_file in $(EXT_INTERFACE_DIR)/*.thrift; do \
		echo "Processing $$thrift_file..."; \
		if [ -x "$(THRIFT_BIN)" ]; then \
			$(THRIFT_BIN) $(THRIFT_FLAGS) -out $(INT_GENERATED_DIR) $$thrift_file; \
		else \
			echo "WARNING: Thrift compiler not found at $(THRIFT_BIN)"; \
			echo "Skipping Thrift generation. Install Thrift or place binary at $(THRIFT_BIN)"; \
		fi \
	done; \
	echo "\033[32m[SUCCESS]\033[0m Thrift code generation complete"; \
else \
	echo "No Thrift files found in $(EXT_INTERFACE_DIR)"; \
	echo "Skipping Thrift generation"; \
fi
endef

# Rule to compile C++ files for debug build
define BUILD_DEBUG_RULE
@echo "\033[34m[INFO]\033[0m Building debug version..."
@mkdir -p $(DEBUG_DIR)
@if [ -d "$(INT_GENERATED_DIR)" ] && [ -n "$$(ls -A $(INT_GENERATED_DIR)/*.cpp 2>/dev/null)" ]; then \
	for cpp_file in $(INT_GENERATED_DIR)/*.cpp; do \
		obj_file=$(DEBUG_DIR)/$$(basename $$cpp_file .cpp).o; \
		echo "Compiling $$cpp_file..."; \
		$(CXX) $(CXXFLAGS_DEBUG) $(INCLUDES) -c $$cpp_file -o $$obj_file; \
	done; \
fi
@if [ -d "$(INT_IMPL_DIR)" ] && [ -n "$$(ls -A $(INT_IMPL_DIR)/*.cpp 2>/dev/null)" ]; then \
	for cpp_file in $(INT_IMPL_DIR)/*.cpp; do \
		obj_file=$(DEBUG_DIR)/$$(basename $$cpp_file .cpp).o; \
		echo "Compiling $$cpp_file..."; \
		$(CXX) $(CXXFLAGS_DEBUG) $(INCLUDES) -c $$cpp_file -o $$obj_file; \
	done; \
fi
@if [ -n "$$(ls -A $(DEBUG_DIR)/*.o 2>/dev/null)" ]; then \
	echo "Linking debug library..."; \
	ar rcs $(DEBUG_DIR)/lib$(MODULE_NAME).a $(DEBUG_DIR)/*.o; \
	echo "Linking debug executable..."; \
	$(CXX) $(CXXFLAGS_DEBUG) $(DEBUG_DIR)/*.o -o $(DEBUG_DIR)/$(MODULE_NAME) $(LDFLAGS) $(LIBS); \
	echo "\033[32m[SUCCESS]\033[0m Debug build complete: $(DEBUG_DIR)/lib$(MODULE_NAME).a and $(DEBUG_DIR)/$(MODULE_NAME)"; \
else \
	echo "No source files to compile. Skipping debug build."; \
fi
endef

# Rule to compile C++ files for release build
define BUILD_RELEASE_RULE
@echo "\033[34m[INFO]\033[0m Building release version..."
@mkdir -p $(RELEASE_DIR)
@if [ -d "$(INT_GENERATED_DIR)" ] && [ -n "$$(ls -A $(INT_GENERATED_DIR)/*.cpp 2>/dev/null)" ]; then \
	for cpp_file in $(INT_GENERATED_DIR)/*.cpp; do \
		obj_file=$(RELEASE_DIR)/$$(basename $$cpp_file .cpp).o; \
		echo "Compiling $$cpp_file..."; \
		$(CXX) $(CXXFLAGS_RELEASE) $(INCLUDES) -c $$cpp_file -o $$obj_file; \
	done; \
fi
@if [ -d "$(INT_IMPL_DIR)" ] && [ -n "$$(ls -A $(INT_IMPL_DIR)/*.cpp 2>/dev/null)" ]; then \
	for cpp_file in $(INT_IMPL_DIR)/*.cpp; do \
		obj_file=$(RELEASE_DIR)/$$(basename $$cpp_file .cpp).o; \
		echo "Compiling $$cpp_file..."; \
		$(CXX) $(CXXFLAGS_RELEASE) $(INCLUDES) -c $$cpp_file -o $$obj_file; \
	done; \
fi
@if [ -n "$$(ls -A $(RELEASE_DIR)/*.o 2>/dev/null)" ]; then \
	echo "Linking release library..."; \
	ar rcs $(RELEASE_DIR)/lib$(MODULE_NAME).a $(RELEASE_DIR)/*.o; \
	echo "Linking release executable..."; \
	$(CXX) $(CXXFLAGS_RELEASE) $(RELEASE_DIR)/*.o -o $(RELEASE_DIR)/$(MODULE_NAME) $(LDFLAGS) $(LIBS); \
	echo "\033[32m[SUCCESS]\033[0m Release build complete: $(RELEASE_DIR)/lib$(MODULE_NAME).a and $(RELEASE_DIR)/$(MODULE_NAME)"; \
else \
	echo "No source files to compile. Skipping release build."; \
fi
endef

# Rule to clean build artifacts
define CLEAN_RULE
@echo "\033[34m[INFO]\033[0m Cleaning build artifacts..."
@rm -rf $(BUILD_DIR)
@rm -rf $(INT_GENERATED_DIR)
@echo "\033[32m[SUCCESS]\033[0m Clean complete"
endef

# Rule to install built artifacts
define INSTALL_RULE
@echo "\033[34m[INFO]\033[0m Installing built artifacts to repository release/..."
@mkdir -p $(INSTALL_BIN_DIR) $(INSTALL_LIB_DIR) $(INSTALL_INCLUDE_DIR)
@if [ -f "$(RELEASE_DIR)/$(MODULE_NAME)" ]; then \
	cp $(RELEASE_DIR)/$(MODULE_NAME) $(INSTALL_BIN_DIR)/; \
	chmod +x $(INSTALL_BIN_DIR)/$(MODULE_NAME); \
	echo "Installed executable to $(INSTALL_BIN_DIR)/$(MODULE_NAME)"; \
fi
@if [ -f "$(RELEASE_DIR)/lib$(MODULE_NAME).a" ]; then \
	cp $(RELEASE_DIR)/lib$(MODULE_NAME).a $(INSTALL_LIB_DIR)/; \
	echo "Installed library to $(INSTALL_LIB_DIR)/lib$(MODULE_NAME).a"; \
fi
@if [ -d "$(INT_GENERATED_DIR)" ] && [ -n "$$(ls -A $(INT_GENERATED_DIR)/*.h 2>/dev/null)" ]; then \
	mkdir -p $(INSTALL_INCLUDE_DIR)/$(MODULE_NAME); \
	cp $(INT_GENERATED_DIR)/*.h $(INSTALL_INCLUDE_DIR)/$(MODULE_NAME)/; \
	echo "Installed generated headers to $(INSTALL_INCLUDE_DIR)/$(MODULE_NAME)/"; \
fi
@if [ -d "$(INT_IMPL_DIR)" ] && [ -n "$$(ls -A $(INT_IMPL_DIR)/*.h 2>/dev/null)" ]; then \
	mkdir -p $(INSTALL_INCLUDE_DIR)/$(MODULE_NAME); \
	cp $(INT_IMPL_DIR)/*.h $(INSTALL_INCLUDE_DIR)/$(MODULE_NAME)/; \
	echo "Installed implementation headers to $(INSTALL_INCLUDE_DIR)/$(MODULE_NAME)/"; \
fi
@echo "\033[32m[SUCCESS]\033[0m Install complete - artifacts in $(REPO_RELEASE_DIR)/"
endef
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
