# BigModuleA Makefile
# Build system for BigModuleA using common build infrastructure

# Include common build configuration and rules
include ../common_infra/build_tools/common.mk
include ../common_infra/build_tools/rules.mk

# Module-specific settings
MODULE_NAME = BigModuleA

# Override paths for this module's structure
EXT_INTERFACE_DIR = $(SRC_DIR)/ext/interfaces

# Test configuration
TEST_DIR = tests/unit
TEST_BUILD_DIR = $(BUILD_DIR)/tests
TEST_SRCS = $(wildcard $(TEST_DIR)/*.cpp)
TEST_BINS = $(patsubst $(TEST_DIR)/%.cpp,$(TEST_BUILD_DIR)/%,$(TEST_SRCS))

# Source files for linking with tests
IMPL_SRCS = $(wildcard $(INT_IMPL_DIR)/*.cpp)
IMPL_OBJS = $(patsubst $(INT_IMPL_DIR)/%.cpp,$(TEST_BUILD_DIR)/%.o,$(filter-out $(INT_IMPL_DIR)/main.cpp,$(IMPL_SRCS)))

# Google Test configuration
ifeq ($(OS_TYPE),macOS)
    GTEST_INCLUDE := $(HOMEBREW_PREFIX)/include
    GTEST_LIB_DIR := $(HOMEBREW_PREFIX)/lib
else
    # Linux: Assume system-installed gtest
    GTEST_INCLUDE := /usr/include
    GTEST_LIB_DIR := /usr/lib
endif

TEST_INCLUDES := $(INCLUDES) -I$(GTEST_INCLUDE) -I$(COMMON_INFRA)/shared_memory
TEST_LDFLAGS := $(LDFLAGS) -L$(GTEST_LIB_DIR)
TEST_LIBS := $(LIBS) -lgtest -lgtest_main -lpthread -lrt

# Targets
all: generate build

generate:
	$(THRIFT_GEN_RULE)

build: build-debug build-release

build-debug:
	$(BUILD_DEBUG_RULE)

build-release:
	$(BUILD_RELEASE_RULE)

# Build unit tests
test-build: dirs-test $(IMPL_OBJS) $(TEST_BINS)
	$(MSG_SUCCESS) "Unit tests built successfully"

# Create test directories
dirs-test:
	@mkdir -p $(TEST_BUILD_DIR)

# Compile implementation files to object files (excluding main.cpp)
$(TEST_BUILD_DIR)/%.o: $(INT_IMPL_DIR)/%.cpp
	$(MSG_BUILD) "Compiling $<"
	@$(CXX) $(CXXFLAGS_DEBUG) $(TEST_INCLUDES) -c $< -o $@

# Link test executables
$(TEST_BUILD_DIR)/%: $(TEST_DIR)/%.cpp $(IMPL_OBJS)
	$(MSG_BUILD) "Linking test $@"
	@$(CXX) $(CXXFLAGS_DEBUG) $(TEST_INCLUDES) $< $(IMPL_OBJS) -o $@ $(TEST_LDFLAGS) $(TEST_LIBS)

# Run unit tests
test: test-build
	$(MSG_INFO) "Running unit tests..."
	@for test in $(TEST_BINS); do \
		echo ""; \
		$(MSG_INFO) "Running $$test"; \
		$$test || exit 1; \
	done
	@echo ""
	$(MSG_SUCCESS) "All unit tests passed"

# Clean test artifacts
clean-test:
	$(MSG_CLEAN) "Removing test build artifacts"
	@rm -rf $(TEST_BUILD_DIR)

clean: clean-test
	$(CLEAN_RULE)

install:
	$(INSTALL_RULE)

.PHONY: all generate build build-debug build-release test-build dirs-test test clean-test clean install
