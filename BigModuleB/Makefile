# BigModuleB Makefile
# Build system for BigModuleB (DistortionPredictor) using common build infrastructure

# Include common build configuration and rules
include ../common_infra/build_tools/common.mk
include ../common_infra/build_tools/rules.mk

# Module-specific settings
MODULE_NAME = BigModuleB

# BigModuleB is a Thrift client that uses BigModuleC's ICompensationController interface
# We need to link against BigModuleC's Thrift-generated code
BIGMODULEC_THRIFT_DIR = ../BigModuleC/src/int/generated

# Source files (implementation only - BigModuleB doesn't generate Thrift code)
IMPL_SRCS = $(wildcard $(INT_IMPL_DIR)/*.cpp)

# BigModuleC's Thrift-generated source files (used by BigModuleB as client)
BIGMODULEC_THRIFT_SRCS = $(BIGMODULEC_THRIFT_DIR)/ICompensationController.cpp \
                         $(BIGMODULEC_THRIFT_DIR)/ICompensationController_types.cpp

# Additional includes for Thrift and shared memory
INCLUDES += -I$(COMMON_INFRA)/shared_memory -I$(BIGMODULEC_THRIFT_DIR)

# Additional libraries for Thrift
LIBS += -lthrift

# Test configuration
TEST_DIR = tests/unit
TEST_BUILD_DIR = $(BUILD_DIR)/tests
TEST_SRCS = $(wildcard $(TEST_DIR)/*.cpp)
TEST_BINS = $(patsubst $(TEST_DIR)/%.cpp,$(TEST_BUILD_DIR)/%,$(TEST_SRCS))

# Source files for linking with tests (exclude main.cpp)
IMPL_OBJS = $(patsubst $(INT_IMPL_DIR)/%.cpp,$(TEST_BUILD_DIR)/%.o,$(filter-out $(INT_IMPL_DIR)/main.cpp,$(IMPL_SRCS)))
BIGMODULEC_THRIFT_OBJS = $(patsubst $(BIGMODULEC_THRIFT_DIR)/%.cpp,$(TEST_BUILD_DIR)/%.o,$(BIGMODULEC_THRIFT_SRCS))

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

# Override build rules to include BigModuleC's Thrift code
define BUILD_DEBUG_RULE_MODULEB
@echo "\033[34m[INFO]\033[0m Building debug version..."
@mkdir -p $(DEBUG_DIR)
@echo "Compiling BigModuleC Thrift files..."
@for cpp_file in $(BIGMODULEC_THRIFT_SRCS); do \
	obj_file=$(DEBUG_DIR)/$$(basename $$cpp_file .cpp).o; \
	echo "Compiling $$cpp_file..."; \
	$(CXX) $(CXXFLAGS_DEBUG) $(INCLUDES) -c $$cpp_file -o $$obj_file; \
done
@echo "Compiling BigModuleB implementation files..."
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

define BUILD_RELEASE_RULE_MODULEB
@echo "\033[34m[INFO]\033[0m Building release version..."
@mkdir -p $(RELEASE_DIR)
@echo "Compiling BigModuleC Thrift files..."
@for cpp_file in $(BIGMODULEC_THRIFT_SRCS); do \
	obj_file=$(RELEASE_DIR)/$$(basename $$cpp_file .cpp).o; \
	echo "Compiling $$cpp_file..."; \
	$(CXX) $(CXXFLAGS_RELEASE) $(INCLUDES) -c $$cpp_file -o $$obj_file; \
done
@echo "Compiling BigModuleB implementation files..."
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

# Targets
all: build

# BigModuleB doesn't generate its own Thrift code (uses BigModuleC's)
generate:
	@echo "\033[34m[INFO]\033[0m BigModuleB uses BigModuleC's Thrift interface (no code generation needed)"

build: build-debug build-release

build-debug:
	$(BUILD_DEBUG_RULE_MODULEB)

build-release:
	$(BUILD_RELEASE_RULE_MODULEB)

# Build unit tests
test-build: dirs-test $(IMPL_OBJS) $(BIGMODULEC_THRIFT_OBJS) $(TEST_BINS)
	$(MSG_SUCCESS) "Unit tests built successfully"

# Create test directories
dirs-test:
	@mkdir -p $(TEST_BUILD_DIR)

# Compile implementation files to object files (excluding main.cpp)
$(TEST_BUILD_DIR)/%.o: $(INT_IMPL_DIR)/%.cpp
	$(MSG_BUILD) "Compiling $<"
	@$(CXX) $(CXXFLAGS_DEBUG) $(TEST_INCLUDES) -c $< -o $@

# Compile BigModuleC Thrift files to object files
$(TEST_BUILD_DIR)/%.o: $(BIGMODULEC_THRIFT_DIR)/%.cpp
	$(MSG_BUILD) "Compiling BigModuleC Thrift $<"
	@$(CXX) $(CXXFLAGS_DEBUG) $(TEST_INCLUDES) -c $< -o $@

# Link test executables
$(TEST_BUILD_DIR)/%: $(TEST_DIR)/%.cpp $(IMPL_OBJS) $(BIGMODULEC_THRIFT_OBJS)
	$(MSG_BUILD) "Linking test $@"
	@$(CXX) $(CXXFLAGS_DEBUG) $(TEST_INCLUDES) $< $(IMPL_OBJS) $(BIGMODULEC_THRIFT_OBJS) -o $@ $(TEST_LDFLAGS) $(TEST_LIBS)

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
