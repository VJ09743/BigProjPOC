# RTDCS Development Tasks for Developer Agent

**Document**: RTDCS Implementation Task Breakdown
**Project**: RTDCS (Reticle Thermal Distortion Compensation System)
**Target**: Developer Agent
**Date**: 2026-01-20
**Author**: Architect Agent
**Status**: Ready for Implementation
**Version**: 1.0

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Prerequisites](#2-prerequisites)
3. [Task Overview](#3-task-overview)
4. [BigModuleA Implementation Tasks](#4-bigmodulea-implementation-tasks)
5. [BigModuleB Implementation Tasks](#5-bigmoduleb-implementation-tasks)
6. [BigModuleC Implementation Tasks](#6-bigmodulec-implementation-tasks)
7. [Testing Requirements](#7-testing-requirements)
8. [Completion Criteria](#8-completion-criteria)

---

## 1. Introduction

This document provides a complete breakdown of implementation tasks for the Developer Agent to implement the RTDCS (Reticle Thermal Distortion Compensation System) proof-of-concept.

### 1.1 Scope

The Developer Agent is responsible for:
- Implementing all three modules (BigModuleA, BigModuleB, BigModuleC)
- Writing unit tests for all implemented classes
- Following the designs specified in EDS documents
- Applying SOLID principles and design patterns

### 1.2 References

**External Design Specifications (EDS)**:
- `docs/architecture/eds/rtdcs-system-eds.md` - System architecture
- `docs/architecture/eds/rtdcs-modulea-eds.md` - BigModuleA design
- `docs/architecture/eds/rtdcs-moduleb-eds.md` - BigModuleB design
- `docs/architecture/eds/rtdcs-modulec-eds.md` - BigModuleC design

**Interface Specifications**:
- `BigModuleC/src/ext/interfaces/ICompensationController.thrift` - Thrift RPC interface
- `common_infra/shared_memory/SharedLithoState.h` - Shared memory structure

**Build System**:
- `common_infra/build_tools/common.mk` - Common build configuration
- `docs/it/build/module-build-system.md` - Build system documentation

---

## 2. Prerequisites

### 2.1 Development Environment

**Operating System**:
- Linux (Ubuntu 20.04+) - Primary platform
- macOS (11.0+) - Development platform

**Compiler**:
- GCC 7+ or Clang 6+ (Linux)
- Apple Clang (macOS)

**Dependencies**:
- Apache Thrift 0.19.0 (compiler and C++ runtime)
- C++14 or later standard library
- POSIX shared memory support (shm_open, mmap)
- POSIX threads (pthread)

**Build Tools**:
- GNU Make
- Git

**Testing Framework**:
- Google Test (gtest) for unit tests

### 2.2 Required Knowledge

- C++14 features (auto, lambdas, smart pointers, nullptr)
- Object-Oriented Programming (classes, inheritance, polymorphism)
- Design Patterns (Strategy, Singleton, Command, Observer)
- POSIX shared memory API
- Apache Thrift RPC (basics)
- Multi-threading (mutexes, thread safety)
- Unit testing with gtest

---

## 3. Task Overview

### 3.1 Module Summary

| Module | Purpose | Key Components | LoC (Est.) |
|--------|---------|----------------|------------|
| **BigModuleA** | ThermalMonitor | Temperature patterns, Shared memory owner, 10 Hz loop | ~800 |
| **BigModuleB** | DistortionPredictor | FICTIONAL Zeeman algorithm, Shared memory reader, Thrift client, 5 Hz loop | ~900 |
| **BigModuleC** | CompensationController | Compensation strategy, Thrift RPC server, Shared memory writer | ~700 |

**Total Lines of Code**: ~2,400 (implementation) + ~1,200 (unit tests) = ~3,600 LoC

### 3.2 Implementation Order

**Recommended Order** (dependencies):
1. **BigModuleA** (creates shared memory, no dependencies)
2. **BigModuleC** (Thrift server, depends on BigModuleA for shared memory)
3. **BigModuleB** (Thrift client, depends on BigModuleA and BigModuleC)

### 3.3 Design Patterns to Apply

| Pattern | Module | Usage |
|---------|--------|-------|
| **Strategy** | BigModuleA | Temperature patterns (Sine, Step) |
| **Singleton** | BigModuleA | SharedMemoryManager |
| **Strategy** | BigModuleB | FICTIONAL Zeeman predictor |
| **Singleton** | BigModuleB | SharedMemoryReader |
| **Adapter** | BigModuleB | Thrift RPC client |
| **Command** | BigModuleC | Compensation actions |
| **Strategy** | BigModuleC | Compensation algorithms (SimpleNegation) |
| **Singleton** | BigModuleC | SharedMemoryWriter |

---

## 4. BigModuleA Implementation Tasks

### 4.1 Module Overview

**Module**: BigModuleA (ThermalMonitor)
**Purpose**: Simulate reticle temperature and write to shared memory
**Frequency**: 10 Hz (100 ms intervals)
**Dependencies**: None (standalone, creates shared memory)

### 4.2 Task A1: Shared Memory Manager (Singleton)

**Estimated Time**: 2-3 hours
**Priority**: High
**Dependencies**: None

**Requirements**:
- Implement `SharedMemoryManager` class (Singleton pattern)
- Create POSIX shared memory segment (`/rtdcs_shared_state`, 4096 bytes)
- Initialize `SharedLithoState` structure with magic number
- Provide write access to temperature fields
- Destroy shared memory on cleanup

**Files to Create**:
- `BigModuleA/src/int/impl/SharedMemoryManager.h`
- `BigModuleA/src/int/impl/SharedMemoryManager.cpp`

**Key Methods**:
```cpp
class SharedMemoryManager {
public:
    static SharedMemoryManager* getInstance();
    void create(const std::string& name, size_t size);
    void writeTemperature(double temp_C, double timestamp_s);
    void destroy();

private:
    SharedMemoryManager() = default;
    ~SharedMemoryManager();
    static SharedMemoryManager* instance_;
    int shmFd_;
    rtdcs::SharedLithoState* shmPtr_;
};
```

**Implementation Details**:
- Use `shm_open(O_CREAT | O_RDWR | O_EXCL, 0666)` to create shared memory
- Use `ftruncate()` to set size to 4096 bytes
- Use `mmap(PROT_READ | PROT_WRITE, MAP_SHARED)` to map memory
- Initialize structure using placement new: `new (shmPtr_) rtdcs::SharedLithoState();`
- Verify magic number after initialization
- Use `shm_unlink()` in `destroy()` to remove shared memory

**Error Handling**:
- Throw `std::runtime_error` if shared memory already exists
- Throw `std::runtime_error` if mmap fails
- Throw `std::runtime_error` if magic number validation fails

**Unit Tests** (BigModuleA/tests/unit/test_shared_memory_manager.cpp):
- Test singleton pattern (getInstance returns same instance)
- Test create and destroy lifecycle
- Test writeTemperature updates shared memory
- Test error when creating duplicate shared memory
- Test cleanup (shm_unlink called)

---

### 4.3 Task A2: Temperature Pattern Strategy

**Estimated Time**: 3-4 hours
**Priority**: High
**Dependencies**: None

**Requirements**:
- Implement `ITemperaturePattern` interface (Strategy pattern)
- Implement `SineWavePattern` class
- Implement `StepPattern` class
- Support configurable parameters (base temp, amplitude, frequency)

**Files to Create**:
- `BigModuleA/src/int/impl/ITemperaturePattern.h`
- `BigModuleA/src/int/impl/SineWavePattern.h`
- `BigModuleA/src/int/impl/SineWavePattern.cpp`
- `BigModuleA/src/int/impl/StepPattern.h`
- `BigModuleA/src/int/impl/StepPattern.cpp`

**Key Interfaces**:
```cpp
class ITemperaturePattern {
public:
    virtual ~ITemperaturePattern() = default;
    virtual double getTemperature(double time_s) const = 0;
};

class SineWavePattern : public ITemperaturePattern {
public:
    SineWavePattern(double baseTemp, double amplitude, double frequency);
    double getTemperature(double time_s) const override;

private:
    double baseTemp_;
    double amplitude_;
    double frequency_;
};

class StepPattern : public ITemperaturePattern {
public:
    StepPattern(double baseTemp, double stepDelta, double interval_s);
    double getTemperature(double time_s) const override;

private:
    double baseTemp_;
    double stepDelta_;
    double interval_s_;
};
```

**Implementation Details**:
- **SineWavePattern**: `T(t) = baseTemp + amplitude * sin(2π * frequency * t)`
- **StepPattern**: `T(t) = baseTemp + (floor(t / interval) % 2) * stepDelta`
- Use `<cmath>` for `sin()` and M_PI constant
- Time input is in seconds since start (e.g., 0.0, 0.1, 0.2, ...)

**Unit Tests** (BigModuleA/tests/unit/test_temperature_patterns.cpp):
- Test SineWavePattern at t=0, t=π/(2*frequency), t=π/frequency
- Test StepPattern at t=0, t=interval/2, t=interval, t=2*interval
- Test edge cases (negative time, zero amplitude, zero frequency)
- Test custom parameters

---

### 4.4 Task A3: Logger Utility

**Estimated Time**: 1-2 hours
**Priority**: Medium
**Dependencies**: None

**Requirements**:
- Implement `Logger` class with static methods
- Support log levels (INFO, WARN, ERROR)
- Timestamped console output
- Thread-safe (use mutex for concurrent logging)

**Files to Create**:
- `BigModuleA/src/int/impl/Logger.h`
- `BigModuleA/src/int/impl/Logger.cpp`

**Key Methods**:
```cpp
class Logger {
public:
    static void info(const std::string& msg);
    static void warn(const std::string& msg);
    static void error(const std::string& msg);

private:
    static std::string currentTimestamp();
    static std::mutex mutex_;
};
```

**Implementation Details**:
- Timestamp format: `[YYYY-MM-DDTHH:MM:SS.mmm]` (ISO 8601 with milliseconds)
- Use `clock_gettime(CLOCK_REALTIME)` for timestamp
- Log format: `[timestamp] [BigModuleA] [LEVEL] message`
- Example: `[2026-01-20T14:23:45.678] [BigModuleA] [INFO] Temperature: 25.3°C`

**Unit Tests** (BigModuleA/tests/unit/test_logger.cpp):
- Test timestamp format
- Test log output (redirect stdout for testing)
- Test thread safety (concurrent logging from multiple threads)

---

### 4.5 Task A4: Main Loop and Entry Point

**Estimated Time**: 3-4 hours
**Priority**: High
**Dependencies**: A1 (SharedMemoryManager), A2 (TemperaturePattern), A3 (Logger)

**Requirements**:
- Implement `main()` function with 10 Hz temperature update loop
- Command-line argument parsing (--pattern, --base-temp, --amplitude, --samples)
- Signal handling (SIGINT, SIGTERM for graceful shutdown)
- Precise timing (clock_nanosleep on Linux, nanosleep on macOS)

**Files to Create**:
- `BigModuleA/src/int/impl/main.cpp`

**Command-Line Arguments**:
```bash
BigModuleA [OPTIONS]

Options:
  --pattern <sine|step>    Temperature pattern (default: sine)
  --base-temp <celsius>    Base temperature in °C (default: 25.0)
  --amplitude <celsius>    Temperature amplitude in °C (default: 5.0)
  --frequency <hz>         Frequency for sine wave in Hz (default: 0.1)
  --step-delta <celsius>   Step change for step pattern (default: 5.0)
  --step-interval <sec>    Step interval in seconds (default: 10.0)
  --samples <count>        Number of samples (default: 100, 0=infinite)
  --help                   Show this help message
```

**Main Loop Structure**:
```cpp
int main(int argc, char* argv[]) {
    // 1. Parse command-line arguments
    // 2. Create shared memory (SharedMemoryManager::getInstance()->create())
    // 3. Create temperature pattern (SineWavePattern or StepPattern)
    // 4. Install signal handler (SIGINT, SIGTERM)
    // 5. Main loop (10 Hz):
    //    a. Compute current time since start
    //    b. Get temperature from pattern
    //    c. Write to shared memory
    //    d. Log progress
    //    e. Precise wait (100 ms - elapsed time)
    // 6. Cleanup (destroy shared memory)
}
```

**Timing Implementation**:
```cpp
#ifdef __linux__
    // Use clock_nanosleep with CLOCK_MONOTONIC
    struct timespec sleep_time;
    sleep_time.tv_sec = 0;
    sleep_time.tv_nsec = 100'000'000;  // 100 ms
    clock_nanosleep(CLOCK_MONOTONIC, 0, &sleep_time, nullptr);
#else
    // macOS fallback
    struct timespec sleep_time;
    sleep_time.tv_sec = 0;
    sleep_time.tv_nsec = 100'000'000;
    nanosleep(&sleep_time, nullptr);
#endif
```

**Signal Handling**:
```cpp
std::atomic<bool> running(true);

void signalHandler(int signum) {
    Logger::info("Shutdown signal received");
    running = false;
}

// In main():
signal(SIGINT, signalHandler);
signal(SIGTERM, signalHandler);

while (running && sampleCount < maxSamples) {
    // Main loop
}
```

**Unit Tests** (BigModuleA/tests/unit/test_main_loop.cpp):
- Test command-line argument parsing
- Test temperature pattern selection (sine vs step)
- Test sample count limit
- (Main loop logic is integration-tested, not unit-tested)

---

### 4.6 Task A5: Makefile and Build System

**Estimated Time**: 1 hour
**Priority**: High
**Dependencies**: All tasks (A1-A4)

**Requirements**:
- Create module Makefile including common.mk
- Define source files, build targets
- Generate Thrift code (not used in BigModuleA, but structure for consistency)

**Files to Create**:
- `BigModuleA/Makefile`

**Makefile Structure**:
```makefile
include $(REPO_ROOT)/common_infra/build_tools/common.mk

MODULE_NAME := BigModuleA

SOURCES := src/int/impl/main.cpp \
           src/int/impl/SharedMemoryManager.cpp \
           src/int/impl/SineWavePattern.cpp \
           src/int/impl/StepPattern.cpp \
           src/int/impl/Logger.cpp

INCLUDES := -I$(COMMON_INFRA)/shared_memory

all: build

build: build-debug build-release

build-debug:
	$(CXX) $(CXXFLAGS_DEBUG) $(INCLUDES) $(SOURCES) $(LDFLAGS) \
	       -o $(DEBUG_DIR)/$(MODULE_NAME)

build-release:
	$(CXX) $(CXXFLAGS_RELEASE) $(INCLUDES) $(SOURCES) $(LDFLAGS) \
	       -o $(RELEASE_DIR)/$(MODULE_NAME)

clean:
	rm -rf $(BUILD_DIR)

.PHONY: all build build-debug build-release clean
```

---

## 5. BigModuleB Implementation Tasks

### 5.1 Module Overview

**Module**: BigModuleB (DistortionPredictor)
**Purpose**: Predict reticle distortion using FICTIONAL Zeeman model
**Frequency**: 5 Hz (200 ms intervals)
**Dependencies**: BigModuleA (shared memory), BigModuleC (Thrift RPC server)

### 5.2 Task B1: Shared Memory Reader (Singleton)

**Estimated Time**: 2 hours
**Priority**: High
**Dependencies**: BigModuleA (shared memory created)

**Requirements**:
- Implement `SharedMemoryReader` class (Singleton pattern)
- Attach to existing shared memory (read-only)
- Provide read access to temperature fields
- Validate magic number

**Files to Create**:
- `BigModuleB/src/int/impl/SharedMemoryReader.h`
- `BigModuleB/src/int/impl/SharedMemoryReader.cpp`

**Key Methods**:
```cpp
class SharedMemoryReader {
public:
    static SharedMemoryReader* getInstance();
    void attach(const std::string& name);
    double readTemperature() const;
    double readTimestamp() const;
    void detach();

private:
    SharedMemoryReader() = default;
    ~SharedMemoryReader();
    static SharedMemoryReader* instance_;
    int shmFd_;
    const rtdcs::SharedLithoState* shmPtr_;
};
```

**Implementation Details**:
- Use `shm_open(O_RDONLY)` to open existing shared memory
- Use `mmap(PROT_READ, MAP_SHARED)` for read-only mapping
- Validate magic number: `if (shmPtr_->magic != rtdcs::SHARED_MEMORY_MAGIC) throw ...`
- No modifications allowed (const pointer)

**Unit Tests** (BigModuleB/tests/unit/test_shared_memory_reader.cpp):
- Test singleton pattern
- Test attach to existing shared memory (mock with temp file)
- Test error when shared memory doesn't exist
- Test magic number validation
- Test readTemperature returns correct value

---

### 5.3 Task B2: FICTIONAL Zeeman Predictor (Strategy)

**Estimated Time**: 2-3 hours
**Priority**: High
**Dependencies**: None

**Requirements**:
- Implement `FictionalZeemanPredictor` class
- Quadratic formula: `X = a0 + a1*T + a2*T^2, Y = b0 + b1*T + b2*T^2`
- Support configurable coefficients
- Return `DistortionVector` (Thrift-generated struct)

**Files to Create**:
- `BigModuleB/src/int/impl/FictionalZeemanPredictor.h`
- `BigModuleB/src/int/impl/FictionalZeemanPredictor.cpp`

**Key Methods**:
```cpp
class FictionalZeemanPredictor {
public:
    struct Coefficients {
        double a0, a1, a2;  // X-direction
        double b0, b1, b2;  // Y-direction
    };

    FictionalZeemanPredictor(const Coefficients& coeffs);
    DistortionVector predict(double temperature_C) const;

private:
    Coefficients coeffs_;
};
```

**Implementation Details**:
- Default coefficients: `a0=0.0, a1=0.1, a2=0.005, b0=0.0, b1=0.08, b2=0.004`
- Formula: `result.distortion_x_nm = a0 + a1*T + a2*T*T`
- Add timestamp: `result.timestamp_s = getCurrentTime()`
- ⚠️ Include FICTIONAL disclaimer in all logs

**Unit Tests** (BigModuleB/tests/unit/test_fictional_zeeman.cpp):
- Test prediction with default coefficients at T=25.0°C
- Test prediction at T=0.0°C, T=50.0°C
- Test custom coefficients
- Test negative temperatures
- Test output format (DistortionVector fields)

---

### 5.4 Task B3: Thrift RPC Client

**Estimated Time**: 3-4 hours
**Priority**: High
**Dependencies**: Thrift IDL generated code

**Requirements**:
- Implement `ThriftRPCClient` class
- Connect to BigModuleC Thrift server (localhost:9090)
- Send `DistortionVector` via `applyDistortion()` RPC
- Handle connection errors and retries

**Files to Create**:
- `BigModuleB/src/int/impl/ThriftRPCClient.h`
- `BigModuleB/src/int/impl/ThriftRPCClient.cpp`

**First, Generate Thrift Code**:
```bash
cd BigModuleB
thrift --gen cpp -out src/int/generated ../BigModuleC/src/ext/interfaces/ICompensationController.thrift
```

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

    void reconnect();
};
```

**Implementation Details**:
- Use Thrift TSocket, TBufferedTransport, TBinaryProtocol
- Call `transport_->open()` in `connect()`
- Call `client_->applyDistortion(distortion)` in `sendDistortion()`
- Catch `TException` and attempt reconnection
- Log all RPC events

**Unit Tests** (BigModuleB/tests/unit/test_thrift_client.cpp):
- Mock Thrift server for testing
- Test connection success
- Test connection failure (server not running)
- Test sendDistortion RPC call
- Test reconnection logic

---

### 5.5 Task B4: Prediction Loop and Main Entry Point

**Estimated Time**: 3-4 hours
**Priority**: High
**Dependencies**: B1 (SharedMemoryReader), B2 (FictionalZeemanPredictor), B3 (ThriftRPCClient)

**Requirements**:
- Implement `main()` function with 5 Hz prediction loop
- Command-line argument parsing (--server-host, --server-port)
- Signal handling for graceful shutdown
- Precise timing (200 ms intervals)

**Files to Create**:
- `BigModuleB/src/int/impl/main.cpp`

**Command-Line Arguments**:
```bash
BigModuleB [OPTIONS]

Options:
  --server-host <host>  BigModuleC server host (default: localhost)
  --server-port <port>  BigModuleC server port (default: 9090)
  --help                Show this help message
```

**Main Loop Structure**:
```cpp
int main(int argc, char* argv[]) {
    // 1. Parse arguments
    // 2. Attach to shared memory (SharedMemoryReader::getInstance()->attach())
    // 3. Create FictionalZeemanPredictor
    // 4. Create ThriftRPCClient and connect
    // 5. Install signal handler
    // 6. Main loop (5 Hz):
    //    a. Read temperature from shared memory
    //    b. Predict distortion
    //    c. Send distortion via Thrift RPC
    //    d. Log with FICTIONAL warning
    //    e. Precise wait (200 ms - elapsed)
    // 7. Cleanup (disconnect, detach)
}
```

**Unit Tests**: (Integration-tested, not unit-tested)

---

### 5.6 Task B5: Makefile and Build System

**Estimated Time**: 1 hour
**Priority**: High
**Dependencies**: All tasks (B1-B4)

**Files to Create**:
- `BigModuleB/Makefile`

**Makefile Structure**:
```makefile
include $(REPO_ROOT)/common_infra/build_tools/common.mk

MODULE_NAME := BigModuleB
THRIFT_IDL := ../BigModuleC/src/ext/interfaces/ICompensationController.thrift

SOURCES := src/int/impl/main.cpp \
           src/int/impl/SharedMemoryReader.cpp \
           src/int/impl/FictionalZeemanPredictor.cpp \
           src/int/impl/ThriftRPCClient.cpp \
           src/int/impl/Logger.cpp \
           src/int/generated/ICompensationController.cpp \
           src/int/generated/ICompensationController_types.cpp

INCLUDES := -I$(COMMON_INFRA)/shared_memory \
            -I$(INT_GENERATED_DIR) \
            -I$(THRIFT_INCLUDE)

all: generate build

generate:
	$(THRIFT) --gen cpp -out $(INT_GENERATED_DIR) $(THRIFT_IDL)

build: build-debug build-release

build-debug:
	$(CXX) $(CXXFLAGS_DEBUG) $(INCLUDES) $(SOURCES) $(LDFLAGS) $(LIBS) \
	       -o $(DEBUG_DIR)/$(MODULE_NAME)

build-release:
	$(CXX) $(CXXFLAGS_RELEASE) $(INCLUDES) $(SOURCES) $(LDFLAGS) $(LIBS) \
	       -o $(RELEASE_DIR)/$(MODULE_NAME)

clean:
	rm -rf $(BUILD_DIR) $(INT_GENERATED_DIR)

.PHONY: all generate build build-debug build-release clean
```

---

## 6. BigModuleC Implementation Tasks

### 6.1 Module Overview

**Module**: BigModuleC (CompensationController)
**Purpose**: Receive distortion predictions and apply compensation
**Frequency**: Event-driven (RPC from BigModuleB, ~5 Hz)
**Dependencies**: BigModuleA (shared memory), BigModuleB (Thrift RPC client)

### 6.2 Task C1: Shared Memory Writer (Singleton)

**Estimated Time**: 2 hours
**Priority**: High
**Dependencies**: BigModuleA (shared memory created)

**Requirements**:
- Implement `SharedMemoryWriter` class (Singleton pattern)
- Attach to existing shared memory (read-write)
- Provide write access to compensation fields
- Thread-safe (use mutex for concurrent RPC threads)

**Files to Create**:
- `BigModuleC/src/int/impl/SharedMemoryWriter.h`
- `BigModuleC/src/int/impl/SharedMemoryWriter.cpp`

**Key Methods**:
```cpp
class SharedMemoryWriter {
public:
    static SharedMemoryWriter* getInstance();
    void attach(const std::string& name);
    void writeCompensation(double comp_x_nm, double comp_y_nm, double timestamp_s);
    void detach();

private:
    SharedMemoryWriter() = default;
    ~SharedMemoryWriter();
    static SharedMemoryWriter* instance_;
    int shmFd_;
    rtdcs::SharedLithoState* shmPtr_;
    std::mutex mutex_;
};
```

**Implementation Details**:
- Use `shm_open(O_RDWR)` to open existing shared memory
- Use `mmap(PROT_READ | PROT_WRITE, MAP_SHARED)` for read-write mapping
- Use `std::lock_guard<std::mutex>` in `writeCompensation()` for thread safety
- Validate magic number

**Unit Tests** (BigModuleC/tests/unit/test_shared_memory_writer.cpp):
- Test singleton pattern
- Test attach to existing shared memory
- Test writeCompensation updates correct fields
- Test thread safety (concurrent writes from multiple threads)

---

### 6.3 Task C2: Simple Negation Strategy

**Estimated Time**: 1-2 hours
**Priority**: High
**Dependencies**: None

**Requirements**:
- Implement `SimpleNegationStrategy` class
- FICTIONAL algorithm: `compensation = -distortion`
- Return compensation values

**Files to Create**:
- `BigModuleC/src/int/impl/SimpleNegationStrategy.h`
- `BigModuleC/src/int/impl/SimpleNegationStrategy.cpp`

**Key Methods**:
```cpp
class SimpleNegationStrategy {
public:
    struct CompensationResult {
        double compensation_x_nm;
        double compensation_y_nm;
    };

    CompensationResult computeCompensation(double distortion_x_nm,
                                            double distortion_y_nm) const;
};
```

**Implementation Details**:
- Formula: `comp_x = -distortion_x, comp_y = -distortion_y`
- ⚠️ Include FICTIONAL disclaimer in logs

**Unit Tests** (BigModuleC/tests/unit/test_simple_negation.cpp):
- Test negation formula (5.7 → -5.7, 4.6 → -4.6)
- Test zero distortion
- Test negative distortion
- Test large values

---

### 6.4 Task C3: Thrift RPC Server and Handler

**Estimated Time**: 4-5 hours
**Priority**: High
**Dependencies**: C1 (SharedMemoryWriter), C2 (SimpleNegationStrategy), Thrift IDL

**Requirements**:
- Implement `CompensationControllerHandler` class (implements `ICompensationControllerIf`)
- Implement `ThriftRPCServer` wrapper for TThreadedServer
- Handle `applyDistortion()` RPC method
- Multi-threaded server (TThreadedServer)

**First, Generate Thrift Code**:
```bash
cd BigModuleC
thrift --gen cpp -out src/int/generated src/ext/interfaces/ICompensationController.thrift
```

**Files to Create**:
- `BigModuleC/src/int/impl/CompensationControllerHandler.h`
- `BigModuleC/src/int/impl/CompensationControllerHandler.cpp`
- `BigModuleC/src/int/impl/ThriftRPCServer.h`
- `BigModuleC/src/int/impl/ThriftRPCServer.cpp`

**Key Classes**:
```cpp
class CompensationControllerHandler : public ICompensationControllerIf {
public:
    CompensationControllerHandler(SimpleNegationStrategy* strategy,
                                  SharedMemoryWriter* writer);

    void applyDistortion(const DistortionVector& distortion) override;

private:
    SimpleNegationStrategy* strategy_;
    SharedMemoryWriter* writer_;
    std::mutex mutex_;
};

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

**Implementation Details**:
- Use TThreadedServer, TServerSocket, TBufferedTransportFactory, TBinaryProtocolFactory
- In `applyDistortion()`:
  1. Log received distortion
  2. Validate input (sanity check: |distortion| < 1000 nm)
  3. Compute compensation using strategy
  4. Write to shared memory (thread-safe)
  5. Log FICTIONAL compensation
- Handle exceptions (TException, std::exception)

**Unit Tests** (BigModuleC/tests/unit/test_thrift_handler.cpp):
- Mock SharedMemoryWriter and Strategy
- Test applyDistortion method
- Test input validation
- Test error handling

---

### 6.5 Task C4: Main Entry Point

**Estimated Time**: 2-3 hours
**Priority**: High
**Dependencies**: C1 (SharedMemoryWriter), C2 (SimpleNegationStrategy), C3 (ThriftRPCServer)

**Requirements**:
- Implement `main()` function to start Thrift RPC server
- Command-line argument parsing (--port)
- Signal handling for graceful shutdown

**Files to Create**:
- `BigModuleC/src/int/impl/main.cpp`

**Command-Line Arguments**:
```bash
BigModuleC [OPTIONS]

Options:
  --port <port>  Thrift RPC server port (default: 9090)
  --help         Show this help message
```

**Main Structure**:
```cpp
int main(int argc, char* argv[]) {
    // 1. Parse arguments
    // 2. Attach to shared memory (SharedMemoryWriter::getInstance()->attach())
    // 3. Create SimpleNegationStrategy
    // 4. Create CompensationControllerHandler
    // 5. Create ThriftRPCServer
    // 6. Install signal handler (SIGINT to call server.stop())
    // 7. server.start() [BLOCKING]
    // 8. Cleanup (detach shared memory)
}
```

**Signal Handling**:
- On SIGINT/SIGTERM: Call `server->stop()` to gracefully shut down

---

### 6.6 Task C5: Makefile and Build System

**Estimated Time**: 1 hour
**Priority**: High
**Dependencies**: All tasks (C1-C4)

**Files to Create**:
- `BigModuleC/Makefile`

**Makefile Structure**:
```makefile
include $(REPO_ROOT)/common_infra/build_tools/common.mk

MODULE_NAME := BigModuleC
THRIFT_IDL := src/ext/interfaces/ICompensationController.thrift

SOURCES := src/int/impl/main.cpp \
           src/int/impl/SharedMemoryWriter.cpp \
           src/int/impl/SimpleNegationStrategy.cpp \
           src/int/impl/CompensationControllerHandler.cpp \
           src/int/impl/ThriftRPCServer.cpp \
           src/int/impl/Logger.cpp \
           src/int/generated/ICompensationController.cpp \
           src/int/generated/ICompensationController_types.cpp

INCLUDES := -I$(COMMON_INFRA)/shared_memory \
            -I$(INT_GENERATED_DIR) \
            -I$(THRIFT_INCLUDE)

all: generate build

generate:
	$(THRIFT) --gen cpp -out $(INT_GENERATED_DIR) $(THRIFT_IDL)

build: build-debug build-release

build-debug:
	$(CXX) $(CXXFLAGS_DEBUG) $(INCLUDES) $(SOURCES) $(LDFLAGS) $(LIBS) \
	       -o $(DEBUG_DIR)/$(MODULE_NAME)

build-release:
	$(CXX) $(CXXFLAGS_RELEASE) $(INCLUDES) $(SOURCES) $(LDFLAGS) $(LIBS) \
	       -o $(RELEASE_DIR)/$(MODULE_NAME)

clean:
	rm -rf $(BUILD_DIR) $(INT_GENERATED_DIR)

.PHONY: all generate build build-debug build-release clean
```

---

## 7. Testing Requirements

### 7.1 Unit Testing (Developer Agent Responsibility)

**For Each Module**, write unit tests for all classes:

**BigModuleA**:
- `test_shared_memory_manager.cpp`
- `test_temperature_patterns.cpp`
- `test_logger.cpp`

**BigModuleB**:
- `test_shared_memory_reader.cpp`
- `test_fictional_zeeman.cpp`
- `test_thrift_client.cpp` (with mock server)

**BigModuleC**:
- `test_shared_memory_writer.cpp`
- `test_simple_negation.cpp`
- `test_thrift_handler.cpp` (with mocks)

**Framework**: Google Test (gtest)

**Unit Test Structure**:
```cpp
#include <gtest/gtest.h>
#include "SineWavePattern.h"

TEST(SineWavePatternTest, TestAtTimeZero) {
    SineWavePattern pattern(25.0, 5.0, 0.1);
    double temp = pattern.getTemperature(0.0);
    EXPECT_NEAR(temp, 25.0, 0.01);  // sin(0) = 0
}

TEST(SineWavePatternTest, TestAtTimePeak) {
    SineWavePattern pattern(25.0, 5.0, 0.1);
    double t = M_PI / (2.0 * 2.0 * M_PI * 0.1);  // π/(2*2π*f) = 1/(4f)
    double temp = pattern.getTemperature(t);
    EXPECT_NEAR(temp, 30.0, 0.01);  // sin(π/2) = 1, 25+5=30
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
```

### 7.2 Integration Testing (Tester Agent Responsibility)

**Not Developer's Responsibility**, but Developer should ensure modules build and run for integration tests.

---

## 8. Completion Criteria

### 8.1 Code Completeness

✅ All classes implemented per EDS specifications
✅ All design patterns applied (Strategy, Singleton, Command)
✅ SOLID principles followed
✅ Platform-specific code (Linux vs macOS) handled with `#ifdef`

### 8.2 Build Success

✅ All modules compile without errors on Linux (GCC)
✅ All modules compile without errors on macOS (Clang)
✅ All Makefiles work (`make all`, `make clean`)
✅ Thrift code generation succeeds

### 8.3 Unit Test Coverage

✅ All unit tests pass (gtest)
✅ Code coverage > 80% (gcov/lcov)

### 8.4 Functionality

✅ BigModuleA runs and creates shared memory
✅ BigModuleB reads from shared memory and connects to BigModuleC
✅ BigModuleC starts Thrift RPC server and writes to shared memory
✅ All modules log correctly with timestamps
✅ Graceful shutdown on SIGINT (Ctrl+C)

### 8.5 Documentation

✅ All classes have header comments
✅ All public methods have docstrings
✅ FICTIONAL disclaimers included in all relevant logs and comments

---

## Appendix: Estimated Timeline

**Total Development Time**: ~35-45 hours

| Module | Tasks | Estimated Time |
|--------|-------|----------------|
| **BigModuleA** | A1-A5 | 10-13 hours |
| **BigModuleB** | B1-B5 | 11-14 hours |
| **BigModuleC** | C1-C5 | 10-13 hours |
| **Unit Tests** | All modules | 4-5 hours |

**Recommended Sprint**: 1 week (full-time) or 2 weeks (part-time)

---

## Document Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-20 | Architect Agent | Initial development tasks created |

---

**End of RTDCS Development Tasks**
