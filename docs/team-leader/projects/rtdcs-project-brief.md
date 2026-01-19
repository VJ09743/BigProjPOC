# Reticle Thermal Distortion Compensation System (RTDCS) - Project Brief

**Project Code**: RTDCS-POC-001
**Status**: APPROVED
**Date**: 2026-01-19
**Team Leader**: Team Leader Agent
**Approved By**: User

---

## Executive Summary

This POC project demonstrates the complete multi-agent development workflow, build system, and release process for a lithography-related software system. The RTDCS monitors reticle thermal expansion during exposure and applies real-time compensation to maintain overlay accuracy.

---

## Project Purpose

1. **Validate End-to-End Workflow**: From proposal → planning → design → implementation → testing → release
2. **Demonstrate Multi-Agent Collaboration**: Team Leader, Architect, Developer, Tester, IT agents working together
3. **Validate Build Infrastructure**: Makefiles, Thrift interfaces, shared memory communication
4. **Establish Development Branch Workflow**: Feature branches, integration, release process

---

## Technical Concept

### Problem Statement
During wafer exposure, the reticle (photomask) absorbs energy from high-intensity illumination, causing thermal expansion at the nanometer scale. This thermal distortion degrades overlay accuracy and must be compensated in real-time.

### Solution Architecture
A three-module system that:
1. **Monitors** reticle temperature (BigModuleA)
2. **Predicts** thermal distortion using thermal expansion models (BigModuleB)
3. **Compensates** by adjusting stage positions (BigModuleC)

### **IMPORTANT: Fictional Elements**

**⚠️ FICTIONAL - FOR POC PURPOSES ONLY**

The following elements are **FICTIONAL** and created specifically for this POC:

1. **Zeeman Thermal Expansion Model**: A fictional thermal expansion algorithm that uses multi-order polynomial coefficients. This is NOT a real lithography algorithm and cannot be found in literature.

2. **Thermal Coefficient Values**: All thermal expansion coefficients used in calculations are fictional and for demonstration only.

3. **Sensor Data**: Temperature readings and sensor configurations are simulated, not based on actual hardware.

**All code, documentation, and specifications MUST clearly label these fictional elements as "FICTIONAL" or "FOR POC DEMONSTRATION ONLY".**

---

## System Architecture

### Module Overview

#### BigModuleA: Thermal Monitor Service
- **Responsibility**: Monitor reticle temperature sensors
- **Technology**: C++, Thrift interfaces, shared memory
- **Files** (3):
  - `ThermalMonitor.cpp` - Main monitoring logic
  - `ThermalSensorInterface.thrift` - Thrift interface definition
  - `main.cpp` - Service entry point

#### BigModuleB: Distortion Predictor Service
- **Responsibility**: Predict thermal distortion using expansion models
- **Technology**: C++, Thrift client/server, shared memory
- **Files** (3):
  - `DistortionPredictor.cpp` - Prediction logic with **FICTIONAL** Zeeman model
  - `PredictionInterface.thrift` - Thrift interface definition
  - `main.cpp` - Service entry point

#### BigModuleC: Compensation Controller Service
- **Responsibility**: Calculate and apply position compensation
- **Technology**: C++, Thrift interfaces, shared memory
- **Files** (3):
  - `CompensationController.cpp` - Compensation control logic
  - `CompensationInterface.thrift` - Thrift interface definition
  - `main.cpp` - Service entry point

### Communication Architecture

```
┌─────────────────────┐
│  BigModuleA         │
│  Thermal Monitor    │
│                     │
│  - Read sensors     │
│  - Calculate temps  │
└──────┬──────────────┘
       │
       │ (Write to Shared Memory)
       ▼
┌─────────────────────────────┐
│  Shared Memory              │
│  SharedLithoState           │
│  - reticle_temp_C           │
│  - thermal_expansion_nm_x   │
│  - thermal_expansion_nm_y   │
│  - compensation_offset_nm_x │
│  - compensation_offset_nm_y │
│  - timestamp_us             │
└─────────────────────────────┘
       │
       │ (Read from Shared Memory)
       ▼
┌─────────────────────┐
│  BigModuleB         │
│  Distortion         │
│  Predictor          │
│                     │
│  - Read thermal data│
│  - Apply FICTIONAL  │
│    Zeeman Model     │
│  - Calculate vectors│
└──────┬──────────────┘
       │
       │ (Thrift RPC)
       ▼
┌─────────────────────┐
│  BigModuleC         │
│  Compensation       │
│  Controller         │
│                     │
│  - Receive vectors  │
│  - Calculate offsets│
│  - Log results      │
└─────────────────────┘
       │
       │ (Write to Shared Memory)
       ▼
┌─────────────────────────────┐
│  Shared Memory (Updated)    │
└─────────────────────────────┘
```

### Thrift Interfaces

**IThermalMonitor.thrift** (BigModuleA/src/ext/interfaces/):
```thrift
// FICTIONAL - FOR POC DEMONSTRATION ONLY
struct ThermalReading {
    1: double temperature_celsius,
    2: i64 timestamp_us,
    3: string sensor_id
}

service ThermalMonitor {
    ThermalReading getCurrentTemperature(),
    list<ThermalReading> getTemperatureHistory(1: i32 count)
}
```

**IDistortionPredictor.thrift** (BigModuleB/src/ext/interfaces/):
```thrift
// Uses FICTIONAL Zeeman Thermal Expansion Model
struct DistortionVector {
    1: double expansion_nm_x,
    2: double expansion_nm_y,
    3: double confidence_percentage
}

service DistortionPredictor {
    DistortionVector predictDistortion(1: double temperature_c),
    void updateThermalModel(1: list<double> coefficients)  // FICTIONAL coefficients
}
```

**ICompensationController.thrift** (BigModuleC/src/ext/interfaces/):
```thrift
struct CompensationCommand {
    1: double offset_nm_x,
    2: double offset_nm_y,
    3: bool apply_immediately
}

service CompensationController {
    void applyCompensation(1: CompensationCommand cmd),
    CompensationCommand getCurrentCompensation()
}
```

### Shared Memory Structure

```cpp
// FICTIONAL - FOR POC DEMONSTRATION ONLY
// Shared memory segment: /rtdcs_shared_state

struct SharedLithoState {
    double reticle_temp_C;              // Current reticle temperature
    double thermal_expansion_nm_x;       // FICTIONAL: X-axis expansion from Zeeman model
    double thermal_expansion_nm_y;       // FICTIONAL: Y-axis expansion from Zeeman model
    double compensation_offset_nm_x;     // Calculated X compensation
    double compensation_offset_nm_y;     // Calculated Y compensation
    uint64_t timestamp_us;               // Microsecond timestamp
    bool is_compensating;                // Compensation active flag
};
```

---

## Observable Results

The system will demonstrate observability through:

1. **Console Output**:
   - BigModuleA logs temperature readings every 100ms
   - BigModuleB prints distortion predictions with **FICTIONAL** Zeeman coefficients
   - BigModuleC displays compensation offsets

2. **Shared Memory State**:
   - Viewable via `rtdcs-state-viewer` utility (to be created)
   - Shows real-time thermal and compensation data

3. **Log Files**:
   - `thermal_monitor.log` - Temperature history
   - `distortion_predictor.log` - Prediction calculations (labeled as FICTIONAL)
   - `compensation_controller.log` - Applied compensations

4. **System State**:
   - Final compensation values in shared memory
   - Timestamp tracking for synchronization validation

---

## Success Criteria

### Technical
- ✅ All three modules build successfully with Makefiles
- ✅ Thrift interfaces generate and compile without errors
- ✅ Modules communicate via shared memory and Thrift RPC
- ✅ Each module runs in its own process
- ✅ Observable output (logs, console, shared memory state)
- ✅ **FICTIONAL** elements clearly labeled in all code and docs

### Process
- ✅ Architect creates EPS/EDS specifications
- ✅ Developer implements based on specs
- ✅ Tester validates with test plans and automated tests
- ✅ Peer review process completed (2+ agent approvals)
- ✅ IT creates release in `release/` directory
- ✅ All work tracked in git with proper branches

### Documentation
- ✅ EPS/EDS in `docs/architecture/`
- ✅ Interface specs in `docs/architecture/interfaces/`
- ✅ Test plans in `docs/tests/plans/`
- ✅ All **FICTIONAL** elements marked clearly

---

## Development Workflow

### Git Branch Strategy

```
master (main branch)
  │
  ├─ recommended-development (development branch)
  │    │
  │    └─ project-feature-int/rtdcs (feature integration branch)
  │         │
  │         ├─ architect/rtdcs-design (Architect's work)
  │         │
  │         ├─ developer/rtdcs-implementation (Developer's work)
  │         │
  │         ├─ tester/rtdcs-validation (Tester's work)
  │         │
  │         └─ it/rtdcs-release (IT's work)
  │
  └─ [Merge project-feature-int/rtdcs after release]
```

### Workflow Steps

1. **Team Leader**: Create `recommended-development` from `master`
2. **Team Leader**: Create `project-feature-int/rtdcs` from `recommended-development`
3. **Team Leader**: Set up git worktrees for each agent:
   - `../worktree-architect` → `architect/rtdcs-design`
   - `../worktree-developer` → `developer/rtdcs-implementation`
   - `../worktree-tester` → `tester/rtdcs-validation`
   - `../worktree-it` → `it/rtdcs-release`

4. **Architect**: Design in worktree, commit, request peer review
5. **Developer**: Implement in worktree, commit, request peer review
6. **Tester**: Validate in worktree, commit, request peer review
7. **IT**: Build & release in worktree, commit, request peer review

8. **All agents**: Merge to `project-feature-int/rtdcs` after peer approvals
9. **IT Agent**: Create release in `release/v0.1.0/`
10. **IT Agent**: Merge `project-feature-int/rtdcs` → `recommended-development` → `master`

---

## Agent Assignments

### Team Leader (Current)
- ✅ Create project brief (this document)
- ⏳ Set up git worktrees
- ⏳ Coordinate agent handoffs
- ⏳ Facilitate peer reviews
- ⏳ Monitor progress

### Architect Agent (Next)
- ⏳ Create External Product Specification (EPS)
- ⏳ Create External Design Specification (EDS)
- ⏳ Design Thrift interfaces (clearly mark **FICTIONAL** model)
- ⏳ Define shared memory structure
- ⏳ Create development tasks for Developer
- ⏳ Document in `docs/architecture/`

### Developer Agent
- ⏳ Implement BigModuleA (ThermalMonitor)
- ⏳ Implement BigModuleB (DistortionPredictor with **FICTIONAL** Zeeman model)
- ⏳ Implement BigModuleC (CompensationController)
- ⏳ Write unit tests for all modules
- ⏳ Ensure **FICTIONAL** elements are clearly commented

### Tester Agent
- ⏳ Create test plan for RTDCS system
- ⏳ Write component tests for each module
- ⏳ Write integration tests for inter-module communication
- ⏳ Write system test for end-to-end workflow
- ⏳ Validate observable results
- ⏳ Create test report

### IT Agent
- ⏳ Validate Makefile builds for all modules
- ⏳ Ensure Thrift code generation works
- ⏳ Create release package in `release/v0.1.0/`
- ⏳ Package binaries, libraries, headers
- ⏳ Create release notes
- ⏳ Execute branch merge workflow

---

## Timeline Estimate

**Total Estimated Effort**: 4-6 agent iterations

- Architect: 1 iteration (design & specs)
- Developer: 2 iterations (implementation & testing)
- Tester: 1 iteration (validation)
- IT: 1 iteration (release)
- Peer Reviews: Throughout (concurrent)

---

## Risk Assessment

### Technical Risks
- **Low**: Simple C++ implementation, well-defined interfaces
- **Low**: Shared memory is standard POSIX API
- **Low**: Thrift is already integrated in build system

### Process Risks
- **Medium**: First time executing full multi-agent workflow
- **Mitigation**: Team Leader actively monitors and facilitates

### Documentation Risks
- **Low**: Templates and examples already exist
- **Critical**: Must ensure **FICTIONAL** elements are clearly marked everywhere

---

## Next Action

**Team Leader will now:**
1. Create git worktrees for parallel agent work
2. Hand off to Architect Agent with this brief
3. Monitor Architect's progress on EPS/EDS creation

**Architect Agent should start with:**
- Reading this project brief thoroughly
- Creating EPS document in `docs/architecture/eps/`
- Designing Thrift interfaces with **FICTIONAL** markers
- Coordinating with Team Leader on questions

---

## References

- Main Repository Documentation: `/home/user/BigProjPOC/CLAUDE.md`
- Agent Definitions: `/home/user/BigProjPOC/.claude/agents/`
- Build System Documentation: `/home/user/BigProjPOC/docs/it/build/`
- Existing Thrift Examples: `BigModuleA/src/ext/interfaces/` (if any exist)

---

**Document Status**: APPROVED
**Last Updated**: 2026-01-19
**Next Review**: After Architect completes EPS/EDS
