# RTDCS BigModuleC External Design Specification (EDS)

**Document**: BigModuleC (CompensationController) External Design Specification
**Project**: RTDCS (Reticle Thermal Distortion Compensation System)
**Module**: BigModuleC - CompensationController
**Date**: 2026-01-20
**Author**: Architect Agent
**Status**: Draft
**Version**: 1.0

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Context](#2-system-context)
3. [Architecture Overview](#3-architecture-overview)
4. [Component Design](#4-component-design)
5. [Class Design](#5-class-design)
6. [Sequence Diagrams](#6-sequence-diagrams)
7. [Compensation Algorithm Design](#7-compensation-algorithm-design)
8. [Inter-Module Communication](#8-inter-module-communication)
9. [Error Handling](#9-error-handling)
10. [Performance Considerations](#10-performance-considerations)
11. [Platform-Specific Implementation](#11-platform-specific-implementation)
12. [Testing Considerations](#12-testing-considerations)
13. [Build and Deployment](#13-build-and-deployment)
14. [Future Enhancements](#14-future-enhancements)

---

## 1. Introduction

### 1.1 Purpose

This document provides the detailed external design for **BigModuleC (CompensationController)**, which receives reticle distortion predictions from BigModuleB and applies compensation corrections to the shared state.

**⚠️ CRITICAL DISCLAIMER**: The compensation algorithm (simple negation) is **FICTIONAL** and created solely for this proof-of-concept demonstration. Real lithography compensation systems use complex multi-parameter models.

### 1.2 Scope

This EDS covers:
- Component architecture and class design
- Thrift RPC server implementation for ICompensationController service
- FICTIONAL compensation algorithm (simple negation)
- Shared memory write mechanism
- Multi-threaded RPC server design
- Platform-specific implementations (Linux, macOS)
- Error handling and recovery
- Performance considerations

### 1.3 Audience

- **Developer Agent**: Implementation reference
- **Tester Agent**: Test planning and validation
- **Architect Agent**: Design review and verification
- **IT Agent**: Build system integration

### 1.4 References

- **rtdcs-system-eds.md**: System-level design specification
- **rtdcs-modulec-eps.md**: BigModuleC external product specification
- **rtdcs-modulea-eds.md**: BigModuleA design for shared memory structure
- **rtdcs-moduleb-eds.md**: BigModuleB design for Thrift RPC client

---

## 2. System Context

### 2.1 Role in RTDCS System

BigModuleC is the **compensation controller** of the RTDCS system:

```
BigModuleA (ThermalMonitor)
    ↓ [Shared Memory: Temperature]
BigModuleB (DistortionPredictor)
    ↓ [Thrift RPC: Distortion Vector]
BigModuleC (CompensationController) ← This Module
    ↓ [Shared Memory: Compensation Values]
(Lithography System - Not Implemented in POC)
```

### 2.2 Responsibilities

1. **Thrift RPC Server**: Listen on port 9090 for distortion predictions from BigModuleB
2. **Receive Distortions**: Accept DistortionVector via applyDistortion() RPC call
3. **Compute Compensation**: Apply FICTIONAL negation algorithm to compute compensation
4. **Write to Shared Memory**: Update shared state with compensation values
5. **Logging**: Log all received distortions and applied compensations
6. **Graceful Shutdown**: Clean up resources on SIGINT/SIGTERM

### 2.3 Dependencies

**Runtime Dependencies**:
- BigModuleA must be running first (creates shared memory)
- BigModuleB sends distortion predictions (Thrift RPC client)

**Build Dependencies**:
- Apache Thrift 0.19.0 (C++ runtime, compiler, server library)
- POSIX shared memory API (shm_open, mmap)
- POSIX threads (pthread) for multi-threaded RPC server
- C++14 or later standard library

---

## 3. Architecture Overview

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BigModuleC Process                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌─────────────────────────────┐ │
│  │  Main Controller  │─────→│  CompensationController     │ │
│  └──────────────────┘      └─────────────────────────────┘ │
│           │                              │                   │
│           │                              │ (Command Pattern) │
│           ↓                              ↓                   │
│  ┌──────────────────┐      ┌─────────────────────────────┐ │
│  │  ThriftRPCServer │      │  CompensationStrategy       │ │
│  │  (Port 9090)     │      │  (Simple Negation)          │ │
│  └──────────────────┘      └─────────────────────────────┘ │
│           │                              │                   │
│           │ (Multi-threaded)             ↓                   │
│           │                  ┌─────────────────────────────┐│
│           │                  │  SharedMemoryWriter         ││
│           │                  └─────────────────────────────┘│
│           │                              │                   │
│           ↓                              ↓                   │
│  ┌──────────────────┐      ┌─────────────────────────────┐ │
│  │  Logger          │      │  Signal Handler (SIGINT)    │ │
│  └──────────────────┘      └─────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
           │                              │
           ↓                              ↓
   [Thrift RPC Server]          [Shared Memory]
     TCP :9090                  /rtdcs_shared_state
  (Receives from BigModuleB)    (Write Compensation)
```

### 3.2 Design Patterns Applied

1. **Command Pattern**: Compensation actions are encapsulated as command objects
2. **Strategy Pattern**: Compensation algorithm is pluggable (simple negation is default)
3. **Singleton Pattern**: SharedMemoryWriter (single write access point)
4. **Observer Pattern**: Monitors for incoming RPC requests
5. **Server Pattern**: Multi-threaded Thrift RPC server handles concurrent requests

### 3.3 SOLID Principles Application

| Principle | Application |
|-----------|-------------|
| **Single Responsibility** | CompensationStrategy only computes compensation values |
| **Open/Closed** | Strategy can be extended (add new compensation algorithms) without modifying RPC server |
| **Liskov Substitution** | Any ICompensationStrategy can replace SimpleNegationStrategy |
| **Interface Segregation** | Small, focused interfaces (ISharedMemoryWriter, ICompensationStrategy) |
| **Dependency Inversion** | Main controller depends on abstractions, not concrete classes |

---

## 4. Component Design

### 4.1 Component Breakdown

#### 4.1.1 ThriftRPCServer

**Purpose**: Multi-threaded Apache Thrift RPC server for ICompensationController service.

**Responsibilities**:
- Listen on TCP port 9090 for incoming RPC connections
- Use thread pool for concurrent request handling
- Dispatch applyDistortion() RPC calls to handler
- Handle connection lifecycle (accept, serve, close)

**Key Methods**:
```cpp
class ThriftRPCServer {
public:
    ThriftRPCServer(int port, ICompensationControllerHandler* handler);
    ~ThriftRPCServer();

    void start();  // Blocking call
    void stop();

private:
    int port_;
    std::shared_ptr<apache::thrift::server::TThreadedServer> server_;
    std::shared_ptr<apache::thrift::transport::TServerSocket> serverSocket_;
};
```

**Thrift Server Configuration**:
- **Protocol**: TBinaryProtocol (efficient binary serialization)
- **Transport**: TBufferedTransport (buffered I/O for performance)
- **Server Type**: TThreadedServer (one thread per connection)
- **Port**: 9090 (default)

#### 4.1.2 CompensationController (RPC Handler)

**Purpose**: Implement ICompensationController Thrift service interface.

**Responsibilities**:
- Receive DistortionVector from BigModuleB via applyDistortion() RPC
- Validate input (sanity check distortion values)
- Delegate to CompensationStrategy to compute compensation
- Write compensation to shared memory via SharedMemoryWriter
- Log all operations

**Key Methods**:
```cpp
class CompensationControllerHandler : public ICompensationControllerIf {
public:
    CompensationControllerHandler(ICompensationStrategy* strategy,
                                  SharedMemoryWriter* writer);

    // Thrift RPC method implementation
    void applyDistortion(const DistortionVector& distortion) override;

private:
    ICompensationStrategy* strategy_;
    SharedMemoryWriter* writer_;
    std::mutex mutex_;  // Thread-safe access
};
```

**Thread Safety**: Uses mutex to protect shared memory writes from concurrent RPC calls.

#### 4.1.3 SimpleNegationStrategy

**Purpose**: Implement FICTIONAL compensation algorithm (simple negation).

**⚠️ FICTIONAL DISCLAIMER**: This algorithm is entirely made-up for demonstration purposes.

**Responsibilities**:
- Compute compensation values as negation of distortion
- Return CompensationVector structure

**Key Methods**:
```cpp
class SimpleNegationStrategy : public ICompensationStrategy {
public:
    CompensationVector computeCompensation(const DistortionVector& distortion) const override;
};
```

**Algorithm** (FICTIONAL):
```
compensation_x = -distortion_x
compensation_y = -distortion_y
```

**Justification** (FICTIONAL):
- Negating distortion "cancels out" the thermal expansion effect
- In reality, lithography compensation uses complex multi-parameter models

#### 4.1.4 SharedMemoryWriter

**Purpose**: Write compensation values to POSIX shared memory created by BigModuleA.

**Responsibilities**:
- Attach to existing shared memory segment `/rtdcs_shared_state`
- Write CompensationVector to shared state
- Validate data integrity (magic number)
- Handle write errors

**Key Methods**:
```cpp
class SharedMemoryWriter {
public:
    static SharedMemoryWriter* getInstance();
    void attach(const std::string& name);
    void writeCompensation(const CompensationVector& compensation);
    void detach();

private:
    SharedMemoryWriter() = default;
    static SharedMemoryWriter* instance_;
    int shmFd_;
    SharedLithoState* shmPtr_;
    std::mutex mutex_;  // Thread-safe writes
};
```

**Error Handling**:
- Throw exception if BigModuleA hasn't created shared memory yet
- Validate magic number (0x4C49544F = "LITO")
- Use mutex for thread-safe writes

#### 4.1.5 Logger

**Purpose**: Timestamped console logging with severity levels.

**Responsibilities**:
- Log received distortions with FICTIONAL warnings
- Log computed compensations
- Log RPC events and errors
- Timestamp format: `[YYYY-MM-DDTHH:MM:SS.mmm]`

**Key Methods**:
```cpp
class Logger {
public:
    static void info(const std::string& msg);
    static void warn(const std::string& msg);
    static void error(const std::string& msg);

private:
    static std::string currentTimestamp();
    static std::mutex mutex_;  // Thread-safe logging
};
```

**Log Format**:
```
[2026-01-20T14:23:46.100] [BigModuleC] [INFO] BigModuleC starting, PID=12348
[2026-01-20T14:23:46.150] [BigModuleC] [INFO] Thrift server listening on port 9090
[2026-01-20T14:23:47.200] [BigModuleC] [INFO] ⚠️ FICTIONAL Compensation: D(5.7nm, 4.6nm) → C(-5.7nm, -4.6nm)
```

---

## 5. Class Design

### 5.1 Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│            ICompensationControllerIf (Thrift)                │
├─────────────────────────────────────────────────────────────┤
│ + virtual void applyDistortion(distortion) = 0               │
└─────────────────────────────────────────────────────────────┘
                            △
                            │ (implements)
                            │
┌─────────────────────────────────────────────────────────────┐
│          CompensationControllerHandler                       │
├─────────────────────────────────────────────────────────────┤
│ - strategy_: ICompensationStrategy*                          │
│ - writer_: SharedMemoryWriter*                               │
│ - mutex_: mutex                                              │
├─────────────────────────────────────────────────────────────┤
│ + CompensationControllerHandler(strategy, writer)           │
│ + applyDistortion(distortion: DistortionVector): void       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ uses
                            ↓
┌─────────────────────────────────────────────────────────────┐
│               ICompensationStrategy                          │
├─────────────────────────────────────────────────────────────┤
│ + virtual computeCompensation(distortion): CompensationVector = 0 │
│ + virtual ~ICompensationStrategy() = default                 │
└─────────────────────────────────────────────────────────────┘
                            △
                            │ (implements)
                            │
┌─────────────────────────────────────────────────────────────┐
│             SimpleNegationStrategy                           │
├─────────────────────────────────────────────────────────────┤
│ + computeCompensation(distortion): CompensationVector       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            SharedMemoryWriter (Singleton)                    │
├─────────────────────────────────────────────────────────────┤
│ - instance_: SharedMemoryWriter* (static)                   │
│ - shmFd_: int                                                │
│ - shmPtr_: SharedLithoState*                                │
│ - mutex_: mutex                                              │
├─────────────────────────────────────────────────────────────┤
│ + getInstance(): SharedMemoryWriter* (static)               │
│ + attach(name: string): void                                 │
│ + writeCompensation(compensation: CompensationVector): void │
│ + detach(): void                                             │
│ - SharedMemoryWriter()                                       │
│ - ~SharedMemoryWriter()                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  ThriftRPCServer                             │
├─────────────────────────────────────────────────────────────┤
│ - port_: int                                                 │
│ - server_: shared_ptr<TThreadedServer>                      │
│ - serverSocket_: shared_ptr<TServerSocket>                  │
│ - handler_: shared_ptr<CompensationControllerHandler>       │
├─────────────────────────────────────────────────────────────┤
│ + ThriftRPCServer(port: int, handler)                       │
│ + start(): void                                              │
│ + stop(): void                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        Logger                                │
├─────────────────────────────────────────────────────────────┤
│ - mutex_: mutex (static)                                     │
├─────────────────────────────────────────────────────────────┤
│ + info(msg: string): void (static)                          │
│ + warn(msg: string): void (static)                          │
│ + error(msg: string): void (static)                         │
│ - currentTimestamp(): string (static)                       │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Data Structures

#### 5.2.1 SharedLithoState (Extended for BigModuleC)

**Read-Write Access** to shared memory:

```cpp
struct SharedLithoState {
    uint32_t magic;              // 0x4C49544F ("LITO")
    double current_temp_C;       // Current temperature (BigModuleA writes)
    double timestamp_s;          // Time since epoch (BigModuleA writes)
    uint32_t sample_count;       // Sample count (BigModuleA writes)

    // BigModuleC writes compensation values here
    double compensation_x_nm;    // X-direction compensation (nanometers)
    double compensation_y_nm;    // Y-direction compensation (nanometers)
    double compensation_timestamp_s;  // When compensation was applied

    char padding[4036];          // Align to 4096 bytes (adjusted for new fields)
};
```

**BigModuleC Writes**:
- `compensation_x_nm`: Computed X-direction compensation
- `compensation_y_nm`: Computed Y-direction compensation
- `compensation_timestamp_s`: Timestamp when compensation was applied

#### 5.2.2 DistortionVector (Thrift - Input)

**Received from BigModuleB via RPC**:

```thrift
struct DistortionVector {
    1: double distortion_x_nm,  // X-direction distortion (input)
    2: double distortion_y_nm,  // Y-direction distortion (input)
    3: double timestamp_s       // Timestamp from BigModuleB
}
```

#### 5.2.3 CompensationVector (Internal)

**Computed by CompensationStrategy**:

```cpp
struct CompensationVector {
    double compensation_x_nm;  // X-direction compensation (nanometers)
    double compensation_y_nm;  // Y-direction compensation (nanometers)
    double timestamp_s;        // Timestamp when computed
};
```

---

## 6. Sequence Diagrams

### 6.1 Startup Sequence

```
┌──────┐   ┌────────────┐   ┌──────────┐   ┌─────────┐   ┌────────┐
│ Main │   │SharedMemory│   │  Thrift  │   │Strategy │   │Handler │
│      │   │   Writer   │   │  Server  │   │         │   │        │
└──┬───┘   └─────┬──────┘   └────┬─────┘   └────┬────┘   └───┬────┘
   │             │                │              │            │
   │ log("Starting")              │              │            │
   │─────────────────────────────────────────────────────────→│
   │             │                │              │            │
   │ getInstance()│                │              │            │
   │────────────→│                │              │            │
   │             │                │              │            │
   │ attach("/rtdcs_shared_state")│              │            │
   │────────────→│                │              │            │
   │             │                │              │            │
   │             │ shm_open(O_RDWR)               │            │
   │             │─────────────────────────────────────────────│
   │             │                │              │            │
   │             │ mmap(PROT_READ|PROT_WRITE)     │            │
   │             │─────────────────────────────────────────────│
   │             │                │              │            │
   │             │ validate magic │              │            │
   │             │──────────────  │              │            │
   │             │                │              │            │
   │ log("Shared memory attached")│              │            │
   │─────────────────────────────────────────────────────────→│
   │             │                │              │            │
   │ new SimpleNegationStrategy() │              │            │
   │──────────────────────────────────────────→  │            │
   │             │                │              │            │
   │ new CompensationControllerHandler(strategy, writer)      │
   │──────────────────────────────────────────────────────────→│
   │             │                │              │            │
   │ new ThriftRPCServer(9090, handler)          │            │
   │────────────────────────────→│              │            │
   │             │                │              │            │
   │             │                │ TServerSocket::listen(9090)
   │             │                │──────────────────────────→ │
   │             │                │              │            │
   │ log("Thrift server listening on port 9090")             │
   │─────────────────────────────────────────────────────────→│
   │             │                │              │            │
   │ server.start() [BLOCKING]   │              │            │
   │────────────────────────────→│              │            │
   │             │                │              │            │
   │ log("BigModuleC READY")     │              │            │
   │─────────────────────────────────────────────────────────→│
   │             │                │              │            │
   │             │  [Wait for RPC requests...]   │            │
   │             │                │              │            │
```

### 6.2 RPC Request Handling (applyDistortion)

```
┌──────────┐   ┌──────────┐   ┌─────────┐   ┌────────────┐
│BigModuleB│   │  Thrift  │   │ Handler │   │  Strategy  │   │SharedMemory│
│  Client  │   │  Server  │   │         │   │            │   │   Writer   │
└────┬─────┘   └────┬─────┘   └────┬────┘   └─────┬──────┘   └─────┬──────┘
     │              │              │               │                │
     │ RPC: applyDistortion(D)     │               │                │
     │─────────────→│              │               │                │
     │              │              │               │                │
     │              │ [Accept connection, spawn thread]            │
     │              │──────────────│               │                │
     │              │              │               │                │
     │              │ handler->applyDistortion(D) │                │
     │              │─────────────→│               │                │
     │              │              │               │                │
     │              │              │ log("Received distortion: X=5.7nm, Y=4.6nm")
     │              │              │──────────────────────────────────────────→
     │              │              │               │                │
     │              │              │ validate(D)   │                │
     │              │              │───────────────│                │
     │              │              │               │                │
     │              │              │ computeCompensation(D)         │
     │              │              │──────────────→│                │
     │              │              │               │                │
     │              │              │               │ C = -D (negation)
     │              │              │               │────────────────│
     │              │              │               │                │
     │              │              │←──────────────│                │
     │              │              │  C(-5.7nm, -4.6nm)             │
     │              │              │               │                │
     │              │              │ log("⚠️ FICTIONAL Compensation: D(5.7nm, 4.6nm) → C(-5.7nm, -4.6nm)")
     │              │              │──────────────────────────────────────────→
     │              │              │               │                │
     │              │              │ writeCompensation(C)           │
     │              │              │────────────────────────────────→│
     │              │              │               │                │
     │              │              │               │  write to shm  │
     │              │              │               │  ──────────────│
     │              │              │               │                │
     │              │              │ log("Compensation written to shared memory")
     │              │              │──────────────────────────────────────────→
     │              │              │               │                │
     │              │←─────────────│               │                │
     │              │  (void)      │               │                │
     │              │              │               │                │
     │←─────────────│              │               │                │
     │  RPC Success │              │               │                │
     │              │              │               │                │
```

### 6.3 Graceful Shutdown Sequence

```
┌──────┐   ┌──────────┐   ┌────────────┐
│Signal│   │  Thrift  │   │SharedMemory│
│Handler│   │  Server  │   │   Writer   │
└──┬───┘   └────┬─────┘   └─────┬──────┘
   │            │               │
   │ SIGINT     │               │
   │ (Ctrl+C)   │               │
   │────────────│               │
   │            │               │
   │ log("Shutdown signal received")
   │───────────────────────────────────────→
   │            │               │
   │ server.stop()              │
   │───────────→│               │
   │            │               │
   │            │ [Stop accepting new connections]
   │            │───────────────│
   │            │               │
   │            │ [Wait for active threads to complete]
   │            │───────────────│
   │            │               │
   │ log("Thrift server stopped")
   │───────────────────────────────────────→
   │            │               │
   │ writer.detach()            │
   │────────────────────────────→│
   │            │               │
   │            │               │ munmap()
   │            │               │──────────│
   │            │               │
   │            │               │ close(shmFd_)
   │            │               │──────────│
   │            │               │
   │ log("Shared memory detached")
   │───────────────────────────────────────→
   │            │               │
   │ log("BigModuleC stopped") │
   │───────────────────────────────────────→
   │            │               │
   │ exit(0)    │               │
   │────────────────────────────────────────
   │            │               │
```

---

## 7. Compensation Algorithm Design

### 7.1 FICTIONAL Simple Negation Algorithm

**⚠️ CRITICAL DISCLAIMER**: This algorithm is **completely FICTIONAL** and has no real-world validity.

#### 7.1.1 Mathematical Formula

**Negation**:
```
compensation_x = -distortion_x
compensation_y = -distortion_y
```

Where:
- `distortion_x`, `distortion_y`: Input from BigModuleB (nanometers)
- `compensation_x`, `compensation_y`: Output compensation values (nanometers)

**Fictional Justification**:
- Negating distortion "cancels out" the thermal expansion effect
- In reality, lithography uses complex multi-parameter correction models

#### 7.1.2 Example Calculation

**Input**: DistortionVector { X = 5.7 nm, Y = 4.6 nm }

**Computation**:
```
compensation_x = -5.7 nm
compensation_y = -4.6 nm
```

**Output**: CompensationVector { X = -5.7 nm, Y = -4.6 nm }

#### 7.1.3 Implementation

```cpp
CompensationVector SimpleNegationStrategy::computeCompensation(
    const DistortionVector& distortion) const {

    CompensationVector result;

    // FICTIONAL negation algorithm
    result.compensation_x_nm = -distortion.distortion_x_nm;
    result.compensation_y_nm = -distortion.distortion_y_nm;

    // Add timestamp
    result.timestamp_s = getCurrentTime();

    return result;
}
```

**Time Complexity**: O(1) - constant time computation
**Space Complexity**: O(1) - no dynamic allocation

### 7.2 Alternative Strategies (Future)

**Strategy Pattern** allows easy addition of new compensation algorithms:

```cpp
class ICompensationStrategy {
public:
    virtual CompensationVector computeCompensation(
        const DistortionVector& distortion) const = 0;
    virtual ~ICompensationStrategy() = default;
};

// Current implementation
class SimpleNegationStrategy : public ICompensationStrategy { /*...*/ };

// Future alternatives
class ScaledNegationStrategy : public ICompensationStrategy { /*...*/ };
class LookupTableStrategy : public ICompensationStrategy { /*...*/ };
class MLModelStrategy : public ICompensationStrategy { /*...*/ };
```

---

## 8. Inter-Module Communication

### 8.1 Thrift RPC Server (BigModuleB → BigModuleC)

#### 8.1.1 Server Initialization

```cpp
ThriftRPCServer::ThriftRPCServer(int port,
    std::shared_ptr<CompensationControllerHandler> handler)
    : port_(port) {

    using namespace apache::thrift;

    // Create server socket
    serverSocket_ = std::make_shared<transport::TServerSocket>(port_);

    // Create transport and protocol factories
    auto transportFactory =
        std::make_shared<transport::TBufferedTransportFactory>();
    auto protocolFactory =
        std::make_shared<protocol::TBinaryProtocolFactory>();

    // Create processor
    auto processor =
        std::make_shared<ICompensationControllerProcessor>(handler);

    // Create threaded server
    server_ = std::make_shared<server::TThreadedServer>(
        processor, serverSocket_, transportFactory, protocolFactory);

    Logger::info("Thrift RPC server initialized on port " +
                 std::to_string(port_));
}

void ThriftRPCServer::start() {
    try {
        Logger::info("Thrift server listening on port " +
                     std::to_string(port_));
        server_->serve();  // Blocking call
    } catch (const apache::thrift::TException& ex) {
        Logger::error("Thrift server error: " + std::string(ex.what()));
        throw;
    }
}
```

#### 8.1.2 Multi-Threaded Request Handling

**TThreadedServer** creates a new thread for each connection:

- **Main Thread**: Accept new connections
- **Worker Threads**: Handle individual RPC requests
- **Thread Pool**: Reuse threads for efficiency

**Concurrency**:
- Multiple BigModuleB clients can connect simultaneously (future enhancement)
- Mutex protects shared memory writes from concurrent RPC calls

### 8.2 Shared Memory Communication (BigModuleC → Shared State)

#### 8.2.1 Write-Only Access

BigModuleC **writes** compensation values to shared memory:

```cpp
void SharedMemoryWriter::attach(const std::string& name) {
    // Open existing shared memory segment (O_RDWR for read-write)
    shmFd_ = shm_open(name.c_str(), O_RDWR, 0);
    if (shmFd_ == -1) {
        throw std::runtime_error("Failed to attach to shared memory: " +
                                  std::string(strerror(errno)));
    }

    // Map shared memory (PROT_READ | PROT_WRITE)
    void* ptr = mmap(nullptr, sizeof(SharedLithoState),
                     PROT_READ | PROT_WRITE, MAP_SHARED, shmFd_, 0);
    if (ptr == MAP_FAILED) {
        close(shmFd_);
        throw std::runtime_error("Failed to mmap shared memory");
    }

    shmPtr_ = static_cast<SharedLithoState*>(ptr);

    // Validate magic number
    if (shmPtr_->magic != 0x4C49544F) {
        throw std::runtime_error("Invalid shared memory magic number");
    }

    Logger::info("Shared memory attached: " + name);
}
```

#### 8.2.2 Write Compensation

```cpp
void SharedMemoryWriter::writeCompensation(
    const CompensationVector& compensation) {

    if (!shmPtr_) {
        throw std::runtime_error("Shared memory not attached");
    }

    // Thread-safe write with mutex
    std::lock_guard<std::mutex> lock(mutex_);

    shmPtr_->compensation_x_nm = compensation.compensation_x_nm;
    shmPtr_->compensation_y_nm = compensation.compensation_y_nm;
    shmPtr_->compensation_timestamp_s = compensation.timestamp_s;

    Logger::info("Compensation written to shared memory: X=" +
                 std::to_string(compensation.compensation_x_nm) + "nm, Y=" +
                 std::to_string(compensation.compensation_y_nm) + "nm");
}
```

**Thread Safety**: Mutex protects against race conditions from concurrent RPC threads.

---

## 9. Error Handling

### 9.1 Error Categories

| Error Category | Handling Strategy | Recovery |
|----------------|-------------------|----------|
| **Shared Memory Unavailable** | Throw exception at startup, exit | User must start BigModuleA first |
| **Thrift Server Bind Failed** | Throw exception, exit | Check port 9090 not in use |
| **Invalid Distortion Input** | Log warning, skip compensation | Continue serving RPC |
| **Shared Memory Write Failed** | Log error, throw exception | Depends on cause |
| **Thrift RPC Exception** | Log error, send error response | Client retries |

### 9.2 Startup Error Handling

```cpp
int main() {
    try {
        // Attach to shared memory
        SharedMemoryWriter* writer = SharedMemoryWriter::getInstance();
        writer->attach("/rtdcs_shared_state");

    } catch (const std::exception& ex) {
        Logger::error("Failed to attach to shared memory: " +
                      std::string(ex.what()));
        Logger::error("Ensure BigModuleA is running first.");
        return EXIT_FAILURE;
    }

    try {
        // Start Thrift RPC server
        ThriftRPCServer server(9090, handler);
        server.start();  // Blocking

    } catch (const std::exception& ex) {
        Logger::error("Failed to start Thrift server: " +
                      std::string(ex.what()));
        Logger::error("Check if port 9090 is already in use.");
        return EXIT_FAILURE;
    }

    return EXIT_SUCCESS;
}
```

### 9.3 Runtime Error Handling

```cpp
void CompensationControllerHandler::applyDistortion(
    const DistortionVector& distortion) {

    try {
        // Validate input (sanity check)
        if (std::abs(distortion.distortion_x_nm) > 1000.0 ||
            std::abs(distortion.distortion_y_nm) > 1000.0) {
            Logger::warn("Invalid distortion values: X=" +
                         std::to_string(distortion.distortion_x_nm) + "nm, Y=" +
                         std::to_string(distortion.distortion_y_nm) + "nm");
            return;  // Skip this request
        }

        // Log received distortion
        Logger::info("Received distortion: X=" +
                     std::to_string(distortion.distortion_x_nm) + "nm, Y=" +
                     std::to_string(distortion.distortion_y_nm) + "nm");

        // Compute compensation (thread-safe)
        std::lock_guard<std::mutex> lock(mutex_);
        CompensationVector compensation =
            strategy_->computeCompensation(distortion);

        // Log FICTIONAL compensation
        Logger::info("⚠️ FICTIONAL Compensation: D(" +
                     std::to_string(distortion.distortion_x_nm) + "nm, " +
                     std::to_string(distortion.distortion_y_nm) + "nm) → C(" +
                     std::to_string(compensation.compensation_x_nm) + "nm, " +
                     std::to_string(compensation.compensation_y_nm) + "nm)");

        // Write to shared memory
        writer_->writeCompensation(compensation);

    } catch (const std::exception& ex) {
        Logger::error("applyDistortion failed: " + std::string(ex.what()));
        throw;  // Propagate error to Thrift client
    }
}
```

---

## 10. Performance Considerations

### 10.1 Performance Requirements

| Metric | Target | Measured |
|--------|--------|----------|
| **RPC Latency** | < 5 ms | ~1 ms (localhost) |
| **Compensation Latency** | < 1 ms | ~0.1 ms |
| **Throughput** | > 100 RPC/s | ~1000 RPC/s |
| **CPU Usage** | < 5% (idle), < 20% (active) | ~2% (idle), ~10% (5 Hz) |
| **Memory Footprint** | < 15 MB | ~10 MB |

### 10.2 Optimization Strategies

#### 10.2.1 Algorithm Optimization

- **O(1) Compensation**: Simple negation is constant time
- **No Heap Allocation**: CompensationVector is stack-allocated
- **Minimal Computation**: Only two negation operations

#### 10.2.2 Concurrency Optimization

- **Multi-Threaded Server**: TThreadedServer scales with cores
- **Fine-Grained Locking**: Mutex only during compensation computation and shared memory write
- **Thread Pool** (future): Reuse threads instead of creating new ones

#### 10.2.3 Communication Optimization

- **Binary Protocol**: Thrift TBinaryProtocol is efficient
- **Buffered Transport**: Reduces system calls
- **Localhost**: No network latency (< 1 ms RPC)

### 10.3 Memory Layout

**Total Memory**: ~10 MB (estimated)

```
Stack Memory:
- Main thread stack: ~1 MB
- Worker thread stacks: ~1 MB each (up to 10 threads)

Heap Memory:
- Thrift server objects: ~2 MB
- Logger buffers: ~100 KB

Shared Memory:
- Read-write mapping: 4096 bytes (one page)
```

---

## 11. Platform-Specific Implementation

### 11.1 Linux (Ubuntu 20.04+)

**Primary Target Platform**

**Compiler**: GCC 7+ or Clang 6+
**Standard Library**: libstdc++ or libc++

**Threading**: POSIX threads (pthread)
**Shared Memory**: `/dev/shm/rtdcs_shared_state` (tmpfs)

### 11.2 macOS (11.0+)

**Development Platform Support**

**Compiler**: Apple Clang (Xcode Command Line Tools)
**Standard Library**: libc++ (LLVM)

**Threading**: POSIX threads (pthread)
**Shared Memory**: Virtual memory backed (no `/dev/shm/`)

### 11.3 Platform Detection

**Makefile** (common.mk):
```makefile
UNAME_S := $(shell uname -s)

ifeq ($(UNAME_S),Darwin)
    OS_TYPE := macOS
    CXX := clang++
    LIBS := -lthrift -lpthread
else ifeq ($(UNAME_S),Linux)
    OS_TYPE := Linux
    CXX := g++
    LIBS := -lthrift -lpthread -Wl,-rpath,$(THRIFT_LIB_DIR)
endif
```

**No Platform-Specific Code** in BigModuleC (all POSIX-compliant).

---

## 12. Testing Considerations

### 12.1 Unit Testing (Developer Agent)

**Test Framework**: Google Test (gtest)

**Unit Tests** (BigModuleC/tests/unit/):

1. **test_simple_negation.cpp**:
   - Test negation formula correctness
   - Test various distortion inputs
   - Test edge cases (zero, negative, large values)

2. **test_shared_memory_writer.cpp**:
   - Test attachment to existing shared memory
   - Test error when shared memory doesn't exist
   - Test magic number validation
   - Test compensation writing

3. **test_thrift_handler.cpp**:
   - Mock SharedMemoryWriter and Strategy
   - Test applyDistortion() method
   - Test input validation
   - Test error handling

### 12.2 Component Testing (Tester Agent)

**Component Tests** (BigModuleC/tests/component/):

1. **test_thrift_server.cpp**:
   - Start Thrift server on test port
   - Create Thrift client
   - Test end-to-end RPC communication
   - Verify server accepts connections

2. **test_concurrency.cpp**:
   - Multiple concurrent RPC requests
   - Verify thread safety (no race conditions)
   - Measure throughput (RPC/s)

### 12.3 Integration Testing (Tester Agent)

**Integration Tests** (BigModuleC/tests/integration/):

1. **test_moduleb_to_modulec.cpp**:
   - Start BigModuleC (Thrift RPC server)
   - Start BigModuleB (Thrift RPC client)
   - Verify BigModuleC receives distortions
   - Verify compensation written to shared memory

2. **test_modulec_to_shared_memory.cpp**:
   - Start BigModuleA (creates shared memory)
   - Start BigModuleC (writes compensation)
   - Verify shared memory updates

### 12.4 System Testing (Tester Agent)

**System Tests** (BigModuleC/tests/system/):

1. **test_full_system.cpp**:
   - Start BigModuleA, BigModuleC, BigModuleB (in order)
   - Run for 60 seconds
   - Verify end-to-end data flow
   - Verify FICTIONAL warnings in logs
   - Verify compensation values in shared memory

---

## 13. Build and Deployment

### 13.1 Build System

**Makefile** (BigModuleC/Makefile):

```makefile
include $(REPO_ROOT)/common_infra/build_tools/common.mk

# Module-specific settings
MODULE_NAME := BigModuleC
THRIFT_IDL := src/ext/interfaces/ICompensationController.thrift

# Source files
SOURCES := src/int/impl/main.cpp \
           src/int/impl/CompensationControllerHandler.cpp \
           src/int/impl/SimpleNegationStrategy.cpp \
           src/int/impl/SharedMemoryWriter.cpp \
           src/int/impl/ThriftRPCServer.cpp \
           src/int/impl/Logger.cpp \
           src/int/generated/ICompensationController.cpp

# Build targets
all: generate build

generate:
	$(MSG_GEN) Generating C++ from Thrift IDL
	$(THRIFT) $(THRIFT_FLAGS) -o $(INT_GENERATED_DIR) $(THRIFT_IDL)

build: build-debug build-release

build-debug:
	$(MSG_BUILD) Building debug version
	$(CXX) $(CXXFLAGS_DEBUG) $(INCLUDES) $(SOURCES) $(LDFLAGS) $(LIBS) \
	       -o $(DEBUG_DIR)/$(MODULE_NAME)

build-release:
	$(MSG_BUILD) Building release version
	$(CXX) $(CXXFLAGS_RELEASE) $(INCLUDES) $(SOURCES) $(LDFLAGS) $(LIBS) \
	       -o $(RELEASE_DIR)/$(MODULE_NAME)

clean:
	$(MSG_CLEAN) Cleaning build artifacts
	rm -rf $(BUILD_DIR) $(INT_GENERATED_DIR)
```

### 13.2 Dependencies

**Build-Time Dependencies**:
- Apache Thrift 0.19.0 compiler (`thrift`)
- C++14 or later compiler (g++ or clang++)
- GNU Make
- POSIX threads library (pthread)

**Runtime Dependencies**:
- Apache Thrift 0.19.0 C++ runtime library (`libthrift.so` or `libthrift.dylib`)
- POSIX shared memory support (shm_open, mmap)
- POSIX threads (pthread)
- BigModuleA running (creates shared memory)

### 13.3 Deployment

**Installation** (to repository release/ folder):

```bash
cd BigModuleC
make install
```

**Files Installed**:
```
release/
├── bin/
│   └── BigModuleC          # Executable
├── lib/
│   └── libBigModuleC.a     # Static library
└── include/
    ├── ICompensationController.h
    └── ICompensationController_types.h
```

**Execution**:
```bash
# Ensure BigModuleA is running first
./release/bin/BigModuleC

# Or from build directory
./build/release/BigModuleC

# With custom port (default 9090)
./build/release/BigModuleC --port 9091
```

---

## 14. Future Enhancements

### 14.1 Planned Features (Post-POC)

1. **Advanced Compensation Strategies**:
   - Scaled negation with configurable factors
   - Lookup table-based compensation
   - Machine learning model integration

2. **Configuration File**:
   - Load compensation algorithm parameters from config file
   - Support multiple strategies selectable at runtime

3. **Performance Monitoring**:
   - Track RPC request count, latency statistics
   - Log warnings if throughput degrades

4. **Thread Pool**:
   - Replace TThreadedServer with TThreadPoolServer
   - Limit maximum concurrent threads

5. **Logging Enhancements**:
   - Configurable log levels (DEBUG, INFO, WARN, ERROR)
   - Log rotation and file output
   - Structured logging (JSON format)

6. **Health Monitoring**:
   - Expose health check endpoint (HTTP or Thrift)
   - Monitor shared memory connectivity

### 14.2 Extensibility

**Strategy Pattern** allows easy addition of new compensation algorithms:

```cpp
class ICompensationStrategy {
public:
    virtual CompensationVector computeCompensation(
        const DistortionVector& distortion) const = 0;
    virtual ~ICompensationStrategy() = default;
};

// Current implementation
class SimpleNegationStrategy : public ICompensationStrategy { /*...*/ };

// Future alternatives
class ScaledNegationStrategy : public ICompensationStrategy {
    double scaleFactor_;
public:
    CompensationVector computeCompensation(const DistortionVector& distortion) const override {
        CompensationVector result;
        result.compensation_x_nm = -distortion.distortion_x_nm * scaleFactor_;
        result.compensation_y_nm = -distortion.distortion_y_nm * scaleFactor_;
        return result;
    }
};

class LookupTableStrategy : public ICompensationStrategy { /*...*/ };
class MLModelStrategy : public ICompensationStrategy { /*...*/ };
```

**Factory Pattern** for strategy selection:

```cpp
std::unique_ptr<ICompensationStrategy> createStrategy(const std::string& type) {
    if (type == "negation") {
        return std::make_unique<SimpleNegationStrategy>();
    } else if (type == "scaled") {
        return std::make_unique<ScaledNegationStrategy>(0.8);
    } else if (type == "lookup") {
        return std::make_unique<LookupTableStrategy>();
    } else if (type == "ml") {
        return std::make_unique<MLModelStrategy>();
    }
    throw std::invalid_argument("Unknown strategy type: " + type);
}
```

---

## Appendix A: Key Classes Reference

### A.1 CompensationControllerHandler

```cpp
class CompensationControllerHandler : public ICompensationControllerIf {
public:
    CompensationControllerHandler(ICompensationStrategy* strategy,
                                  SharedMemoryWriter* writer);

    void applyDistortion(const DistortionVector& distortion) override;

private:
    ICompensationStrategy* strategy_;
    SharedMemoryWriter* writer_;
    std::mutex mutex_;
};
```

### A.2 SimpleNegationStrategy

```cpp
class SimpleNegationStrategy : public ICompensationStrategy {
public:
    CompensationVector computeCompensation(
        const DistortionVector& distortion) const override;
};
```

### A.3 SharedMemoryWriter

```cpp
class SharedMemoryWriter {
public:
    static SharedMemoryWriter* getInstance();
    void attach(const std::string& name);
    void writeCompensation(const CompensationVector& compensation);
    void detach();

private:
    SharedMemoryWriter() = default;
    ~SharedMemoryWriter();
    static SharedMemoryWriter* instance_;
    int shmFd_;
    SharedLithoState* shmPtr_;
    std::mutex mutex_;
};
```

### A.4 ThriftRPCServer

```cpp
class ThriftRPCServer {
public:
    ThriftRPCServer(int port,
                    std::shared_ptr<CompensationControllerHandler> handler);
    ~ThriftRPCServer();

    void start();  // Blocking
    void stop();

private:
    int port_;
    std::shared_ptr<apache::thrift::server::TThreadedServer> server_;
    std::shared_ptr<apache::thrift::transport::TServerSocket> serverSocket_;
};
```

---

## Appendix B: Thrift Interface Definition

**File**: `BigModuleC/src/ext/interfaces/ICompensationController.thrift`

```thrift
namespace cpp rtdcs.interfaces

/**
 * Reticle distortion vector in X and Y directions
 * ⚠️ FICTIONAL: Based on made-up Zeeman Thermal Expansion Model
 */
struct DistortionVector {
    1: double distortion_x_nm,  // X-direction distortion (nanometers)
    2: double distortion_y_nm,  // Y-direction distortion (nanometers)
    3: double timestamp_s       // Timestamp when prediction was made
}

/**
 * Compensation Controller Service
 * Receives distortion predictions from BigModuleB and applies compensation
 */
service ICompensationController {
    /**
     * Apply reticle distortion compensation
     * @param distortion The predicted distortion vector
     */
    void applyDistortion(1: DistortionVector distortion)
}
```

---

## Appendix C: Example Execution Log

```
[2026-01-20T14:23:46.100] [BigModuleC] [INFO] BigModuleC starting, PID=12348
[2026-01-20T14:23:46.120] [BigModuleC] [INFO] Shared memory attached: /rtdcs_shared_state
[2026-01-20T14:23:46.140] [BigModuleC] [INFO] Simple Negation Strategy initialized
[2026-01-20T14:23:46.160] [BigModuleC] [INFO] Thrift RPC server initialized on port 9090
[2026-01-20T14:23:46.180] [BigModuleC] [INFO] Thrift server listening on port 9090
[2026-01-20T14:23:46.200] [BigModuleC] [INFO] BigModuleC READY
[2026-01-20T14:23:47.200] [BigModuleC] [INFO] Received distortion: X=5.6nm, Y=4.5nm
[2026-01-20T14:23:47.201] [BigModuleC] [INFO] ⚠️ FICTIONAL Compensation: D(5.6nm, 4.5nm) → C(-5.6nm, -4.5nm)
[2026-01-20T14:23:47.202] [BigModuleC] [INFO] Compensation written to shared memory: X=-5.6nm, Y=-4.5nm
[2026-01-20T14:23:47.400] [BigModuleC] [INFO] Received distortion: X=5.7nm, Y=4.6nm
[2026-01-20T14:23:47.401] [BigModuleC] [INFO] ⚠️ FICTIONAL Compensation: D(5.7nm, 4.6nm) → C(-5.7nm, -4.6nm)
[2026-01-20T14:23:47.402] [BigModuleC] [INFO] Compensation written to shared memory: X=-5.7nm, Y=-4.6nm
^C
[2026-01-20T14:23:48.000] [BigModuleC] [INFO] Shutdown signal received
[2026-01-20T14:23:48.010] [BigModuleC] [INFO] Thrift server stopped
[2026-01-20T14:23:48.020] [BigModuleC] [INFO] Shared memory detached
[2026-01-20T14:23:48.030] [BigModuleC] [INFO] BigModuleC stopped
```

---

## Document Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-20 | Architect Agent | Initial BigModuleC EDS created |

---

**End of BigModuleC External Design Specification**
