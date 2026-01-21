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
Centralized infrastructure and build tools for the BigProjPOC repository.

## Structure

```
common_infra/
├── thrift/           # Apache Thrift installation (local to repository)
│   ├── bin/          # Thrift compiler binary
│   ├── include/      # C++ runtime headers
│   └── lib/          # C++ runtime libraries
├── build_tools/      # Common build makefiles
│   ├── common.mk     # Build variables and settings
│   └── rules.mk      # Reusable build rules
└── README.md         # This file
```

## Apache Thrift

### Version
Apache Thrift 0.19.0

### Installation Method
Built from source and installed locally to `common_infra/thrift/`.

**Build Configuration:**
- Prefix: `/home/user/BigProjPOC/common_infra/thrift`
- Libraries: Disabled (`--enable-libs=no`)
- Only compiler binary is installed

### Invocation
The Thrift compiler is located at:
```bash
common_infra/thrift/bin/thrift
```

**Usage:**
```bash
# From repository root
./common_infra/thrift/bin/thrift --version

# Generate C++ code from .thrift file
./common_infra/thrift/bin/thrift --gen cpp -out gen-cpp service.thrift
```

**In Makefiles:**
```make
include $(REPO_ROOT)/common_infra/build_tools/common.mk

# THRIFT variable is automatically defined
$(THRIFT) --gen cpp -out gen-cpp service.thrift
```

### Why Centralized

**Single Source of Truth:**
- All modules use the same Thrift version (0.19.0)
- No version conflicts between modules

**No External Dependencies:**
- Thrift is installed locally within the repository
- No system-wide installation required
- Works on any machine that clones the repository

**Reproducible Builds:**
- New developers don't need to install Thrift system-wide
- Build environment is consistent across all machines
- No "works on my machine" issues

**Easier Onboarding:**
- Clone repository → build immediately
- No manual tool installation required

## Build Tools

### common.mk
Defines common build variables:
- Repository root path (`REPO_ROOT`)
- Thrift paths and compiler location
- Build directory conventions
- Common compiler flags
- Include/library paths
- Build message formatting

### rules.mk
Provides reusable build rules:
- Directory creation targets
- Thrift code generation rules
- Clean targets (gen, build, release)
- Pattern rules for .thrift files
- Help documentation

### Usage in Module Makefiles

Include in your module's Makefile:

```make
# Include common build infrastructure
include $(REPO_ROOT)/common_infra/build_tools/rules.mk

# Module-specific targets
build: dirs
	$(MSG_BUILD) Building module
	# Your build commands here

.PHONY: build
```

## Maintenance

### Updating Thrift Version

To update to a new Thrift version:

1. Remove old installation:
   ```bash
   rm -rf common_infra/thrift/*
   ```

2. Download new version:
   ```bash
   cd common_infra/thrift
   wget https://archive.apache.org/dist/thrift/<VERSION>/thrift-<VERSION>.tar.gz
   ```

3. Build and install:
   ```bash
   tar -xzf thrift-<VERSION>.tar.gz
   cd thrift-<VERSION>
   ./configure --prefix=/home/user/BigProjPOC/common_infra/thrift --enable-libs=no --enable-tests=no --enable-tutorial=no
   make -j$(nproc)
   make install
   cd .. && rm -rf thrift-<VERSION> thrift-<VERSION>.tar.gz
   ```

4. Verify:
   ```bash
   ./common_infra/thrift/bin/thrift --version
   ```

5. Update this README with new version number

### Adding New Build Tools

Add new common makefiles to `common_infra/build_tools/` as needed for shared build functionality.
