# RTDCS User Guide
**Reticle Thermal Distortion Compensation System**
**Version:** 1.0
**Date:** 2026-01-21
**Platform:** Linux, macOS

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Building from Source](#building-from-source)
5. [Running the System](#running-the-system)
6. [Configuration Options](#configuration-options)
7. [System Architecture](#system-architecture)
8. [Troubleshooting](#troubleshooting)
9. [Important Disclaimers](#important-disclaimers)

---

## System Overview

RTDCS is a proof-of-concept system demonstrating multi-process communication for thermal distortion compensation in lithography systems. The system consists of three independent modules:

- **BigModuleA (ThermalMonitor)**: Simulates reticle temperature and writes to shared memory
- **BigModuleB (DistortionPredictor)**: Reads temperature, predicts distortion, sends to BigModuleC via RPC
- **BigModuleC (CompensationController)**: Receives distortion via RPC, computes compensation, writes to shared memory

### Key Features

- ✅ Multi-process communication via POSIX shared memory and Apache Thrift RPC
- ✅ Real-time operation (10 Hz temperature, 5 Hz prediction)
- ✅ Cross-platform support (Linux and macOS)
- ✅ Configurable via command-line arguments
- ✅ Graceful shutdown with signal handling

---

## Prerequisites

### For Linux (Ubuntu 20.04+, Debian 10+)

```bash
# System packages
sudo apt-get update
sudo apt-get install -y \
    build-essential \
    git \
    libthrift-dev \
    libgtest-dev
```

**Required versions:**
- GCC 7.5+ or Clang 10+
- Apache Thrift 0.19.0+
- C++14 standard support

### For macOS (11.0+)

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install thrift googletest
```

**Required versions:**
- Xcode Command Line Tools (includes clang++)
- Apache Thrift 0.19.0+
- Homebrew (latest)

---

## Quick Start

### Step 1: Clone Repository

```bash
git clone https://github.com/meenusinha/BigProjPOC.git
cd BigProjPOC
git checkout claude/continue-planned-tasks-zg6I5
```

### Step 2: Build All Modules

```bash
# Build all three modules
make -C BigModuleA build
make -C BigModuleB build
make -C BigModuleC build
```

**Expected output:**
```
[SUCCESS] Debug build complete: build/debug/libBigModuleA.a and build/debug/BigModuleA
[SUCCESS] Release build complete: build/release/libBigModuleA.a and build/release/BigModuleA
[SUCCESS] Debug build complete: build/debug/libBigModuleB.a and build/debug/BigModuleB
[SUCCESS] Release build complete: build/release/libBigModuleB.a and build/release/BigModuleB
[SUCCESS] Debug build complete: build/debug/libBigModuleC.a and build/debug/BigModuleC
[SUCCESS] Release build complete: build/release/libBigModuleC.a and build/release/BigModuleC
```

### Step 3: Verify Build

```bash
ls -lh BigModuleA/build/release/BigModuleA
ls -lh BigModuleB/build/release/BigModuleB
ls -lh BigModuleC/build/release/BigModuleC
```

All three executables should be present and executable.

### Step 4: Run the System

Open **three separate terminals** and run the following commands:

#### Terminal 1: Start ThermalMonitor
```bash
./BigModuleA/build/release/BigModuleA --pattern sine --samples 100
```

#### Terminal 2: Start CompensationController
```bash
./BigModuleC/build/release/BigModuleC --port 9090
```

#### Terminal 3: Start DistortionPredictor
```bash
./BigModuleB/build/release/BigModuleB --host localhost --port 9090 --samples 50
```

### Step 5: Observe Output

You should see:
- **Terminal 1**: Temperature values being written (10 Hz)
- **Terminal 2**: RPC requests being received and compensation applied
- **Terminal 3**: Distortion predictions being computed and sent

### Step 6: Stop the System

Press **Ctrl+C** in each terminal to gracefully shutdown each module.

---

## Building from Source

### Build All Modules

```bash
# From repository root
make -C BigModuleA build
make -C BigModuleB build
make -C BigModuleC build
```

### Build Individual Modules

```bash
# BigModuleA only
cd BigModuleA
make clean
make build

# BigModuleB only
cd BigModuleB
make clean
make build

# BigModuleC only
cd BigModuleC
make clean
make build
```

### Build Targets

Each module supports the following Make targets:

| Target | Description |
|--------|-------------|
| `make all` | Build everything (default) |
| `make build` | Build debug and release versions |
| `make build-debug` | Build debug version only |
| `make build-release` | Build release version only |
| `make clean` | Remove all build artifacts |
| `make install` | Install to repository `release/` folder |
| `make help` | Show available targets |

### Build Output

Executables are created in:
- **Debug**: `build/debug/BigModuleX`
- **Release**: `build/release/BigModuleX`

Libraries are created in:
- **Debug**: `build/debug/libBigModuleX.a`
- **Release**: `build/release/libBigModuleX.a`

---

## Running the System

### Startup Order

⚠️ **IMPORTANT**: Start modules in this order:

1. **BigModuleA** (ThermalMonitor) - Creates shared memory
2. **BigModuleC** (CompensationController) - Starts RPC server
3. **BigModuleB** (DistortionPredictor) - Connects to shared memory and RPC server

### Shutdown Order

Press **Ctrl+C** in any terminal to stop that module. The recommended shutdown order is:

1. **BigModuleB** (DistortionPredictor) - Stop prediction loop
2. **BigModuleC** (CompensationController) - Stop RPC server
3. **BigModuleA** (ThermalMonitor) - Destroy shared memory

### Running with Custom Configuration

#### BigModuleA (ThermalMonitor)

```bash
# Sine wave pattern (default)
./BigModuleA/build/release/BigModuleA \
    --pattern sine \
    --base-temp 25.0 \
    --amplitude 5.0 \
    --frequency 0.1 \
    --samples 100

# Step pattern
./BigModuleA/build/release/BigModuleA \
    --pattern step \
    --base-temp 25.0 \
    --step-delta 5.0 \
    --interval 3.0 \
    --samples 100
```

#### BigModuleB (DistortionPredictor)

```bash
# Connect to localhost:9090 (default)
./BigModuleB/build/release/BigModuleB \
    --host localhost \
    --port 9090 \
    --samples 50

# Connect to remote server
./BigModuleB/build/release/BigModuleB \
    --host 192.168.1.100 \
    --port 9090
```

#### BigModuleC (CompensationController)

```bash
# Listen on port 9090 (default)
./BigModuleC/build/release/BigModuleC --port 9090

# Listen on custom port
./BigModuleC/build/release/BigModuleC --port 8080
```

### Help Output

View help for any module:

```bash
./BigModuleA/build/release/BigModuleA --help
./BigModuleB/build/release/BigModuleB --help
./BigModuleC/build/release/BigModuleC --help
```

---

## Configuration Options

### BigModuleA (ThermalMonitor)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--pattern <type>` | string | `sine` | Temperature pattern: `sine` or `step` |
| `--base-temp <value>` | double | `25.0` | Base temperature in °C |
| `--amplitude <value>` | double | `5.0` | Temperature variation amplitude in °C |
| `--frequency <value>` | double | `0.1` | Frequency in Hz (sine pattern only) |
| `--step-delta <value>` | double | `5.0` | Step delta in °C (step pattern only) |
| `--interval <value>` | double | `3.0` | Step interval in seconds (step pattern only) |
| `--samples <count>` | int | `0` | Number of samples (0 = infinite) |
| `--help` | - | - | Show help message |

**Examples:**
```bash
# Sine wave: 25°C ± 5°C at 0.1 Hz, 100 samples
./BigModuleA/build/release/BigModuleA --pattern sine --base-temp 25.0 --amplitude 5.0 --frequency 0.1 --samples 100

# Step pattern: 25°C ↔ 30°C every 3 seconds, infinite
./BigModuleA/build/release/BigModuleA --pattern step --base-temp 25.0 --step-delta 5.0 --interval 3.0
```

### BigModuleB (DistortionPredictor)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--host <host>` | string | `localhost` | BigModuleC hostname or IP |
| `--port <port>` | int | `9090` | BigModuleC Thrift RPC port |
| `--samples <n>` | int | `0` | Number of samples (0 = infinite) |
| `--help` | - | - | Show help message |

**Examples:**
```bash
# Connect to localhost:9090, process 50 samples
./BigModuleB/build/release/BigModuleB --host localhost --port 9090 --samples 50

# Connect to remote server, run indefinitely
./BigModuleB/build/release/BigModuleB --host 192.168.1.100 --port 9090
```

### BigModuleC (CompensationController)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--port <port>` | int | `9090` | Thrift RPC server port |
| `--help` | - | - | Show help message |

**Examples:**
```bash
# Listen on default port 9090
./BigModuleC/build/release/BigModuleC --port 9090

# Listen on custom port 8080
./BigModuleC/build/release/BigModuleC --port 8080
```

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    RTDCS System Architecture                │
└─────────────────────────────────────────────────────────────┘

BigModuleA (ThermalMonitor)
  │ Simulates reticle temperature at 10 Hz
  │ Patterns: Sine wave or Step function
  │
  ├──► Shared Memory (/rtdcs_shared_state)
  │    Size: 4096 bytes (1 page)
  │    Fields:
  │      - current_temp_C (double)
  │      - timestamp_s (double)
  │      - sample_count (uint32_t)
  │
  ▼
BigModuleB (DistortionPredictor)
  │ Reads temperature from shared memory at 5 Hz
  │ FICTIONAL Zeeman Thermal Expansion Model
  │ Model: distortion = α*ΔT + β*ΔT²
  │
  ├──► Thrift RPC (TBinaryProtocol, TBufferedTransport)
  │    Endpoint: localhost:9090
  │    Method: applyDistortion(DistortionVector)
  │    Fields:
  │      - distortion_x_nm (double)
  │      - distortion_y_nm (double)
  │
  ▼
BigModuleC (CompensationController)
  │ Receives distortion via RPC (TThreadedServer)
  │ FICTIONAL Simple Negation Strategy
  │ Algorithm: compensation = -distortion
  │
  └──► Shared Memory (/rtdcs_shared_state)
       Fields:
         - compensation_x_nm (double)
         - compensation_y_nm (double)
         - compensation_timestamp_s (double)
```

### Inter-Process Communication

#### 1. POSIX Shared Memory

**Name:** `/rtdcs_shared_state`
**Size:** 4096 bytes (1 memory page)
**Location:**
- Linux: `/dev/shm/rtdcs_shared_state`
- macOS: `/tmp/rtdcs_shared_state`

**Access Modes:**
- **BigModuleA**: Owner (`O_CREAT | O_RDWR`) - Creates, writes temperature, destroys
- **BigModuleB**: Reader (`O_RDONLY`) - Reads temperature
- **BigModuleC**: Writer (`O_RDWR`) - Writes compensation

**Memory Layout:**
```
Offset | Size | Field                        | Writer      | Reader(s)
-------|------|------------------------------|-------------|-------------
0      | 4    | magic (0x4C49544F)           | BigModuleA  | All
8      | 8    | current_temp_C               | BigModuleA  | BigModuleB
16     | 8    | timestamp_s                  | BigModuleA  | BigModuleB
24     | 4    | sample_count                 | BigModuleA  | All
32     | 8    | compensation_x_nm            | BigModuleC  | -
40     | 8    | compensation_y_nm            | BigModuleC  | -
48     | 8    | compensation_timestamp_s     | BigModuleC  | -
56     | 4040 | padding (reserved)           | -           | -
```

#### 2. Apache Thrift RPC

**Protocol:** TBinaryProtocol
**Transport:** TBufferedTransport over TCP
**Server:** TThreadedServer (one thread per connection)
**Port:** 9090 (configurable)

**RPC Interface:**
```thrift
service ICompensationController {
    void applyDistortion(1: DistortionVector distortion)
}

struct DistortionVector {
    1: double distortion_x_nm,
    2: double distortion_y_nm
}
```

### Update Rates

| Module | Update Rate | Description |
|--------|-------------|-------------|
| BigModuleA | 10 Hz (100 ms) | Temperature simulation |
| BigModuleB | 5 Hz (200 ms) | Distortion prediction |
| BigModuleC | Event-driven | RPC response (microseconds) |

---

## Troubleshooting

### Build Issues

#### Issue: "thrift: command not found"

**Linux:**
```bash
sudo apt-get install libthrift-dev
```

**macOS:**
```bash
brew install thrift
```

#### Issue: "fatal error: thrift/Thrift.h: No such file or directory"

**Linux:**
```bash
sudo apt-get install libthrift-dev
```

**macOS:**
```bash
brew install thrift
# Verify installation
which thrift
ls -la $(brew --prefix)/include/thrift/
```

#### Issue: Build fails with linking errors

Check that Thrift libraries are installed:

**Linux:**
```bash
ldconfig -p | grep thrift
```

**macOS:**
```bash
ls -la $(brew --prefix)/lib/libthrift*
```

### Runtime Issues

#### Issue: "Failed to open shared memory"

**Cause:** BigModuleA is not running (shared memory doesn't exist)

**Solution:** Start BigModuleA first:
```bash
./BigModuleA/build/release/BigModuleA --samples 100
```

#### Issue: "Failed to connect to BigModuleC"

**Cause:** BigModuleC is not running or wrong port

**Solution:**
1. Start BigModuleC:
   ```bash
   ./BigModuleC/build/release/BigModuleC --port 9090
   ```
2. Verify port matches in BigModuleB:
   ```bash
   ./BigModuleB/build/release/BigModuleB --host localhost --port 9090
   ```

#### Issue: "Address already in use" (port 9090)

**Cause:** Another process is using port 9090

**Solution:**
```bash
# Check what's using the port
lsof -i :9090  # Linux/macOS

# Kill the process or use a different port
./BigModuleC/build/release/BigModuleC --port 9091
./BigModuleB/build/release/BigModuleB --port 9091
```

#### Issue: Stale shared memory on macOS

**Cause:** Shared memory persists after crash

**Solution:**
```bash
# Remove stale shared memory
rm /tmp/rtdcs_shared_state

# Or use shm_unlink programmatically
```

#### Issue: Permission denied on shared memory

**Cause:** Wrong permissions on shared memory

**Solution:**
```bash
# Remove and recreate (BigModuleA will recreate)
rm /dev/shm/rtdcs_shared_state  # Linux
rm /tmp/rtdcs_shared_state      # macOS
```

---

## Important Disclaimers

### ⚠️ FICTIONAL ALGORITHMS

All prediction and compensation algorithms in this system are **COMPLETELY FICTIONAL** and have **NO scientific validity**. They are simple mathematical models created solely for demonstration purposes.

#### Zeeman Thermal Expansion Model (BigModuleB)

**What it is:** A made-up quadratic thermal expansion model
**Formula:** `distortion = α*ΔT + β*ΔT²`
**Coefficients (FICTIONAL):**
- α_x = 1.2 nm/°C
- α_y = 0.9 nm/°C
- β_x = 0.05 nm/°C²
- β_y = 0.03 nm/°C²

**Why "Zeeman"?**
The Zeeman effect is a real physics phenomenon (spectral line splitting in magnetic fields). It has **NOTHING to do** with thermal expansion or lithography. This name was chosen to make it obviously fictional.

**Real lithography systems use:**
- Finite Element Analysis (FEA) with material properties
- Calibration-based lookup tables from metrology measurements
- Multi-parameter regression models
- Physics-based simulations accounting for anisotropic behavior
- Environmental factors (humidity, pressure, etc.)

#### Simple Negation Strategy (BigModuleC)

**What it is:** A trivial compensation algorithm
**Formula:** `compensation = -distortion`

**Real lithography systems use:**
- Complex multi-parameter correction models
- Non-linear actuator response curves
- Calibration-based correction tables
- Dynamic feedback control loops
- Multi-zone correction strategies

### ⚠️ DO NOT USE IN PRODUCTION

This is a **proof-of-concept system** for demonstrating:
- Multi-process communication (shared memory + RPC)
- Lithography domain modeling
- Clean software architecture
- Cross-platform build systems

**DO NOT use this system or its algorithms in:**
- Production lithography equipment
- Research requiring accurate predictions
- Any system where accuracy matters
- Safety-critical applications

---

## Support and Feedback

For questions, issues, or feedback:
- **GitHub Issues:** https://github.com/meenusinha/BigProjPOC/issues
- **Documentation:** See `release/docs/` folder
- **Source Code:** https://github.com/meenusinha/BigProjPOC

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-21 | Initial release with all three modules complete |

---

**Copyright © 2026 BigProjPOC Contributors**
**License:** See LICENSE file in repository root
