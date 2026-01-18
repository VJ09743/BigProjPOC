# Common Infrastructure

This directory contains shared build tools and dependencies used across all modules in the BigProjPOC project.

## Directory Structure

```
common_infra/
├── build_tools/        # Common build configuration and rules
│   ├── common.mk       # Common build variables and settings
│   └── rules.mk        # Reusable build rules
└── thrift/             # Apache Thrift tools
    └── bin/            # Thrift compiler binary
        └── thrift      # (To be installed)
```

## Build Tools

### common.mk

Contains common build variables and settings:
- Compiler settings (CXX, CC, flags)
- Directory structure definitions
- Debug and release build configurations
- Include paths and library settings
- Thrift compiler configuration

### rules.mk

Contains reusable build rules:
- Thrift code generation rules
- Debug and release build rules
- Clean and install rules
- Helper macros for consistent builds

## Usage

Module Makefiles should include these files at the top:

```makefile
# Include common build configuration
include ../../common_infra/build_tools/common.mk
include ../../common_infra/build_tools/rules.mk
```

## Thrift Compiler

The Apache Thrift compiler should be installed at `thrift/bin/thrift`. If not present, Thrift code generation will be skipped with a warning.

To install Thrift:
1. Download Apache Thrift from https://thrift.apache.org/
2. Place the `thrift` binary in `common_infra/thrift/bin/`
3. Ensure it has execute permissions: `chmod +x common_infra/thrift/bin/thrift`

## Build Flow

1. **Generate**: `make generate` - Generates C++ code from Thrift interface files
2. **Build**: `make build` - Compiles generated and implementation code (debug + release)
3. **Install**: `make install` - Installs built artifacts to system locations

## Module Independence

Each module can be built independently using the common build system. Modules include the common build files and define their own module-specific variables (e.g., MODULE_NAME).
