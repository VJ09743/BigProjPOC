# BigModuleC Makefile
# Build system for BigModuleC using common build infrastructure

# Include common build configuration and rules
include ../common_infra/build_tools/common.mk
include ../common_infra/build_tools/rules.mk

# Module-specific settings
MODULE_NAME = BigModuleC

# Override paths for this module's structure
EXT_INTERFACE_DIR = $(SRC_DIR)/ext/interfaces

# Targets
all: generate build

generate:
	$(THRIFT_GEN_RULE)

build: build-debug build-release

build-debug:
	$(BUILD_DEBUG_RULE)

build-release:
	$(BUILD_RELEASE_RULE)

clean:
	$(CLEAN_RULE)

install:
	$(INSTALL_RULE)
