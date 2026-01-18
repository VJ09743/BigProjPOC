# Common Build Configuration
# This file contains common build variables and settings used across all modules

# Project root directory (relative to module root)
PROJECT_ROOT = ../..

# Common infrastructure paths
COMMON_INFRA = $(PROJECT_ROOT)/common_infra
THRIFT_BIN = $(COMMON_INFRA)/thrift/bin/thrift

# Build directories
BUILD_DIR = build
DEBUG_DIR = $(BUILD_DIR)/debug
RELEASE_DIR = $(BUILD_DIR)/release

# Source directories
SRC_DIR = src
EXT_INTERFACE_DIR = $(SRC_DIR)/ext/interface
INT_GENERATED_DIR = $(SRC_DIR)/int/generated
INT_IMPL_DIR = $(SRC_DIR)/int/impl

# Compiler settings
CXX = g++
CC = gcc

# Common compiler flags
CXXFLAGS_COMMON = -Wall -Wextra -std=c++11
CFLAGS_COMMON = -Wall -Wextra

# Debug flags
CXXFLAGS_DEBUG = $(CXXFLAGS_COMMON) -g -O0 -DDEBUG
CFLAGS_DEBUG = $(CFLAGS_COMMON) -g -O0 -DDEBUG

# Release flags
CXXFLAGS_RELEASE = $(CXXFLAGS_COMMON) -O3 -DNDEBUG
CFLAGS_RELEASE = $(CFLAGS_COMMON) -O3 -DNDEBUG

# Include paths
INCLUDES = -I$(INT_GENERATED_DIR) -I$(INT_IMPL_DIR)

# Linker flags
LDFLAGS =
LIBS = -lthrift

# Thrift compiler options
THRIFT_GEN = cpp
THRIFT_FLAGS = --gen $(THRIFT_GEN)

# Install directories
INSTALL_PREFIX = /usr/local
INSTALL_BIN_DIR = $(INSTALL_PREFIX)/bin
INSTALL_LIB_DIR = $(INSTALL_PREFIX)/lib
INSTALL_INCLUDE_DIR = $(INSTALL_PREFIX)/include

# Colors for output (optional, for prettier output)
COLOR_RESET = \033[0m
COLOR_GREEN = \033[32m
COLOR_YELLOW = \033[33m
COLOR_BLUE = \033[34m

# Utility functions
define print_info
	@echo "$(COLOR_BLUE)[INFO]$(COLOR_RESET) $(1)"
endef

define print_success
	@echo "$(COLOR_GREEN)[SUCCESS]$(COLOR_RESET) $(1)"
endef

define print_warning
	@echo "$(COLOR_YELLOW)[WARNING]$(COLOR_RESET) $(1)"
endef
