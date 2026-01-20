# BigModuleA (ThermalMonitor) External Design Specification (EDS)

**Project**: RTDCS (Reticle Thermal Distortion Compensation System)
**Module**: BigModuleA - ThermalMonitor
**Document Type**: Module-Level External Design Specification (EDS)
**Version**: 1.0
**Date**: 2026-01-20
**Author**: Architect Agent
**Status**: Draft - Awaiting Review

---

## ⚠️ CRITICAL DISCLAIMER

This module contains **FICTIONAL** temperature simulation - NOT real sensor integration.

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Detailed Design](#2-detailed-design)
3. [Class Diagrams](#3-class-diagrams)
4. [Sequence Diagrams](#4-sequence-diagrams)
5. [Interface Specifications](#5-interface-specifications)
6. [Algorithm Details](#6-algorithm-details)
7. [Error Handling](#7-error-handling)
8. [Performance Considerations](#8-performance-considerations)

---

## 1. Module Overview

BigModuleA (ThermalMonitor) is responsible for simulating reticle temperature data and publishing it to shared memory for consumption by BigModuleB.

**Key Responsibilities**:
- Create and manage shared memory lifecycle (owner)
- Simulate temperature patterns (sine wave or step changes)
- Update temperature at 10 Hz frequency
- Maintain module status flag
- Handle graceful shutdown

---

## 2. Detailed Design

### 2.1 Component Architecture

```
┌───────────────────────────────────────────────────┐
│           BigModuleA (Process)                    │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  main()                                     │ │
│  │  ├─ Parse command-line arguments            │ │
│  │  ├─ Create TemperatureSimulator             │ │
│  │  ├─ Create SharedMemoryManager (owner)      │ │
│  │  ├─ Initialize shared memory                │ │
│  │  ├─ Setup signal handlers                   │ │
│  │  ├─ Enter main loop (10 Hz)                 │ │
│  │  └─ Cleanup and shutdown                    │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  TemperatureSimulator                       │ │
│  │  ├─ pattern: ITemperaturePattern*           │ │
│  │  ├─ getCurrentTemperature() → double        │ │
│  │  └─ update(deltaTime)                       │ │
│  └─────────────────────────────────────────────┘ │
│           │                                       │
│           │ uses Strategy Pattern                │
│           ▼                                       │
│  ┌─────────────────────────────────────────────┐ │
│  │  ITemperaturePattern (interface)            │ │
│  │  └─ getTemperature(time) → double           │ │
│  └─────────────────────────────────────────────┘ │
│           ▲                                       │
│           │ implemented by                       │
│     ┌─────┴─────┐                                │
│     │           │                                │
│  ┌──┴───┐   ┌──┴───┐                            │
│  │Sine  │   │Step  │                            │
│  │Wave  │   │Pattern│                           │
│  └──────┘   └──────┘                            │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  SharedMemoryManager (Singleton)            │ │
│  │  ├─ create() - shm_open, ftruncate, mmap    │ │
│  │  ├─ writeTemperature(double)                │ │
│  │  ├─ writeTimestamp(int64_t)                 │ │
│  │  ├─ setStatus(uint32_t)                     │ │
│  │  └─ destroy() - munmap, shm_unlink          │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  Logger                                     │ │
│  │  └─ log(level, message) → stdout            │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  SignalHandler                              │ │
│  │  └─ handleSignal(SIGTERM/SIGINT)            │ │
│  └─────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────┘
```

---

## 3. Class Diagrams

### 3.1 Core Classes

```cpp
// Temperature Pattern Interface (Strategy Pattern)
class ITemperaturePattern {
public:
    virtual ~ITemperaturePattern() = default;
    virtual double getTemperature(double time_s) const = 0;
};

// Concrete Strategy: Sine Wave
class SineWavePattern : public ITemperaturePattern {
private:
    double baseTemp_;      // Base temperature (°C)
    double amplitude_;     // Oscillation amplitude (°C)
    double frequency_;     // Frequency (Hz)
    
public:
    SineWavePattern(double baseTemp = 25.0, 
                   double amplitude = 5.0, 
                   double frequency = 0.1);
    
    double getTemperature(double time_s) const override {
        return baseTemp_ + amplitude_ * std::sin(2.0 * M_PI * frequency_ * time_s);
    }
};

// Concrete Strategy: Step Pattern
class StepPattern : public ITemperaturePattern {
private:
    double baseTemp_;
    double stepDelta_;
    double stepInterval_;
    
public:
    StepPattern(double baseTemp = 25.0, 
               double stepDelta = 3.0, 
               double stepInterval = 10.0);
    
    double getTemperature(double time_s) const override {
        int stepCount = static_cast<int>(time_s / stepInterval_);
        return baseTemp_ + (stepCount % 2) * stepDelta_;
    }
};

// Factory for creating patterns
class TemperaturePatternFactory {
public:
    enum class PatternType { SINE_WAVE, STEP_CHANGE };
    
    static std::unique_ptr<ITemperaturePattern> create(
        PatternType type,
        double baseTemp,
        double param1,  // amplitude or stepDelta
        double param2   // frequency or stepInterval
    );
};

// Temperature Simulator
class TemperatureSimulator {
private:
    std::unique_ptr<ITemperaturePattern> pattern_;
    double startTime_;
    
public:
    explicit TemperatureSimulator(std::unique_ptr<ITemperaturePattern> pattern);
    
    double getCurrentTemperature() const;
    void reset();
};

// Shared Memory Manager (Singleton)
class SharedMemoryManager {
private:
    static SharedMemoryManager* instance_;
    int shmFd_;
    SharedLithoState* shmPtr_;
    
    SharedMemoryManager();
    ~SharedMemoryManager();
    
    // Prevent copying
    SharedMemoryManager(const SharedMemoryManager&) = delete;
    SharedMemoryManager& operator=(const SharedMemoryManager&) = delete;
    
public:
    static SharedMemoryManager* getInstance();
    
    void create();  // shm_open, ftruncate, mmap
    void destroy(); // munmap, shm_unlink
    
    void writeTemperature(double temp_C);
    void writeTimestamp(int64_t timestamp_ns);
    void setModuleStatus(uint32_t status);
    
    SharedLithoState* getRawPointer() const { return shmPtr_; }
};
```

---

## 4. Sequence Diagrams

### 4.1 Startup Sequence

```
User          main()        ShmMgr        TempSim       SignalHandler    Logger
 │              │             │             │                 │            │
 │──start───────▶│            │             │                 │            │
 │              │─create()───▶│             │                 │            │
 │              │             │─shm_open()──┐                 │            │
 │              │             │◀────────────┘                 │            │
 │              │             │─ftruncate()─┐                 │            │
 │              │             │◀────────────┘                 │            │
 │              │             │─mmap()──────┐                 │            │
 │              │             │◀────────────┘                 │            │
 │              │             │─initialize()┐                 │            │
 │              │             │◀────────────┘                 │            │
 │              │◀────────────│             │                 │            │
 │              │                           │                 │            │
 │              │─create(pattern)──────────▶│                 │            │
 │              │◀──────────────────────────│                 │            │
 │              │                           │                 │            │
 │              │─setup(SIGTERM,SIGINT)────────────────────▶│            │
 │              │◀──────────────────────────────────────────│            │
 │              │                           │                 │            │
 │              │─log("READY")──────────────────────────────────────────▶│
 │              │                           │                 │            │
 │              │─mainLoop()────┐           │                 │            │
 │              │               │           │                 │            │
 │              │               └──every 100ms─────┐          │            │
 │              │                           │      │          │            │
 │              │─getTemperature()─────────▶│      │          │            │
 │              │◀──────────────────────────│      │          │            │
 │              │                           │      │          │            │
 │              │─writeTemp(T)─▶│           │      │          │            │
 │              │─writeTS(now)─▶│           │      │          │            │
 │              │◀──────────────│           │      │          │            │
 │              │                           │      │          │            │
 │              │─log("Temp")──────────────────────────────────────────▶│
 │              │                           │      │          │            │
 │              │─sleep(100ms)──┐           │      │          │            │
 │              │               └─────────────────┘          │            │
 │              │                           │                 │            │
```

### 4.2 Shutdown Sequence

```
User      SignalHandler   main()      ShmMgr     TempSim    Logger
 │             │            │           │           │         │
 │──Ctrl+C────▶│            │           │           │         │
 │             │─signal(SIGINT)─────▶│  │           │         │
 │             │            │           │           │         │
 │             │            │─stopLoop()┐           │         │
 │             │            │◀──────────┘           │         │
 │             │            │                       │         │
 │             │            │─setStatus(0)─────────▶│         │
 │             │            │                       │         │
 │             │            │─log("Shutting down")────────────▶│
 │             │            │                       │         │
 │             │            │─destroy()────────────▶│         │
 │             │            │           │─munmap()─┐│         │
 │             │            │           │◀─────────┘│         │
 │             │            │           │─shm_unlink()┐       │
 │             │            │           │◀──────────┘│         │
 │             │            │◀──────────│           │         │
 │             │            │                       │         │
 │             │            │─delete TempSim───────▶│         │
 │             │            │                       │         │
 │             │            │─log("Complete")──────────────────▶│
 │             │            │                       │         │
 │             │◀───exit(0)│                       │         │
 │◀────────────│            │                       │         │
```

---

## 5. Interface Specifications

### 5.1 Command-Line Interface

**Format**: `./BigModuleA [OPTIONS]`

**Options**:
```
--pattern <sine|step>         Temperature pattern (default: sine)
--base-temp <celsius>         Base temperature in °C (default: 25.0)
--amplitude <celsius>         Amplitude for sine pattern (default: 5.0)
--frequency <hz>              Frequency for sine pattern (default: 0.1)
--step-delta <celsius>        Step size for step pattern (default: 3.0)
--step-interval <seconds>     Step interval for step pattern (default: 10.0)
--help                        Display usage information
```

**Examples**:
```bash
# Sine wave pattern (default)
./BigModuleA

# Sine wave with custom parameters
./BigModuleA --pattern sine --base-temp 26.0 --amplitude 4.0 --frequency 0.2

# Step pattern
./BigModuleA --pattern step --base-temp 25.0 --step-delta 3.0 --step-interval 5.0
```

### 5.2 Shared Memory Interface (Output)

**Implementation File**: `src/int/impl/SharedMemoryManager.cpp`

**Methods**:
```cpp
void SharedMemoryManager::create() {
    // 1. shm_open with O_CREAT | O_RDWR
    // 2. ftruncate to 4096 bytes
    // 3. mmap with PROT_READ | PROT_WRITE
    // 4. Initialize all fields to zero
}

void SharedMemoryManager::writeTemperature(double temp_C) {
    if (!shmPtr_) throw std::runtime_error("Shared memory not initialized");
    shmPtr_->reticle_temp_C = temp_C;
    // Memory barrier to ensure write visibility
    std::atomic_thread_fence(std::memory_order_release);
}

void SharedMemoryManager::writeTimestamp(int64_t timestamp_ns) {
    if (!shmPtr_) throw std::runtime_error("Shared memory not initialized");
    shmPtr_->temp_timestamp_ns = timestamp_ns;
    std::atomic_thread_fence(std::memory_order_release);
}

void SharedMemoryManager::setModuleStatus(uint32_t status) {
    if (!shmPtr_) throw std::runtime_error("Shared memory not initialized");
    shmPtr_->modulea_status = status;
    std::atomic_thread_fence(std::memory_order_release);
}

void SharedMemoryManager::destroy() {
    if (shmPtr_) {
        munmap(shmPtr_, sizeof(SharedLithoState));
        shmPtr_ = nullptr;
    }
    if (shmFd_ >= 0) {
        close(shmFd_);
        shm_unlink("/rtdcs_shared_state");
        shmFd_ = -1;
    }
}
```

---

## 6. Algorithm Details

### 6.1 Sine Wave Temperature Pattern

**Formula**:
```
T(t) = T_base + A * sin(2π * f * t)
```

**Where**:
- `T(t)` = Temperature at time t (°C)
- `T_base` = Base temperature (default: 25.0°C)
- `A` = Amplitude (default: 5.0°C)
- `f` = Frequency (default: 0.1 Hz, period = 10 seconds)
- `t` = Time in seconds since start

**Example**:
- At t=0s: T = 25.0 + 5.0 * sin(0) = 25.0°C
- At t=2.5s (quarter period): T = 25.0 + 5.0 * sin(π/2) = 30.0°C
- At t=5.0s (half period): T = 25.0 + 5.0 * sin(π) = 25.0°C
- At t=7.5s: T = 25.0 + 5.0 * sin(3π/2) = 20.0°C
- At t=10.0s (full period): T = 25.0°C

### 6.2 Step Pattern Temperature

**Formula**:
```
step_count = floor(t / interval)
T(t) = T_base + (step_count % 2) * delta
```

**Where**:
- `T_base` = Base temperature (default: 25.0°C)
- `delta` = Step size (default: 3.0°C)
- `interval` = Time between steps (default: 10.0 seconds)

**Example** (interval=10s, delta=3.0):
- 0s-10s: T = 25.0°C (step 0, even)
- 10s-20s: T = 28.0°C (step 1, odd)
- 20s-30s: T = 25.0°C (step 2, even)
- 30s-40s: T = 28.0°C (step 3, odd)

### 6.3 Timing Loop (10 Hz)

**Platform-Specific Implementation**:

```cpp
void MainLoop::run() {
    const long PERIOD_NS = 100'000'000; // 100ms = 10 Hz
    struct timespec sleepTime;
    sleepTime.tv_sec = 0;
    sleepTime.tv_nsec = PERIOD_NS;
    
    while (!shutdownRequested) {
        // Get temperature
        double temp = tempSimulator->getCurrentTemperature();
        
        // Write to shared memory
        shmMgr->writeTemperature(temp);
        shmMgr->writeTimestamp(getCurrentTimeNs());
        
        // Log (every 10th iteration)
        if (iterationCount % 10 == 0) {
            logger->log(LogLevel::INFO, 
                       "Temperature: " + std::to_string(temp) + "°C");
        }
        
        // Sleep for 100ms
        #ifdef __APPLE__
            nanosleep(&sleepTime, nullptr);  // macOS
        #else
            clock_nanosleep(CLOCK_MONOTONIC, 0, &sleepTime, nullptr);  // Linux
        #endif
        
        iterationCount++;
    }
}
```

---

## 7. Error Handling

### 7.1 Error Categories and Handling

| Error | Condition | Handling | Exit Code |
|-------|-----------|----------|-----------|
| **Shared memory creation failed** | `shm_open()` returns -1 | Log error with errno, exit | 1 |
| **Memory mapping failed** | `mmap()` returns MAP_FAILED | Log error, cleanup, exit | 1 |
| **Invalid arguments** | Unknown --pattern value | Print usage, exit | 1 |
| **Signal setup failed** | `sigaction()` fails | Log warning, continue | N/A |
| **Timer failure** | `clock_nanosleep()` interrupted | Log warning, continue | N/A |

### 7.2 Platform-Specific Error Handling

**macOS Shared Memory Limit Check** (startup):
```cpp
void checkSharedMemoryLimits() {
    #ifdef __APPLE__
        // Check macOS shared memory limit
        int shmMax;
        size_t len = sizeof(shmMax);
        sysctlbyname("kern.sysv.shmmax", &shmMax, &len, NULL, 0);
        
        if (shmMax < 4096) {
            logger->log(LogLevel::ERROR, 
                       "Insufficient shared memory limit on macOS: " + 
                       std::to_string(shmMax) + " bytes. Required: 4096 bytes.");
            logger->log(LogLevel::ERROR, 
                       "Fix: sudo sysctl -w kern.sysv.shmmax=8388608");
            exit(1);
        }
    #endif
}
```

---

## 8. Performance Considerations

### 8.1 CPU Usage Optimization

**Sleep Instead of Busy-Wait**:
- Use `clock_nanosleep()` or `nanosleep()` for 100ms periods
- Target: < 1% CPU usage during steady-state operation

**Measurement**:
```bash
# On Linux
top -p $(pidof BigModuleA)

# On macOS
top -pid $(pgrep BigModuleA)
```

### 8.2 Memory Footprint

**Target**: < 10 MB resident memory

**Breakdown**:
- Executable code: ~1-2 MB
- Shared memory mapping: 4 KB
- Stack: ~1 MB
- Heap: ~1-2 MB (minimal allocations)

### 8.3 Timing Accuracy

**Jitter Target**: < 5ms deviation from 100ms period

**Factors Affecting Timing**:
- OS scheduling (non-real-time kernel)
- System load
- Platform differences (Linux more precise than macOS)

**Acceptable for POC**: 10 Hz ± 5% is sufficient demonstration

---

## Document Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-20 | Architect Agent | Initial BigModuleA EDS created |

---

**Related Documents**:
- `rtdcs-system-eds.md` - System-Level EDS
- `rtdcs-modulea-eps.md` - BigModuleA EPS (requirements)
- `rtdcs-moduleb-eds.md` - BigModuleB EDS
- `rtdcs-modulec-eds.md` - BigModuleC EDS

---

**End of BigModuleA EDS**
