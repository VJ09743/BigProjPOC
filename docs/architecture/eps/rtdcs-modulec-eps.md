# BigModuleC (CompensationController) External Product Specification (EPS)

**Project**: Reticle Thermal Distortion Compensation System (RTDCS)
**Module**: BigModuleC - CompensationController
**Document Type**: Module-Level External Product Specification (EPS)
**Version**: 1.0
**Date**: 2026-01-19
**Author**: Architect Agent
**Status**: Draft - Awaiting Review

---

## ⚠️ CRITICAL DISCLAIMER: FICTIONAL PROOF-OF-CONCEPT

**This module is part of a PROOF-OF-CONCEPT (POC) project.**

**FICTIONAL ELEMENTS IN THIS MODULE**:
- The compensation strategy (simple negation) is **OVERLY SIMPLIFIED**
- Real compensation systems use sophisticated control algorithms (feedforward, feedback, multi-variable control)
- This module demonstrates RPC server implementation and data flow, NOT real control theory

**Real lithography compensation controllers**:
- Use advanced control algorithms (PID, model predictive control, adaptive control)
- Include dynamic models, state estimators, and disturbance rejection
- Coordinate multi-axis actuators with sub-nanometer precision
- Interface with real-time motion control hardware

**This module demonstrates software architecture, NOT production control systems.**

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

**BigModuleC (CompensationController)** is responsible for:
- Providing Thrift RPC server interface for receiving distortion predictions
- Calculating compensation offsets from distortion vectors (simple negation strategy)
- Writing compensation offsets to shared memory for system observability
- Logging all compensation actions
- Managing startup and shutdown coordination

### Position in System Architecture

```
┌────────────────────────────────────────────────┐
│  BigModuleC: CompensationController            │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Thrift RPC Server                         │ │
│  │ (ICompensationController service)         │ │
│  │ Port: 9090                                 │ │
│  │                                            │ │
│  │ Method: applyDistortion(DistortionVector) │ │
│  └─────────────┬─────────────────────────────┘ │
│                │ Receives from BigModuleB      │
│                ▼                                │
│  ┌───────────────────────────────────────────┐ │
│  │ Compensation Calculator                   │ │
│  │ (Simple negation strategy)                │ │
│  │                                            │ │
│  │ offset_x = -distortion_x                  │ │
│  │ offset_y = -distortion_y                  │ │
│  └─────────────┬─────────────────────────────┘ │
│                │                                │
│                ▼                                │
│  ┌───────────────────────────────────────────┐ │
│  │ Shared Memory Writer                      │ │
│  │ (Write compensation offsets)              │ │
│  └─────────────┬─────────────────────────────┘ │
│                │                                │
│                ▼                                │
│  ┌───────────────────────────────────────────┐ │
│  │ Logger                                     │ │
│  │ (stdout, standardized format)              │ │
│  └───────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
         │
         │  Compensation offsets
         ▼
┌─────────────────────────┐
│  Shared Memory          │
│  /rtdcs_shared_state    │
│                         │
│  Observable by:         │
│  - System tests         │
│  - Monitoring tools     │
└─────────────────────────┘
```

### Module Boundaries

**Responsibilities** (What BigModuleC DOES):
- Thrift RPC server implementation (`ICompensationController` service)
- Compensation offset calculation (simple negation strategy)
- Shared memory write access (compensation fields only)
- Logging of compensation actions
- Startup and shutdown coordination

**Non-Responsibilities** (What BigModuleC DOES NOT do):
- Temperature sensing (that's BigModuleA)
- Thermal distortion prediction (that's BigModuleB)
- Real actuator control or hardware interfacing
- Advanced control algorithms (PID, MPC, etc.) - POC uses simple negation
- Shared memory creation (only writes, does not own)

---

## 2. Module Scope

### In Scope

- Thrift RPC server on port 9090
- `applyDistortion()` method implementation
- Simple compensation strategy: `offset = -distortion`
- Write compensation offsets to shared memory
- Timestamp management
- Module status reporting
- Graceful shutdown

### Out of Scope

- Real actuator hardware interfacing
- Advanced control theory (PID, state feedback, adaptive control)
- Compensation history tracking or optimization
- Calibration or learning algorithms
- Multi-axis coordination beyond simple 2D (X, Y) offsets
- Safety interlock systems

---

## 3. Functional Requirements

### FR-C-01: Thrift RPC Server
**Description**: BigModuleC SHALL provide a Thrift RPC server implementing `ICompensationController` service.
**Priority**: High
**Details**:
- Service name: `ICompensationController`
- Port: 9090 (TCP)
- Protocol: Binary protocol
- Transport: Buffered transport over TCP socket
- Listen on: `localhost` (or `0.0.0.0` for all interfaces)

**Server Lifecycle**:
- Start server during module initialization
- Accept connections from BigModuleB (Thrift client)
- Stop server during graceful shutdown

**Error Handling**: If port 9090 is already in use, log error and exit with non-zero status.

**Verification**: Integration tests verify BigModuleB can connect and call methods.

### FR-C-02: applyDistortion() Method
**Description**: BigModuleC SHALL implement the `applyDistortion()` Thrift service method.
**Priority**: High
**Method Signature** (Thrift IDL):
```thrift
service ICompensationController {
    void applyDistortion(1: DistortionVector distortion)
}

struct DistortionVector {
    1: double expansion_nm_x,    // Distortion from BigModuleB
    2: double expansion_nm_y,    // Distortion from BigModuleB
    3: i64    timestamp_ns       // When prediction was made
}
```

**Method Behavior**:
1. Receive `DistortionVector` from BigModuleB
2. Extract `expansion_nm_x`, `expansion_nm_y`, `timestamp_ns`
3. Calculate compensation offsets (see FR-C-03)
4. Write offsets to shared memory (see FR-C-04)
5. Log compensation action (see FR-C-05)
6. Return (void method)

**Performance Requirement**: Method SHALL complete within < 5ms (non-blocking).

**Verification**: Unit tests verify method logic; integration tests verify end-to-end RPC communication.

### FR-C-03: Compensation Calculation
**Description**: BigModuleC SHALL calculate compensation offsets using simple negation strategy.
**Priority**: High
**Algorithm** (⚠️ FICTIONAL - overly simplified):
```
offset_x = -distortion_x
offset_y = -distortion_y
```

**Rationale**:
- Simple feedforward strategy: directly counteract predicted distortion
- Real systems would use more sophisticated algorithms (PID, model-based control)
- Sufficient for POC demonstration purposes

**Input**:
- `distortion_x` (nanometers) from `DistortionVector.expansion_nm_x`
- `distortion_y` (nanometers) from `DistortionVector.expansion_nm_y`

**Output**:
- `offset_x` (nanometers) to be written to shared memory
- `offset_y` (nanometers) to be written to shared memory

**Example**:
```
Input:  distortion_x = +5.7 nm, distortion_y = +4.6 nm
Output: offset_x = -5.7 nm, offset_y = -4.6 nm
```

**⚠️ FICTIONAL**: Real compensation would account for actuator dynamics, sensor feedback, disturbance rejection, multi-variable coupling, etc.

**Verification**: Unit tests verify negation calculation.

### FR-C-04: Shared Memory Write
**Description**: BigModuleC SHALL write compensation offsets to shared memory.
**Priority**: High
**Details**:
- Attach to shared memory segment `/rtdcs_shared_state` (created by BigModuleA)
- Write `SharedLithoState.compensation_offset_nm_x`
- Write `SharedLithoState.compensation_offset_nm_y`
- Write `SharedLithoState.comp_timestamp_ns` (current timestamp)
- Use memory barriers to ensure visibility

**Write Frequency**: On-demand (triggered by `applyDistortion()` calls, typically 5 Hz from BigModuleB).

**Data Consistency**: No locking required (single writer for compensation fields).

**Verification**: Integration tests verify BigModuleC writes are observable in shared memory.

### FR-C-05: Compensation Logging
**Description**: BigModuleC SHALL log all compensation actions.
**Priority**: High
**Log Format**:
```
[TIMESTAMP] [BigModuleC] [INFO] Compensation applied: Distortion(X=5.7nm, Y=4.6nm) → Offset(X=-5.7nm, Y=-4.6nm)
```

**Logging Frequency**: Every compensation action (typically 5 Hz).

**Optional**: Log every N-th action to reduce log volume (configurable).

**Verification**: System tests parse logs to verify compensation logging.

### FR-C-06: Module Status Reporting
**Description**: BigModuleC SHALL maintain its running status in shared memory.
**Priority**: Medium
**Details**:
- Set `SharedLithoState.modulec_status = 1` when operational (Thrift server ready)
- Set `SharedLithoState.modulec_status = 0` during shutdown
- Other modules can check this flag

**Verification**: Integration tests verify status flag updates.

### FR-C-07: Graceful Shutdown
**Description**: BigModuleC SHALL handle SIGTERM and SIGINT signals for graceful shutdown.
**Priority**: High
**Shutdown Sequence**:
1. Catch signal (SIGTERM or SIGINT)
2. Set `modulec_status = 0` in shared memory
3. Stop Thrift server (close listening socket, reject new connections)
4. Wait for pending RPC calls to complete (timeout: 1 second)
5. Detach from shared memory
6. Log: `"BigModuleC shutdown complete"`
7. Exit with status 0

**Verification**: System tests verify clean shutdown and no hung connections.

---

## 4. Non-Functional Requirements

### NFR-C-01: RPC Processing Latency
**Description**: `applyDistortion()` method SHALL process requests quickly.
**Target**: < 5ms per call (from receive to return)
**Priority**: High
**Rationale**: Enables real-time system operation at 5 Hz frequency.

**Verification**: Performance tests with high-resolution timing.

### NFR-C-02: Concurrent Request Handling
**Description**: Thrift server SHALL handle concurrent requests if needed.
**Details**:
- Single-threaded server sufficient for POC (BigModuleB is the only client, 5 Hz rate)
- Thread pool optional for future scalability

**Priority**: Low (single client in POC)

**Verification**: Load tests with multiple concurrent clients (optional).

### NFR-C-03: Server Startup Time
**Description**: Thrift server SHALL become ready quickly.
**Target**: < 100ms from process start to server listening
**Priority**: Medium

**Verification**: System tests measure time to READY state.

### NFR-C-04: CPU Usage
**Description**: BigModuleC SHALL consume minimal CPU during idle periods.
**Target**: < 1% CPU usage when no RPC calls
**Priority**: Medium
**Implementation Guidance**: Event-driven Thrift server (blocking on socket accept).

**Verification**: Resource monitoring during system tests.

### NFR-C-05: Memory Footprint
**Description**: BigModuleC SHALL have small memory footprint.
**Target**: < 20 MB resident memory
**Priority**: Low

**Verification**: Memory profiling during operation.

### NFR-C-06: Code Quality
**Description**: BigModuleC SHALL follow software engineering best practices.
**Standards**:
- SOLID principles: Single Responsibility (compensation calculation only)
- Design patterns: Command pattern for compensation actions (future extensibility)
- Clean Code: Meaningful names, small functions, DRY
- Unit test coverage > 80%

**Priority**: High

**Verification**: Code review, static analysis, coverage reports.

### NFR-C-07: Portability
**Description**: BigModuleC SHALL build and run on Linux (Ubuntu 20.04+).
**Dependencies**:
- Apache Thrift C++ library (0.19.0)
- POSIX shared memory (`shm_open`, `mmap`)
- Standard C++ (C++14 or later)

**Priority**: Medium

**Verification**: Build and run on target platform.

---

## 5. External Interfaces

### 5.1 Thrift RPC Interface (Input)

**Interface Type**: Apache Thrift Server
**Port**: 9090 (TCP)
**Protocol**: Binary protocol
**Service Provided**: `ICompensationController`

**Service Definition** (Thrift IDL):
```thrift
namespace cpp rtdcs.modulec

struct DistortionVector {
    1: double expansion_nm_x,    // X-axis expansion in nanometers
    2: double expansion_nm_y,    // Y-axis expansion in nanometers
    3: i64    timestamp_ns       // Timestamp (ns since epoch)
}

service ICompensationController {
    void applyDistortion(1: DistortionVector distortion)
}
```

**Method: applyDistortion()**
- **Input**: `DistortionVector` structure with distortion predictions from BigModuleB
- **Output**: None (void)
- **Side Effect**: Writes compensation offsets to shared memory, logs action

**Client**: BigModuleB (DistortionPredictor) calls this method at 5 Hz.

**Connection Pattern**: Persistent connection (BigModuleB maintains TCP connection).

### 5.2 Shared Memory Interface (Output)

**Interface Type**: POSIX Shared Memory (Writer)
**Segment Name**: `/rtdcs_shared_state`
**Access Mode**: Read/Write (compensation fields only)

**Data Written by BigModuleC**:
```cpp
struct SharedLithoState {
    // Fields managed by other modules (BigModuleC does not touch):
    double   reticle_temp_C;       // Written by BigModuleA
    int64_t  temp_timestamp_ns;    // Written by BigModuleA
    uint32_t modulea_status;       // Written by BigModuleA
    uint32_t moduleb_status;       // Written by BigModuleB

    // Compensation data (written by BigModuleC)
    double   compensation_offset_nm_x;  // X-axis offset in nanometers
    double   compensation_offset_nm_y;  // Y-axis offset in nanometers
    int64_t  comp_timestamp_ns;         // Timestamp when compensation calculated

    // Status (written by BigModuleC)
    uint32_t modulec_status;       // 1=running, 0=stopped

    // Reserved
    uint8_t  reserved[4000];
};
```

**Write Frequency**: On-demand (triggered by RPC calls, typically 5 Hz).
**Synchronization**: None required (single writer for compensation fields).

### 5.3 Logging Interface (Output)

**Interface Type**: stdout
**Format**: `[TIMESTAMP] [BigModuleC] [LEVEL] Message`
**Levels**: INFO, WARNING, ERROR

**Key Log Messages**:
```
[2026-01-19T12:34:56.200] [BigModuleC] [INFO] BigModuleC starting, PID=9012
[2026-01-19T12:34:56.250] [BigModuleC] [INFO] Shared memory attached: /rtdcs_shared_state
[2026-01-19T12:34:56.300] [BigModuleC] [INFO] Thrift server listening on port 9090
[2026-01-19T12:34:56.350] [BigModuleC] [INFO] BigModuleC READY
[2026-01-19T12:34:57.350] [BigModuleC] [INFO] Compensation applied: Distortion(X=5.7nm, Y=4.6nm) → Offset(X=-5.7nm, Y=-4.6nm)
[2026-01-19T12:35:10.500] [BigModuleC] [INFO] Shutdown signal received, stopping Thrift server...
[2026-01-19T12:35:10.550] [BigModuleC] [INFO] BigModuleC shutdown complete
```

### 5.4 Command-Line Interface (Input)

**Interface Type**: Command-line arguments (optional)
**Purpose**: Configure server behavior

**Arguments**:
- `--port <port>`: Thrift server port (default: 9090)
- `--log-interval <n>`: Log every N-th compensation (default: 1 = log all)
- `--help`: Display usage information

**Example**:
```bash
./BigModuleC --port 9090 --log-interval 10
```

### 5.5 Signal Interface (Input)

**Interface Type**: POSIX signals
**Signals Handled**:
- `SIGTERM`: Graceful shutdown
- `SIGINT`: Graceful shutdown (Ctrl+C)

**Behavior**: Trigger shutdown sequence (FR-C-07)

---

## 6. Operational Scenarios

### Scenario 1: Normal Startup and Operation

**Preconditions**: BigModuleA running (shared memory available)
**Steps**:
1. User executes: `./BigModuleC`
2. BigModuleC attaches to shared memory `/rtdcs_shared_state`
3. BigModuleC starts Thrift server on port 9090
4. BigModuleC sets `modulec_status = 1`
5. BigModuleC logs: `"Thrift server listening on port 9090"`
6. BigModuleC logs: `"BigModuleC READY"`
7. BigModuleC waits for RPC calls (blocking on socket accept)
8. BigModuleB connects and calls `applyDistortion(distortion)`
9. BigModuleC receives call:
   - Extracts distortion: `X=5.7nm, Y=4.6nm`
   - Calculates compensation: `offset_x=-5.7nm, offset_y=-4.6nm`
   - Writes offsets to shared memory
   - Logs: `"Compensation applied: Distortion(X=5.7nm, Y=4.6nm) → Offset(X=-5.7nm, Y=-4.6nm)"`
   - Returns (void)
10. Process repeats for each RPC call (5 Hz from BigModuleB)

**Expected Behavior**:
- Thrift server responsive to BigModuleB calls
- Compensation offsets written to shared memory
- All actions logged
- CPU usage minimal between calls

### Scenario 2: BigModuleA Not Ready

**Preconditions**: BigModuleA not started yet
**Steps**:
1. User executes: `./BigModuleC`
2. BigModuleC attempts to attach to shared memory
3. Attachment fails (segment does not exist)
4. BigModuleC logs: `"WARNING: Shared memory not available, waiting for BigModuleA..."`
5. BigModuleC retries every 1 second
6. User starts BigModuleA
7. BigModuleA creates shared memory
8. BigModuleC successfully attaches
9. BigModuleC logs: `"Shared memory attached: /rtdcs_shared_state"`
10. BigModuleC starts Thrift server and proceeds to normal operation

**Expected Behavior**:
- Graceful retry until shared memory available
- No crash or abnormal exit
- Automatic recovery when BigModuleA becomes available

### Scenario 3: Port Already in Use

**Preconditions**: Another process is listening on port 9090
**Steps**:
1. User executes: `./BigModuleC`
2. BigModuleC attempts to start Thrift server on port 9090
3. Server start fails (port already in use)
4. BigModuleC logs: `"ERROR: Failed to start Thrift server on port 9090: Address already in use"`
5. BigModuleC exits with status 1

**Expected Behavior**:
- Clear error message indicating port conflict
- Non-zero exit status
- User should terminate conflicting process or use `--port` to specify different port

### Scenario 4: Shutdown

**Preconditions**: BigModuleC running normally
**Steps**:
1. User sends SIGTERM: `kill -TERM <pid>`
2. BigModuleC catches signal
3. BigModuleC sets `modulec_status = 0`
4. BigModuleC stops Thrift server:
   - Close listening socket
   - Wait for pending RPC calls to complete (up to 1 second timeout)
5. BigModuleC detaches from shared memory
6. BigModuleC logs: `"BigModuleC shutdown complete"`
7. BigModuleC exits with status 0

**Expected Behavior**:
- Clean shutdown within 1-2 seconds
- No hung connections
- All resources released

---

## 7. Error Handling

### Error 1: Shared Memory Attachment Failure

**Condition**: `shm_open()` or `mmap()` fails
**Handling**:
1. Log: `"WARNING: Shared memory not available, waiting for BigModuleA..."`
2. Retry every 1 second
3. Continue retrying until success (blocking startup)

**Prevention**: Start BigModuleA before BigModuleC.

### Error 2: Thrift Server Start Failure

**Condition**: Cannot bind to port 9090 (port already in use)
**Handling**:
1. Log: `"ERROR: Failed to start Thrift server on port 9090: <error details>"`
2. Detach from shared memory
3. Exit with status 1

**Recovery**: User must free port 9090 or use `--port` option.

### Error 3: Invalid Distortion Values

**Condition**: Received distortion values are unrealistic (e.g., > 1000 nm)
**Handling**:
1. Log: `"WARNING: Invalid distortion values X=<val>, Y=<val>, skipping compensation"`
2. Do NOT write to shared memory
3. Return from RPC call normally (don't crash)

**Validation Range**: -1000 nm to +1000 nm (sanity check)

**Note**: Since BigModuleB generates distortions, this error is unlikely.

### Error 4: Shared Memory Write Failure

**Condition**: Write to shared memory fails (extremely rare)
**Handling**:
1. Log: `"ERROR: Failed to write compensation to shared memory"`
2. Continue operation (non-fatal, next cycle may succeed)

**Prevention**: Proper shared memory initialization by BigModuleA.

---

## 8. Glossary

| Term | Definition |
|------|------------|
| **BigModuleC** | CompensationController module - this module |
| **Compensation Offset** | Correction value (in nanometers) to counteract thermal distortion |
| **Negation Strategy** | Simple control strategy: `offset = -distortion` (⚠️ FICTIONAL - overly simplified) |
| **Thrift RPC** | Apache Thrift remote procedure call framework |
| **Thrift Server** | BigModuleC's role in Thrift communication (provides service to BigModuleB client) |
| **ICompensationController** | Thrift service interface provided by BigModuleC |
| **applyDistortion()** | Thrift service method that receives distortion and calculates compensation |
| **DistortionVector** | Thrift structure containing X/Y expansion predictions from BigModuleB |
| **Port 9090** | TCP port where BigModuleC Thrift server listens |
| **Fire-and-Forget** | Communication pattern: BigModuleB sends data without expecting response (void method) |
| **Feedforward Control** | Control strategy that acts on predictions (distortion) before error occurs (⚠️ SIMPLIFIED) |

---

## Document Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-19 | Architect Agent | Initial BigModuleC EPS created |

---

**Related Documents**:
- `rtdcs-system-eps.md` - System-Level External Product Specification
- `rtdcs-modulea-eps.md` - BigModuleA (ThermalMonitor) EPS
- `rtdcs-moduleb-eps.md` - BigModuleB (DistortionPredictor) EPS
- `rtdcs-modulec-eds.md` - BigModuleC External Design Specification (TBD)

---

**End of BigModuleC EPS**
