# Common Build Configuration
# This file contains common build variables and settings used across all modules
# Supports Linux (Ubuntu 20.04+) and macOS (11.0+)

# ============================================================================
# Platform Detection
# ============================================================================

UNAME_S := $(shell uname -s)
UNAME_M := $(shell uname -m)

ifeq ($(UNAME_S),Darwin)
    OS_TYPE := macOS
    # Check if Apple Silicon or Intel
    ifeq ($(UNAME_M),arm64)
        ARCH := arm64
        HOMEBREW_PREFIX := /opt/homebrew
    else
        ARCH := x86_64
        HOMEBREW_PREFIX := /usr/local
    endif
else ifeq ($(UNAME_S),Linux)
    OS_TYPE := Linux
    ARCH := $(UNAME_M)
else
    $(error Unsupported operating system: $(UNAME_S))
endif

# ============================================================================
# Repository Paths
# ============================================================================

# Repository root directory
REPO_ROOT := $(shell git rev-parse --show-toplevel 2>/dev/null || pwd)

# Common infrastructure paths
COMMON_INFRA := $(REPO_ROOT)/common_infra

# ============================================================================
# Thrift Configuration (Platform-Specific)
# ============================================================================

ifeq ($(OS_TYPE),macOS)
    # macOS: Use Homebrew-installed Thrift
    THRIFT := $(shell which thrift || echo $(HOMEBREW_PREFIX)/bin/thrift)
    THRIFT_INCLUDE := $(HOMEBREW_PREFIX)/include
    THRIFT_LIB_DIR := $(HOMEBREW_PREFIX)/lib

    # Verify Thrift is installed
    ifeq ($(wildcard $(THRIFT)),)
        $(warning Thrift not found. Please install via: brew install thrift)
    endif
else
    # Linux: Use local Thrift installation from common_infra
    THRIFT_HOME := $(COMMON_INFRA)/thrift
    THRIFT := $(THRIFT_HOME)/bin/thrift
    THRIFT_INCLUDE := $(THRIFT_HOME)/include
    THRIFT_LIB_DIR := $(THRIFT_HOME)/lib
endif

# Thrift code generation options
THRIFT_GEN := cpp
THRIFT_FLAGS := --gen $(THRIFT_GEN)

# ============================================================================
# Build Directories
# ============================================================================

BUILD_DIR := build
DEBUG_DIR := $(BUILD_DIR)/debug
RELEASE_DIR := $(BUILD_DIR)/release

# ============================================================================
# Source Directories
# ============================================================================

SRC_DIR := src
EXT_INTERFACE_DIR := $(SRC_DIR)/ext/interfaces
INT_GENERATED_DIR := $(SRC_DIR)/int/generated
INT_IMPL_DIR := $(SRC_DIR)/int/impl

# ============================================================================
# Compiler Configuration (Platform-Specific)
# ============================================================================

ifeq ($(OS_TYPE),macOS)
    # macOS: Use clang (Apple's default compiler)
    CXX := clang++
    CC := clang

    # macOS-specific flags
    PLATFORM_CXXFLAGS := -stdlib=libc++
    PLATFORM_LDFLAGS :=
else
    # Linux: Use g++ (can also use clang)
    CXX := g++
    CC := gcc

    # Linux-specific flags
    PLATFORM_CXXFLAGS :=
    PLATFORM_LDFLAGS := -pthread
endif

# ============================================================================
# Compiler Flags
# ============================================================================

# Common flags for all platforms
CXXFLAGS_COMMON := -Wall -Wextra -std=c++14 $(PLATFORM_CXXFLAGS)
CFLAGS_COMMON := -Wall -Wextra $(PLATFORM_CXXFLAGS)

# Debug flags
CXXFLAGS_DEBUG := $(CXXFLAGS_COMMON) -g -O0 -DDEBUG
CFLAGS_DEBUG := $(CFLAGS_COMMON) -g -O0 -DDEBUG

# Release flags
CXXFLAGS_RELEASE := $(CXXFLAGS_COMMON) -O3 -DNDEBUG
CFLAGS_RELEASE := $(CFLAGS_COMMON) -O3 -DNDEBUG

# ============================================================================
# Include Paths
# ============================================================================

INCLUDES := -I$(INT_GENERATED_DIR) \
            -I$(INT_IMPL_DIR) \
            -I$(THRIFT_INCLUDE)

# ============================================================================
# Linker Configuration
# ============================================================================

LDFLAGS := -L$(THRIFT_LIB_DIR) $(PLATFORM_LDFLAGS)

# Platform-specific library linking
ifeq ($(OS_TYPE),macOS)
    # macOS: Use .dylib extension
    LIBS := -lthrift
else
    # Linux: Use .so extension, may need -Wl,-rpath for runtime
    LIBS := -lthrift -Wl,-rpath,$(THRIFT_LIB_DIR)
endif

# ============================================================================
# Install Directories (Repository-Level Release)
# ============================================================================

REPO_RELEASE_DIR := $(REPO_ROOT)/release
INSTALL_BIN_DIR := $(REPO_RELEASE_DIR)/bin
INSTALL_LIB_DIR := $(REPO_RELEASE_DIR)/lib
INSTALL_INCLUDE_DIR := $(REPO_RELEASE_DIR)/include

# ============================================================================
# Output Directories for Generated Code
# ============================================================================

GEN_CPP_DIR := gen-cpp
GEN_JAVA_DIR := gen-java
GEN_PY_DIR := gen-py

# ============================================================================
# Color Output for Build Messages
# ============================================================================

COLOR_RESET := \033[0m
COLOR_GREEN := \033[32m
COLOR_YELLOW := \033[33m
COLOR_BLUE := \033[34m
COLOR_CYAN := \033[36m
COLOR_RED := \033[31m

# ============================================================================
# Build Message Macros
# ============================================================================

MSG_INFO := @echo "$(COLOR_BLUE)[INFO]$(COLOR_RESET)"
MSG_SUCCESS := @echo "$(COLOR_GREEN)[SUCCESS]$(COLOR_RESET)"
MSG_WARNING := @echo "$(COLOR_YELLOW)[WARNING]$(COLOR_RESET)"
MSG_ERROR := @echo "$(COLOR_RED)[ERROR]$(COLOR_RESET)"
MSG_BUILD := @echo "$(COLOR_GREEN)[BUILD]$(COLOR_RESET)"
MSG_CLEAN := @echo "$(COLOR_YELLOW)[CLEAN]$(COLOR_RESET)"
MSG_GEN := @echo "$(COLOR_CYAN)[GEN]$(COLOR_RESET)"
MSG_INSTALL := @echo "$(COLOR_BLUE)[INSTALL]$(COLOR_RESET)"

# ============================================================================
# Utility Functions
# ============================================================================

define print_info
	@echo "$(COLOR_BLUE)[INFO]$(COLOR_RESET) $(1)"
endef

define print_success
	@echo "$(COLOR_GREEN)[SUCCESS]$(COLOR_RESET) $(1)"
endef

define print_warning
	@echo "$(COLOR_YELLOW)[WARNING]$(COLOR_RESET) $(1)"
endef

define print_error
	@echo "$(COLOR_RED)[ERROR]$(COLOR_RESET) $(1)"
endef

# ============================================================================
# Platform Information (for debugging)
# ============================================================================

define print_platform_info
	$(call print_info,Build Configuration)
	$(call print_info,  OS: $(OS_TYPE) ($(UNAME_S)))
	$(call print_info,  Architecture: $(ARCH))
	$(call print_info,  Compiler: $(CXX))
	$(call print_info,  Thrift: $(THRIFT))
	$(call print_info,  Thrift Include: $(THRIFT_INCLUDE))
	$(call print_info,  Thrift Lib: $(THRIFT_LIB_DIR))
endef

# ============================================================================
# End of common.mk
# ============================================================================
