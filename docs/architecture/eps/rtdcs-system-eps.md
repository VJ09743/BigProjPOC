# RTDCS System-Level External Product Specification (EPS)

**Project**: Reticle Thermal Distortion Compensation System (RTDCS)
**Document Type**: System-Level External Product Specification (EPS)
**Version**: 1.0
**Date**: 2026-01-19
**Author**: Architect Agent
**Status**: Draft - Awaiting Review

---

## ⚠️ CRITICAL DISCLAIMER: FICTIONAL PROOF-OF-CONCEPT

**This is a PROOF-OF-CONCEPT (POC) project for demonstrating multi-agent workflow, build systems, and release processes.**

**FICTIONAL ELEMENTS**:
- The **Zeeman Thermal Expansion Model** is **COMPLETELY FICTIONAL**
- It is NOT based on real lithography physics or the actual Zeeman effect
- Created solely to demonstrate inter-module communication and algorithm implementation
- Real lithography systems use proprietary thermal models based on extensive calibration

**This POC demonstrates software engineering practices, NOT real lithography algorithms.**

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [System Scope](#2-system-scope)
3. [System-Level Functional Requirements](#3-system-level-functional-requirements)
4. [System-Level Non-Functional Requirements](#4-system-level-non-functional-requirements)
5. [System Architecture Overview](#5-system-architecture-overview)
6. [Inter-Module Interfaces](#6-inter-module-interfaces)
7. [System Use Cases](#7-system-use-cases)
8. [Module Responsibilities](#8-module-responsibilities)
9. [Glossary](#9-glossary)
10. [Appendix: FICTIONAL Elements Summary](#10-appendix-fictional-elements-summary)

---

## 1. System Overview

The **Reticle Thermal Distortion Compensation System (RTDCS)** is a multi-module real-time system designed to:
1. Monitor reticle temperature in real-time
2. Predict thermal distortion using a **FICTIONAL** thermal expansion model
3. Calculate and apply compensation offsets

### System Context

This system operates within a lithography machine environment where:
- Reticle temperature varies during exposure operations
- Temperature changes cause thermal expansion affecting overlay accuracy
- Compensation is required to maintain sub-nanometer precision

**⚠️ FICTIONAL**: The thermal expansion model used in this POC is fictional and created for demonstration purposes only.

### System Goals

1. Demonstrate multi-module architecture with clear separation of concerns
2. Show inter-module communication patterns (shared memory + Thrift RPC)
3. Implement real-time data flow with observable logging
4. Validate build system, testing, and release processes

---

## 2. System Scope

### In Scope (System Level)

- Multi-module system architecture (3 independent modules)
- Inter-module communication infrastructure
  - Shared memory (POSIX) for high-frequency data exchange
  - Apache Thrift RPC for command/control and computed results
- System-level workflow orchestration
- System-level logging and observability
- Real-time performance requirements
- Build system integration across modules
- System test framework

### Out of Scope (System Level)

- Hardware integration with actual lithography equipment
- Real thermal sensor drivers
- Reticle stage actuator control
- GUI or HMI
- Factory automation (SECS/GEM) integration
- Historical data storage or analytics
- Safety interlock systems

### Module Boundaries

- **BigModuleA**: Temperature monitoring and data acquisition
- **BigModuleB**: Thermal distortion prediction algorithms
- **BigModuleC**: Compensation calculation and offset generation

See individual module EPS documents for detailed requirements.

---

## 3. System-Level Functional Requirements

### FR-SYS-01: Multi-Module Architecture
**Description**: The system SHALL consist of three independent executable modules.
**Priority**: High
**Rationale**: Demonstrates modular architecture and inter-process communication.

### FR-SYS-02: Shared Memory Communication
**Description**: The system SHALL use POSIX shared memory for high-frequency data exchange between modules.
**Priority**: High
**Details**:
- Shared memory segment name: `/rtdcs_shared_state`
- Contains: temperature, compensation offsets, timestamps, status flags
- Read/write synchronization using memory barriers

### FR-SYS-03: Thrift RPC Communication
**Description**: The system SHALL use Apache Thrift for command/control and computed result communication.
**Priority**: High
**Details**:
- BigModuleB → BigModuleC: Distortion vector via Thrift
- Enables structured data exchange with versioning support

### FR-SYS-04: System Workflow Execution
**Description**: The system SHALL execute continuous real-time workflow:
1. BigModuleA monitors temperature → writes to shared memory
2. BigModuleB reads temperature → computes distortion → sends via Thrift
3. BigModuleC receives distortion → calculates compensation → writes to shared memory
4. Repeat continuously

**Priority**: High
**Real-time Constraint**: Complete cycle within 100ms

### FR-SYS-05: System Initialization
**Description**: The system SHALL initialize in the correct order:
1. BigModuleA creates and initializes shared memory
2. BigModuleB starts and attaches to shared memory
3. BigModuleC starts Thrift server and attaches to shared memory
4. All modules log "READY" status

**Priority**: High

### FR-SYS-06: System Shutdown
**Description**: The system SHALL support graceful shutdown:
- SIGTERM/SIGINT signals handled by all modules
- Resources released (shared memory, Thrift connections)
- Final state logged

**Priority**: Medium

### FR-SYS-07: System Logging
**Description**: All modules SHALL log events to stdout with standardized format:
```
[TIMESTAMP] [MODULE_NAME] [LEVEL] Message
```
**Priority**: High
**Levels**: INFO, WARNING, ERROR

### FR-SYS-08: Observable System State
**Description**: System state SHALL be observable through logs and shared memory inspection.
**Priority**: High
**Purpose**: Enable verification during testing and demonstration.

---

## 4. System-Level Non-Functional Requirements

### NFR-SYS-01: Real-Time Performance
**Description**: The system SHALL meet real-time performance targets:
- End-to-end latency (temperature update → compensation applied): < 100ms
- Temperature update frequency: 10 Hz minimum
- Distortion prediction frequency: 5 Hz minimum
- Compensation update frequency: 5 Hz minimum

**Priority**: High
**Verification**: Performance testing with timestamped logging

### NFR-SYS-02: System Reliability
**Description**: The system SHALL run continuously for extended periods:
- Target: 1 hour continuous operation without crashes
- Graceful error handling for communication failures
- Module restart capability without full system restart

**Priority**: Medium

### NFR-SYS-03: Build System Integration
**Description**: All modules SHALL build using consistent build system:
- Common Makefile infrastructure (`common_infra/build_tools/`)
- Unified Thrift code generation
- Consistent debug/release builds
- Repository-level release packaging

**Priority**: High

### NFR-SYS-04: Portability
**Description**: The system SHALL build and run on Linux (Ubuntu 20.04+).
**Priority**: Medium
**Note**: POC targets Linux only; production would require broader platform support.

### NFR-SYS-05: Code Quality
**Description**: All modules SHALL follow:
- SOLID principles for object-oriented design
- Clean Code practices (meaningful names, small functions, DRY)
- Unit test coverage > 80% per module
- Component/integration/system tests

**Priority**: High

### NFR-SYS-06: Documentation
**Description**: System SHALL have comprehensive documentation:
- System-level and module-level EPS/EDS documents
- Architecture Decision Records (ADRs)
- Build and deployment instructions
- Test plans and reports

**Priority**: High

### NFR-SYS-07: Fictional Element Marking
**Description**: All **FICTIONAL** elements SHALL be clearly marked:
- In code comments
- In documentation
- In interface definitions
- In test descriptions

**Priority**: Critical
**Rationale**: Prevent confusion about what is real lithography practice vs. POC demonstration.

---

## 5. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    RTDCS System Architecture                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  BigModuleA      │         │  BigModuleB      │         │  BigModuleC      │
│                  │         │                  │         │                  │
│  ThermalMonitor  │         │ DistortionPredictor       │ CompensationCtrl │
│                  │         │                  │         │                  │
│  - Simulate temp │         │ - Read temp      │         │ - Receive dist   │
│  - Write to SHM  │         │ - Apply FICTIONAL│         │ - Calculate comp │
│  - Log updates   │         │   Zeeman model   │         │ - Write to SHM   │
│                  │         │ - Send via Thrift│         │ - Log offsets    │
└────────┬─────────┘         └────────┬─────────┘         └────────┬─────────┘
         │                            │                            │
         │  Write temp                │  Read temp                 │  Write comp
         ├────────────────────────────┼────────────────────────────┤
         │                            │                            │
         │         ┌──────────────────▼──────────────────┐         │
         └────────►│     Shared Memory (POSIX)          │◄────────┘
                   │  /rtdcs_shared_state               │
                   │                                     │
                   │  - reticle_temp_C                  │
                   │  - compensation_offset_nm_x        │
                   │  - compensation_offset_nm_y        │
                   │  - timestamp_ns                    │
                   │  - module_status_flags             │
                   └─────────────────────────────────────┘

                          Thrift RPC (TCP)
         ┌──────────────────────────────────────────────┐
         │  BigModuleB  ─────────►  BigModuleC          │
         │  (Client)         DistortionVector  (Server) │
         │                                               │
         │  struct DistortionVector {                   │
         │    double expansion_nm_x                     │
         │    double expansion_nm_y                     │
         │    int64  timestamp_ns                       │
         │  }                                            │
         └───────────────────────────────────────────────┘

Key:
  SHM = Shared Memory
  ─►  = Data flow direction
  ◄─► = Bidirectional access
```

### Architecture Principles

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Loose Coupling**: Modules communicate via well-defined interfaces (shared memory, Thrift)
3. **Independent Deployment**: Each module builds and can be tested independently
4. **Observable System**: All data flows are logged for verification
5. **Real-time Capable**: Shared memory for high-frequency data, RPC for control

---

## 6. Inter-Module Interfaces

### 6.1 Shared Memory Structure

**Name**: `/rtdcs_shared_state`
**Size**: 4096 bytes (aligned)
**Access Pattern**:
- BigModuleA: Read/Write (owner, creates segment)
- BigModuleB: Read-only
- BigModuleC: Read/Write (compensation fields only)

**Data Structure** (defined in system EDS):
```cpp
struct SharedLithoState {
    // Temperature data (written by BigModuleA)
    double   reticle_temp_C;
    int64_t  temp_timestamp_ns;

    // Compensation data (written by BigModuleC)
    double   compensation_offset_nm_x;
    double   compensation_offset_nm_y;
    int64_t  comp_timestamp_ns;

    // Status flags
    uint32_t modulea_status;  // 1=running, 0=stopped
    uint32_t moduleb_status;
    uint32_t modulec_status;

    // Reserved for future use
    uint8_t  reserved[4000];
};
```

### 6.2 Thrift RPC Interface

**Service**: `ICompensationController` (provided by BigModuleC)
**Transport**: TCP socket on port 9090
**Protocol**: Binary protocol

**Method**:
```thrift
service ICompensationController {
    void applyDistortion(1: DistortionVector distortion)
}

struct DistortionVector {
    1: double expansion_nm_x,
    2: double expansion_nm_y,
    3: i64    timestamp_ns
}
```

**Communication Pattern**:
- BigModuleB (client) → BigModuleC (server)
- Asynchronous call (fire-and-forget)
- Timeout: 10ms

---

## 7. System Use Cases

### Use Case 1: Normal Operation Cycle

**Actors**: BigModuleA, BigModuleB, BigModuleC
**Preconditions**: All modules initialized and running
**Trigger**: Continuous real-time operation

**Main Flow**:
1. BigModuleA simulates temperature reading (e.g., 25.3°C)
2. BigModuleA writes temperature to shared memory (`SharedLithoState.reticle_temp_C`)
3. BigModuleA logs: `"Temperature updated: 25.3°C"`
4. BigModuleB reads temperature from shared memory
5. BigModuleB applies **FICTIONAL** Zeeman thermal expansion model
6. BigModuleB computes distortion vector: `(expansion_x, expansion_y)`
7. BigModuleB sends `DistortionVector` to BigModuleC via Thrift RPC
8. BigModuleB logs: `"Predicted distortion: X=1.2nm, Y=0.8nm"`
9. BigModuleC receives distortion vector via Thrift server
10. BigModuleC calculates compensation offsets: `offset = -distortion`
11. BigModuleC writes compensation to shared memory (`compensation_offset_nm_x/y`)
12. BigModuleC logs: `"Compensation applied: X=-1.2nm, Y=-0.8nm"`
13. Cycle repeats continuously

**Success Criteria**:
- End-to-end latency < 100ms
- All data flows observable in logs
- Shared memory consistent

### Use Case 2: System Startup

**Actors**: System operator, all modules
**Preconditions**: None
**Trigger**: System start command

**Main Flow**:
1. Operator starts BigModuleA
2. BigModuleA creates shared memory segment `/rtdcs_shared_state`
3. BigModuleA initializes shared memory (zero all fields)
4. BigModuleA sets `modulea_status = 1` (running)
5. BigModuleA logs: `"BigModuleA READY"`
6. Operator starts BigModuleB
7. BigModuleB attaches to shared memory segment
8. BigModuleB sets `moduleb_status = 1`
9. BigModuleB logs: `"BigModuleB READY, waiting for temperature updates"`
10. Operator starts BigModuleC
11. BigModuleC starts Thrift server on port 9090
12. BigModuleC attaches to shared memory segment
13. BigModuleC sets `modulec_status = 1`
14. BigModuleC logs: `"BigModuleC READY, Thrift server listening on port 9090"`
15. System enters normal operation

**Success Criteria**: All modules reach READY state and begin processing

### Use Case 3: System Shutdown

**Actors**: System operator, all modules
**Preconditions**: System running normally
**Trigger**: SIGTERM/SIGINT signal sent to modules

**Main Flow**:
1. Operator sends SIGTERM to all modules
2. Each module receives shutdown signal
3. BigModuleC stops Thrift server, closes connections
4. BigModuleC sets `modulec_status = 0`, detaches shared memory
5. BigModuleC logs: `"BigModuleC shutdown complete"`
6. BigModuleB stops processing loop, sets `moduleb_status = 0`
7. BigModuleB detaches shared memory
8. BigModuleB logs: `"BigModuleB shutdown complete"`
9. BigModuleA stops temperature simulation, sets `modulea_status = 0`
10. BigModuleA destroys shared memory segment (owner)
11. BigModuleA logs: `"BigModuleA shutdown complete, shared memory released"`
12. All modules exit gracefully

**Success Criteria**: Clean resource release, no memory leaks, all logs written

---

## 8. Module Responsibilities

### BigModuleA: ThermalMonitor

**Purpose**: Simulate reticle temperature sensor and publish temperature data
**Key Responsibilities**:
- Create and manage shared memory segment (owner)
- Simulate temperature sensor readings (sine wave or step changes)
- Update temperature in shared memory at 10 Hz
- Log temperature updates
- Handle startup/shutdown

**See**: `rtdcs-modulea-eps.md` for detailed requirements

---

### BigModuleB: DistortionPredictor

**Purpose**: Predict thermal distortion using **FICTIONAL** Zeeman model
**Key Responsibilities**:
- Read temperature from shared memory
- Apply **FICTIONAL** Zeeman thermal expansion algorithm
- Compute 2D distortion vector (X, Y expansion in nm)
- Send distortion vector to BigModuleC via Thrift RPC at 5 Hz
- Log predictions
- **CRITICAL**: Mark FICTIONAL model in code and logs

**See**: `rtdcs-moduleb-eps.md` for detailed requirements

---

### BigModuleC: CompensationController

**Purpose**: Calculate and apply compensation offsets
**Key Responsibilities**:
- Provide Thrift RPC server interface (`ICompensationController`)
- Receive distortion vectors from BigModuleB
- Calculate compensation offsets (simple negation strategy)
- Write compensation to shared memory
- Log compensation actions
- Handle startup/shutdown

**See**: `rtdcs-modulec-eps.md` for detailed requirements

---

## 9. Glossary

| Term | Definition |
|------|------------|
| **RTDCS** | Reticle Thermal Distortion Compensation System - this POC system |
| **Reticle** | Photomask containing circuit patterns (in real lithography) |
| **Thermal Distortion** | Pattern deformation due to temperature-induced expansion |
| **Compensation Offset** | Correction applied to counteract distortion (nm-level positioning) |
| **Shared Memory** | POSIX shared memory (`/rtdcs_shared_state`) for inter-process data exchange |
| **Thrift RPC** | Apache Thrift remote procedure call for structured communication |
| **BigModuleA** | ThermalMonitor module (temperature acquisition) |
| **BigModuleB** | DistortionPredictor module (**FICTIONAL** algorithm) |
| **BigModuleC** | CompensationController module (offset calculation) |
| **⚠️ Zeeman Model** | **FICTIONAL** thermal expansion algorithm (NOT real physics) |
| **Overlay Accuracy** | Alignment precision in lithography (sub-nanometer in real systems) |
| **POC** | Proof-of-Concept - demonstration project, not production code |

---

## 10. Appendix: FICTIONAL Elements Summary

**⚠️ CRITICAL**: The following elements in this system are **COMPLETELY FICTIONAL** and created solely for POC demonstration:

### FICTIONAL: Zeeman Thermal Expansion Model

- **What it is**: A polynomial-based algorithm that computes 2D thermal expansion from temperature
- **Formula (FICTIONAL)**:
  ```
  expansion_x(T) = a0 + a1*T + a2*T^2
  expansion_y(T) = b0 + b1*T + b2*T^2
  ```
  Where coefficients (a0, a1, a2, b0, b1, b2) are arbitrary constants

- **What it is NOT**:
  - NOT the real Zeeman effect (magnetic field splitting of spectral lines in quantum physics)
  - NOT a real lithography thermal model
  - NOT based on actual material properties or calibration data
  - NOT validated or suitable for production use

- **Why FICTIONAL**:
  - Real lithography thermal models are proprietary and complex
  - Require extensive calibration with actual hardware
  - This POC demonstrates software architecture, not physics accuracy

### FICTIONAL: Temperature Simulation

- Temperature values are generated algorithmically (sine wave or step function)
- NOT reading from real hardware sensors
- NOT representative of actual reticle thermal behavior

### FICTIONAL: Compensation Strategy

- Simple negation strategy: `offset = -distortion`
- Real compensation systems are far more sophisticated
- Include dynamic models, feedforward/feedback control, multi-axis correction

**Purpose of FICTIONAL Elements**:
Enable demonstration of:
- Multi-module architecture
- Real-time data flow
- Inter-process communication patterns
- Observable system behavior
- Testing and validation workflows

**Marking Convention**:
All FICTIONAL elements will be marked with `⚠️ FICTIONAL` in:
- Source code comments
- Interface definitions
- Log messages
- Test descriptions
- Documentation

---

## Document Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-19 | Architect Agent | Initial system-level EPS created |

---

**Next Steps**:
1. Review and approve this system-level EPS
2. Create module-level EPS for BigModuleA, BigModuleB, BigModuleC
3. Create system-level EDS (detailed design)
4. Create module-level EDS for each module
5. Begin implementation phase

---

**Related Documents**:
- `rtdcs-modulea-eps.md` - BigModuleA (ThermalMonitor) External Product Specification
- `rtdcs-moduleb-eps.md` - BigModuleB (DistortionPredictor) External Product Specification
- `rtdcs-modulec-eps.md` - BigModuleC (CompensationController) External Product Specification
- `rtdcs-system-eds.md` - System-Level External Design Specification (TBD)
- `rtdcs-project-brief.md` - Overall RTDCS project documentation

---

**End of System-Level EPS**
