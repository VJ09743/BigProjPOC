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
