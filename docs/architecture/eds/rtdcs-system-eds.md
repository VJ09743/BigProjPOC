# RTDCS System-Level External Design Specification (EDS)

**Project**: Reticle Thermal Distortion Compensation System (RTDCS)
**Document Type**: System-Level External Design Specification (EDS)
**Version**: 1.0
**Date**: 2026-01-20
**Author**: Architect Agent
**Status**: Draft - Awaiting Review

---

## ⚠️ CRITICAL DISCLAIMER: FICTIONAL PROOF-OF-CONCEPT

**This document describes the detailed design of a PROOF-OF-CONCEPT (POC) system.**

**FICTIONAL ELEMENTS**:
- The Zeeman Thermal Expansion Model is COMPLETELY FICTIONAL
- Temperature simulation is not based on real sensor integration
- Compensation strategy is intentionally oversimplified

**This EDS demonstrates software architecture and design patterns, NOT production lithography systems.**

---

## Table of Contents

1. [Document Overview](#1-document-overview)
2. [System Architecture](#2-system-architecture)
3. [Design Patterns and Principles](#3-design-patterns-and-principles)
4. [Component Design](#4-component-design)
5. [Inter-Module Communication Design](#5-inter-module-communication-design)
6. [Data Structures and Interfaces](#6-data-structures-and-interfaces)
7. [Error Handling and Logging](#7-error-handling-and-logging)
8. [Build and Deployment](#8-build-and-deployment)
9. [Testing Strategy](#9-testing-strategy)
10. [Technology Stack](#10-technology-stack)
11. [Architecture Decision Records](#11-architecture-decision-records)

---

## 1. Document Overview

### 1.1 Purpose

This External Design Specification (EDS) describes **HOW** the RTDCS system is designed and implemented. It provides detailed architectural decisions, design patterns, component interactions, and technical implementation details.

**Relationship to EPS**:
- **EPS (External Product Specification)**: Defines **WHAT** the system does (requirements)
- **EDS (External Design Specification)**: Defines **HOW** the system is built (design)

### 1.2 Scope

This document covers:
- Overall system architecture and design rationale
- Design patterns and object-oriented principles applied
- Component design and responsibilities
- Inter-module communication mechanisms
- Data structures and interface definitions
- Error handling, logging, and observability
- Build system and deployment
- Testing strategy

### 1.3 Audience

- **Developer Agent**: Implements modules based on this design
- **Tester Agent**: Creates tests validating this design
- **IT Agent**: Builds and deploys based on this design
- **Architect Agent**: Maintains and evolves this design
- **User/Reviewer**: Reviews and approves this design

---

## 2. System Architecture

### 2.1 Architectural Style

**Multi-Process Architecture with IPC (Inter-Process Communication)**

**Rationale**:
- **Separation of Concerns**: Each module runs as independent process with single responsibility
- **Fault Isolation**: Module crash doesn't bring down entire system
- **Scalability**: Modules can run on different cores/machines
- **Realistic**: Matches real lithography systems (distributed subsystems)

**Alternatives Considered**:
1. **Monolithic Single Process**: Simpler but less realistic, no fault isolation
2. **Multi-Threaded Single Process**: Less isolation, shared memory issues
3. **Microservices with HTTP**: Too heavyweight for real-time POC

### 2.2 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RTDCS System Architecture                        │
│                                                                          │
│  ┌───────────────────┐      ┌───────────────────┐      ┌──────────────┐│
│  │  BigModuleA       │      │  BigModuleB       │      │  BigModuleC  ││
│  │  ThermalMonitor   │      │ DistortionPred    │      │CompensCtrl   ││
│  │                   │      │                   │      │              ││
│  │  ┌─────────────┐  │      │  ┌─────────────┐  │      │┌───────────┐││
│  │  │Temp         │  │      │  │⚠️FICTIONAL │  │      ││Thrift RPC │││
│  │  │Simulator    │  │      │  │Zeeman Model │  │      ││Server     │││
│  │  └─────┬───────┘  │      │  └─────┬───────┘  │      │└─────▲─────┘││
│  │        │          │      │        │          │      │      │      ││
│  │        ▼          │      │        ▼          │      │      │      ││
│  │  ┌─────────────┐  │      │  ┌─────────────┐  │      │┌───────────┐││
│  │  │Shared Mem   │  │      │  │Thrift Client│  │      ││Compens-   │││
│  │  │Writer       │  │      │  │             │──┼──────▶│ation      │││
│  │  │(Owner)      │  │      │  │             │  │      ││Calculator │││
│  │  └─────┬───────┘  │      │  └─────────────┘  │      │└─────┬─────┘││
│  │        │          │      │        │          │      │      │      ││
│  │        │          │      │        │          │      │      │      ││
│  └────────┼──────────┘      └────────┼──────────┘      └──────┼──────┘│
│           │                          │                        │       │
│           │  Write Temp              │  Read Temp             │       │
│           ▼                          ▼                        ▼       │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │              Shared Memory: /rtdcs_shared_state                    ││
│  │  ┌──────────────┬──────────────┬──────────────┬──────────────────┐││
│  │  │ reticle_temp │ temp_ts      │ comp_offset  │ status_flags     │││
│  │  │ (double)     │ (int64)      │ (double x2)  │ (uint32 x3)      │││
│  │  └──────────────┴──────────────┴──────────────┴──────────────────┘││
│  └────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  Legend:                                                                 │
│  ───► Data Flow                                                         │
│  ═══► Control Flow / RPC Call                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Module Responsibilities

| Module | Primary Responsibility | Secondary Responsibilities |
|--------|------------------------|---------------------------|
| **BigModuleA** | Temperature data acquisition | Shared memory lifecycle, system initialization |
| **BigModuleB** | Thermal distortion prediction | Thrift RPC client, algorithm execution |
| **BigModuleC** | Compensation calculation | Thrift RPC server, control output |

### 2.4 Process Lifecycle

**Startup Sequence** (Order matters for shared memory):
1. **BigModuleA** starts first
   - Creates `/rtdcs_shared_state` (owner)
   - Initializes all fields to zero
   - Sets `modulea_status = 1`
   - Begins temperature simulation

2. **BigModuleC** starts second
   - Attaches to existing `/rtdcs_shared_state`
   - Starts Thrift server on port 9090
   - Sets `modulec_status = 1`
   - Waits for RPC calls

3. **BigModuleB** starts last
   - Attaches to existing `/rtdcs_shared_state`
   - Connects to BigModuleC Thrift server
   - Sets `moduleb_status = 1`
   - Begins prediction loop

**Shutdown Sequence** (Reverse order):
1. **BigModuleB** stops (SIGTERM/SIGINT)
   - Disconnects from Thrift server
   - Sets `moduleb_status = 0`
   - Detaches from shared memory

2. **BigModuleC** stops
   - Stops Thrift server
   - Sets `modulec_status = 0`
   - Detaches from shared memory

3. **BigModuleA** stops (last)
   - Sets `modulea_status = 0`
   - Destroys `/rtdcs_shared_state` (owner)

---

## 3. Design Patterns and Principles

### 3.1 Object-Oriented Design Principles

#### SOLID Principles Application

**S - Single Responsibility Principle**:
- BigModuleA: Only responsible for temperature monitoring
- BigModuleB: Only responsible for distortion prediction
- BigModuleC: Only responsible for compensation calculation

**O - Open/Closed Principle**:
- Temperature simulation patterns (sine, step) can be extended without modifying core
- Prediction algorithms can be swapped (Strategy pattern)

**L - Liskov Substitution Principle**:
- Interface-based design allows substitution (e.g., IThermalMonitor, IDistortionPredictor)

**I - Interface Segregation Principle**:
- Thrift interfaces are minimal and specific (ICompensationController has single method)

**D - Dependency Inversion Principle**:
- Modules depend on abstractions (Thrift interfaces, POSIX APIs), not concrete implementations

#### GRASP Principles

**Information Expert**: Shared memory data is written by the module with the information
**Low Coupling**: Modules communicate only via well-defined interfaces
**High Cohesion**: Each module has strongly related responsibilities

### 3.2 Design Patterns Used

#### 3.2.1 Observer Pattern (BigModuleA → BigModuleB)

**Intent**: BigModuleB observes temperature changes from BigModuleA

**Implementation**:
- **Subject**: BigModuleA writes temperature to shared memory
- **Observer**: BigModuleB polls shared memory (simplified polling instead of push notifications)

**Rationale**: Decouples producer (BigModuleA) from consumer (BigModuleB)

#### 3.2.2 Strategy Pattern (BigModuleB Prediction Algorithms)

**Intent**: Allow swapping of distortion prediction algorithms

**Implementation**:
```cpp
// Strategy Interface
class IDistortionAlgorithm {
public:
    virtual DistortionVector predict(double temperature_C) = 0;
    virtual ~IDistortionAlgorithm() = default;
};

// Concrete Strategy: FICTIONAL Zeeman Model
class FictionalZeemanAlgorithm : public IDistortionAlgorithm {
public:
    DistortionVector predict(double temperature_C) override {
        // Polynomial calculation: expansion = a0 + a1*T + a2*T^2
        // ...
    }
};

// Context
class DistortionPredictor {
    std::unique_ptr<IDistortionAlgorithm> algorithm;
public:
    void setAlgorithm(std::unique_ptr<IDistortionAlgorithm> alg) {
        algorithm = std::move(alg);
    }
    DistortionVector predict(double temp) {
        return algorithm->predict(temp);
    }
};
```

**Benefits**: Easy to add new algorithms, testable in isolation

#### 3.2.3 Command Pattern (BigModuleC Compensation Actions)

**Intent**: Encapsulate compensation actions as objects

**Implementation**:
```cpp
// Command Interface
class ICompensationCommand {
public:
    virtual void execute() = 0;
    virtual ~ICompensationCommand() = default;
};

// Concrete Command
class ApplyCompensationCommand : public ICompensationCommand {
    DistortionVector distortion;
    SharedMemoryWriter* shmWriter;
public:
    ApplyCompensationCommand(DistortionVector dist, SharedMemoryWriter* writer)
        : distortion(dist), shmWriter(writer) {}
    
    void execute() override {
        // Calculate offset = -distortion
        // Write to shared memory via shmWriter
    }
};
```

**Benefits**: Logging, undo capability (future), queueing

#### 3.2.4 Singleton Pattern (Shared Memory Manager)

**Intent**: Ensure single instance of shared memory connection per process

**Implementation**:
```cpp
class SharedMemoryManager {
private:
    static SharedMemoryManager* instance;
    SharedMemoryManager() { /* Initialize */ }
    SharedMemoryManager(const SharedMemoryManager&) = delete;
public:
    static SharedMemoryManager* getInstance() {
        if (!instance) {
            instance = new SharedMemoryManager();
        }
        return instance;
    }
    // ...
};
```

**Rationale**: One shared memory segment per process, global access point

#### 3.2.5 Factory Pattern (Temperature Pattern Creation)

**Intent**: Create temperature simulation patterns without exposing creation logic

**Implementation**:
```cpp
class TemperaturePatternFactory {
public:
    static std::unique_ptr<ITemperaturePattern> create(const std::string& type) {
        if (type == "sine") {
            return std::make_unique<SineWavePattern>();
        } else if (type == "step") {
            return std::make_unique<StepPattern>();
        }
        throw std::runtime_error("Unknown pattern type");
    }
};
```

### 3.3 Architectural Patterns

**Layered Architecture** (within each module):
```
┌──────────────────────────────────────┐
│  Application Layer (Main)            │  ← Entry point, orchestration
├──────────────────────────────────────┤
│  Domain Layer (Business Logic)       │  ← Algorithms, calculations
├──────────────────────────────────────┤
│  Infrastructure Layer (I/O)          │  ← Shared memory, Thrift, logging
├──────────────────────────────────────┤
│  Platform Layer (POSIX, OS)          │  ← OS APIs, system calls
└──────────────────────────────────────┘
```

**Event-Driven Architecture** (simplified):
- BigModuleA generates temperature "events" (writes to shared memory)
- BigModuleB reacts to temperature changes (polling loop)
- BigModuleC reacts to distortion predictions (Thrift RPC handler)

---

## 4. Component Design

### 4.1 BigModuleA Component Breakdown

```
BigModuleA (ThermalMonitor Process)
│
├── Main.cpp                            ← Entry point
│   ├── Parse command-line arguments
│   ├── Initialize components
│   ├── Start main loop
│   └── Handle shutdown signals
│
├── TemperatureSimulator                ← Business Logic
│   ├── ITemperaturePattern (interface)
│   ├── SineWavePattern (concrete)
│   ├── StepPattern (concrete)
│   └── TemperaturePatternFactory
│
├── SharedMemoryManager                 ← Infrastructure
│   ├── create() - Create /rtdcs_shared_state
│   ├── initialize() - Zero all fields
│   ├── writeTemperature(double)
│   ├── writeTimestamp(int64_t)
│   ├── setStatus(uint32_t)
│   └── destroy() - Unlink segment
│
├── Logger                              ← Infrastructure
│   ├── log(level, message)
│   └── Output: stdout
│
└── SignalHandler                       ← Infrastructure
    ├── setupHandlers(SIGTERM, SIGINT)
    └── triggerGracefulShutdown()
```

### 4.2 BigModuleB Component Breakdown

```
BigModuleB (DistortionPredictor Process)
│
├── Main.cpp                            ← Entry point
│   ├── Parse arguments
│   ├── Initialize components
│   ├── Start prediction loop (5 Hz)
│   └── Handle shutdown
│
├── DistortionPredictor                 ← Business Logic
│   ├── IDistortionAlgorithm (interface)
│   ├── FictionalZeemanAlgorithm (⚠️ FICTIONAL)
│   │   ├── predict(temperature) → DistortionVector
│   │   └── Polynomial: expansion = a0 + a1*T + a2*T^2
│   └── setAlgorithm(IDistortionAlgorithm*)
│
├── SharedMemoryReader                  ← Infrastructure
│   ├── attach() - Attach to /rtdcs_shared_state
│   ├── readTemperature() → double
│   ├── readTimestamp() → int64_t
│   ├── getModuleStatus(module_id) → uint32_t
│   └── detach()
│
├── ThriftRPCClient                     ← Infrastructure
│   ├── connect(host, port)
│   ├── sendDistortion(DistortionVector)
│   ├── disconnect()
│   └── Uses: Apache Thrift C++ client
│
├── Logger                              ← Infrastructure
│   └── log() with ⚠️ FICTIONAL markers
│
└── SignalHandler                       ← Infrastructure
```

### 4.3 BigModuleC Component Breakdown

```
BigModuleC (CompensationController Process)
│
├── Main.cpp                            ← Entry point
│   ├── Parse arguments
│   ├── Start Thrift server
│   ├── Wait for RPC calls (event-driven)
│   └── Handle shutdown
│
├── CompensationController              ← Business Logic
│   ├── ICompensationStrategy (interface)
│   ├── NegationStrategy (concrete)
│   │   └── calculate(distortion) → offset = -distortion
│   └── setStrategy(ICompensationStrategy*)
│
├── ThriftRPCServer                     ← Infrastructure
│   ├── ICompensationController.thrift implementation
│   ├── applyDistortion(DistortionVector) handler
│   │   ├── Extract distortion
│   │   ├── Calculate compensation (via strategy)
│   │   ├── Write to shared memory
│   │   └── Log action
│   ├── start(port)
│   └── stop()
│
├── SharedMemoryWriter                  ← Infrastructure
│   ├── attach() - Attach to /rtdcs_shared_state
│   ├── writeCompensation(double x, double y)
│   ├── writeTimestamp(int64_t)
│   ├── setStatus(uint32_t)
│   └── detach()
│
├── Logger                              ← Infrastructure
│
└── SignalHandler                       ← Infrastructure
```

### 4.4 Class Diagram (Simplified UML)

```
┌──────────────────────────┐
│   ITemperaturePattern    │ (interface)
│ ───────────────────────  │
│ + getTemperature() → T   │
└──────────▲───────────────┘
           │
      ┌────┴────┐
      │         │
┌─────┴─────────┴───┐   ┌──────────────────┐
│ SineWavePattern    │   │  StepPattern     │
└────────────────────┘   └──────────────────┘

┌──────────────────────────┐
│ IDistortionAlgorithm     │ (interface)
│ ───────────────────────  │
│ + predict(T) → Vector    │
└──────────▲───────────────┘
           │
           │
┌──────────┴────────────────────┐
│ FictionalZeemanAlgorithm      │ ⚠️ FICTIONAL
│ ──────────────────────────────│
│ - coefficients: a0,a1,a2,...  │
│ + predict(T) → DistortionVec  │
└───────────────────────────────┘

┌──────────────────────────┐
│ ICompensationStrategy    │ (interface)
│ ───────────────────────  │
│ + calculate(distortion)  │
└──────────▲───────────────┘
           │
           │
┌──────────┴────────────────┐
│ NegationStrategy          │
│ ──────────────────────────│
│ + calculate() → offset    │
│   offset = -distortion    │
└───────────────────────────┘
```

---

## 5. Inter-Module Communication Design

### 5.1 Shared Memory Design

**Technology**: POSIX Shared Memory (`shm_open`, `mmap`)

**Segment Name**: `/rtdcs_shared_state`

**Access Pattern**:
- **BigModuleA**: Read/Write, Owner (creates & destroys)
- **BigModuleB**: Read-only
- **BigModuleC**: Read/Write (compensation fields only)

**Synchronization Strategy**:
- **No locking**: Simple producer-consumer with single writer per field
- **Memory barriers**: Compiler barriers ensure write ordering

**Platform Considerations**:
- **Linux**: `/dev/shm/` filesystem, large limits
- **macOS**: Virtual memory backed, smaller default limits (sufficient for 4KB)

### 5.2 Thrift RPC Design

**Technology**: Apache Thrift 0.19.0, C++ implementation

**Protocol**: Binary Protocol (efficient, compact)

**Transport**: Buffered Transport over TCP Sockets

**Communication Pattern**: Client-Server
- **Server**: BigModuleC (port 9090)
- **Client**: BigModuleB

**Interface Definition** (preview):
```thrift
namespace cpp rtdcs.ipc

struct DistortionVector {
    1: double expansion_nm_x,
    2: double expansion_nm_y,
    3: i64 timestamp_ns
}

service ICompensationController {
    void applyDistortion(1: DistortionVector distortion)
}
```

**Error Handling**:
- Timeout: 10ms per RPC call
- Retry: None (fire-and-forget for POC)
- Connection failure: Log warning, continue (non-blocking)

---

## 6. Data Structures and Interfaces

### 6.1 Shared Memory Structure

```cpp
// File: common_infra/shared_memory/SharedLithoState.h

#pragma once
#include <cstdint>

namespace rtdcs {
namespace shared_memory {

/**
 * Shared memory structure for RTDCS inter-process communication
 * Segment: /rtdcs_shared_state
 * Size: 4096 bytes (page-aligned)
 */
struct SharedLithoState {
    // Temperature data (written by BigModuleA)
    double   reticle_temp_C;          // Current reticle temperature (Celsius)
    int64_t  temp_timestamp_ns;       // Timestamp of temperature reading (ns since epoch)
    
    // Compensation data (written by BigModuleC)
    double   compensation_offset_nm_x;  // X-axis compensation offset (nanometers)
    double   compensation_offset_nm_y;  // Y-axis compensation offset (nanometers)
    int64_t  comp_timestamp_ns;         // Timestamp of compensation calculation
    
    // Module status flags
    uint32_t modulea_status;          // 1=running, 0=stopped
    uint32_t moduleb_status;          // 1=running, 0=stopped
    uint32_t modulec_status;          // 1=running, 0=stopped
    
    // Reserved for future use (padding to 4096 bytes)
    uint8_t  reserved[4000];
};

static_assert(sizeof(SharedLithoState) <= 4096, "SharedLithoState exceeds 4KB");

} // namespace shared_memory
} // namespace rtdcs
```

### 6.2 Thrift Interfaces

**File**: `BigModuleC/src/ext/interfaces/ICompensationController.thrift`

```thrift
namespace cpp rtdcs.ipc

/**
 * Distortion vector representing thermal expansion in 2D
 * ⚠️ FICTIONAL: Based on fictional Zeeman thermal expansion model
 */
struct DistortionVector {
    1: double expansion_nm_x,    // X-axis thermal expansion in nanometers
    2: double expansion_nm_y,    // Y-axis thermal expansion in nanometers
    3: i64    timestamp_ns       // Timestamp when prediction was made
}

/**
 * Compensation controller service
 * Provided by BigModuleC, called by BigModuleB
 */
service ICompensationController {
    /**
     * Apply thermal distortion compensation
     * @param distortion Predicted distortion from thermal model
     * Side effect: Writes compensation to shared memory
     */
    void applyDistortion(1: DistortionVector distortion)
}
```

### 6.3 Key C++ Classes

**TemperatureSimulator**:
```cpp
class TemperatureSimulator {
public:
    enum class Pattern { SINE_WAVE, STEP_CHANGE };
    
    TemperatureSimulator(Pattern pattern, double baseTemp = 25.0);
    double getCurrentTemperature() const;
    void update(double deltaTime);
    
private:
    std::unique_ptr<ITemperaturePattern> pattern_;
};
```

**DistortionPredictor**:
```cpp
class DistortionPredictor {
public:
    DistortionPredictor();
    void setAlgorithm(std::unique_ptr<IDistortionAlgorithm> algorithm);
    DistortionVector predict(double temperature_C);
    
private:
    std::unique_ptr<IDistortionAlgorithm> algorithm_;
};
```

**CompensationController**:
```cpp
class CompensationController {
public:
    CompensationController();
    void setStrategy(std::unique_ptr<ICompensationStrategy> strategy);
    CompensationOffset calculate(const DistortionVector& distortion);
    
private:
    std::unique_ptr<ICompensationStrategy> strategy_;
};
```

---

## 7. Error Handling and Logging

### 7.1 Error Handling Strategy

**Principles**:
1. **Fail Fast**: Detect errors early and handle immediately
2. **Graceful Degradation**: Continue operation if non-critical error
3. **Clear Reporting**: Log all errors with context

**Error Categories**:

| Category | Examples | Handling |
|----------|----------|----------|
| **Fatal** | Shared memory creation failure | Log error, exit with non-zero status |
| **Recoverable** | Thrift connection failure | Log warning, retry or continue |
| **Expected** | Invalid command-line arguments | Print usage, exit gracefully |
| **Transient** | RPC timeout | Log warning, skip this cycle, continue |

**Platform-Specific Errors**:
- **macOS Shared Memory Limits**: Check `sysctl kern.sysv.shmmax` on startup, fail with clear message if insufficient

### 7.2 Logging Design

**Output**: stdout (can be redirected to file by user)

**Format**:
```
[TIMESTAMP] [MODULE_NAME] [LEVEL] Message
```

**Example**:
```
[2026-01-20T12:34:56.789] [BigModuleA] [INFO] BigModuleA READY
[2026-01-20T12:34:57.123] [BigModuleB] [INFO] ⚠️ FICTIONAL Zeeman Prediction: T=25.3°C → X=5.7nm, Y=4.6nm
[2026-01-20T12:34:57.456] [BigModuleC] [INFO] Compensation applied: X=-5.7nm, Y=-4.6nm
[2026-01-20T12:34:58.000] [BigModuleB] [WARNING] Thrift call timeout, retrying...
[2026-01-20T12:34:59.000] [BigModuleA] [ERROR] Failed to write to shared memory
```

**Log Levels**:
- **INFO**: Normal operation events
- **WARNING**: Recoverable errors, degraded operation
- **ERROR**: Failures requiring attention

**⚠️ FICTIONAL Markers**: All logs related to fictional Zeeman model include `⚠️ FICTIONAL` prefix

---

## 8. Build and Deployment

### 8.1 Build System Architecture

**Technology**: GNU Make with modular Makefiles

**Structure**:
```
common_infra/build_tools/
├── common.mk          ← Platform detection, common variables
└── rules.mk           ← Reusable build rules

BigModuleA/
├── Makefile           ← Module-specific build
└── Uses: common.mk, rules.mk

BigModuleB/Makefile
BigModuleC/Makefile
```

**Build Targets**:
- `make all` - Generate Thrift code + build debug & release
- `make generate` - Generate C++ from .thrift files
- `make build` - Build debug and release
- `make clean` - Remove build artifacts
- `make install` - Install to repository release/

**Platform Detection** (in common.mk):
```makefile
UNAME_S := $(shell uname -s)

ifeq ($(UNAME_S),Darwin)
    # macOS
    THRIFT := /opt/homebrew/bin/thrift
    CXX := clang++
else
    # Linux
    THRIFT := $(REPO_ROOT)/common_infra/thrift/bin/thrift
    CXX := g++
endif
```

### 8.2 Deployment

**Development Deployment**:
1. Build all modules: `cd BigModuleA && make all` (repeat for B, C)
2. Run in separate terminals:
   - Terminal 1: `./BigModuleA/build/release/BigModuleA`
   - Terminal 2: `./BigModuleC/build/release/BigModuleC`
   - Terminal 3: `./BigModuleB/build/release/BigModuleB`

**Release Deployment**:
1. Install to repository release: `make install` (each module)
2. Release structure:
   ```
   release/
   ├── bin/
   │   ├── BigModuleA
   │   ├── BigModuleB
   │   └── BigModuleC
   ├── lib/
   │   ├── libBigModuleA.a
   │   ├── libBigModuleB.a
   │   └── libBigModuleC.a
   └── include/
       └── ...
   ```

---

## 9. Testing Strategy

### 9.1 Test Levels

**Unit Tests** (by Developer Agent):
- Test individual classes in isolation
- Mock dependencies (e.g., mock IDistortionAlgorithm)
- Framework: Google Test (gtest)
- Location: `<module>/tests/unit/`
- Coverage target: >80%

**Component Tests** (by Tester Agent):
- Test individual modules as black boxes
- Verify external interfaces (Thrift, shared memory)
- Framework: gtest + integration helpers
- Location: `<module>/tests/component/`

**Integration Tests** (by Tester Agent):
- Test module pairs:
  - BigModuleA + BigModuleB (shared memory communication)
  - BigModuleB + BigModuleC (Thrift RPC communication)
- Verify data flow
- Location: `<module>/tests/integration/`

**System Tests** (by Tester Agent):
- Test all 3 modules together
- End-to-end workflow validation
- Performance testing (10 Hz, 5 Hz frequencies)
- Location: `tests/system/` (repository level)

### 9.2 Testing the FICTIONAL Zeeman Model

**Important**: Tests verify **mathematical correctness**, NOT physical accuracy

**Unit Tests**:
```cpp
TEST(FictionalZeemanAlgorithmTest, PolynomialCalculation) {
    FictionalZeemanAlgorithm algo;
    // Test: T=25°C → expansion = a0 + a1*25 + a2*625
    auto result = algo.predict(25.0);
    EXPECT_NEAR(result.expansion_nm_x, 5.625, 0.001); // Expected polynomial result
}

TEST(FictionalZeemanAlgorithmTest, FictionalMarking) {
    // Verify that class/function names include "Fictional" marker
    std::string className = typeid(FictionalZeemanAlgorithm).name();
    EXPECT_TRUE(className.find("Fictional") != std::string::npos);
}
```

---

## 10. Technology Stack

### 10.1 Languages and Standards

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| **Implementation Language** | C++ | C++14 | Modern features, performance, POSIX compatibility |
| **Build System** | GNU Make | 3.81+ | Universal, simple, no external dependencies |
| **RPC Framework** | Apache Thrift | 0.19.0 | Cross-language, efficient binary protocol |

### 10.2 Libraries and Dependencies

| Library | Purpose | Platform Notes |
|---------|---------|----------------|
| **Apache Thrift C++** | RPC communication | Linux: `common_infra/thrift/`, macOS: Homebrew |
| **POSIX APIs** | Shared memory, signals, timers | Both platforms (minor timing API differences) |
| **Standard C++ Library** | Data structures, algorithms | libc++ (macOS), libstdc++ (Linux) |
| **Google Test** (future) | Unit testing | To be added by Developer/Tester |

### 10.3 Platform Support

| Platform | Compiler | Build Tools | Package Manager |
|----------|----------|-------------|-----------------|
| **Linux (Ubuntu 20.04+)** | GCC 7+ or Clang 6+ | make, git | apt |
| **macOS (11.0+)** | Apple Clang | Xcode CLI Tools | Homebrew |

---

## 11. Architecture Decision Records

### ADR-001: Multi-Process vs. Multi-Threaded Architecture

**Status**: Accepted

**Context**: Need to demonstrate realistic lithography system architecture

**Decision**: Use multi-process architecture with IPC (shared memory + Thrift RPC)

**Consequences**:
- ✅ Realistic representation of distributed lithography subsystems
- ✅ Fault isolation between modules
- ✅ Demonstrates IPC mechanisms
- ❌ More complex than single process
- ❌ Requires careful startup/shutdown orchestration

---

### ADR-002: POSIX Shared Memory vs. Thrift for All Communication

**Status**: Accepted

**Context**: Need efficient temperature data exchange (10 Hz) and control messages (5 Hz)

**Decision**: Use both:
- POSIX shared memory for high-frequency data (temperature, compensation)
- Thrift RPC for control messages (distortion vector)

**Consequences**:
- ✅ Demonstrates two IPC mechanisms
- ✅ Shared memory: Low latency, high frequency
- ✅ Thrift: Structured data, type safety, cross-language (future)
- ❌ More complexity than using only one

---

### ADR-003: FICTIONAL Zeeman Model Polynomial Implementation

**Status**: Accepted

**Context**: Need simple, demonstrable thermal expansion algorithm

**Decision**: Use second-order polynomial: `expansion = a0 + a1*T + a2*T^2` with arbitrary coefficients

**Consequences**:
- ✅ Simple to implement and understand
- ✅ Easy to test (mathematical verification)
- ✅ Clearly fictional (marked everywhere)
- ✅ Demonstrates algorithm integration
- ❌ NO physical meaning whatsoever

---

### ADR-004: Platform Detection in Makefiles

**Status**: Accepted

**Context**: Need to support both Linux and macOS with different Thrift installations

**Decision**: Auto-detect platform in common.mk using `uname -s`

**Consequences**:
- ✅ Zero-config builds on both platforms
- ✅ Single Makefile works everywhere
- ✅ Automatic Thrift path detection
- ❌ Slight Makefile complexity

---

### ADR-005: Simple Negation Compensation Strategy

**Status**: Accepted

**Context**: Need compensation algorithm for POC

**Decision**: Use simplest possible strategy: `offset = -distortion`

**Consequences**:
- ✅ Trivial to implement and understand
- ✅ Demonstrates control flow
- ✅ Easily testable
- ❌ Not realistic (real systems use PID, MPC, etc.)
- ⚠️ Clearly marked as oversimplified

---

## Document Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-20 | Architect Agent | Initial system-level EDS created |

---

**Next Steps**:
1. Review and approve this system-level EDS
2. Create module-level EDS for BigModuleA, BigModuleB, BigModuleC
3. Implement Thrift interface definitions (.thrift files)
4. Create shared memory structure header file
5. Create development tasks for Developer Agent
6. Begin implementation phase

---

**Related Documents**:
- `rtdcs-system-eps.md` - System-Level External Product Specification (WHAT)
- `rtdcs-modulea-eds.md` - BigModuleA External Design Specification (TBD)
- `rtdcs-moduleb-eds.md` - BigModuleB External Design Specification (TBD)
- `rtdcs-modulec-eds.md` - BigModuleC External Design Specification (TBD)
- `rtdcs-project-brief.md` - Overall RTDCS project documentation

---

**End of System-Level EDS**
