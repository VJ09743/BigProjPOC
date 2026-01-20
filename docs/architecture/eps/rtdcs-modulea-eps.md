# BigModuleA (ThermalMonitor) External Product Specification (EPS)

**Project**: Reticle Thermal Distortion Compensation System (RTDCS)
**Module**: BigModuleA - ThermalMonitor
**Document Type**: Module-Level External Product Specification (EPS)
**Version**: 1.0
**Date**: 2026-01-19
**Author**: Architect Agent
**Status**: Draft - Awaiting Review

---

## ⚠️ CRITICAL DISCLAIMER: FICTIONAL PROOF-OF-CONCEPT

**This module is part of a PROOF-OF-CONCEPT (POC) project.**

**FICTIONAL ELEMENTS IN THIS MODULE**:
- Temperature sensor readings are **SIMULATED**, not from real hardware
- Temperature patterns (sine wave, step changes) are **ARTIFICIAL**
- NOT representative of actual reticle thermal behavior in production lithography systems

**This module demonstrates software architecture and data flow, NOT real sensor integration.**

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Module Scope](#2-module-scope)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [External Interfaces](#5-external-interfaces)
6. [Operational Scenarios](#6-operational-scenarios)
7. [Error Handling](#7-error-handling)
8. [Glossary](#8-glossary)

---

## 1. Module Overview

**BigModuleA (ThermalMonitor)** is responsible for:
- Simulating reticle temperature sensor readings
- Managing shared memory lifecycle (create, initialize, destroy)
- Publishing temperature data to shared memory for other modules
- Logging temperature updates for system observability

### Position in System Architecture

```
┌──────────────────────────────────────┐
│  BigModuleA: ThermalMonitor          │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ Temperature Simulator          │ │  ⚠️ FICTIONAL
│  │ (Sine wave or step pattern)    │ │
│  └─────────────┬──────────────────┘ │
│                │                     │
│                ▼                     │
│  ┌────────────────────────────────┐ │
│  │ Shared Memory Manager          │ │
│  │ (POSIX /rtdcs_shared_state)    │ │
│  │ - Create (owner)                │ │
│  │ - Write temperature             │ │
│  │ - Write timestamp               │ │
│  │ - Set status flag               │ │
│  └─────────────┬──────────────────┘ │
│                │                     │
│                ▼                     │
│  ┌────────────────────────────────┐ │
│  │ Logger                          │ │
│  │ (stdout, standardized format)   │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
         │
         │  Temperature data
         ▼
┌─────────────────────────┐
│  Shared Memory          │
│  /rtdcs_shared_state    │
│                         │
│  Read by:               │
│  - BigModuleB           │
└─────────────────────────┘
```

### Module Boundaries

**Responsibilities** (What BigModuleA DOES):
- Temperature simulation (configurable patterns)
- Shared memory creation and management
- Temperature data publication
- Startup and shutdown coordination
- Status reporting and logging

**Non-Responsibilities** (What BigModuleA DOES NOT do):
- Thermal distortion prediction (that's BigModuleB)
- Compensation calculation (that's BigModuleC)
- Real hardware sensor integration (FICTIONAL simulation only)
- Thrift RPC communication (not needed for this module)

---

## 2. Module Scope

### In Scope

- Temperature simulation with configurable patterns
- Shared memory segment creation and initialization
- Temperature updates at 10 Hz frequency
- Timestamping for performance analysis
- Module status management (`modulea_status` flag)
- Logging all temperature updates
- Graceful shutdown with resource cleanup

### Out of Scope

- Real sensor hardware integration
- Temperature control or regulation
- Data persistence or historical storage
- GUI or remote monitoring interface
- Communication with BigModuleB or BigModuleC (indirect via shared memory only)

---

## 3. Functional Requirements

### FR-A-01: Temperature Simulation
**Description**: BigModuleA SHALL simulate reticle temperature readings using configurable patterns.
**Priority**: High
**Details**:
- **Pattern 1: Sine Wave** (smooth variation)
  ```
  T(t) = T_base + T_amplitude * sin(2π * f * t)
  Default: T_base = 25.0°C, T_amplitude = 5.0°C, f = 0.1 Hz
  ```
- **Pattern 2: Step Changes** (discrete temperature levels)
  ```
  T(t) = T_base, then step to T_base + ΔT at intervals
  Default: T_base = 25.0°C, ΔT = 3.0°C, step every 10 seconds
  ```
- Pattern selectable via compile-time configuration or command-line argument
- Temperature range: 20.0°C to 30.0°C (typical lithography environment)

**⚠️ FICTIONAL**: These patterns are artificial and not based on real reticle thermal behavior.

**Verification**: Unit tests verify pattern generation; system tests observe logged values.

### FR-A-02: Shared Memory Creation
**Description**: BigModuleA SHALL create the POSIX shared memory segment at startup.
**Priority**: High
**Details**:
- Segment name: `/rtdcs_shared_state`
- Size: 4096 bytes (page-aligned)
- Permissions: 0666 (read/write for all modules)
- If segment exists from previous run, unlink and recreate
- Initialize all fields to zero before operation

**Error Handling**: If creation fails, log error and exit with non-zero status.

**Verification**: System tests verify shared memory exists and is accessible by other modules.

### FR-A-03: Shared Memory Initialization
**Description**: BigModuleA SHALL initialize shared memory structure at startup.
**Priority**: High
**Details**:
- Zero all fields
- Set `modulea_status = 1` (running)
- Set `moduleb_status = 0`, `modulec_status = 0` (other modules not started yet)
- Set initial temperature to 25.0°C (room temperature)
- Set initial timestamp to current time (nanoseconds since epoch)

**Verification**: Unit tests verify initialization; integration tests verify other modules can read.

### FR-A-04: Temperature Update Frequency
**Description**: BigModuleA SHALL update temperature in shared memory at 10 Hz (100ms period).
**Priority**: High
**Real-time Requirement**: Updates SHALL occur within ±5ms of target period.

**Implementation Guidance**: Use `clock_nanosleep` with CLOCK_MONOTONIC for deterministic timing.

**Verification**: Performance tests measure actual update frequency and jitter.

### FR-A-05: Temperature Data Writing
**Description**: BigModuleA SHALL write temperature data to shared memory on each update cycle.
**Priority**: High
**Details**:
- Write `reticle_temp_C` field with current simulated temperature (double precision)
- Write `temp_timestamp_ns` field with current timestamp (int64, nanoseconds since epoch)
- Use memory barriers to ensure visibility across processes
- Maintain `modulea_status = 1` during operation

**Data Consistency**: No locking required (single writer, multiple readers with atomic double writes on x86-64).

**Verification**: Integration tests verify BigModuleB can read temperatures correctly.

### FR-A-06: Logging
**Description**: BigModuleA SHALL log all significant events to stdout.
**Priority**: High
**Log Format**:
```
[TIMESTAMP] [BigModuleA] [LEVEL] Message
```
**Events to Log**:
- Startup: `"BigModuleA starting, PID=<pid>"`
- Shared memory created: `"Shared memory created: /rtdcs_shared_state, size=4096"`
- Ready state: `"BigModuleA READY"`
- Temperature updates (every 10th update to avoid log spam): `"Temperature: 25.3°C (sample 10/100)"`
- Shutdown signal received: `"Shutdown signal received, stopping..."`
- Shutdown complete: `"BigModuleA shutdown complete, shared memory released"`

**Verification**: System tests parse logs to verify correct operation.

### FR-A-07: Graceful Shutdown
**Description**: BigModuleA SHALL handle SIGTERM and SIGINT signals for graceful shutdown.
**Priority**: High
**Shutdown Sequence**:
1. Catch signal (SIGTERM or SIGINT)
2. Set `modulea_status = 0` in shared memory
3. Log shutdown message
4. Unlink/destroy shared memory segment (as owner)
5. Exit with status 0

**Resource Cleanup**: Ensure no shared memory leaks.

**Verification**: System tests verify clean shutdown and resource release.

### FR-A-08: Status Reporting
**Description**: BigModuleA SHALL maintain its running status in shared memory.
**Priority**: Medium
**Details**:
- Set `modulea_status = 1` when operational
- Set `modulea_status = 0` during shutdown
- Other modules can check this flag to detect BigModuleA availability

**Verification**: Integration tests verify status flag updates.

---

## 4. Non-Functional Requirements

### NFR-A-01: Update Latency
**Description**: Temperature updates SHALL occur with minimal jitter.
**Target**: < 5ms jitter from 100ms period
**Priority**: High
**Rationale**: Demonstrates real-time capable design.

**Verification**: Performance tests with high-resolution timestamps.

### NFR-A-02: CPU Usage
**Description**: BigModuleA SHALL consume minimal CPU resources during idle periods.
**Target**: < 1% CPU usage on modern desktop CPU
**Priority**: Medium
**Implementation Guidance**: Use `clock_nanosleep` instead of busy-waiting.

**Verification**: Resource monitoring during system tests.

### NFR-A-03: Memory Footprint
**Description**: BigModuleA SHALL have small memory footprint.
**Target**: < 10 MB resident memory
**Priority**: Low
**Rationale**: Simple module with minimal data structures.

**Verification**: Memory profiling during operation.

### NFR-A-04: Startup Time
**Description**: BigModuleA SHALL reach READY state quickly.
**Target**: < 100ms from process start to READY log message
**Priority**: Medium

**Verification**: System tests measure startup time.

### NFR-A-05: Code Quality
**Description**: BigModuleA SHALL follow software engineering best practices.
**Standards**:
- SOLID principles: Single Responsibility (temperature monitoring only)
- Clean Code: Meaningful names, small functions (< 50 lines), DRY
- Unit test coverage > 80%
- All **FICTIONAL** elements marked in comments

**Priority**: High

**Verification**: Code review, static analysis, unit test coverage reports.

### NFR-A-06: Portability
**Description**: BigModuleA SHALL build and run on Linux (Ubuntu 20.04+) and macOS (11.0+).

**Dependencies**:
- POSIX shared memory (`shm_open`, `mmap`)
  - Linux: Full support, `/dev/shm/` filesystem
  - macOS: Supported, but smaller default limits (use `sysctl kern.sysv.shmmax` to check)
- POSIX real-time timers
  - Linux: `clock_nanosleep()` with `CLOCK_MONOTONIC`
  - macOS: `nanosleep()` fallback (no CLOCK_MONOTONIC support)
- Standard C++ (C++14 or later)
  - Linux: GCC 7+ or Clang 6+
  - macOS: Clang (Xcode Command Line Tools)

**Platform-Specific Implementations**:
- **Timing**: Preprocessor directives to select `clock_nanosleep()` (Linux) or `nanosleep()` (macOS)
- **Shared Memory**: Same API, but macOS may require `sudo sysctl -w kern.sysv.shmmax=8388608` for larger segments

**Priority**: Medium

**Verification**: Build and run on both Linux (Ubuntu 20.04+) and macOS (11.0+).

---

## 5. External Interfaces

### 5.1 Shared Memory Interface (Output)

**Interface Type**: POSIX Shared Memory (Writer)
**Segment Name**: `/rtdcs_shared_state`
**Access Mode**: Read/Write (owner)

**Data Written by BigModuleA**:
```cpp
struct SharedLithoState {
    // Temperature data (written by BigModuleA)
    double   reticle_temp_C;       // Temperature in Celsius
    int64_t  temp_timestamp_ns;    // Timestamp (ns since epoch)

    // Status (written by BigModuleA)
    uint32_t modulea_status;       // 1=running, 0=stopped

    // Other fields managed by other modules (BigModuleA does not touch):
    double   compensation_offset_nm_x;  // Written by BigModuleC
    double   compensation_offset_nm_y;  // Written by BigModuleC
    int64_t  comp_timestamp_ns;         // Written by BigModuleC
    uint32_t moduleb_status;            // Written by BigModuleB
    uint32_t modulec_status;            // Written by BigModuleC

    // Reserved
    uint8_t  reserved[4000];
};
```

**Write Frequency**: 10 Hz (every 100ms)
**Synchronization**: None required (single writer for temperature fields)

### 5.2 Logging Interface (Output)

**Interface Type**: stdout (standard output stream)
**Format**: `[TIMESTAMP] [BigModuleA] [LEVEL] Message`
**Timestamp Format**: ISO 8601 or Unix timestamp (ms precision)
**Levels**: INFO, WARNING, ERROR

**Example Logs**:
```
[2026-01-19T12:34:56.123] [BigModuleA] [INFO] BigModuleA starting, PID=1234
[2026-01-19T12:34:56.145] [BigModuleA] [INFO] Shared memory created: /rtdcs_shared_state, size=4096
[2026-01-19T12:34:56.150] [BigModuleA] [INFO] BigModuleA READY
[2026-01-19T12:34:57.150] [BigModuleA] [INFO] Temperature: 25.3°C (sample 10/100)
[2026-01-19T12:35:10.500] [BigModuleA] [INFO] Shutdown signal received, stopping...
[2026-01-19T12:35:10.505] [BigModuleA] [INFO] BigModuleA shutdown complete, shared memory released
```

### 5.3 Command-Line Interface (Input)

**Interface Type**: Command-line arguments (optional)
**Purpose**: Configure temperature simulation pattern

**Arguments**:
- `--pattern <sine|step>`: Select temperature pattern (default: sine)
- `--base-temp <celsius>`: Base temperature in °C (default: 25.0)
- `--amplitude <celsius>`: Temperature amplitude for sine pattern (default: 5.0)
- `--frequency <hz>`: Frequency for sine pattern (default: 0.1 Hz)
- `--step-delta <celsius>`: Temperature step size for step pattern (default: 3.0)
- `--help`: Display usage information

**Example**:
```bash
./BigModuleA --pattern sine --base-temp 26.0 --amplitude 4.0
```

**Validation**: If invalid arguments provided, print error and exit with status 1.

### 5.4 Signal Interface (Input)

**Interface Type**: POSIX signals
**Signals Handled**:
- `SIGTERM`: Graceful shutdown (recommended)
- `SIGINT`: Graceful shutdown (Ctrl+C in terminal)

**Behavior**: Trigger shutdown sequence (FR-A-07)

---

## 6. Operational Scenarios

### Scenario 1: Normal Startup and Operation

**Preconditions**: None (BigModuleA starts first in system)
**Steps**:
1. User executes: `./BigModuleA --pattern sine`
2. BigModuleA parses command-line arguments
3. BigModuleA creates shared memory `/rtdcs_shared_state`
4. BigModuleA initializes shared memory (zero all fields)
5. BigModuleA sets `modulea_status = 1`
6. BigModuleA logs: `"BigModuleA READY"`
7. BigModuleA enters main loop:
   - Generate temperature using sine wave pattern
   - Write temperature to shared memory
   - Write timestamp
   - Sleep for 100ms (10 Hz)
   - Every 10th update, log temperature value
8. Loop continues until shutdown signal

**Expected Behavior**:
- Temperature updates at 10 Hz
- Values follow sine wave pattern: 25 ± 5°C with 0.1 Hz oscillation
- Logs show periodic temperature samples
- Other modules (when started) can read temperature from shared memory

### Scenario 2: Shutdown

**Preconditions**: BigModuleA running normally
**Steps**:
1. User sends SIGTERM: `kill -TERM <pid>` or presses Ctrl+C
2. BigModuleA catches signal
3. BigModuleA exits main loop
4. BigModuleA sets `modulea_status = 0`
5. BigModuleA logs: `"Shutdown signal received, stopping..."`
6. BigModuleA unlinks shared memory segment
7. BigModuleA logs: `"BigModuleA shutdown complete, shared memory released"`
8. BigModuleA exits with status 0

**Expected Behavior**:
- Clean shutdown within 100ms
- Shared memory segment removed (no leaks)
- All logs written
- Exit status 0

### Scenario 3: Step Temperature Pattern

**Preconditions**: None
**Steps**:
1. User executes: `./BigModuleA --pattern step --step-delta 3.0`
2. BigModuleA initializes with step pattern
3. BigModuleA logs: `"BigModuleA READY, using step pattern"`
4. Temperature starts at 25.0°C
5. After 10 seconds (100 updates), temperature steps to 28.0°C
6. After another 10 seconds, temperature steps back to 25.0°C
7. Pattern repeats: 25°C → 28°C → 25°C → ...

**Expected Behavior**:
- Temperature alternates between two levels
- Transitions are instantaneous (step change)
- Useful for testing response to rapid temperature changes

---

## 7. Error Handling

### Error 1: Shared Memory Creation Failure

**Condition**: `shm_open()` returns -1
**Possible Causes**:
- Insufficient permissions
- Out of memory
- Name conflict (segment already exists and locked)

**Handling**:
1. Log error: `"ERROR: Failed to create shared memory: <errno description>"`
2. Exit with status 1

**Prevention**: Unlink segment at startup if it exists.

### Error 2: Memory Mapping Failure

**Condition**: `mmap()` returns MAP_FAILED
**Possible Causes**:
- Invalid file descriptor
- Out of memory

**Handling**:
1. Log error: `"ERROR: Failed to map shared memory: <errno description>"`
2. Unlink shared memory segment
3. Exit with status 1

### Error 3: Invalid Command-Line Arguments

**Condition**: User provides unsupported arguments or invalid values
**Examples**:
- `--pattern invalid`
- `--base-temp 500` (unrealistic temperature)

**Handling**:
1. Print error message: `"ERROR: Invalid argument: <details>"`
2. Print usage information (`--help` text)
3. Exit with status 1

**Validation Rules**:
- `--base-temp`: Must be in range [20.0, 30.0]
- `--amplitude`: Must be in range [0.0, 10.0]
- `--pattern`: Must be `sine` or `step`

### Error 4: Signal Handler Registration Failure

**Condition**: `signal()` or `sigaction()` fails
**Possible Causes**:
- Invalid signal number
- System error

**Handling**:
1. Log warning: `"WARNING: Failed to register signal handler, graceful shutdown may not work"`
2. Continue operation (non-critical)

**Note**: If signal handler fails, shutdown will be abrupt (SIGKILL required).

---

## 8. Glossary

| Term | Definition |
|------|------------|
| **BigModuleA** | ThermalMonitor module - this module |
| **Reticle** | Photomask in lithography (real systems); simulated thermal source in this POC |
| **Temperature Simulation** | **⚠️ FICTIONAL** - Algorithmic generation of temperature values, not real sensor data |
| **Sine Wave Pattern** | Smooth temperature oscillation: T = T_base + amplitude * sin(2πft) |
| **Step Pattern** | Discrete temperature changes at intervals |
| **Shared Memory** | POSIX shared memory segment (`/rtdcs_shared_state`) for inter-process communication |
| **Owner** | The module responsible for creating and destroying a shared resource (BigModuleA for shared memory) |
| **10 Hz** | Update frequency: 10 times per second (100ms period) |
| **Jitter** | Variation in update timing (target: < 5ms) |
| **Graceful Shutdown** | Clean resource release and logging before process termination |
| **SIGTERM/SIGINT** | POSIX signals for process termination (15 and 2 respectively) |

---

## Document Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-19 | Architect Agent | Initial BigModuleA EPS created |

---

**Related Documents**:
- `rtdcs-system-eps.md` - System-Level External Product Specification
- `rtdcs-moduleb-eps.md` - BigModuleB (DistortionPredictor) EPS
- `rtdcs-modulec-eps.md` - BigModuleC (CompensationController) EPS
- `rtdcs-modulea-eds.md` - BigModuleA External Design Specification (TBD)

---

**End of BigModuleA EPS**
