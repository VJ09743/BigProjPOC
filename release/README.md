# Release Directory

This directory contains release artifacts for the project.

## Structure

```
release/
├── README.md          # This file
├── .gitkeep           # Keeps directory in git
└── [versioned releases will be added here]
```

## Release Process

Releases are created by the IT Agent following this workflow:

1. **Build** - All modules are built in release mode
2. **Test** - All tests must pass
3. **Package** - Artifacts are packaged
4. **Version** - Semantic versioning (v1.0.0)
5. **Tag** - Git tag is created
6. **Document** - Release notes are generated

## Creating a Release

Tell your AI assistant: "Create a release for version X.Y.Z"

The IT Agent will:
1. Build all modules
2. Run all tests
3. Create `release/vX.Y.Z/` directory
4. Copy artifacts and documentation
5. Create git tag
6. Generate release notes

## Version Format

Semantic Versioning (SemVer):
- MAJOR.MINOR.PATCH
- Example: 1.0.0, 1.1.0, 2.0.0

## Notes

- Release artifacts are gitignored (except README and .gitkeep)
- Each release gets its own versioned subfolder
- Release documentation goes in `docs/it/releases/`
