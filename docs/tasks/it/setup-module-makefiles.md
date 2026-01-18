# Task: Setup Module-Level Makefiles with Build System Integration

**Status**: TODO
<!-- Allowed values: TODO | Assigned | In-Progress | Blocked | Failed | Completed -->

**Priority**: high
<!-- Allowed values: critical | high | medium | low -->

**Created**: 2026-01-18

**Assigned To**: IT Agent
<!-- Allowed values: IT Agent | Unassigned -->

**Module**: All
<!-- Allowed values: All | BigModuleA | BigModuleB | BigModuleC | N/A -->

## Objective
Create standardized Makefiles for each module (BigModuleA, BigModuleB, BigModuleC) that integrate with the common build infrastructure and support the complete build lifecycle including Thrift code generation, compilation, and installation.

## Requirements

### Makefile Structure
- Each module must have a top-level `Makefile` in its root directory
- Makefiles must include `common.mk` and `rules.mk` from `common_infra/build_tools/`
- Support both debug and release build configurations

### Required Make Targets
1. **`all`**: Default target - builds everything (generate + build)
2. **`generate`**: Generate C++ code from Thrift interface files
3. **`build`**: Compile generated and implementation code
4. **`clean`**: Remove all build artifacts
5. **`install`**: Install built artifacts to appropriate locations

### Directory Structure Requirements
- Build artifacts organized as:
  - `build/debug/` - Debug build outputs
  - `build/release/` - Release build outputs
- Generated Thrift code placed in: `src/int/generated/`
- Source files structure:
  - Thrift definitions: `src/ext/interface/*.thrift`
  - C++ implementations: `src/int/impl/*.cpp` and `src/int/impl/*.h`

### Dependencies
- Requires `common_infra/` build system (already set up)
- Requires Apache Thrift binary at `common_infra/thrift/bin/thrift`
- Developer will create `.thrift` interface files
- Developer will create C++ implementation files

## Deliverables

- [ ] Create `BigModuleA/Makefile` with all required targets
- [ ] Create `BigModuleB/Makefile` with all required targets
- [ ] Create `BigModuleC/Makefile` with all required targets
- [ ] Create `build/debug/` and `build/release/` subdirectories in each module
- [ ] Create `src/int/generated/` directory in each module for Thrift outputs
- [ ] Create `src/int/impl/` directory in each module for implementations
- [ ] Ensure Makefiles properly include `common.mk` and `rules.mk`
- [ ] Test all make targets (all, generate, build, clean, install) in each module
- [ ] Document build process in `docs/it/build/module-build-system.md`
- [ ] Update CLAUDE.md with module build instructions

## Acceptance Criteria

- **Criterion 1**: Each module has a working Makefile that successfully includes common build files
  - Verify: Run `make -n all` in each module directory without errors

- **Criterion 2**: All five targets are defined and functional
  - Verify: Each target (all, generate, build, clean, install) executes without errors

- **Criterion 3**: Build directory structure is created correctly
  - Verify: `build/debug/` and `build/release/` exist in each module
  - Verify: `src/int/generated/` exists for Thrift output
  - Verify: `src/int/impl/` exists for implementations

- **Criterion 4**: Generate target correctly invokes Thrift compiler
  - Verify: `make generate` processes `.thrift` files from `src/ext/interface/`
  - Verify: Generated C++ code appears in `src/int/generated/`

- **Criterion 5**: Build target supports both debug and release modes
  - Verify: Can build debug version with appropriate flags
  - Verify: Can build release version with optimization flags

- **Criterion 6**: Clean target removes all build artifacts
  - Verify: `make clean` removes `build/`, `src/int/generated/` contents

- **Criterion 7**: Documentation is complete and accurate
  - Verify: Build process documented in `docs/it/build/`
  - Verify: CLAUDE.md updated with build instructions

## Notes

### Build Flow
1. Developer creates `.thrift` file in `src/ext/interface/`
2. Developer creates C++ implementation in `src/int/impl/`
3. `make generate` - Generates C++ from Thrift
4. `make build` - Compiles generated + implementation code
5. `make install` - Installs built artifacts

### Module Independence
- Each module should be buildable independently
- Modules may have inter-dependencies that need to be managed
- Consider build order if modules depend on each other

### Consistency
- All three modules should follow identical build patterns
- Use consistent directory structure across all modules
- Maintain uniform naming conventions

### Integration with Common Infrastructure
- Leverage common compiler flags from `common.mk`
- Use build rules from `rules.mk`
- Reference Thrift binary from `common_infra/thrift/bin/thrift`

### Future Considerations
- Module interdependencies may require coordination between modules
- May need to add additional targets for testing, packaging, etc.
- Consider adding targets for documentation generation

## Resources

### Existing Infrastructure
- `common_infra/build_tools/common.mk` - Common build variables
- `common_infra/build_tools/rules.mk` - Reusable build rules
- `common_infra/thrift/bin/thrift` - Thrift compiler binary
- `common_infra/README.md` - Infrastructure documentation

### Documentation
- GNU Make Manual: https://www.gnu.org/software/make/manual/
- Apache Thrift Documentation: https://thrift.apache.org/docs/
- `docs/it/infrastructure/common-infra.md` - Common infrastructure setup

### Related Tasks
- Depends on: `setup-common-infra-thrift.md` (completed)
- Enables: Developer tasks for implementing interfaces
- Enables: Tester tasks for component and integration testing

### Example Makefile Pattern
```makefile
# Include common build configuration
include ../../common_infra/build_tools/common.mk
include ../../common_infra/build_tools/rules.mk

# Module-specific settings
MODULE_NAME = BigModuleA
THRIFT_FILES = $(wildcard src/ext/interface/*.thrift)
GENERATED_DIR = src/int/generated
IMPL_DIR = src/int/impl

# Targets
.PHONY: all generate build clean install

all: generate build

generate:
	# Generate C++ from Thrift files

build: build-debug build-release

build-debug:
	# Compile for debug

build-release:
	# Compile for release

clean:
	# Remove build artifacts

install:
	# Install built artifacts
```
