# Module Build System Documentation

## Overview

The BigProjPOC project uses a standardized GNU Make-based build system for all modules. Each module (BigModuleA, BigModuleB, BigModuleC) has its own Makefile that integrates with common build infrastructure located in `common_infra/build_tools/`.

## Build System Architecture

### Components

1. **Common Infrastructure** (`common_infra/`)
   - `build_tools/common.mk` - Common build variables and compiler settings
   - `build_tools/rules.mk` - Reusable build rules
   - `thrift/bin/thrift` - Apache Thrift compiler binary

2. **Module Makefiles**
   - Each module has a Makefile at its root: `BigModuleX/Makefile`
   - Includes common.mk and rules.mk for consistency
   - Defines module-specific settings

3. **Directory Structure** (per module)
   ```
   BigModuleX/
   ├── Makefile                    # Module build file
   ├── build/                      # Build outputs
   │   ├── debug/                  # Debug build artifacts
   │   └── release/                # Release build artifacts
   ├── src/
   │   ├── ext/
   │   │   └── interfaces/         # Thrift interface definitions (.thrift files)
   │   └── int/
   │       ├── generated/          # Generated C++ code from Thrift
   │       └── impl/               # C++ implementation files
   └── release/                    # Module release artifacts
   ```

## Build Workflow

### 1. Developer Workflow

The typical development workflow follows these steps:

1. **Create Interface Definition**
   ```bash
   # Developer creates .thrift file
   vim src/ext/interfaces/MyService.thrift
   ```

2. **Generate C++ Code**
   ```bash
   # Generate C++ from Thrift
   make generate
   ```
   This creates C++ files in `src/int/generated/`

3. **Implement Interfaces**
   ```bash
   # Developer implements by extending/implementing generated files
   vim src/int/impl/MyServiceImpl.cpp
   vim src/int/impl/MyServiceImpl.h
   ```

4. **Build**
   ```bash
   # Build both debug and release versions
   make build

   # Or build specific version
   make build-debug
   make build-release
   ```

5. **Test and Install**
   ```bash
   # Install built artifacts
   make install
   ```

### 2. Build Flow Diagram

```
.thrift files       →   make generate   →   Generated C++
                                                  ↓
Developer Impl      ←   Implementation   ←   (review generated code)
                                                  ↓
Implementation      →   make build      →   Compiled binaries
                                                  ↓
                        make install    →   Installed artifacts
```

## Make Targets

All modules support the following targets:

### `make all` (default)
Builds everything: runs `generate` then `build`.
```bash
make all
# or simply
make
```

### `make generate`
Generates C++ code from Thrift interface files.
- Input: `src/ext/interfaces/*.thrift`
- Output: `src/int/generated/*.cpp` and `*.h`
- Uses: Apache Thrift compiler from `common_infra/thrift/bin/thrift`

**Example:**
```bash
cd BigModuleA
make generate
```

### `make build`
Builds both debug and release versions.
Equivalent to running both `make build-debug` and `make build-release`.

**Example:**
```bash
cd BigModuleA
make build
```

### `make build-debug`
Builds debug version with debug symbols and no optimization.
- Compiler flags: `-g -O0 -DDEBUG`
- Output: `build/debug/libBigModuleX.a`
- Includes: Generated code + implementation code

**Example:**
```bash
cd BigModuleA
make build-debug
```

### `make build-release`
Builds release version with optimizations and no debug symbols.
- Compiler flags: `-O3 -DNDEBUG`
- Output: `build/release/libBigModuleX.a`
- Includes: Generated code + implementation code

**Example:**
```bash
cd BigModuleA
make build-release
```

### `make clean`
Removes all build artifacts.
- Deletes: `build/` directory
- Deletes: `src/int/generated/` contents
- Leaves source code untouched

**Example:**
```bash
cd BigModuleA
make clean
```

### `make install`
Installs built artifacts to system directories.
- Installs library: `/usr/local/lib/libBigModuleX.a`
- Installs headers: `/usr/local/include/BigModuleX/`
- Requires: Successful release build

**Example:**
```bash
cd BigModuleA
sudo make install
```

### `make help`
Displays available targets and their descriptions.

**Example:**
```bash
cd BigModuleA
make help
```

## Configuration

### Build Variables

Defined in `common_infra/build_tools/common.mk`:

#### Compiler Settings
- `CXX = g++` - C++ compiler
- `CC = gcc` - C compiler

#### Compiler Flags
- **Common**: `-Wall -Wextra -std=c++11`
- **Debug**: `-g -O0 -DDEBUG`
- **Release**: `-O3 -DNDEBUG`

#### Paths
- `THRIFT_BIN` - Thrift compiler location
- `BUILD_DIR` - Build output directory
- `SRC_DIR` - Source code directory
- `INT_GENERATED_DIR` - Generated code directory
- `INT_IMPL_DIR` - Implementation code directory

#### Install Directories
- `INSTALL_PREFIX = /usr/local`
- `INSTALL_BIN_DIR = /usr/local/bin`
- `INSTALL_LIB_DIR = /usr/local/lib`
- `INSTALL_INCLUDE_DIR = /usr/local/include`

### Module-Specific Settings

Each module can override settings in its Makefile:

```makefile
# Example: BigModuleA/Makefile
MODULE_NAME = BigModuleA
EXT_INTERFACE_DIR = $(SRC_DIR)/ext/interfaces
```

## Build Rules

Build rules are defined in `common_infra/build_tools/rules.mk` and used by module Makefiles.

### Thrift Code Generation

```makefile
$(THRIFT_GEN_RULE)
```
- Scans `src/ext/interfaces/` for `.thrift` files
- Generates C++ code using Thrift compiler
- Outputs to `src/int/generated/`
- Handles missing Thrift files gracefully

### Debug Build

```makefile
$(BUILD_DEBUG_RULE)
```
- Compiles all C++ files with debug flags
- Creates object files in `build/debug/`
- Links into static library `libBigModuleX.a`
- Handles empty source directories gracefully

### Release Build

```makefile
$(BUILD_RELEASE_RULE)
```
- Compiles all C++ files with optimization flags
- Creates object files in `build/release/`
- Links into static library `libBigModuleX.a`
- Handles empty source directories gracefully

### Clean

```makefile
$(CLEAN_RULE)
```
- Removes `build/` directory
- Removes `src/int/generated/` contents
- Safe to run multiple times

### Install

```makefile
$(INSTALL_RULE)
```
- Installs release library to system
- Installs header files to system include directory
- Creates directories as needed

## Examples

### Building a Single Module

```bash
# Navigate to module
cd BigModuleA

# View available targets
make help

# Build everything
make all

# Or just build (skips generate if no thrift files)
make build
```

### Building All Modules

```bash
# From project root
for module in BigModuleA BigModuleB BigModuleC; do
  echo "Building $module..."
  cd $module && make all && cd ..
done
```

### Clean Build

```bash
# Clean and rebuild
make clean
make all
```

### Debug vs Release

```bash
# Build only debug version
make build-debug

# Build only release version
make build-release

# Build both (default)
make build
```

## Troubleshooting

### Thrift Compiler Not Found

**Error:**
```
WARNING: Thrift compiler not found at ../common_infra/thrift/bin/thrift
```

**Solution:**
Ensure Thrift binary is installed at `common_infra/thrift/bin/thrift`. The IT Agent should have set this up. If missing, download and install Apache Thrift 0.21.0.

### No Source Files to Compile

**Message:**
```
No source files to compile. Skipping debug build.
```

**Explanation:**
This is normal when:
1. No Thrift files exist yet in `src/ext/interfaces/`
2. No implementation files exist yet in `src/int/impl/`

Developer needs to create interface definitions and implementations.

### Compilation Errors

**Common Issues:**
1. Missing include paths - Check `INCLUDES` in common.mk
2. Missing Thrift library - Ensure `-lthrift` in LIBS
3. C++ standard issues - Project uses C++11

**Debug:**
```bash
# Run with verbose output
make V=1 build-debug
```

### Permission Denied on Install

**Error:**
```
Permission denied
```

**Solution:**
Install target requires root privileges:
```bash
sudo make install
```

## Best Practices

### For Developers

1. **Always generate before implementing**
   - Run `make generate` first to see generated interfaces
   - Then create implementations that extend/use generated code

2. **Test both debug and release**
   - Debug builds for development and debugging
   - Release builds for performance testing

3. **Clean builds when changing interfaces**
   - After modifying `.thrift` files, run `make clean && make all`

4. **Don't edit generated files**
   - Files in `src/int/generated/` are auto-generated
   - Changes will be lost on next `make generate`

### For Build System Maintenance

1. **Keep common.mk and rules.mk in sync**
   - Changes should apply to all modules
   - Test changes across all three modules

2. **Document build variable changes**
   - Update this documentation when adding new variables
   - Update CLAUDE.md with user-facing changes

3. **Maintain backward compatibility**
   - Existing Makefiles should continue to work
   - Add new features without breaking old ones

## Related Documentation

- [Common Infrastructure Setup](../infrastructure/common-infra.md) - Infrastructure setup and Thrift installation
- [CLAUDE.md](../../CLAUDE.md) - Project-wide documentation
- [Apache Thrift Documentation](https://thrift.apache.org/docs/) - Thrift language reference

## Maintenance

**Last Updated:** 2026-01-18
**Maintained By:** IT Agent
**Version:** 1.0
