# RTDCS Release Package

**Reticle Thermal Distortion Compensation System**
**Version:** 1.0
**Release Date:** 2026-01-21

---

## Contents

This release package contains documentation for the RTDCS proof-of-concept system.

### Documentation

- **[QUICK-START.md](docs/QUICK-START.md)** - One-page quick reference for building and running
- **[RTDCS-User-Guide.md](docs/RTDCS-User-Guide.md)** - Complete user guide with detailed instructions
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture and design documentation

### Executables (Build Required)

Executables are built from source and located in:
- `BigModuleA/build/release/BigModuleA` - Thermal Monitor
- `BigModuleB/build/release/BigModuleB` - Distortion Predictor
- `BigModuleC/build/release/BigModuleC` - Compensation Controller

---

## Quick Start

### For the Impatient

#### Linux
```bash
# Install dependencies
sudo apt-get install -y build-essential libthrift-dev

# Build
make -C BigModuleA build && make -C BigModuleB build && make -C BigModuleC build

# Run (3 terminals)
./BigModuleA/build/release/BigModuleA --samples 100
./BigModuleC/build/release/BigModuleC --port 9090
./BigModuleB/build/release/BigModuleB --samples 50
```

#### macOS
```bash
# Install dependencies
brew install thrift googletest boost

# Build
make -C BigModuleA build && make -C BigModuleB build && make -C BigModuleC build

# Run (3 terminals)
./BigModuleA/build/release/BigModuleA --samples 100
./BigModuleC/build/release/BigModuleC --port 9090
./BigModuleB/build/release/BigModuleB --samples 50
```

---

## System Overview

RTDCS demonstrates multi-process communication for thermal distortion compensation:

```
BigModuleA → Shared Memory → BigModuleB → Thrift RPC → BigModuleC → Shared Memory
(Temperature)                (Prediction)              (Compensation)
```

**Key Technologies:**
- POSIX Shared Memory for high-speed data sharing
- Apache Thrift RPC for inter-process communication
- Multi-threaded concurrent processing
- Real-time operation (10 Hz temperature, 5 Hz prediction)

---

## Documentation Index

### Getting Started
- **Quick Start** - Get running in 5 minutes
- **User Guide** - Complete installation and usage instructions
- **Architecture** - System design and implementation details

### Reference
- **Build System** - Makefile documentation and build targets
- **Configuration** - Command-line options and environment variables
- **Troubleshooting** - Common issues and solutions

### For Developers
- **API Reference** - Module interfaces and data structures
- **Testing** - Unit test, integration test, and system test guidelines
- **Contributing** - Development workflow and coding standards

---

## Important Disclaimers

⚠️ **PROOF OF CONCEPT ONLY**

This system uses **COMPLETELY FICTIONAL** algorithms that have **NO scientific validity**:

1. **Zeeman Thermal Expansion Model** (BigModuleB)
   - Made-up quadratic model: `distortion = α*ΔT + β*ΔT²`
   - Fictional coefficients chosen arbitrarily

2. **Simple Negation Strategy** (BigModuleC)
   - Trivial algorithm: `compensation = -distortion`
   - Not representative of real compensation systems

**Real lithography systems use:**
- Finite Element Analysis (FEA)
- Calibration-based correction tables
- Multi-parameter physics-based models
- Complex control algorithms

**DO NOT use this system in production or for any application requiring accuracy.**

---

## Support

- **Documentation:** See `docs/` folder
- **Issues:** https://github.com/meenusinha/BigProjPOC/issues
- **Source Code:** https://github.com/meenusinha/BigProjPOC

---

## License

See LICENSE file in repository root.

---

**Copyright © 2026 BigProjPOC Contributors**
