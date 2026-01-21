# BigModuleC Makefile
# Build system for BigModuleC (CompensationController) using common build infrastructure

# Include common build configuration and rules
include ../common_infra/build_tools/common.mk
include ../common_infra/build_tools/rules.mk

# Module-specific settings
MODULE_NAME = BigModuleC

# Override paths for this module's structure
EXT_INTERFACE_DIR = $(SRC_DIR)/ext/interfaces
THRIFT_IDL = $(EXT_INTERFACE_DIR)/ICompensationController.thrift

# Source files (implementation + Thrift-generated)
IMPL_SRCS = $(wildcard $(INT_IMPL_DIR)/*.cpp)
THRIFT_SRCS = $(wildcard $(INT_GENERATED_DIR)/*.cpp)
ALL_SRCS = $(IMPL_SRCS) $(THRIFT_SRCS)

# Additional includes for Thrift
INCLUDES += -I$(COMMON_INFRA)/shared_memory -I$(INT_GENERATED_DIR)

# Additional libraries for Thrift
LIBS += -lthrift

# Test configuration
TEST_DIR = tests/unit
TEST_BUILD_DIR = $(BUILD_DIR)/tests
TEST_SRCS = $(wildcard $(TEST_DIR)/*.cpp)
TEST_BINS = $(patsubst $(TEST_DIR)/%.cpp,$(TEST_BUILD_DIR)/%,$(TEST_SRCS))

# Source files for linking with tests (exclude main.cpp)
IMPL_OBJS = $(patsubst $(INT_IMPL_DIR)/%.cpp,$(TEST_BUILD_DIR)/%.o,$(filter-out $(INT_IMPL_DIR)/main.cpp,$(IMPL_SRCS)))
THRIFT_OBJS = $(patsubst $(INT_GENERATED_DIR)/%.cpp,$(TEST_BUILD_DIR)/gen_%.o,$(THRIFT_SRCS))

# Google Test configuration
ifeq ($(OS_TYPE),macOS)
    GTEST_INCLUDE := $(HOMEBREW_PREFIX)/include
    GTEST_LIB_DIR := $(HOMEBREW_PREFIX)/lib
else
    # Linux: Assume system-installed gtest
    GTEST_INCLUDE := /usr/include
    GTEST_LIB_DIR := /usr/lib
endif

TEST_INCLUDES := $(INCLUDES) -I$(GTEST_INCLUDE)
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
test-build: dirs-test $(IMPL_OBJS) $(THRIFT_OBJS) $(TEST_BINS)
	$(MSG_SUCCESS) "Unit tests built successfully"

# Create test directories
dirs-test:
	@mkdir -p $(TEST_BUILD_DIR)

# Compile implementation files to object files (excluding main.cpp)
$(TEST_BUILD_DIR)/%.o: $(INT_IMPL_DIR)/%.cpp
	$(MSG_BUILD) "Compiling $<"
	@$(CXX) $(CXXFLAGS_DEBUG) $(TEST_INCLUDES) -c $< -o $@

# Compile Thrift-generated files to object files
$(TEST_BUILD_DIR)/gen_%.o: $(INT_GENERATED_DIR)/%.cpp
	$(MSG_BUILD) "Compiling Thrift-generated $<"
	@$(CXX) $(CXXFLAGS_DEBUG) $(TEST_INCLUDES) -c $< -o $@

# Link test executables
$(TEST_BUILD_DIR)/%: $(TEST_DIR)/%.cpp $(IMPL_OBJS) $(THRIFT_OBJS)
	$(MSG_BUILD) "Linking test $@"
	@$(CXX) $(CXXFLAGS_DEBUG) $(TEST_INCLUDES) $< $(IMPL_OBJS) $(THRIFT_OBJS) -o $@ $(TEST_LDFLAGS) $(TEST_LIBS)

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
