# Build Output

This folder contains the **combined output** from all software modules.

## Structure

```
output/
├── release/          # Combined release builds from all modules
│   ├── bin/          # Executables
│   ├── lib/          # Libraries
│   └── include/      # Headers (if needed)
│
└── debug/            # Combined debug builds from all modules
    ├── bin/          # Debug executables
    └── lib/          # Debug libraries
```

## How It Works

1. **Individual modules** build to their own `release/` and `debug/` folders
2. **Top-level Makefile** copies/links outputs here for easy access
3. **Final deliverables** come from this folder

## Build Flow

```
modules/
├── module-a/release/  ──┐
├── module-b/release/  ──┼──→  output/release/
└── module-c/release/  ──┘

modules/
├── module-a/debug/    ──┐
├── module-b/debug/    ──┼──→  output/debug/
└── module-c/debug/    ──┘
```

## Usage

From project root:

```bash
# Build all modules and combine output
make all

# Build release only
make release

# Build debug only
make debug

# Clean everything
make clean
```

## Contents (gitignored)

The actual build outputs are gitignored. Only `.gitkeep` files are tracked to preserve folder structure.
