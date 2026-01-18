# Common Infrastructure Setup

**Date**: 2026-01-18
**Author**: IT Agent
**Status**: Completed

## Overview

Established centralized common infrastructure at repository root (`common_infra/`) containing Apache Thrift and shared build tools.

## Components

### 1. Apache Thrift 0.19.0

**Installation Location**: `common_infra/thrift/`

**Installation Method**: Built from source

**Build Configuration**:
```bash
./configure \
  --prefix=/home/user/BigProjPOC/common_infra/thrift \
  --enable-libs=no \
  --enable-tests=no \
  --enable-tutorial=no
```

**Components Installed**:
- Thrift compiler: `common_infra/thrift/bin/thrift`
- Headers: `common_infra/thrift/include/` (empty - libs disabled)
- Libraries: `common_infra/thrift/lib/` (empty - libs disabled)

**Verification**:
```bash
$ ./common_infra/thrift/bin/thrift --version
Thrift version 0.19.0
```

**Why Local Installation**:
- No system-wide dependencies
- Consistent version across all modules
- Reproducible on any machine
- No conflicts with system Thrift installations

### 2. Build Tools

**Location**: `common_infra/build_tools/`

#### common.mk
Defines common build variables:
- `REPO_ROOT` - Repository root path
- `THRIFT_HOME` - Thrift installation path
- `THRIFT` - Thrift compiler path
- `BUILD_DIR`, `RELEASE_DIR` - Standard directory names
- `CXXFLAGS`, `CFLAGS` - Common compiler flags
- `INCLUDES`, `LDFLAGS` - Include and library paths
- Thrift generation options for C++, Java, Python
- Color-coded build messages

#### rules.mk
Provides reusable build rules:
- `all` - Default build target
- `dirs` - Create build/release directories
- `thrift_gen` - Function for Thrift code generation
- Pattern rules for .thrift → .cpp conversion
- Clean targets: `clean-gen`, `clean-build`, `clean-release`, `clean`
- `help` - Display available targets

**Usage Pattern**:
```make
# In module Makefile
include $(REPO_ROOT)/common_infra/build_tools/rules.mk

# Use predefined variables and rules
build: dirs
	$(MSG_BUILD) Compiling module
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o output source.cpp
```

## Directory Structure

```
common_infra/
├── thrift/
│   ├── bin/
│   │   └── thrift              # Thrift compiler binary
│   ├── include/                # Headers (empty)
│   └── lib/                    # Libraries (empty)
├── build_tools/
│   ├── common.mk               # Build variables
│   └── rules.mk                # Build rules
└── README.md                   # User-facing documentation
```

## Configuration Updates

### .gitignore
Added patterns to exclude build artifacts:
```
# Build directories
**/build/
**/release/

# Generated code directories
**/gen-cpp/
**/gen-java/
**/gen-py/

# Thrift temporary files
*.thrift~
```

### CLAUDE.md
- Added `common_infra/` to project structure diagram
- Added "Common Infrastructure" section documenting:
  - Apache Thrift installation and usage
  - Build tools (common.mk and rules.mk)
  - Integration with module Makefiles

## Maintenance

### Updating Thrift Version

1. Remove old installation:
   ```bash
   rm -rf common_infra/thrift/*
   ```

2. Download and build new version:
   ```bash
   cd common_infra/thrift
   wget https://archive.apache.org/dist/thrift/<VERSION>/thrift-<VERSION>.tar.gz
   tar -xzf thrift-<VERSION>.tar.gz
   cd thrift-<VERSION>
   ./configure --prefix=/home/user/BigProjPOC/common_infra/thrift --enable-libs=no
   make -j$(nproc)
   make install
   cd .. && rm -rf thrift-<VERSION> thrift-<VERSION>.tar.gz
   ```

3. Verify:
   ```bash
   ./common_infra/thrift/bin/thrift --version
   ```

4. Update version numbers in:
   - `common_infra/README.md`
   - `CLAUDE.md`
   - This document

### Adding Build Tools

New common build utilities should be added to `common_infra/build_tools/` and documented in `common.mk` or `rules.mk` as appropriate.

## Integration with Modules

Each module (BigModuleA, BigModuleB, BigModuleC) can now:

1. **Use Thrift compiler**:
   ```bash
   $(THRIFT) --gen cpp -out gen-cpp interfaces/service.thrift
   ```

2. **Include build tools**:
   ```make
   include $(REPO_ROOT)/common_infra/build_tools/rules.mk
   ```

3. **Use predefined variables**:
   - `THRIFT` - Thrift compiler path
   - `BUILD_DIR`, `RELEASE_DIR` - Standard directories
   - `MSG_BUILD`, `MSG_CLEAN`, `MSG_GEN` - Colored messages

4. **Use predefined rules**:
   - `dirs` - Create build directories
   - `clean` - Clean all artifacts
   - Pattern rules for Thrift code generation

## Benefits

✅ **Consistency**: Same Thrift version across all modules
✅ **Reproducibility**: Works on any machine without system dependencies
✅ **Simplicity**: Single command to build from source
✅ **Maintainability**: Centralized build tool definitions
✅ **Developer Experience**: Clone and build immediately

## References

- Thrift Documentation: https://thrift.apache.org/docs/
- Common Infrastructure README: `common_infra/README.md`
- Task Specification: `docs/tasks/it/setup-common-infra-thrift.md`
