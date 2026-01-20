# BigModuleB (DistortionPredictor) External Product Specification (EPS)

**Project**: Reticle Thermal Distortion Compensation System (RTDCS)
**Module**: BigModuleB - DistortionPredictor
**Document Type**: Module-Level External Product Specification (EPS)
**Version**: 1.0
**Date**: 2026-01-19
**Author**: Architect Agent
**Status**: Draft - Awaiting Review

---

## ⚠️ CRITICAL DISCLAIMER: FICTIONAL ALGORITHM

**This module contains a COMPLETELY FICTIONAL thermal expansion algorithm.**

**⚠️ FICTIONAL: Zeeman Thermal Expansion Model**
- The "Zeeman Model" used in this module is **100% FICTIONAL**
- It is **NOT** the real Zeeman effect from quantum physics (magnetic field splitting)
- It is **NOT** based on real lithography thermal models or material science
- It is **NOT** calibrated, validated, or suitable for any production use
- It is a **simple polynomial calculation** created solely for POC demonstration

**Real lithography thermal models**:
- Are proprietary and highly complex
- Require extensive calibration with actual hardware
- Involve finite element analysis, material properties, multi-physics simulation
- Are NOT simple polynomial formulas

**This module demonstrates algorithm integration and data flow, NOT real physics.**

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Module Scope](#2-module-scope)
3. [Functional Requirements](#3-functional-requirements)
4. [FICTIONAL Zeeman Model Specification](#4-fictional-zeeman-model-specification)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [External Interfaces](#6-external-interfaces)
7. [Operational Scenarios](#7-operational-scenarios)
8. [Error Handling](#8-error-handling)
9. [Glossary](#9-glossary)
10. [Appendix: Why "Zeeman" is FICTIONAL](#10-appendix-why-zeeman-is-fictional)

---

## 1. Module Overview

**BigModuleB (DistortionPredictor)** is responsible for:
- Reading temperature data from shared memory (published by BigModuleA)
- Applying the **FICTIONAL** Zeeman Thermal Expansion Model to predict distortion
- Computing 2D thermal expansion vector (X, Y displacement in nanometers)
- Sending distortion vector to BigModuleC via Apache Thrift RPC
- Logging predictions for system observability

### Position in System Architecture

```
┌────────────────────────────────────────────────┐
│  BigModuleB: DistortionPredictor               │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Shared Memory Reader                      │ │
│  │ (Read temperature from BigModuleA)        │ │
│  └─────────────┬─────────────────────────────┘ │
│                │                                │
│                ▼                                │
│  ┌───────────────────────────────────────────┐ │
│  │ ⚠️ FICTIONAL Zeeman Thermal Expansion    │ │
│  │ Model Calculator                          │ │
│  │                                            │ │
│  │ expansion_x = a0 + a1*T + a2*T^2          │ │
│  │ expansion_y = b0 + b1*T + b2*T^2          │ │
│  │                                            │ │
│  │ (Polynomial coefficients are ARBITRARY)   │ │
│  └─────────────┬─────────────────────────────┘ │
│                │                                │
│                ▼                                │
│  ┌───────────────────────────────────────────┐ │
│  │ Thrift RPC Client                         │ │
│  │ (Send DistortionVector to BigModuleC)     │ │
│  └─────────────┬─────────────────────────────┘ │
│                │                                │
│                ▼                                │
│  ┌───────────────────────────────────────────┐ │
│  │ Logger                                     │ │
│  │ (stdout, standardized format)              │ │
│  └───────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
         │
         │  DistortionVector
         │  (Thrift RPC)
         ▼
┌──────────────────────┐
│  BigModuleC          │
│  CompensationCtrl    │
└──────────────────────┘
```

### Module Boundaries

**Responsibilities** (What BigModuleB DOES):
- Temperature monitoring (read from shared memory)
- **FICTIONAL** thermal distortion prediction
- Thrift RPC client communication to BigModuleC
- Prediction logging and observability
- Startup and shutdown coordination

**Non-Responsibilities** (What BigModuleB DOES NOT do):
- Temperature sensing (that's BigModuleA)
- Compensation calculation (that's BigModuleC)
- Real thermal physics or material modeling
- Shared memory creation (only reads, does not write)
- Thrift server (BigModuleB is client, BigModuleC is server)

---

## 2. Module Scope

### In Scope

- Read temperature from shared memory at 5 Hz
- Apply **FICTIONAL** Zeeman polynomial model to compute distortion
- Send distortion vector to BigModuleC via Thrift RPC
- Log all predictions with **FICTIONAL** markings
- Module status reporting
- Graceful shutdown

### Out of Scope

- Real thermal expansion physics or finite element analysis
- Calibration with actual hardware measurements
- Multi-physics modeling (mechanical, optical, thermal coupling)
- Historical trend analysis or prediction filtering
- Shared memory writing (read-only access)
- Direct compensation calculation (that's BigModuleC's job)

---

## 3. Functional Requirements

### FR-B-01: Temperature Reading
**Description**: BigModuleB SHALL read temperature from shared memory at 5 Hz.
**Priority**: High
**Details**:
- Attach to shared memory segment `/rtdcs_shared_state` (created by BigModuleA)
- Read `SharedLithoState.reticle_temp_C` field
- Read `SharedLithoState.temp_timestamp_ns` for age checking
- Update frequency: 5 Hz (200ms period)

**Error Handling**: If shared memory not available, log error and retry every 1 second until available.

**Verification**: Integration tests verify BigModuleB can read BigModuleA's temperature data.

### FR-B-02: **⚠️ FICTIONAL** Zeeman Model Application
**Description**: BigModuleB SHALL apply the **FICTIONAL** Zeeman Thermal Expansion Model to predict distortion.
**Priority**: High
**Model Formula** (see Section 4 for detailed specification):
```
expansion_x(T) = a0 + a1 * T + a2 * T^2
expansion_y(T) = b0 + b1 * T + b2 * T^2
```
Where:
- `T` = temperature in Celsius (from shared memory)
- `expansion_x`, `expansion_y` = predicted thermal expansion in nanometers
- `a0, a1, a2, b0, b1, b2` = **ARBITRARY** polynomial coefficients

**⚠️ FICTIONAL**: This model is completely fictional and has NO relation to real physics.

**Implementation Requirement**: All code implementing this model MUST include comments marking it as **FICTIONAL**.

**Verification**: Unit tests verify polynomial calculation correctness (math only, not physics).

### FR-B-03: Distortion Vector Construction
**Description**: BigModuleB SHALL construct a `DistortionVector` structure with computed results.
**Priority**: High
**Structure** (Thrift definition):
```thrift
struct DistortionVector {
    1: double expansion_nm_x,    // X-axis expansion in nanometers
    2: double expansion_nm_y,    // Y-axis expansion in nanometers
    3: i64    timestamp_ns       // Timestamp (ns since epoch)
}
```

**Data Population**:
- `expansion_nm_x`: Result from Zeeman model X-axis calculation
- `expansion_nm_y`: Result from Zeeman model Y-axis calculation
- `timestamp_ns`: Current timestamp when prediction was made

**Verification**: Unit tests verify structure population.

### FR-B-04: Thrift RPC Communication
**Description**: BigModuleB SHALL send `DistortionVector` to BigModuleC via Thrift RPC.
**Priority**: High
**Details**:
- Connect to BigModuleC Thrift server at `localhost:9090`
- Call `ICompensationController.applyDistortion(DistortionVector)`
- Communication frequency: 5 Hz (synchronized with temperature reading)
- Timeout: 10ms per call

**Connection Handling**:
- Establish connection at startup
- If connection fails, log error and retry every 1 second
- If call fails, log warning and continue (non-blocking)

**Verification**: Integration tests verify Thrift communication with BigModuleC.

### FR-B-05: Prediction Logging
**Description**: BigModuleB SHALL log all distortion predictions.
**Priority**: High
**Log Format**:
```
[TIMESTAMP] [BigModuleB] [INFO] ⚠️ FICTIONAL Prediction: T=25.3°C → Distortion X=1.23nm, Y=0.87nm
```

**Logging Frequency**: Every prediction (5 Hz), OR every 10th prediction to reduce log volume (configurable).

**CRITICAL**: Logs MUST include "⚠️ FICTIONAL" marker to prevent confusion.

**Verification**: System tests parse logs to verify prediction logging.

### FR-B-06: Module Status Reporting
**Description**: BigModuleB SHALL maintain its running status in shared memory.
**Priority**: Medium
**Details**:
- Set `SharedLithoState.moduleb_status = 1` when operational
- Set `SharedLithoState.moduleb_status = 0` during shutdown
- Other modules can check this flag

**Verification**: Integration tests verify status flag updates.

### FR-B-07: Graceful Shutdown
**Description**: BigModuleB SHALL handle SIGTERM and SIGINT signals for graceful shutdown.
**Priority**: High
**Shutdown Sequence**:
1. Catch signal (SIGTERM or SIGINT)
2. Set `moduleb_status = 0` in shared memory
3. Close Thrift connection to BigModuleC
4. Detach from shared memory
5. Log: `"BigModuleB shutdown complete"`
6. Exit with status 0

**Verification**: System tests verify clean shutdown.

---

## 4. FICTIONAL Zeeman Model Specification

### ⚠️ CRITICAL: This Model is 100% FICTIONAL

**This section describes a FICTIONAL algorithm created solely for POC demonstration.**

### 4.1 Model Name

**Name**: "Zeeman Thermal Expansion Model"
**⚠️ FICTIONAL**: This name is intentionally fictional and misleading to emphasize the POC nature.

**Why "Zeeman"?**
- In real physics, the **Zeeman effect** is the splitting of spectral lines in a magnetic field (quantum mechanics)
- It has **NOTHING** to do with thermal expansion or lithography
- This POC uses "Zeeman" as a fictional placeholder name to clearly signal this is NOT real

**Real lithography thermal models** have names like:
- "Reticle Thermal Expansion Model (RTEM)"
- "Lens Heating Model (LHM)"
- Proprietary vendor-specific names

### 4.2 Mathematical Formula

**⚠️ FICTIONAL Formula**:
```
expansion_x(T) = a0 + a1 * T + a2 * T^2
expansion_y(T) = b0 + b1 * T + b2 * T^2
```

**Where**:
- `T` = reticle temperature in Celsius (input)
- `expansion_x` = predicted X-axis thermal expansion in nanometers (output)
- `expansion_y` = predicted Y-axis thermal expansion in nanometers (output)
- `a0, a1, a2` = X-axis polynomial coefficients (**ARBITRARY** constants)
- `b0, b1, b2` = Y-axis polynomial coefficients (**ARBITRARY** constants)

### 4.3 Coefficient Values (ARBITRARY)

**Default Coefficients** (chosen arbitrarily for demonstration):

```
a0 = 0.0       // X-axis constant term (nm)
a1 = 0.1       // X-axis linear coefficient (nm/°C)
a2 = 0.005     // X-axis quadratic coefficient (nm/°C^2)

b0 = 0.0       // Y-axis constant term (nm)
b1 = 0.08      // Y-axis linear coefficient (nm/°C)
b2 = 0.004     // Y-axis quadratic coefficient (nm/°C^2)
```

**⚠️ FICTIONAL**: These coefficients are **NOT** based on:
- Real material thermal expansion properties
- Calibration data from actual hardware
- Finite element analysis or multi-physics simulation
- Any scientific measurement or calculation

**They are arbitrary numbers chosen to produce "reasonable-looking" results for demonstration.**

### 4.4 Example Calculations

**Example 1**: T = 25.0°C (room temperature)
```
expansion_x = 0.0 + 0.1*25.0 + 0.005*25.0^2
            = 0.0 + 2.5 + 3.125
            = 5.625 nm

expansion_y = 0.0 + 0.08*25.0 + 0.004*25.0^2
            = 0.0 + 2.0 + 2.5
            = 4.5 nm
```

**Example 2**: T = 30.0°C (warmer)
```
expansion_x = 0.0 + 0.1*30.0 + 0.005*30.0^2
            = 0.0 + 3.0 + 4.5
            = 7.5 nm

expansion_y = 0.0 + 0.08*30.0 + 0.004*30.0^2
            = 0.0 + 2.4 + 3.6
            = 6.0 nm
```

**Interpretation**:
- As temperature increases, predicted expansion increases (quadratic growth)
- X and Y axes have different expansion rates (anisotropic, common in real systems)
- Magnitudes are in nanometer range (realistic scale for lithography overlay errors)

**⚠️ REMINDER**: These calculations have NO physical meaning. They are just polynomial math.

### 4.5 Validity Range

**Temperature Range**: 20.0°C to 30.0°C
**⚠️ FICTIONAL**: Outside this range, the model may produce unrealistic values, but it doesn't matter because the entire model is fictional anyway.

**Real models** would have:
- Validity ranges based on calibration data
- Error bounds and confidence intervals
- Multi-regime behavior (different formulas for different temperature ranges)

### 4.6 Implementation Requirements

**Code Comments MUST Include**:
```cpp
// ⚠️ FICTIONAL: Zeeman Thermal Expansion Model
// This is a COMPLETELY FICTIONAL algorithm created for POC demonstration.
// It is NOT based on real physics, material properties, or calibration data.
// The formula is a simple polynomial: expansion = a0 + a1*T + a2*T^2
// Coefficients are ARBITRARY and have NO physical meaning.
```

**Function Names MUST Include Marker**:
```cpp
DistortionVector calculateFictionalZeemanDistortion(double temperature_C);
// OR
DistortionVector calculateZeemanDistortion_FICTIONAL(double temperature_C);
```

**Logs MUST Include Marker**:
```
[2026-01-19T12:34:56.789] [BigModuleB] [INFO] ⚠️ FICTIONAL Zeeman Prediction: T=25.3°C → X=5.7nm, Y=4.6nm
```

**Test Names MUST Include Marker**:
```cpp
TEST(DistortionPredictorTest, FictionalZeemanModelCalculation) { ... }
```

---

## 5. Non-Functional Requirements

### NFR-B-01: Prediction Latency
**Description**: Distortion prediction SHALL be computed within minimal time.
**Target**: < 1ms from temperature read to Thrift call
**Priority**: High
**Rationale**: Simple polynomial calculation should be fast.

**Verification**: Performance tests with high-resolution timing.

### NFR-B-02: Prediction Frequency
**Description**: Predictions SHALL occur at 5 Hz (200ms period).
**Priority**: High
**Jitter Tolerance**: < 10ms

**Verification**: Performance tests measure actual frequency.

### NFR-B-03: Thrift Communication Reliability
**Description**: Thrift RPC calls SHALL succeed under normal conditions.
**Success Rate**: > 99% when BigModuleC is running
**Timeout**: 10ms per call
**Priority**: High

**Error Handling**: Log warning on failure, continue operation (non-blocking).

**Verification**: Integration tests with deliberate network issues.

### NFR-B-04: CPU Usage
**Description**: BigModuleB SHALL consume minimal CPU during operation.
**Target**: < 2% CPU usage on modern desktop CPU
**Priority**: Medium

**Verification**: Resource monitoring during system tests.

### NFR-B-05: Memory Footprint
**Description**: BigModuleB SHALL have small memory footprint.
**Target**: < 20 MB resident memory
**Priority**: Low
**Note**: Thrift library may add overhead compared to BigModuleA.

**Verification**: Memory profiling during operation.

### NFR-B-06: Code Quality
**Description**: BigModuleB SHALL follow software engineering best practices.
**Standards**:
- SOLID principles: Single Responsibility (prediction only)
- Design patterns: Strategy pattern for model implementation (future extensibility)
- Clean Code: Meaningful names, small functions, DRY
- Unit test coverage > 80%
- **ALL FICTIONAL elements marked in code**

**Priority**: High

**Verification**: Code review, static analysis, coverage reports.

### NFR-B-07: Fictional Element Marking
**Description**: All code, logs, and tests SHALL clearly mark FICTIONAL elements.
**Markers**:
- `⚠️ FICTIONAL` in comments
- `_FICTIONAL` or `Fictional` in function/class names
- `⚠️ FICTIONAL` prefix in log messages
- `FICTIONAL` in test names

**Priority**: Critical
**Rationale**: Prevent any confusion about what is real vs. demonstration.

**Verification**: Code review checklist, grep for unmarked Zeeman references.

### NFR-B-08: Portability
**Description**: BigModuleB SHALL build and run on Linux (Ubuntu 20.04+) and macOS (11.0+).

**Dependencies**:
- POSIX shared memory (`shm_open`, `mmap`)
  - Linux: Full support
  - macOS: Supported with same API
- Apache Thrift C++ library (0.19.0)
  - Linux: Install via `apt install libthrift-dev` or build from source
  - macOS: Install via `brew install thrift`
- Standard C++ (C++14 or later)
  - Linux: GCC 7+ or Clang 6+
  - macOS: Clang (Xcode Command Line Tools)

**Platform-Specific Notes**:
- Thrift library paths differ between platforms (handled by Makefile detection)
- No platform-specific code needed (Thrift and POSIX APIs are portable)

**Priority**: Medium

**Verification**: Build and run on both Linux and macOS.

---

## 6. External Interfaces

### 6.1 Shared Memory Interface (Input)

**Interface Type**: POSIX Shared Memory (Reader)
**Segment Name**: `/rtdcs_shared_state`
**Access Mode**: Read-only

**Data Read by BigModuleB**:
```cpp
struct SharedLithoState {
    // Temperature data (read by BigModuleB)
    double   reticle_temp_C;       // Temperature in Celsius
    int64_t  temp_timestamp_ns;    // Timestamp (ns since epoch)

    // Status (read by BigModuleB)
    uint32_t modulea_status;       // Check if BigModuleA is running

    // Status (written by BigModuleB)
    uint32_t moduleb_status;       // 1=running, 0=stopped

    // Other fields (not used by BigModuleB):
    double   compensation_offset_nm_x;
    double   compensation_offset_nm_y;
    int64_t  comp_timestamp_ns;
    uint32_t modulec_status;
    uint8_t  reserved[4000];
};
```

**Read Frequency**: 5 Hz (every 200ms)
**Synchronization**: None required (single writer, multiple readers)

### 6.2 Thrift RPC Interface (Output)

**Interface Type**: Apache Thrift Client
**Server**: BigModuleC at `localhost:9090`
**Protocol**: Binary protocol
**Transport**: TCP socket

**Service Used**:
```thrift
service ICompensationController {
    void applyDistortion(1: DistortionVector distortion)
}

struct DistortionVector {
    1: double expansion_nm_x,    // ⚠️ FICTIONAL prediction
    2: double expansion_nm_y,    // ⚠️ FICTIONAL prediction
    3: i64    timestamp_ns       // When prediction was made
}
```

**Call Pattern**:
- Asynchronous (fire-and-forget)
- Frequency: 5 Hz (synchronized with temperature read)
- Timeout: 10ms
- No return value expected

**Connection Management**:
- Establish connection at startup
- Maintain persistent connection (reconnect on failure)
- Close gracefully on shutdown

### 6.3 Logging Interface (Output)

**Interface Type**: stdout
**Format**: `[TIMESTAMP] [BigModuleB] [LEVEL] Message`
**Levels**: INFO, WARNING, ERROR

**Key Log Messages**:
```
[2026-01-19T12:34:56.100] [BigModuleB] [INFO] BigModuleB starting, PID=5678
[2026-01-19T12:34:56.150] [BigModuleB] [INFO] Shared memory attached: /rtdcs_shared_state
[2026-01-19T12:34:56.200] [BigModuleB] [INFO] Thrift client connected to BigModuleC at localhost:9090
[2026-01-19T12:34:56.250] [BigModuleB] [INFO] BigModuleB READY
[2026-01-19T12:34:57.250] [BigModuleB] [INFO] ⚠️ FICTIONAL Zeeman Prediction: T=25.3°C → X=5.7nm, Y=4.6nm
[2026-01-19T12:35:10.500] [BigModuleB] [INFO] Shutdown signal received, stopping...
[2026-01-19T12:35:10.505] [BigModuleB] [INFO] BigModuleB shutdown complete
```

**⚠️ CRITICAL**: Prediction logs MUST include "⚠️ FICTIONAL" marker.

### 6.4 Command-Line Interface (Input)

**Interface Type**: Command-line arguments (optional)
**Purpose**: Configure prediction behavior

**Arguments**:
- `--server-host <hostname>`: BigModuleC server hostname (default: localhost)
- `--server-port <port>`: BigModuleC server port (default: 9090)
- `--prediction-rate <hz>`: Prediction frequency in Hz (default: 5)
- `--log-interval <n>`: Log every N-th prediction (default: 1 = log all, 10 = log every 10th)
- `--help`: Display usage information

**Example**:
```bash
./BigModuleB --server-port 9090 --prediction-rate 5 --log-interval 10
```

### 6.5 Signal Interface (Input)

**Interface Type**: POSIX signals
**Signals Handled**:
- `SIGTERM`: Graceful shutdown
- `SIGINT`: Graceful shutdown (Ctrl+C)

**Behavior**: Trigger shutdown sequence (FR-B-07)

---

## 7. Operational Scenarios

### Scenario 1: Normal Operation

**Preconditions**: BigModuleA running, BigModuleC running and ready
**Steps**:
1. User executes: `./BigModuleB`
2. BigModuleB attaches to shared memory `/rtdcs_shared_state`
3. BigModuleB connects to BigModuleC Thrift server at `localhost:9090`
4. BigModuleB sets `moduleb_status = 1`
5. BigModuleB logs: `"BigModuleB READY"`
6. BigModuleB enters main loop (5 Hz):
   - Read temperature from shared memory
   - Apply **FICTIONAL** Zeeman model: compute distortion vector
   - Send `DistortionVector` to BigModuleC via Thrift
   - Log prediction (with ⚠️ FICTIONAL marker)
   - Sleep for 200ms
7. Loop continues until shutdown

**Expected Behavior**:
- Predictions at 5 Hz
- All predictions logged with **FICTIONAL** markers
- Thrift calls succeed (BigModuleC processes them)
- End-to-end latency < 100ms (temperature update → compensation applied)

### Scenario 2: BigModuleA Not Ready

**Preconditions**: BigModuleA not started yet
**Steps**:
1. User executes: `./BigModuleB`
2. BigModuleB attempts to attach to shared memory
3. Attachment fails (segment does not exist)
4. BigModuleB logs: `"WARNING: Shared memory not available, waiting for BigModuleA..."`
5. BigModuleB retries every 1 second
6. User starts BigModuleA
7. BigModuleA creates shared memory
8. BigModuleB successfully attaches
9. BigModuleB logs: `"Shared memory attached: /rtdcs_shared_state"`
10. BigModuleB proceeds to normal operation

**Expected Behavior**:
- Graceful retry until shared memory available
- No crash or abnormal exit
- Automatic recovery when BigModuleA becomes available

### Scenario 3: BigModuleC Not Responding

**Preconditions**: BigModuleA running, BigModuleC NOT running
**Steps**:
1. User executes: `./BigModuleB`
2. BigModuleB attaches to shared memory (success)
3. BigModuleB attempts to connect to BigModuleC at `localhost:9090`
4. Connection fails (BigModuleC not listening)
5. BigModuleB logs: `"WARNING: Thrift connection failed, retrying..."`
6. BigModuleB retries connection every 1 second
7. BigModuleB continues reading temperature and computing predictions
8. Predictions logged but NOT sent (connection unavailable)
9. User starts BigModuleC
10. BigModuleB successfully connects
11. BigModuleB logs: `"Thrift client connected to BigModuleC at localhost:9090"`
12. BigModuleB resumes sending predictions

**Expected Behavior**:
- Non-blocking operation (continues even if BigModuleC unavailable)
- Automatic reconnection when BigModuleC becomes available
- No crash or data loss

### Scenario 4: Shutdown

**Preconditions**: BigModuleB running normally
**Steps**:
1. User sends SIGTERM: `kill -TERM <pid>`
2. BigModuleB catches signal
3. BigModuleB exits main loop
4. BigModuleB sets `moduleb_status = 0`
5. BigModuleB closes Thrift connection
6. BigModuleB detaches from shared memory
7. BigModuleB logs: `"BigModuleB shutdown complete"`
8. BigModuleB exits with status 0

**Expected Behavior**:
- Clean shutdown within 200ms
- No resource leaks
- All logs written

---

## 8. Error Handling

### Error 1: Shared Memory Attachment Failure

**Condition**: `shm_open()` or `mmap()` fails
**Handling**:
1. Log: `"WARNING: Shared memory not available, waiting for BigModuleA..."`
2. Retry every 1 second
3. Continue retrying until success (blocking startup)

**Prevention**: Start BigModuleA before BigModuleB.

### Error 2: Thrift Connection Failure

**Condition**: Cannot connect to BigModuleC server
**Handling**:
1. Log: `"WARNING: Thrift connection failed, retrying..."`
2. Retry every 1 second
3. Continue normal operation (read temperature, compute predictions)
4. Skip Thrift call until connection established

**Recovery**: Automatic reconnection when BigModuleC becomes available.

### Error 3: Thrift Call Timeout

**Condition**: `applyDistortion()` call exceeds 10ms timeout
**Handling**:
1. Log: `"WARNING: Thrift call timeout, skipping this prediction"`
2. Continue to next prediction cycle
3. Maintain connection (timeout is non-fatal)

**Prevention**: BigModuleC should process calls quickly (< 5ms).

### Error 4: Invalid Temperature Reading

**Condition**: Temperature value is unrealistic (e.g., < 0°C or > 100°C)
**Handling**:
1. Log: `"WARNING: Invalid temperature T=<value>, skipping prediction"`
2. Skip prediction for this cycle
3. Continue to next cycle

**Validation Range**: 0.0°C to 50.0°C (sanity check)

**Note**: Since temperature is simulated by BigModuleA, this error is unlikely.

---

## 9. Glossary

| Term | Definition |
|------|------------|
| **BigModuleB** | DistortionPredictor module - this module |
| **⚠️ Zeeman Model** | **FICTIONAL** thermal expansion algorithm (polynomial-based, NOT real physics) |
| **Thermal Distortion** | Pattern deformation due to temperature-induced expansion (in real lithography) |
| **Distortion Vector** | 2D displacement (X, Y) in nanometers representing **FICTIONAL** predicted expansion |
| **Thrift RPC** | Apache Thrift remote procedure call framework |
| **Thrift Client** | BigModuleB's role in Thrift communication (calls BigModuleC server) |
| **ICompensationController** | Thrift service interface provided by BigModuleC |
| **Polynomial Coefficients** | a0, a1, a2, b0, b1, b2 - **ARBITRARY** constants in FICTIONAL model |
| **5 Hz** | Prediction frequency: 5 times per second (200ms period) |
| **Anisotropic** | Different behavior in X vs. Y directions (X and Y have different expansion rates) |
| **Fire-and-Forget** | Asynchronous call pattern: send data without waiting for response |

---

## 10. Appendix: Why "Zeeman" is FICTIONAL

### Real Zeeman Effect (Quantum Physics)

The **actual Zeeman effect**, discovered by Pieter Zeeman in 1896:
- Describes the splitting of spectral lines of atoms in a magnetic field
- A quantum mechanical phenomenon
- Used in spectroscopy, astrophysics, and magnetic resonance
- **Has NOTHING to do with thermal expansion or lithography**

### Why This POC Uses "Zeeman"

**Intentional Misdirection**:
- The name "Zeeman" is used to make it obvious this is NOT a real lithography algorithm
- Anyone familiar with physics will immediately recognize the mismatch
- Emphasizes the POC/demonstration nature

**Better Alternatives for Real Projects**:
- "Reticle Thermal Expansion Model (RTEM)"
- "Thermal Distortion Predictor (TDP)"
- "Linear Thermal Model (LTM)"
- Vendor-specific proprietary names

### Real Lithography Thermal Models

**What real models involve**:
- Finite element analysis (FEA) of reticle and mask structures
- Material properties (coefficient of thermal expansion for specific materials)
- Multi-physics coupling (thermal, mechanical, optical)
- Extensive calibration with hardware measurements
- Dynamic models accounting for thermal lag and transient behavior
- Spatially-varying models (different expansion at different reticle locations)

**Complexity**:
- Thousands to millions of degrees of freedom (mesh points in FEA)
- Real-time model order reduction for online use
- Proprietary vendor IP (ASML, Nikon, Canon)

**This POC's polynomial formula is 0.001% of the complexity of a real model.**

---

## Document Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-19 | Architect Agent | Initial BigModuleB EPS created with FICTIONAL Zeeman model |

---

**Related Documents**:
- `rtdcs-system-eps.md` - System-Level External Product Specification
- `rtdcs-modulea-eps.md` - BigModuleA (ThermalMonitor) EPS
- `rtdcs-modulec-eps.md` - BigModuleC (CompensationController) EPS
- `rtdcs-moduleb-eds.md` - BigModuleB External Design Specification (TBD)

---

**End of BigModuleB EPS**
