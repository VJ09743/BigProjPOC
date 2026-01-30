# Scripts

This folder contains scripts for building, testing, and running your project.

## Available Scripts

| Script | Purpose |
|--------|---------|
| `build.sh` | Build all modules |
| `test.sh` | Run all tests |
| `run.sh` | Run the application |
| `clean.sh` | Clean build artifacts |

## Usage

```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Build the project
./scripts/build.sh

# Run tests
./scripts/test.sh

# Run the application
./scripts/run.sh

# Clean build artifacts
./scripts/clean.sh
```

## Customization

These are template scripts. Modify them based on your project's technology stack:

- **Node.js**: Use `npm run build`, `npm test`
- **Python**: Use `pip install`, `pytest`
- **Go**: Use `go build`, `go test`
- **Rust**: Use `cargo build`, `cargo test`
- **C/C++**: Use `make` (already configured in Makefile)

## Adding New Scripts

1. Create your script in this folder
2. Add `#!/bin/bash` at the top
3. Make it executable: `chmod +x scripts/your-script.sh`
4. Document it in this README
