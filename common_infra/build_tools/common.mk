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

# Install directories - repository-level release folder
REPO_RELEASE_DIR = $(PROJECT_ROOT)/release
INSTALL_BIN_DIR = $(REPO_RELEASE_DIR)/bin
INSTALL_LIB_DIR = $(REPO_RELEASE_DIR)/lib
INSTALL_INCLUDE_DIR = $(REPO_RELEASE_DIR)/include

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
# Common Build Variables and Settings
# This makefile contains common build configuration used across all modules

# Repository root directory
REPO_ROOT := $(shell git rev-parse --show-toplevel 2>/dev/null || pwd)

# Common infrastructure paths
COMMON_INFRA := $(REPO_ROOT)/common_infra
THRIFT_HOME := $(COMMON_INFRA)/thrift

# Thrift compiler
THRIFT := $(THRIFT_HOME)/bin/thrift

# Build directories
BUILD_DIR := build
RELEASE_DIR := release

# Common compiler flags
CXXFLAGS := -std=c++17 -Wall -Wextra -O2
CFLAGS := -Wall -Wextra -O2

# Include paths
INCLUDES := -I$(THRIFT_HOME)/include

# Library paths
LDFLAGS := -L$(THRIFT_HOME)/lib

# Thrift generation options
THRIFT_CPP_OPTIONS := --gen cpp
THRIFT_JAVA_OPTIONS := --gen java
THRIFT_PYTHON_OPTIONS := --gen py

# Output directories for generated code
GEN_CPP_DIR := gen-cpp
GEN_JAVA_DIR := gen-java
GEN_PY_DIR := gen-py

# Color output for build messages
COLOR_RESET := \033[0m
COLOR_GREEN := \033[32m
COLOR_YELLOW := \033[33m
COLOR_CYAN := \033[36m

# Build messages
MSG_BUILD := @echo "$(COLOR_GREEN)[BUILD]$(COLOR_RESET)"
MSG_CLEAN := @echo "$(COLOR_YELLOW)[CLEAN]$(COLOR_RESET)"
MSG_GEN := @echo "$(COLOR_CYAN)[GEN]$(COLOR_RESET)"
