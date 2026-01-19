# External Product Specification (EPS)
## Reticle Thermal Distortion Compensation System (RTDCS)

**Document ID**: EPS-RTDCS-001
**Version**: 1.0
**Date**: 2026-01-19
**Author**: Architect Agent
**Status**: Draft
**Project**: RTDCS POC

---

## Document Control

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-19 | Architect Agent | Initial EPS creation |

### Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Architect | Architect Agent | 2026-01-19 | Pending Peer Review |
| Developer | TBD | TBD | Pending Review |
| IT | TBD | TBD | Pending Review |
| User | TBD | TBD | Pending Approval |

---

## 1. Product Overview

### 1.1 Purpose

The Reticle Thermal Distortion Compensation System (RTDCS) is a proof-of-concept software system designed to demonstrate real-time thermal distortion compensation in lithography equipment. The system monitors reticle temperature, predicts thermal expansion effects, and calculates compensation adjustments to maintain overlay accuracy.

**⚠️ IMPORTANT**: This is a **POC (Proof of Concept)** system. The thermal expansion model and calculations are **FICTIONAL** and created solely for demonstration purposes.

### 1.2 Scope

**In Scope**:
- Real-time temperature monitoring simulation
- Thermal distortion prediction using **FICTIONAL** Zeeman Thermal Expansion Model
- Compensation offset calculation
- Inter-module communication (shared memory + Thrift RPC)
- Observable logging and state tracking
- Multi-process architecture

**Out of Scope**:
- Actual hardware integration
- Production lithography machine deployment
- Real-time operating system (RTOS) constraints
- Safety-critical validation
- Calibration with real sensor data
- Integration with existing lithography machine control systems

### 1.3 Target Audience

- **Primary**: Development team (Architect, Developer, Tester, IT agents)
- **Secondary**: Technical stakeholders evaluating multi-agent development workflows
- **Tertiary**: Software engineers learning lithography domain concepts

---

## 2. System Context

### 2.1 Business Context

**Problem**: In semiconductor lithography, reticle thermal expansion during wafer exposure causes nanometer-scale distortions that degrade overlay accuracy. Compensating for these effects is critical for advanced node manufacturing (<7nm).

**Solution**: RTDCS provides a software framework demonstrating how thermal effects can be monitored, predicted, and compensated in real-time.

**⚠️ FICTIONAL DISCLAIMER**: The specific thermal expansion model (Zeeman model) and coefficient values used in this POC are **FICTIONAL** and do not represent real lithography physics. This is intentional for POC demonstration purposes.

### 2.2 System Context Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    RTDCS System Boundary                      │
│                                                                │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐           │
│  │BigModuleA│      │BigModuleB│      │BigModuleC│           │
│  │ Thermal  │──┬──▶│Distortion│──────▶│Compensa- │           │
│  │ Monitor  │  │   │Predictor │      │tion Ctrl │           │
│  └──────────┘  │   └──────────┘      └──────────┘           │
│                │         │                  │                 │
│                │         │                  │                 │
│                └─────────┼──────────────────┘                 │
│                          │                                    │
│                   ┌──────▼──────┐                            │
│                   │Shared Memory│                            │
│                   │   (POSIX)   │                            │
│                   └─────────────┘                            │
└──────────────────────────────────────────────────────────────┘
         │                                  │
         ▼                                  ▼
    [Simulated                         [Logged
     Temperature                        Compensation
     Sensors]                           Results]
     (FICTIONAL)                        (Observable)
```

### 2.3 Stakeholders

| Stakeholder | Interest | Influence |
|-------------|----------|-----------|
| **User** | Validate multi-agent workflow | High |
| **Developer Agent** | Implement based on specs | High |
| **Tester Agent** | Validate requirements | High |
| **IT Agent** | Build and release system | Medium |
| **Team Leader** | Coordinate agents | High |

---

## 3. Functional Requirements

### 3.1 Temperature Monitoring (BigModuleA)

**FR-01**: The system SHALL simulate reticle temperature sensor readings.
**Priority**: High
**⚠️ FICTIONAL**: Sensor data is simulated, not from real hardware.

**FR-02**: The system SHALL update temperature readings at minimum 10 Hz frequency.
**Priority**: High
**Rationale**: Sufficient for demonstrating real-time monitoring without RTOS constraints.

**FR-03**: The system SHALL write current temperature to shared memory.
**Priority**: High

**FR-04**: The system SHALL log temperature readings to console/file.
**Priority**: Medium
**Rationale**: Provides observable output for POC demonstration.

**FR-05**: The system SHALL provide Thrift RPC interface for temperature queries.
**Priority**: Low
**Rationale**: Enables remote monitoring if needed.

### 3.2 Distortion Prediction (BigModuleB)

**FR-06**: The system SHALL read temperature data from shared memory.
**Priority**: High

**FR-07**: The system SHALL apply **FICTIONAL** Zeeman Thermal Expansion Model to predict distortion.
**Priority**: High
**⚠️ FICTIONAL**: The Zeeman model is NOT a real lithography algorithm. It is a fictional polynomial-based calculation created for this POC.

**FR-08**: The system SHALL calculate X and Y thermal expansion vectors in nanometers.
**Priority**: High

**FR-09**: The system SHALL send distortion predictions to Compensation Controller via Thrift RPC.
**Priority**: High

**FR-10**: The system SHALL log distortion predictions to console/file.
**Priority**: Medium

**FR-11**: The system SHALL update predictions at minimum 5 Hz frequency.
**Priority**: Medium
**Rationale**: Balances demonstration of responsiveness with computational simplicity.

### 3.3 Compensation Control (BigModuleC)

**FR-12**: The system SHALL receive distortion predictions via Thrift RPC from BigModuleB.
**Priority**: High

**FR-13**: The system SHALL calculate compensation offsets in nanometers for X and Y axes.
**Priority**: High

**FR-14**: The system SHALL write compensation offsets to shared memory.
**Priority**: High

**FR-15**: The system SHALL log final compensation values to console/file.
**Priority**: High
**Rationale**: Critical observable output for POC validation.

**FR-16**: The system SHALL track compensation history (last N values).
**Priority**: Low

### 3.4 Inter-Module Communication

**FR-17**: The system SHALL use POSIX shared memory for high-frequency data exchange (temperature, compensation).
**Priority**: High
**Rationale**: Demonstrates efficient IPC for real-time data.

**FR-18**: The system SHALL use Apache Thrift RPC for command/control communication (predictions, queries).
**Priority**: High
**Rationale**: Demonstrates interface-driven development with IDL.

**FR-19**: The system SHALL handle communication failures gracefully (log error, continue operation).
**Priority**: Medium

### 3.5 Observable Results

**FR-20**: The system SHALL provide console output showing:
- Current temperature (BigModuleA)
- Predicted distortion (BigModuleB)
- Compensation offsets (BigModuleC)
**Priority**: High
**Rationale**: Essential for POC demonstration.

**FR-21**: The system SHALL log all events to timestamped log files.
**Priority**: Medium

**FR-22**: The system SHALL provide shared memory viewer utility to inspect system state.
**Priority**: Low

---

## 4. Non-Functional Requirements

### 4.1 Performance

**NFR-01**: Temperature updates SHALL occur at ≥10 Hz (≤100ms latency).
**Priority**: High

**NFR-02**: Distortion predictions SHALL occur at ≥5 Hz (≤200ms latency).
**Priority**: High

**NFR-03**: Compensation calculations SHALL complete within 50ms of receiving prediction.
**Priority**: Medium

**NFR-04**: Shared memory access SHALL be lock-free (read-only) or use lightweight synchronization.
**Priority**: Medium

### 4.2 Reliability

**NFR-05**: Each module SHALL run as an independent process (crash isolation).
**Priority**: High

**NFR-06**: Modules SHALL restart gracefully after failure (outside POC scope but architecturally sound).
**Priority**: Low

**NFR-07**: The system SHALL log all errors with timestamps and module identification.
**Priority**: Medium

### 4.3 Maintainability

**NFR-08**: All interfaces SHALL be defined using Apache Thrift IDL.
**Priority**: High
**Rationale**: Ensures language-agnostic, version-controlled interfaces.

**NFR-09**: Code SHALL follow SOLID principles and Clean Code guidelines.
**Priority**: High

**NFR-10**: All **FICTIONAL** elements (Zeeman model, coefficients, sensor data) SHALL be clearly marked in code comments.
**Priority**: Critical
**Rationale**: Prevents confusion about POC vs production algorithms.

**NFR-11**: Architecture SHALL support future extension (new prediction algorithms, multiple sensors).
**Priority**: Medium
**Rationale**: Strategy pattern enables algorithm swapping.

### 4.4 Testability

**NFR-12**: Each module SHALL have >80% unit test coverage.
**Priority**: High

**NFR-13**: Component tests SHALL validate each module independently.
**Priority**: High

**NFR-14**: Integration tests SHALL validate inter-module communication.
**Priority**: High

**NFR-15**: System tests SHALL validate end-to-end thermal compensation workflow.
**Priority**: High

### 4.5 Portability

**NFR-16**: The system SHALL compile and run on Linux (Ubuntu 20.04+, CentOS 7+).
**Priority**: High

**NFR-17**: The system SHALL use standard C++17 or later.
**Priority**: High

**NFR-18**: Build system SHALL use GNU Make with common build infrastructure.
**Priority**: High

### 4.6 Documentation

**NFR-19**: All Thrift interfaces SHALL be documented with comments.
**Priority**: High

**NFR-20**: Architecture decisions SHALL be documented with rationale.
**Priority**: High

**NFR-21**: **FICTIONAL** disclaimers SHALL appear in all relevant documentation.
**Priority**: Critical

---

## 5. Use Cases

### 5.1 UC-01: Monitor and Compensate Thermal Distortion

**Actor**: RTDCS System (automated)

**Preconditions**:
- All three modules are running
- Shared memory is initialized
- Thrift services are listening

**Main Flow**:
1. BigModuleA simulates temperature sensor reading (e.g., 25.3°C)
2. BigModuleA writes temperature to shared memory (`SharedLithoState.reticle_temp_C`)
3. BigModuleA logs: "Temperature: 25.3°C at timestamp T"
4. BigModuleB reads temperature from shared memory
5. BigModuleB applies **FICTIONAL** Zeeman model: expansion_x = f(T), expansion_y = g(T)
6. BigModuleB sends `DistortionVector(expansion_nm_x=1.2, expansion_nm_y=0.8)` to BigModuleC via Thrift
7. BigModuleB logs: "Predicted distortion: X=1.2nm, Y=0.8nm"
8. BigModuleC receives distortion vector
9. BigModuleC calculates compensation: offset_x = -expansion_x, offset_y = -expansion_y
10. BigModuleC writes compensation to shared memory (`compensation_offset_nm_x/y`)
11. BigModuleC logs: "Compensation applied: X=-1.2nm, Y=-0.8nm"
12. Repeat continuously

**Postconditions**:
- Shared memory contains current thermal state
- Compensation offsets are calculated and logged
- System state is observable via logs and shared memory

**Alternative Flows**:
- **A1**: If Thrift RPC fails, BigModuleC logs error and uses last known prediction
- **A2**: If temperature reading fails, BigModuleA logs error and retries

### 5.2 UC-02: Query Temperature History

**Actor**: External monitoring tool (optional, low priority)

**Preconditions**:
- BigModuleA Thrift service is running

**Main Flow**:
1. Client calls `ThermalMonitor.getTemperatureHistory(count=100)`
2. BigModuleA returns list of last 100 temperature readings
3. Client displays temperature trend

**Postconditions**:
- Client has historical temperature data

### 5.3 UC-03: Inspect System State

**Actor**: Developer/Tester

**Preconditions**:
- RTDCS is running
- Shared memory viewer utility is available

**Main Flow**:
1. Developer runs `rtdcs-state-viewer` command
2. Utility reads `SharedLithoState` from shared memory
3. Utility displays: temperature, expansion, compensation, timestamp
4. Developer verifies system is operating correctly

**Postconditions**:
- System state is visible and verifiable

---

## 6. System Constraints

### 6.1 Technical Constraints

**C-01**: Must use Apache Thrift 0.13.0+ for RPC (existing in build system).
**C-02**: Must use POSIX shared memory (standard Linux API).
**C-03**: Must use C++17 or later.
**C-04**: Must build with GNU Make (existing build infrastructure).
**C-05**: Must run on Linux (Ubuntu 20.04+, CentOS 7+).

### 6.2 Design Constraints

**C-06**: Each module must be independently compilable and testable.
**C-07**: Shared memory structure must be fixed-size for simplicity.
**C-08**: **FICTIONAL** Zeeman model must use simple polynomial (no complex physics).
**C-09**: No external dependencies beyond standard libraries, Thrift, and build tools.

### 6.3 Project Constraints

**C-10**: POC must be completable within 4-6 agent iterations.
**C-11**: Code complexity must remain low (2-3 files per module).
**C-12**: Observable results must be immediately verifiable (console logs, shared memory).

---

## 7. Quality Attributes

### 7.1 Performance
- **Target**: 10 Hz temperature updates, 5 Hz prediction updates
- **Measurement**: Log timestamps, calculate update rates
- **Rationale**: Demonstrates real-time responsiveness without RTOS complexity

### 7.2 Modularity
- **Target**: Each module independently testable, replaceable
- **Measurement**: Compile each module separately, mock interfaces
- **Rationale**: Validates interface-driven architecture

### 7.3 Observability
- **Target**: All significant events logged, state visible in shared memory
- **Measurement**: Review logs, inspect shared memory
- **Rationale**: Essential for POC validation and debugging

### 7.4 Maintainability
- **Target**: SOLID principles, Clean Code, clear documentation
- **Measurement**: Peer review, code review metrics
- **Rationale**: Demonstrates software engineering best practices

### 7.5 Extensibility
- **Target**: Easy to add new prediction algorithms, sensors, compensation strategies
- **Measurement**: Strategy pattern, interface segregation
- **Rationale**: Architecture should support future enhancements

---

## 8. Assumptions

**A-01**: Temperature sensor data is simulated (no real hardware).
**A-02**: **FICTIONAL** Zeeman model is acceptable for POC demonstration.
**A-03**: Shared memory synchronization can use simple read/write without mutexes (read-only for most fields).
**A-04**: Thrift RPC latency is acceptable (<10ms on localhost).
**A-05**: Single reticle temperature sensor is sufficient for POC.
**A-06**: Compensation offsets are logged but not applied to real hardware.
**A-07**: System runs on single machine (no distributed deployment).

---

## 9. Dependencies

### 9.1 External Dependencies
- **Apache Thrift**: RPC framework (already in build system)
- **POSIX shared memory**: Standard Linux API
- **GNU Make**: Build system
- **C++17 compiler**: GCC 7+ or Clang 5+

### 9.2 Internal Dependencies
- **Build Infrastructure**: `common_infra/build_tools/`
- **Makefile templates**: `common.mk`, `rules.mk`
- **Module structure**: `BigModuleA/`, `BigModuleB/`, `BigModuleC/`

---

## 10. Success Criteria

The RTDCS POC is successful if:

**SC-01**: All three modules build successfully using Makefiles.
**SC-02**: Modules run as independent processes and communicate correctly.
**SC-03**: Temperature monitoring produces observable console output.
**SC-04**: Distortion prediction logs **FICTIONAL** Zeeman model results.
**SC-05**: Compensation controller logs final offsets.
**SC-06**: Shared memory contains current system state (temperature, expansion, compensation).
**SC-07**: End-to-end workflow completes: temperature → prediction → compensation.
**SC-08**: All **FICTIONAL** elements are clearly marked in code and docs.
**SC-09**: Unit, component, integration, and system tests pass.
**SC-10**: Peer review approvals obtained (Developer, IT agents).

---

## 11. Glossary

| Term | Definition |
|------|------------|
| **Reticle** | Photomask used in lithography to project circuit patterns onto wafers |
| **Overlay Accuracy** | Alignment precision between successive lithography layers (nanometer-scale) |
| **Thermal Expansion** | Material expansion due to temperature increase |
| **Distortion** | Deviation from ideal geometry due to thermal effects |
| **Compensation** | Adjustment applied to correct for distortion |
| **Zeeman Model** | **FICTIONAL** polynomial-based thermal expansion algorithm (NOT real physics) |
| **Shared Memory** | POSIX inter-process communication mechanism using mapped memory |
| **Thrift RPC** | Apache Thrift Remote Procedure Call framework |
| **EPS** | External Product Specification (this document) |
| **EDS** | External Design Specification (companion document) |

---

## 12. References

| Ref ID | Document | Version | Location |
|--------|----------|---------|----------|
| REF-01 | RTDCS Project Brief | 1.0 | `docs/team-leader/projects/rtdcs-project-brief.md` |
| REF-02 | CLAUDE.md | Current | `/home/user/BigProjPOC/CLAUDE.md` |
| REF-03 | Module Build System | 1.0 | `docs/it/build/module-build-system.md` |
| REF-04 | Common Infrastructure | 1.0 | `docs/it/infrastructure/common-infra.md` |
| REF-05 | Architect Handoff | 1.0 | `docs/team-leader/handoffs/architect-rtdcs-handoff.md` |

---

## Appendix A: **FICTIONAL** Elements Summary

**⚠️ CRITICAL DISCLAIMER**

The following elements in RTDCS are **FICTIONAL** and created specifically for POC demonstration. They do NOT represent real lithography physics or production algorithms:

1. **Zeeman Thermal Expansion Model**:
   - Fictional polynomial-based calculation
   - NOT found in literature or production systems
   - Created to demonstrate prediction algorithms

2. **Thermal Expansion Coefficients**:
   - All numerical values are fictional
   - NOT based on real reticle materials or physics

3. **Temperature Sensor Data**:
   - Simulated, not from real hardware
   - Fictional sensor IDs and calibration values

4. **Distortion Values**:
   - Calculated from fictional model
   - NOT validated against real lithography measurements

**Purpose**: This POC demonstrates software architecture, multi-agent development, and interface-driven design. The domain concepts (thermal compensation) are real, but specific implementations are intentionally fictional for demonstration purposes.

---

**End of External Product Specification**

**Next Document**: External Design Specification (EDS) - defines HOW the system is designed and implemented.
