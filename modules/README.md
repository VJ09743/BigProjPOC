# Software Modules

This directory contains all software modules for your project.

## Structure

Each module is a self-contained unit with its own source code, tests, and build configuration:

```
modules/
├── module-name/
│   ├── src/              # Source code
│   ├── test/             # Unit and integration tests
│   ├── release/          # Release build output
│   ├── debug/            # Debug build output
│   ├── build-config/     # Build configuration files
│   ├── Makefile          # Module build script
│   └── README.md         # Module documentation
│
├── another-module/
│   └── ...
│
└── README.md             # This file
```

## Creating a New Module

1. Copy the `example-module/` folder
2. Rename it to your module name
3. Update the module's `README.md`
4. Modify the `Makefile` for your needs
5. Add your source code to `src/`
6. Add tests to `test/`

## Module Folder Descriptions

| Folder | Purpose |
|--------|---------|
| `src/` | All source code (.c, .cpp, .h, .py, .js, etc.) |
| `test/` | Unit tests, integration tests, test fixtures |
| `release/` | Optimized production build output |
| `debug/` | Debug build with symbols for development |
| `build-config/` | CMake files, compiler configs, linker scripts |

## Build Commands

From within a module directory:

```bash
# Build release version
make release

# Build debug version
make debug

# Run tests
make test

# Clean build artifacts
make clean

# Build all (debug + release + test)
make all
```

## Multi-Module Projects

For projects with multiple modules:

```
modules/
├── core/           # Core functionality
├── api/            # API layer
├── ui/             # User interface
├── database/       # Database access
└── shared/         # Shared utilities
```

Each module can depend on others. Define dependencies in the module's `Makefile` or `build-config/`.

## Example Architectures

### Microservices
```
modules/
├── auth-service/
├── user-service/
├── payment-service/
└── notification-service/
```

### Layered Architecture
```
modules/
├── presentation/
├── business-logic/
├── data-access/
└── infrastructure/
```

### Component-Based
```
modules/
├── component-a/
├── component-b/
└── shared-libs/
```
