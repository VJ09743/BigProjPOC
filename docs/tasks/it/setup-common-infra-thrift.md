# Task: Setup Common Infrastructure with Apache Thrift

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
Create a centralized common infrastructure folder at the repository root and install Apache Thrift locally (not system-wide) for use across all modules.

## Requirements

### 1. Common Infrastructure Folder Structure
Create at repository root:
```
common_infra/
├── thrift/
│   ├── bin/
│   ├── include/
│   └── lib/
├── build_tools/
│   ├── common.mk
│   └── rules.mk
└── README.md
```

**Important**: Do NOT add extra folders or files beyond this structure.

### 2. Apache Thrift Installation
- **Location**: Must be installed locally under `common_infra/thrift/`
- **No system-wide dependencies**: All artifacts must live within the repository
- **Required components**:
  - Thrift compiler (`thrift`)
  - C++ runtime headers
  - C++ runtime libraries

**Acceptable approaches**:
- Build from source
- Use prebuilt binaries

**Verification**: After installation, this must work:
```bash
common_infra/thrift/bin/thrift --version
```

### 3. Build Tools
Create makefiles in `common_infra/build_tools/`:
- `common.mk` - Common build variables and settings
- `rules.mk` - Reusable build rules

### 4. Technical Constraints
- Thrift must be repository-local (not system-installed)
- No external dependencies outside the repo
- Must work across all three modules (BigModuleA, BigModuleB, BigModuleC)
- Installation must be reproducible on different machines

## Deliverables
- [ ] Create `common_infra/` folder at repository root
- [ ] Create folder structure: thrift/, build_tools/
- [ ] Install Apache Thrift locally to `common_infra/thrift/`
- [ ] Verify thrift compiler is executable at `common_infra/thrift/bin/thrift`
- [ ] Create `common_infra/build_tools/common.mk`
- [ ] Create `common_infra/build_tools/rules.mk`
- [ ] Create `common_infra/README.md` with installation documentation
- [ ] Update `.gitignore` if needed for build artifacts
- [ ] Update `CLAUDE.md` to document the new common_infra structure
- [ ] Create documentation in `docs/it/infrastructure/common-infra.md`

## Acceptance Criteria
- [ ] `common_infra/` folder exists at repository root
- [ ] Exact folder structure matches requirements (no extra folders)
- [ ] Thrift compiler works: `common_infra/thrift/bin/thrift --version`
- [ ] All Thrift components are local to repository
- [ ] Build tool makefiles exist and are documented
- [ ] `common_infra/README.md` documents:
  - How Thrift was installed
  - How it is invoked
  - Why it is centralized
- [ ] Documentation is short and technical (no fluff)
- [ ] CLAUDE.md updated with new structure

## Notes

### Thrift Installation Options

**Option 1: Build from Source**
```bash
cd common_infra/thrift
wget https://archive.apache.org/dist/thrift/[version]/thrift-[version].tar.gz
tar -xzf thrift-[version].tar.gz
cd thrift-[version]
./configure --prefix=$(pwd)/.. --enable-libs=no
make
make install
```

**Option 2: Prebuilt Binaries**
Download prebuilt binaries and extract to `common_infra/thrift/`

### Why Centralized
- Single source of truth for build tools
- Consistent Thrift version across all modules
- No dependency on system-installed tools
- Easier for new developers to get started

## Resources
- Apache Thrift Downloads: https://thrift.apache.org/download
- Thrift Documentation: https://thrift.apache.org/docs/
- Build from source guide: https://thrift.apache.org/docs/install/

## Dependencies
- None (this is a foundational infrastructure task)
