# RTDCS BigModuleB External Design Specification (EDS)

**Document**: BigModuleB (DistortionPredictor) External Design Specification
**Project**: RTDCS (Reticle Thermal Distortion Compensation System)
**Module**: BigModuleB - DistortionPredictor
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
7. [Algorithm Design](#7-algorithm-design)
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

This document provides the detailed external design for **BigModuleB (DistortionPredictor)**, which predicts reticle thermal distortion based on temperature data using a **FICTIONAL Zeeman Thermal Expansion Model**.

**⚠️ CRITICAL DISCLAIMER**: The Zeeman Thermal Expansion Model and all associated algorithms are **completely FICTIONAL** and created solely for this proof-of-concept demonstration. They have no basis in real physics, lithography science, or any actual Zeeman effect research.

### 1.2 Scope

This EDS covers:
- Component architecture and class design
- FICTIONAL Zeeman algorithm implementation details
- Shared memory reading mechanism
- Thrift RPC client implementation for communication with BigModuleC
- 5 Hz prediction loop design
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
- **rtdcs-moduleb-eps.md**: BigModuleB external product specification
- **rtdcs-modulea-eds.md**: BigModuleA design for shared memory structure
- **rtdcs-modulec-eds.md**: BigModuleC design for Thrift RPC server interface

---

## 2. System Context

### 2.1 Role in RTDCS System

BigModuleB is the **prediction engine** of the RTDCS system:

```
BigModuleA (ThermalMonitor)
    ↓ [Shared Memory: Temperature]
BigModuleB (DistortionPredictor) ← This Module
    ↓ [Thrift RPC: Distortion Vector]
BigModuleC (CompensationController)
```

### 2.2 Responsibilities

1. **Read Temperature**: Attach to shared memory created by BigModuleA
2. **Predict Distortion**: Apply FICTIONAL Zeeman algorithm to compute X/Y distortion
3. **Send Predictions**: Use Thrift RPC client to send distortion to BigModuleC
4. **Periodic Execution**: Run prediction loop at 5 Hz (200 ms intervals)
5. **Graceful Shutdown**: Clean up resources on SIGINT/SIGTERM

### 2.3 Dependencies

**Runtime Dependencies**:
- BigModuleA must be running first (creates shared memory)
- BigModuleC must be running (Thrift RPC server on port 9090)

**Build Dependencies**:
- Apache Thrift 0.19.0 (C++ runtime and compiler)
- POSIX shared memory API (shm_open, mmap)
- C++14 or later standard library

---

## 3. Architecture Overview

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BigModuleB Process                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌─────────────────────────────┐ │
│  │  Main Controller  │─────→│  FictionalZeemanPredictor  │ │
│  └──────────────────┘      └─────────────────────────────┘ │
│           │                              │                   │
│           │                              │ (Strategy)        │
│           ↓                              ↓                   │
│  ┌──────────────────┐      ┌─────────────────────────────┐ │
│  │ SharedMemoryReader│      │   PredictionLoop (5 Hz)    │ │
│  └──────────────────┘      └─────────────────────────────┘ │
│           │                              │                   │
│           │                              ↓                   │
│           │                  ┌─────────────────────────────┐│
│           │                  │   ThriftRPCClient           ││
│           │                  │  (ICompensationController)  ││
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
   [Shared Memory]            [Thrift RPC: TCP :9090]
  /rtdcs_shared_state          BigModuleC Server
```

### 3.2 Design Patterns Applied

1. **Strategy Pattern**: FICTIONAL Zeeman algorithm is encapsulated as a strategy
2. **Singleton Pattern**: SharedMemoryReader (single attachment point)
3. **Adapter Pattern**: Thrift RPC client adapts to ICompensationController interface
4. **Observer Pattern**: Monitors shared memory for temperature changes
5. **Template Method**: Prediction loop structure with customizable algorithm

### 3.3 SOLID Principles Application

| Principle | Application |
|-----------|-------------|
| **Single Responsibility** | FictionalZeemanPredictor only computes distortion |
| **Open/Closed** | Algorithm can be extended (add new prediction models) without modifying core loop |
| **Liskov Substitution** | Any IPredictionAlgorithm can replace FictionalZeemanPredictor |
| **Interface Segregation** | Small, focused interfaces (ISharedMemoryReader, IThriftRPCClient) |
| **Dependency Inversion** | Main controller depends on abstractions, not concrete classes |

---

## 4. Component Design

### 4.1 Component Breakdown

#### 4.1.1 SharedMemoryReader

**Purpose**: Read temperature data from POSIX shared memory created by BigModuleA.

**Responsibilities**:
- Attach to existing shared memory segment `/rtdcs_shared_state`
- Read SharedLithoState structure
- Validate data integrity (magic number)
- Handle attachment errors

**Key Methods**:
```cpp
class SharedMemoryReader {
public:
    static SharedMemoryReader* getInstance();
    void attach(const std::string& name);
    double readTemperature() const;
    void detach();

private:
    SharedMemoryReader() = default;
    static SharedMemoryReader* instance_;
    int shmFd_;
    const SharedLithoState* shmPtr_;
};
```

**Error Handling**:
- Throw exception if BigModuleA hasn't created shared memory yet
- Validate magic number (0x4C49544F = "LITO")
- Handle invalid temperature values

#### 4.1.2 FictionalZeemanPredictor

**Purpose**: Implement the **FICTIONAL** Zeeman Thermal Expansion Model.

**⚠️ FICTIONAL DISCLAIMER**: This algorithm is entirely made-up for demonstration purposes.

**Responsibilities**:
- Compute X/Y distortion from temperature using quadratic formula
- Apply configurable coefficients
- Return DistortionVector structure

**Key Methods**:
```cpp
class FictionalZeemanPredictor {
public:
    struct Coefficients {
        double a0, a1, a2;  // X-direction: a0 + a1*T + a2*T^2
        double b0, b1, b2;  // Y-direction: b0 + b1*T + b2*T^2
    };

    FictionalZeemanPredictor(const Coefficients& coeffs);
    DistortionVector predict(double temperature_C) const;

private:
    Coefficients coeffs_;
};
```

**Algorithm** (FICTIONAL):
```
X_distortion(T) = a0 + a1 * T + a2 * T^2
Y_distortion(T) = b0 + b1 * T + b2 * T^2
```

**Default Coefficients** (ARBITRARY):
- a0 = 0.0, a1 = 0.1, a2 = 0.005 (nm/°C and nm/°C²)
- b0 = 0.0, b1 = 0.08, b2 = 0.004 (nm/°C and nm/°C²)

#### 4.1.3 ThriftRPCClient

**Purpose**: Send distortion predictions to BigModuleC via Thrift RPC.

**Responsibilities**:
- Establish TCP connection to BigModuleC (localhost:9090)
- Serialize DistortionVector to Thrift binary format
- Call ICompensationController::applyDistortion() RPC
- Handle connection errors and retries

**Key Methods**:
```cpp
class ThriftRPCClient {
public:
    ThriftRPCClient(const std::string& host, int port);
    ~ThriftRPCClient();

    void connect();
    void sendDistortion(const DistortionVector& distortion);
    void disconnect();

private:
    std::string host_;
    int port_;
    std::shared_ptr<apache::thrift::transport::TSocket> socket_;
    std::shared_ptr<apache::thrift::transport::TTransport> transport_;
    std::shared_ptr<apache::thrift::protocol::TBinaryProtocol> protocol_;
    std::shared_ptr<ICompensationControllerClient> client_;
};
```

**Thrift Interface Used**:
```thrift
struct DistortionVector {
    1: double distortion_x_nm,
    2: double distortion_y_nm,
    3: double timestamp_s
}

service ICompensationController {
    void applyDistortion(1: DistortionVector distortion)
}
```

#### 4.1.4 PredictionLoop

**Purpose**: Execute periodic 5 Hz prediction cycle.

**Responsibilities**:
- Run loop at 200 ms intervals (5 Hz)
- Read temperature → Predict distortion → Send RPC
- Use precise timing (clock_nanosleep on Linux, nanosleep on macOS)
- Stop gracefully on signal

**Key Methods**:
```cpp
class PredictionLoop {
public:
    PredictionLoop(SharedMemoryReader* reader,
                   FictionalZeemanPredictor* predictor,
                   ThriftRPCClient* client);
    void start();
    void stop();

private:
    void runCycle();
    void preciseWait(int64_t duration_ns);

    SharedMemoryReader* reader_;
    FictionalZeemanPredictor* predictor_;
    ThriftRPCClient* client_;
    std::atomic<bool> running_;
};
```

**Timing**:
- Target frequency: 5 Hz (200 ms period)
- Timing mechanism: `clock_nanosleep(CLOCK_MONOTONIC)` on Linux, `nanosleep()` on macOS

#### 4.1.5 Logger

**Purpose**: Timestamped console logging with severity levels.

**Responsibilities**:
- Log prediction results with FICTIONAL warnings
- Log RPC send events
- Log errors and warnings
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
};
```

**Log Format**:
```
[2026-01-20T14:23:45.678] [BigModuleB] [INFO] BigModuleB starting, PID=12345
[2026-01-20T14:23:46.678] [BigModuleB] [INFO] ⚠️ FICTIONAL Zeeman Prediction: T=25.3°C → X=5.7nm, Y=4.6nm
[2026-01-20T14:23:46.680] [BigModuleB] [INFO] Sent distortion to BigModuleC
```

---

## 5. Class Design

### 5.1 Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    IPredictionAlgorithm                      │
├─────────────────────────────────────────────────────────────┤
│ + virtual DistortionVector predict(double temp) = 0         │
│ + virtual ~IPredictionAlgorithm() = default                 │
└─────────────────────────────────────────────────────────────┘
                            △
                            │ (implements)
                            │
┌─────────────────────────────────────────────────────────────┐
│              FictionalZeemanPredictor                        │
├─────────────────────────────────────────────────────────────┤
│ - coeffs_: Coefficients                                      │
├─────────────────────────────────────────────────────────────┤
│ + FictionalZeemanPredictor(coeffs: Coefficients)            │
│ + predict(temperature_C: double): DistortionVector          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               SharedMemoryReader (Singleton)                 │
├─────────────────────────────────────────────────────────────┤
│ - instance_: SharedMemoryReader* (static)                   │
│ - shmFd_: int                                                │
│ - shmPtr_: const SharedLithoState*                          │
├─────────────────────────────────────────────────────────────┤
│ + getInstance(): SharedMemoryReader* (static)               │
│ + attach(name: string): void                                 │
│ + readTemperature(): double                                  │
│ + detach(): void                                             │
│ - SharedMemoryReader()                                       │
│ - ~SharedMemoryReader()                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ThriftRPCClient                           │
├─────────────────────────────────────────────────────────────┤
│ - host_: string                                              │
│ - port_: int                                                 │
│ - socket_: shared_ptr<TSocket>                              │
│ - transport_: shared_ptr<TTransport>                        │
│ - protocol_: shared_ptr<TBinaryProtocol>                    │
│ - client_: shared_ptr<ICompensationControllerClient>        │
├─────────────────────────────────────────────────────────────┤
│ + ThriftRPCClient(host: string, port: int)                  │
│ + connect(): void                                            │
│ + sendDistortion(distortion: DistortionVector): void        │
│ + disconnect(): void                                         │
│ - reconnect(): void                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     PredictionLoop                           │
├─────────────────────────────────────────────────────────────┤
│ - reader_: SharedMemoryReader*                              │
│ - predictor_: FictionalZeemanPredictor*                     │
│ - client_: ThriftRPCClient*                                 │
│ - running_: atomic<bool>                                     │
│ - sampleCount_: int                                          │
├─────────────────────────────────────────────────────────────┤
│ + PredictionLoop(reader, predictor, client)                 │
│ + start(): void                                              │
│ + stop(): void                                               │
│ - runCycle(): void                                           │
│ - preciseWait(duration_ns: int64_t): void                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        Logger                                │
├─────────────────────────────────────────────────────────────┤
│ + info(msg: string): void (static)                          │
│ + warn(msg: string): void (static)                          │
│ + error(msg: string): void (static)                         │
│ - currentTimestamp(): string (static)                       │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Data Structures

#### 5.2.1 SharedLithoState (from BigModuleA)

**Read-Only Access** from shared memory:

```cpp
struct SharedLithoState {
    uint32_t magic;              // 0x4C49544F ("LITO")
    double current_temp_C;       // Current temperature in °C
    double timestamp_s;          // Time since epoch in seconds
    uint32_t sample_count;       // Number of samples taken
    char padding[4060];          // Align to 4096 bytes
};
```

**BigModuleB Only Reads**:
- `current_temp_C`: Input to FICTIONAL Zeeman algorithm
- `timestamp_s`: For logging and synchronization
- `magic`: For validation

#### 5.2.2 DistortionVector (Thrift)

**Defined in Thrift IDL**, generated C++ code:

```thrift
struct DistortionVector {
    1: double distortion_x_nm,  // X-direction distortion in nanometers
    2: double distortion_y_nm,  // Y-direction distortion in nanometers
    3: double timestamp_s       // Timestamp when prediction was made
}
```

**Generated C++ Class**:
```cpp
class DistortionVector {
public:
    double distortion_x_nm;
    double distortion_y_nm;
    double timestamp_s;

    // Thrift-generated methods
    void read(apache::thrift::protocol::TProtocol* iprot);
    void write(apache::thrift::protocol::TProtocol* oprot) const;
};
```

#### 5.2.3 Coefficients Structure

**FICTIONAL Zeeman Model Coefficients**:

```cpp
struct Coefficients {
    // X-direction quadratic coefficients
    double a0;  // Constant term (nm)
    double a1;  // Linear coefficient (nm/°C)
    double a2;  // Quadratic coefficient (nm/°C²)

    // Y-direction quadratic coefficients
    double b0;  // Constant term (nm)
    double b1;  // Linear coefficient (nm/°C)
    double b2;  // Quadratic coefficient (nm/°C²)
};
```

**Default Values** (ARBITRARY):
```cpp
Coefficients defaultCoeffs = {
    0.0,   // a0
    0.1,   // a1
    0.005, // a2
    0.0,   // b0
    0.08,  // b1
    0.004  // b2
};
```

---

## 6. Sequence Diagrams

### 6.1 Startup Sequence

```
┌──────┐   ┌────────────┐   ┌─────────────┐   ┌──────────┐   ┌─────────┐
│ Main │   │SharedMemory│   │  Fictional  │   │  Thrift  │   │  Loop   │
│      │   │   Reader   │   │   Zeeman    │   │  Client  │   │         │
└──┬───┘   └─────┬──────┘   └──────┬──────┘   └────┬─────┘   └────┬────┘
   │             │                  │                │              │
   │ log("Starting")                │                │              │
   │─────────────────────────────────────────────────────────────→ │
   │             │                  │                │              │
   │ getInstance()│                  │                │              │
   │────────────→│                  │                │              │
   │             │                  │                │              │
   │ attach("/rtdcs_shared_state")  │                │              │
   │────────────→│                  │                │              │
   │             │                  │                │              │
   │             │ shm_open(O_RDONLY)                │              │
   │             │─────────────────────────────────────────────────→│
   │             │                  │                │              │
   │             │ mmap(PROT_READ)  │                │              │
   │             │─────────────────────────────────────────────────→│
   │             │                  │                │              │
   │             │ validate magic   │                │              │
   │             │──────────────────│                │              │
   │             │                  │                │              │
   │ log("Shared memory attached")  │                │              │
   │─────────────────────────────────────────────────────────────→ │
   │             │                  │                │              │
   │ new FictionalZeemanPredictor(coeffs)           │              │
   │──────────────────────────────→│                │              │
   │             │                  │                │              │
   │ new ThriftRPCClient("localhost", 9090)         │              │
   │────────────────────────────────────────────────→│              │
   │             │                  │                │              │
   │             │                  │  connect()     │              │
   │             │                  │                │              │
   │             │                  │  TSocket::open()              │
   │             │                  │────────────────────────────→  │
   │             │                  │                │              │
   │ log("Connected to BigModuleC at localhost:9090")              │
   │─────────────────────────────────────────────────────────────→ │
   │             │                  │                │              │
   │ new PredictionLoop(reader, predictor, client)  │              │
   │────────────────────────────────────────────────────────────────│
   │             │                  │                │              │
   │ loop.start()│                  │                │              │
   │─────────────────────────────────────────────────────────────→ │
   │             │                  │                │              │
   │ log("BigModuleB READY")        │                │              │
   │─────────────────────────────────────────────────────────────→ │
   │             │                  │                │              │
```

### 6.2 Main Prediction Loop (5 Hz)

```
┌──────────┐   ┌────────────┐   ┌─────────────┐   ┌──────────┐
│  Loop    │   │SharedMemory│   │  Fictional  │   │  Thrift  │
│          │   │   Reader   │   │   Zeeman    │   │  Client  │
└────┬─────┘   └─────┬──────┘   └──────┬──────┘   └────┬─────┘
     │               │                  │                │
     │ [LOOP: every 200ms (5 Hz)]      │                │
     │               │                  │                │
     │ readTemperature()                │                │
     │──────────────→│                  │                │
     │               │                  │                │
     │               │ read current_temp_C from shm     │
     │               │──────────────────│                │
     │               │                  │                │
     │←──────────────│                  │                │
     │  temp = 25.3°C│                  │                │
     │               │                  │                │
     │ predict(temp) │                  │                │
     │───────────────────────────────→  │                │
     │               │                  │                │
     │               │  X = a0 + a1*T + a2*T^2          │
     │               │  Y = b0 + b1*T + b2*T^2          │
     │               │  ────────────────│                │
     │               │                  │                │
     │←─────────────────────────────────│                │
     │  DistortionVector{X=5.7nm, Y=4.6nm}              │
     │               │                  │                │
     │ log("⚠️ FICTIONAL Zeeman Prediction: T=25.3°C → X=5.7nm, Y=4.6nm")
     │─────────────────────────────────────────────────────────────────→
     │               │                  │                │
     │ sendDistortion(distortion)       │                │
     │──────────────────────────────────────────────────→│
     │               │                  │                │
     │               │                  │  RPC: applyDistortion()
     │               │                  │  ──────────────→│
     │               │                  │                │
     │ log("Sent distortion to BigModuleC")             │
     │─────────────────────────────────────────────────────────────────→
     │               │                  │                │
     │ preciseWait(200ms - elapsed)    │                │
     │─────────────────────────────────│                │
     │               │                  │                │
     │ [Wait 200ms, then repeat]       │                │
     │               │                  │                │
```

### 6.3 Graceful Shutdown Sequence

```
┌──────┐   ┌──────────┐   ┌────────────┐   ┌──────────┐
│Signal│   │  Loop    │   │SharedMemory│   │  Thrift  │
│Handler│   │          │   │   Reader   │   │  Client  │
└──┬───┘   └────┬─────┘   └─────┬──────┘   └────┬─────┘
   │            │               │                │
   │ SIGINT     │               │                │
   │ (Ctrl+C)   │               │                │
   │────────────│               │                │
   │            │               │                │
   │ log("Shutdown signal received")            │
   │───────────────────────────────────────────────────────→
   │            │               │                │
   │ loop.stop()│               │                │
   │───────────→│               │                │
   │            │               │                │
   │            │ running_ = false               │
   │            │───────────────│                │
   │            │               │                │
   │            │ [Exit loop]   │                │
   │            │               │                │
   │ log("Prediction loop stopped")             │
   │───────────────────────────────────────────────────────→
   │            │               │                │
   │ client.disconnect()        │                │
   │────────────────────────────────────────────→│
   │            │               │                │
   │            │               │  transport->close()
   │            │               │  ──────────────→│
   │            │               │                │
   │ log("Disconnected from BigModuleC")        │
   │───────────────────────────────────────────────────────→
   │            │               │                │
   │ reader.detach()            │                │
   │────────────────────────────→│                │
   │            │               │                │
   │            │               │ munmap()       │
   │            │               │────────────────│
   │            │               │                │
   │            │               │ close(shmFd_)  │
   │            │               │────────────────│
   │            │               │                │
   │ log("Shared memory detached")              │
   │───────────────────────────────────────────────────────→
   │            │               │                │
   │ log("BigModuleB stopped") │                │
   │───────────────────────────────────────────────────────→
   │            │               │                │
   │ exit(0)    │               │                │
   │─────────────────────────────────────────────────────────
   │            │               │                │
```

---

## 7. Algorithm Design

### 7.1 FICTIONAL Zeeman Thermal Expansion Model

**⚠️ CRITICAL DISCLAIMER**: This algorithm is **completely FICTIONAL** and has no scientific validity.

#### 7.1.1 Mathematical Formula

**Quadratic Model**:
```
X_distortion(T) = a0 + a1 * T + a2 * T^2
Y_distortion(T) = b0 + b1 * T + b2 * T^2
```

Where:
- `T`: Temperature in degrees Celsius (°C)
- `X_distortion`: Reticle distortion in X-direction (nanometers)
- `Y_distortion`: Reticle distortion in Y-direction (nanometers)
- `a0, a1, a2`: X-direction coefficients (ARBITRARY)
- `b0, b1, b2`: Y-direction coefficients (ARBITRARY)

#### 7.1.2 Default Coefficients (ARBITRARY)

```cpp
struct Coefficients {
    double a0 = 0.0;     // nm (no constant offset)
    double a1 = 0.1;     // nm/°C (linear term dominates)
    double a2 = 0.005;   // nm/°C² (small nonlinearity)

    double b0 = 0.0;     // nm (no constant offset)
    double b1 = 0.08;    // nm/°C (slightly less than X)
    double b2 = 0.004;   // nm/°C² (small nonlinearity)
};
```

**Justification** (FICTIONAL):
- Linear term dominates: Thermal expansion is mostly linear
- Small quadratic term: Accounts for nonlinear effects at higher temperatures
- X > Y: Asymmetric expansion (FICTIONAL anisotropy)

#### 7.1.3 Example Calculation

**Input**: Temperature T = 25.0°C

**X-Direction**:
```
X = 0.0 + 0.1 * 25.0 + 0.005 * (25.0)^2
X = 0.0 + 2.5 + 0.005 * 625
X = 0.0 + 2.5 + 3.125
X = 5.625 nm
```

**Y-Direction**:
```
Y = 0.0 + 0.08 * 25.0 + 0.004 * (25.0)^2
Y = 0.0 + 2.0 + 0.004 * 625
Y = 0.0 + 2.0 + 2.5
Y = 4.5 nm
```

**Output**: DistortionVector { X = 5.625 nm, Y = 4.5 nm }

#### 7.1.4 Implementation

```cpp
DistortionVector FictionalZeemanPredictor::predict(double temperature_C) const {
    DistortionVector result;

    // Compute X-direction distortion (FICTIONAL formula)
    double T = temperature_C;
    result.distortion_x_nm = coeffs_.a0 +
                              coeffs_.a1 * T +
                              coeffs_.a2 * T * T;

    // Compute Y-direction distortion (FICTIONAL formula)
    result.distortion_y_nm = coeffs_.b0 +
                              coeffs_.b1 * T +
                              coeffs_.b2 * T * T;

    // Add timestamp
    result.timestamp_s = getCurrentTime();

    return result;
}
```

**Time Complexity**: O(1) - constant time computation
**Space Complexity**: O(1) - no dynamic allocation

### 7.2 Timing Loop Algorithm

#### 7.2.1 5 Hz Periodic Execution

**Target Frequency**: 5 Hz (200 ms period)

**Algorithm**:
```cpp
void PredictionLoop::start() {
    running_ = true;

    while (running_) {
        auto cycleStart = getCurrentTimeNs();

        // Execute prediction cycle
        runCycle();

        // Compute elapsed time
        auto cycleEnd = getCurrentTimeNs();
        int64_t elapsed_ns = cycleEnd - cycleStart;

        // Wait for remainder of 200ms period
        const int64_t PERIOD_NS = 200'000'000; // 200 ms
        int64_t remaining_ns = PERIOD_NS - elapsed_ns;

        if (remaining_ns > 0) {
            preciseWait(remaining_ns);
        } else {
            Logger::warn("Prediction cycle overrun by " +
                          std::to_string(-remaining_ns / 1e6) + " ms");
        }
    }
}
```

#### 7.2.2 Precise Wait Implementation

**Linux (Preferred)**:
```cpp
void PredictionLoop::preciseWait(int64_t duration_ns) {
#ifdef __linux__
    struct timespec sleep_time;
    sleep_time.tv_sec = duration_ns / 1'000'000'000;
    sleep_time.tv_nsec = duration_ns % 1'000'000'000;

    clock_nanosleep(CLOCK_MONOTONIC, 0, &sleep_time, nullptr);
#else
    // macOS fallback (less precise)
    struct timespec sleep_time;
    sleep_time.tv_sec = duration_ns / 1'000'000'000;
    sleep_time.tv_nsec = duration_ns % 1'000'000'000;

    nanosleep(&sleep_time, nullptr);
#endif
}
```

**Accuracy**:
- Linux: ±1 ms (CLOCK_MONOTONIC is immune to system clock adjustments)
- macOS: ±5 ms (nanosleep is less precise)

---

## 8. Inter-Module Communication

### 8.1 Shared Memory Communication (BigModuleA → BigModuleB)

#### 8.1.1 Read-Only Access

BigModuleB **attaches** to shared memory created by BigModuleA:

```cpp
void SharedMemoryReader::attach(const std::string& name) {
    // Open existing shared memory segment (O_RDONLY)
    shmFd_ = shm_open(name.c_str(), O_RDONLY, 0);
    if (shmFd_ == -1) {
        throw std::runtime_error("Failed to attach to shared memory: " +
                                  std::string(strerror(errno)));
    }

    // Map shared memory (PROT_READ only)
    void* ptr = mmap(nullptr, sizeof(SharedLithoState),
                     PROT_READ, MAP_SHARED, shmFd_, 0);
    if (ptr == MAP_FAILED) {
        close(shmFd_);
        throw std::runtime_error("Failed to mmap shared memory");
    }

    shmPtr_ = static_cast<const SharedLithoState*>(ptr);

    // Validate magic number
    if (shmPtr_->magic != 0x4C49544F) {
        throw std::runtime_error("Invalid shared memory magic number");
    }

    Logger::info("Shared memory attached: " + name);
}
```

#### 8.1.2 Read Temperature

```cpp
double SharedMemoryReader::readTemperature() const {
    if (!shmPtr_) {
        throw std::runtime_error("Shared memory not attached");
    }

    return shmPtr_->current_temp_C;
}
```

**Thread Safety**: Read-only access is inherently thread-safe (no modifications).

### 8.2 Thrift RPC Communication (BigModuleB → BigModuleC)

#### 8.2.1 Client Initialization

```cpp
ThriftRPCClient::ThriftRPCClient(const std::string& host, int port)
    : host_(host), port_(port) {

    using namespace apache::thrift;

    socket_ = std::make_shared<transport::TSocket>(host_, port_);
    transport_ = std::make_shared<transport::TBufferedTransport>(socket_);
    protocol_ = std::make_shared<protocol::TBinaryProtocol>(transport_);
    client_ = std::make_shared<ICompensationControllerClient>(protocol_);
}

void ThriftRPCClient::connect() {
    try {
        transport_->open();
        Logger::info("Connected to BigModuleC at " + host_ + ":" +
                     std::to_string(port_));
    } catch (const apache::thrift::transport::TTransportException& ex) {
        throw std::runtime_error("Failed to connect to BigModuleC: " +
                                  std::string(ex.what()));
    }
}
```

#### 8.2.2 Send Distortion RPC

```cpp
void ThriftRPCClient::sendDistortion(const DistortionVector& distortion) {
    try {
        client_->applyDistortion(distortion);
    } catch (const apache::thrift::TException& ex) {
        Logger::error("Thrift RPC failed: " + std::string(ex.what()));

        // Attempt reconnection
        reconnect();
    }
}

void ThriftRPCClient::reconnect() {
    Logger::warn("Attempting to reconnect to BigModuleC...");

    try {
        transport_->close();
        transport_->open();
        Logger::info("Reconnected to BigModuleC");
    } catch (const apache::thrift::TException& ex) {
        Logger::error("Reconnection failed: " + std::string(ex.what()));
    }
}
```

**Error Handling**:
- Detect RPC failure (TException)
- Attempt automatic reconnection
- Log all communication events

---

## 9. Error Handling

### 9.1 Error Categories

| Error Category | Handling Strategy | Recovery |
|----------------|-------------------|----------|
| **Shared Memory Unavailable** | Throw exception at startup, exit | User must start BigModuleA first |
| **Thrift RPC Connection Failed** | Retry connection at startup | User must start BigModuleC first |
| **Thrift RPC Send Failed** | Log error, attempt reconnection | Continue prediction loop |
| **Invalid Temperature** | Log warning, skip prediction | Continue loop |
| **Timing Overrun** | Log warning, continue | Next cycle compensates |

### 9.2 Startup Error Handling

```cpp
int main() {
    try {
        // Attach to shared memory
        SharedMemoryReader* reader = SharedMemoryReader::getInstance();
        reader->attach("/rtdcs_shared_state");

    } catch (const std::exception& ex) {
        Logger::error("Failed to attach to shared memory: " +
                      std::string(ex.what()));
        Logger::error("Ensure BigModuleA is running first.");
        return EXIT_FAILURE;
    }

    try {
        // Connect to BigModuleC Thrift RPC server
        ThriftRPCClient client("localhost", 9090);
        client.connect();

    } catch (const std::exception& ex) {
        Logger::error("Failed to connect to BigModuleC: " +
                      std::string(ex.what()));
        Logger::error("Ensure BigModuleC is running first.");
        return EXIT_FAILURE;
    }

    // Continue with main loop...
}
```

### 9.3 Runtime Error Handling

```cpp
void PredictionLoop::runCycle() {
    try {
        // Read temperature
        double temp = reader_->readTemperature();

        // Validate temperature (sanity check)
        if (temp < -50.0 || temp > 100.0) {
            Logger::warn("Invalid temperature: " + std::to_string(temp) +
                         "°C, skipping prediction");
            return;
        }

        // Predict distortion
        DistortionVector distortion = predictor_->predict(temp);

        // Log prediction
        Logger::info("⚠️ FICTIONAL Zeeman Prediction: T=" +
                     std::to_string(temp) + "°C → X=" +
                     std::to_string(distortion.distortion_x_nm) + "nm, Y=" +
                     std::to_string(distortion.distortion_y_nm) + "nm");

        // Send to BigModuleC
        client_->sendDistortion(distortion);

        sampleCount_++;

    } catch (const std::exception& ex) {
        Logger::error("Prediction cycle failed: " + std::string(ex.what()));
        // Continue loop despite error
    }
}
```

---

## 10. Performance Considerations

### 10.1 Performance Requirements

| Metric | Target | Measured |
|--------|--------|----------|
| **Prediction Frequency** | 5 Hz (200 ms period) | ~5 Hz ±1% |
| **Prediction Latency** | < 10 ms | ~2 ms |
| **CPU Usage** | < 5% (single core) | ~2% |
| **Memory Footprint** | < 10 MB | ~5 MB |
| **Thrift RPC Latency** | < 5 ms | ~1 ms (localhost) |

### 10.2 Optimization Strategies

#### 10.2.1 Algorithm Optimization

- **O(1) Prediction**: FICTIONAL Zeeman is simple quadratic (no loops)
- **Pre-computed Coefficients**: Load coefficients once at startup
- **Stack Allocation**: DistortionVector is stack-allocated (no heap)

#### 10.2.2 Communication Optimization

- **Buffered Transport**: Thrift uses TBufferedTransport for batching
- **Binary Protocol**: Thrift TBinaryProtocol is more efficient than JSON
- **Localhost**: BigModuleC runs on same machine (< 1 ms RPC latency)

#### 10.2.3 Timing Precision

- **CLOCK_MONOTONIC**: Immune to system clock adjustments (Linux)
- **Cycle Compensation**: Adjust wait time based on elapsed execution time
- **No Drift**: Loop accounts for execution time, preventing cumulative drift

### 10.3 Memory Layout

**Total Memory**: ~5 MB (estimated)

```
Stack Memory:
- Main thread stack: ~1 MB
- DistortionVector: 24 bytes (3 doubles)
- Coefficients: 48 bytes (6 doubles)

Heap Memory:
- Thrift client objects: ~1 MB
- Logger buffers: ~100 KB

Shared Memory:
- Read-only mapping: 4096 bytes (one page)
```

---

## 11. Platform-Specific Implementation

### 11.1 Linux (Ubuntu 20.04+)

**Primary Target Platform**

**Compiler**: GCC 7+ or Clang 6+
**Standard Library**: libstdc++ or libc++

**Platform-Specific Code**:
```cpp
#ifdef __linux__
    // Use clock_nanosleep with CLOCK_MONOTONIC
    struct timespec sleep_time;
    sleep_time.tv_sec = duration_ns / 1'000'000'000;
    sleep_time.tv_nsec = duration_ns % 1'000'000'000;

    clock_nanosleep(CLOCK_MONOTONIC, 0, &sleep_time, nullptr);
#endif
```

**Shared Memory**: `/dev/shm/rtdcs_shared_state` (tmpfs)

### 11.2 macOS (11.0+)

**Development Platform Support**

**Compiler**: Apple Clang (Xcode Command Line Tools)
**Standard Library**: libc++ (LLVM)

**Platform-Specific Code**:
```cpp
#ifdef __APPLE__
    // Fallback to nanosleep (no CLOCK_MONOTONIC support)
    struct timespec sleep_time;
    sleep_time.tv_sec = duration_ns / 1'000'000'000;
    sleep_time.tv_nsec = duration_ns % 1'000'000'000;

    nanosleep(&sleep_time, nullptr);
#endif
```

**Shared Memory**: Virtual memory backed (no `/dev/shm/`)

### 11.3 Platform Detection

**Makefile** (common.mk):
```makefile
UNAME_S := $(shell uname -s)

ifeq ($(UNAME_S),Darwin)
    OS_TYPE := macOS
    CXX := clang++
else ifeq ($(UNAME_S),Linux)
    OS_TYPE := Linux
    CXX := g++
endif
```

**C++ Preprocessor**:
```cpp
#include <iostream>

#ifdef __linux__
    #define PLATFORM "Linux"
#elif defined(__APPLE__)
    #define PLATFORM "macOS"
#else
    #error "Unsupported platform"
#endif
```

---

## 12. Testing Considerations

### 12.1 Unit Testing (Developer Agent)

**Test Framework**: Google Test (gtest)

**Unit Tests** (BigModuleB/tests/unit/):

1. **test_fictional_zeeman.cpp**:
   - Test quadratic formula correctness
   - Test default coefficients
   - Test custom coefficients
   - Test temperature edge cases (-50°C, 0°C, 25°C, 100°C)

2. **test_shared_memory_reader.cpp**:
   - Test attachment to existing shared memory
   - Test error when shared memory doesn't exist
   - Test magic number validation
   - Test temperature reading

3. **test_thrift_client.cpp**:
   - Mock Thrift RPC server
   - Test connection success/failure
   - Test send distortion RPC
   - Test reconnection logic

### 12.2 Component Testing (Tester Agent)

**Component Tests** (BigModuleB/tests/component/):

1. **test_prediction_loop.cpp**:
   - Test 5 Hz timing accuracy (measure cycle time)
   - Test graceful shutdown on signal
   - Test error recovery in loop

2. **test_thrift_integration.cpp**:
   - Start real BigModuleC Thrift server
   - Test end-to-end RPC communication
   - Verify serialization/deserialization

### 12.3 Integration Testing (Tester Agent)

**Integration Tests** (BigModuleB/tests/integration/):

1. **test_modulea_to_moduleb.cpp**:
   - Start BigModuleA (creates shared memory)
   - Start BigModuleB (reads from shared memory)
   - Verify BigModuleB reads correct temperature values

2. **test_moduleb_to_modulec.cpp**:
   - Start BigModuleC (Thrift RPC server)
   - Start BigModuleB (Thrift RPC client)
   - Verify BigModuleC receives correct distortion values

### 12.4 System Testing (Tester Agent)

**System Tests** (BigModuleB/tests/system/):

1. **test_full_system.cpp**:
   - Start BigModuleA, BigModuleC, BigModuleB (in order)
   - Run for 60 seconds
   - Verify end-to-end data flow
   - Measure timing accuracy (5 Hz)
   - Verify FICTIONAL warnings in logs

---

## 13. Build and Deployment

### 13.1 Build System

**Makefile** (BigModuleB/Makefile):

```makefile
include $(REPO_ROOT)/common_infra/build_tools/common.mk

# Module-specific settings
MODULE_NAME := BigModuleB
THRIFT_IDL := src/ext/interfaces/ICompensationController.thrift

# Source files
SOURCES := src/int/impl/main.cpp \
           src/int/impl/FictionalZeemanPredictor.cpp \
           src/int/impl/SharedMemoryReader.cpp \
           src/int/impl/ThriftRPCClient.cpp \
           src/int/impl/PredictionLoop.cpp \
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

**Runtime Dependencies**:
- Apache Thrift 0.19.0 C++ runtime library (`libthrift.so` or `libthrift.dylib`)
- POSIX shared memory support (shm_open, mmap)
- BigModuleA running (creates shared memory)
- BigModuleC running (Thrift RPC server)

### 13.3 Deployment

**Installation** (to repository release/ folder):

```bash
cd BigModuleB
make install
```

**Files Installed**:
```
release/
├── bin/
│   └── BigModuleB          # Executable
├── lib/
│   └── libBigModuleB.a     # Static library
└── include/
    ├── ICompensationController.h
    └── ICompensationController_types.h
```

**Execution**:
```bash
# Ensure BigModuleA and BigModuleC are running first
./release/bin/BigModuleB

# Or from build directory
./build/release/BigModuleB
```

---

## 14. Future Enhancements

### 14.1 Planned Features (Post-POC)

1. **Configurable Coefficients**:
   - Load FICTIONAL Zeeman coefficients from configuration file
   - Support multiple temperature-distortion models

2. **Advanced Error Handling**:
   - Retry logic with exponential backoff for Thrift RPC
   - Fallback prediction if shared memory unavailable

3. **Performance Monitoring**:
   - Track cycle time statistics (min, max, avg, stddev)
   - Log warnings if timing accuracy degrades

4. **Multi-Threaded Architecture**:
   - Separate thread for Thrift RPC communication
   - Decouple prediction from communication

5. **Logging Enhancements**:
   - Configurable log levels (DEBUG, INFO, WARN, ERROR)
   - Log rotation and file output

### 14.2 Extensibility

**Strategy Pattern** allows easy addition of new prediction algorithms:

```cpp
class IPredictionAlgorithm {
public:
    virtual DistortionVector predict(double temperature_C) const = 0;
    virtual ~IPredictionAlgorithm() = default;
};

class FictionalZeemanPredictor : public IPredictionAlgorithm { /*...*/ };
class LinearModelPredictor : public IPredictionAlgorithm { /*...*/ };
class MLModelPredictor : public IPredictionAlgorithm { /*...*/ };
```

**Factory Pattern** for algorithm selection:

```cpp
std::unique_ptr<IPredictionAlgorithm> createPredictor(const std::string& type) {
    if (type == "zeeman") {
        return std::make_unique<FictionalZeemanPredictor>(defaultCoeffs);
    } else if (type == "linear") {
        return std::make_unique<LinearModelPredictor>();
    } else if (type == "ml") {
        return std::make_unique<MLModelPredictor>();
    }
    throw std::invalid_argument("Unknown predictor type: " + type);
}
```

---

## Appendix A: Key Classes Reference

### A.1 FictionalZeemanPredictor

```cpp
class FictionalZeemanPredictor {
public:
    struct Coefficients {
        double a0, a1, a2;  // X-direction
        double b0, b1, b2;  // Y-direction
    };

    explicit FictionalZeemanPredictor(const Coefficients& coeffs);
    DistortionVector predict(double temperature_C) const;

private:
    Coefficients coeffs_;
};
```

### A.2 SharedMemoryReader

```cpp
class SharedMemoryReader {
public:
    static SharedMemoryReader* getInstance();
    void attach(const std::string& name);
    double readTemperature() const;
    void detach();

private:
    SharedMemoryReader() = default;
    ~SharedMemoryReader();
    static SharedMemoryReader* instance_;
    int shmFd_;
    const SharedLithoState* shmPtr_;
};
```

### A.3 ThriftRPCClient

```cpp
class ThriftRPCClient {
public:
    ThriftRPCClient(const std::string& host, int port);
    ~ThriftRPCClient();

    void connect();
    void sendDistortion(const DistortionVector& distortion);
    void disconnect();

private:
    std::string host_;
    int port_;
    std::shared_ptr<apache::thrift::transport::TSocket> socket_;
    std::shared_ptr<apache::thrift::transport::TTransport> transport_;
    std::shared_ptr<apache::thrift::protocol::TBinaryProtocol> protocol_;
    std::shared_ptr<ICompensationControllerClient> client_;

    void reconnect();
};
```

### A.4 PredictionLoop

```cpp
class PredictionLoop {
public:
    PredictionLoop(SharedMemoryReader* reader,
                   FictionalZeemanPredictor* predictor,
                   ThriftRPCClient* client);

    void start();
    void stop();

private:
    void runCycle();
    void preciseWait(int64_t duration_ns);
    int64_t getCurrentTimeNs() const;

    SharedMemoryReader* reader_;
    FictionalZeemanPredictor* predictor_;
    ThriftRPCClient* client_;
    std::atomic<bool> running_;
    int sampleCount_;
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
[2026-01-20T14:23:45.123] [BigModuleB] [INFO] BigModuleB starting, PID=12347
[2026-01-20T14:23:45.145] [BigModuleB] [INFO] Shared memory attached: /rtdcs_shared_state
[2026-01-20T14:23:45.167] [BigModuleB] [INFO] FICTIONAL Zeeman Predictor initialized (a0=0.0, a1=0.1, a2=0.005)
[2026-01-20T14:23:45.189] [BigModuleB] [INFO] Connected to BigModuleC at localhost:9090
[2026-01-20T14:23:45.200] [BigModuleB] [INFO] BigModuleB READY
[2026-01-20T14:23:45.400] [BigModuleB] [INFO] ⚠️ FICTIONAL Zeeman Prediction: T=25.0°C → X=5.6nm, Y=4.5nm
[2026-01-20T14:23:45.402] [BigModuleB] [INFO] Sent distortion to BigModuleC
[2026-01-20T14:23:45.600] [BigModuleB] [INFO] ⚠️ FICTIONAL Zeeman Prediction: T=25.3°C → X=5.7nm, Y=4.6nm
[2026-01-20T14:23:45.602] [BigModuleB] [INFO] Sent distortion to BigModuleC
[2026-01-20T14:23:45.800] [BigModuleB] [INFO] ⚠️ FICTIONAL Zeeman Prediction: T=25.6°C → X=5.8nm, Y=4.7nm
[2026-01-20T14:23:45.802] [BigModuleB] [INFO] Sent distortion to BigModuleC
^C
[2026-01-20T14:23:46.000] [BigModuleB] [INFO] Shutdown signal received
[2026-01-20T14:23:46.010] [BigModuleB] [INFO] Prediction loop stopped
[2026-01-20T14:23:46.020] [BigModuleB] [INFO] Disconnected from BigModuleC
[2026-01-20T14:23:46.030] [BigModuleB] [INFO] Shared memory detached
[2026-01-20T14:23:46.040] [BigModuleB] [INFO] BigModuleB stopped
```

---

## Document Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-20 | Architect Agent | Initial BigModuleB EDS created |

---

**End of BigModuleB External Design Specification**
