# Common Infrastructure

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
