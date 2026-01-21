# RTDCS System Architecture

**Reticle Thermal Distortion Compensation System**
**Version:** 1.0
**Date:** 2026-01-21

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Module Descriptions](#module-descriptions)
4. [Inter-Process Communication](#inter-process-communication)
5. [Data Flow](#data-flow)
6. [Threading Model](#threading-model)
7. [Error Handling](#error-handling)
8. [Design Patterns](#design-patterns)

---

## System Overview

RTDCS is a distributed system consisting of three independent processes that communicate via shared memory and RPC. The system demonstrates a simplified lithography thermal compensation workflow.

### Design Goals

1. **Separation of Concerns**: Each module has a single responsibility
2. **Loose Coupling**: Modules communicate via well-defined interfaces
3. **Real-Time Performance**: Low-latency communication for time-sensitive data
4. **Cross-Platform**: Runs on Linux and macOS
5. **Demonstrable**: Clear illustration of multi-process architecture

### Technology Stack

- **Language**: C++14
- **IPC**: POSIX Shared Memory, Apache Thrift 0.19.0
- **Build System**: GNU Make
- **Platform**: Linux (Ubuntu 20.04+), macOS (11.0+)
- **Compiler**: GCC 7.5+, Clang 10+

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                        RTDCS System Architecture                      │
└──────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────┐
                    │   BigModuleA                │
                    │   (ThermalMonitor)          │
                    │                             │
                    │  - Temperature Simulation   │
                    │  - Sine/Step Patterns       │
                    │  - 10 Hz Update Rate        │
                    └──────────┬──────────────────┘
                               │
                               │ Write (O_RDWR)
                               ▼
                    ┌─────────────────────────────┐
                    │   POSIX Shared Memory       │
                    │   /rtdcs_shared_state       │
                    │   Size: 4096 bytes          │
                    │                             │
                    │  Temperature Fields:        │
                    │  - current_temp_C           │
                    │  - timestamp_s              │
                    │  - sample_count             │
                    │                             │
                    │  Compensation Fields:       │
                    │  - compensation_x_nm        │
                    │  - compensation_y_nm        │
                    │  - compensation_timestamp_s │
                    └──────────┬──────────────────┘
                               │
                               │ Read (O_RDONLY)
                               ▼
                    ┌─────────────────────────────┐
                    │   BigModuleB                │
                    │   (DistortionPredictor)     │
                    │                             │
                    │  - Read Temperature         │
                    │  - Zeeman Model (FICTIONAL) │
                    │  - 5 Hz Update Rate         │
                    └──────────┬──────────────────┘
                               │
                               │ Thrift RPC
                               │ applyDistortion()
                               ▼
                    ┌─────────────────────────────┐
                    │   BigModuleC                │
                    │   (CompensationController)  │
                    │                             │
                    │  - Thrift RPC Server        │
                    │  - TThreadedServer          │
                    │  - Simple Negation Strategy │
                    └──────────┬──────────────────┘
                               │
                               │ Write (O_RDWR)
                               │
                               └───────────────────┐
                                                   │
                            Back to Shared Memory ─┘
```

---

## Module Descriptions

### BigModuleA: ThermalMonitor

**Purpose:** Simulate reticle temperature and provide it to other modules via shared memory.

**Responsibilities:**
- Create and initialize POSIX shared memory segment
- Generate temperature data using configurable patterns (sine or step)
- Write temperature values to shared memory at 10 Hz
- Destroy shared memory on exit

**Key Components:**
- `SharedMemoryManager`: Singleton for managing shared memory lifecycle
- `ITemperaturePattern`: Strategy pattern interface for temperature generation
- `SineWavePattern`: Sine wave temperature simulator
- `StepPattern`: Step function temperature simulator
- `Logger`: Thread-safe logging utility

**Configuration:**
- Temperature pattern: Sine or Step
- Base temperature: 25.0°C (default)
- Amplitude/Delta: 5.0°C (default)
- Frequency/Interval: 0.1 Hz or 3.0s (default)
- Sample count: Configurable or infinite

### BigModuleB: DistortionPredictor

**Purpose:** Read temperature from shared memory, predict distortion, and send to BigModuleC via RPC.

**Responsibilities:**
- Attach to existing shared memory (read-only)
- Read temperature values at 5 Hz
- Predict distortion using FICTIONAL Zeeman model
- Send distortion predictions to BigModuleC via Thrift RPC
- Detach from shared memory on exit

**Key Components:**
- `SharedMemoryReader`: Singleton for reading from shared memory
- `ZeemanDistortionPredictor`: FICTIONAL quadratic thermal expansion model
- `ThriftRPCClient`: Wrapper for Thrift client communication
- `Logger`: Thread-safe logging utility

**Algorithm (FICTIONAL):**
```
ΔT = T - T_ref (25.0°C)
distortion_x = α_x * ΔT + β_x * ΔT²  (α_x=1.2, β_x=0.05)
distortion_y = α_y * ΔT + β_y * ΔT²  (α_y=0.9, β_y=0.03)
```

**Configuration:**
- BigModuleC host: localhost (default)
- BigModuleC port: 9090 (default)
- Sample count: Configurable or infinite

### BigModuleC: CompensationController

**Purpose:** Receive distortion predictions via RPC and write compensation to shared memory.

**Responsibilities:**
- Start Thrift RPC server (TThreadedServer) on port 9090
- Receive distortion predictions from BigModuleB
- Compute compensation using FICTIONAL simple negation strategy
- Write compensation values to shared memory
- Stop RPC server on exit

**Key Components:**
- `ThriftRPCServer`: Wrapper for TThreadedServer
- `CompensationControllerHandler`: Thrift RPC handler implementing ICompensationControllerIf
- `SimpleNegationStrategy`: FICTIONAL compensation algorithm
- `SharedMemoryWriter`: Singleton for writing to shared memory
- `Logger`: Thread-safe logging utility

**Algorithm (FICTIONAL):**
```
compensation_x = -distortion_x
compensation_y = -distortion_y
```

**Configuration:**
- RPC server port: 9090 (default)

---

## Inter-Process Communication

### 1. POSIX Shared Memory

**Name:** `/rtdcs_shared_state`
**Size:** 4096 bytes (1 memory page)
**Standard:** POSIX.1-2001

**System Locations:**
- **Linux**: `/dev/shm/rtdcs_shared_state`
- **macOS**: `/tmp/rtdcs_shared_state`

**Access Modes:**

| Module | Access Mode | Flags | Protection | Description |
|--------|-------------|-------|------------|-------------|
| BigModuleA | Owner | `O_CREAT\|O_RDWR` | `PROT_READ\|PROT_WRITE` | Creates, writes, destroys |
| BigModuleB | Reader | `O_RDONLY` | `PROT_READ` | Read-only access |
| BigModuleC | Writer | `O_RDWR` | `PROT_READ\|PROT_WRITE` | Read-write access |

**Memory Layout:**

```c++
struct SharedLithoState {
    uint32_t magic;                    // Offset 0,  Size 4
    // [4 bytes alignment padding]
    double current_temp_C;             // Offset 8,  Size 8
    double timestamp_s;                // Offset 16, Size 8
    uint32_t sample_count;             // Offset 24, Size 4
    // [4 bytes alignment padding]
    double compensation_x_nm;          // Offset 32, Size 8
    double compensation_y_nm;          // Offset 40, Size 8
    double compensation_timestamp_s;   // Offset 48, Size 8
    char padding[4040];                // Offset 56, Size 4040
};  // Total: 4096 bytes
```

**Synchronization:**
- **No explicit locking**: Single writer per field, readers accept eventual consistency
- **Atomic reads**: Each field is read/written atomically (double, uint32_t are atomic on x86-64)
- **Magic number validation**: All modules verify `magic == 0x4C49544F` after attaching

**Lifecycle:**
1. BigModuleA: `shm_open(O_CREAT|O_RDWR)` → `ftruncate(4096)` → `mmap()`
2. BigModuleB: `shm_open(O_RDONLY)` → `mmap(PROT_READ)`
3. BigModuleC: `shm_open(O_RDWR)` → `mmap(PROT_READ|PROT_WRITE)`
4. [All modules run]
5. BigModuleA: `munmap()` → `shm_unlink()` (destroys)
6. BigModuleB/C: `munmap()` (detach but don't destroy)

### 2. Apache Thrift RPC

**Version:** 0.19.0
**Protocol:** TBinaryProtocol
**Transport:** TBufferedTransport over TCP
**Server:** TThreadedServer (one thread per connection)
**Port:** 9090 (default, configurable)

**IDL Definition:**
```thrift
namespace cpp rtdcs.interfaces

struct DistortionVector {
    1: double distortion_x_nm,
    2: double distortion_y_nm
}

service ICompensationController {
    void applyDistortion(1: DistortionVector distortion)
}
```

**Generated Files:**
- `ICompensationController.h` - Service interface
- `ICompensationController.cpp` - Service implementation stubs
- `ICompensationController_types.h` - Data structures
- `ICompensationController_types.cpp` - Serialization code

**Client-Server Interaction:**
```
BigModuleB (Client)                    BigModuleC (Server)
      │                                        │
      │ 1. Connect (TCP handshake)             │
      ├───────────────────────────────────────>│
      │                                        │
      │ 2. applyDistortion(distortion)         │
      ├───────────────────────────────────────>│
      │                                        │
      │                                   3. Process
      │                                   - Compute compensation
      │                                   - Write to shared memory
      │                                        │
      │ 4. ACK (void return)                   │
      │<───────────────────────────────────────┤
      │                                        │
      │ 5. [Repeat for each prediction]        │
      │                                        │
```

**Threading Model:**
- **TThreadedServer**: Creates one thread per client connection
- **Thread-safe handler**: Uses mutex for concurrent RPC calls
- **Connection pooling**: Not implemented (single client)

---

## Data Flow

### Startup Sequence

```
1. User starts BigModuleA
   ├─> Create shared memory (/rtdcs_shared_state)
   ├─> Initialize SharedLithoState structure
   ├─> Set magic number (0x4C49544F)
   └─> Start 10 Hz temperature simulation loop

2. User starts BigModuleC
   ├─> Attach to shared memory (read-write)
   ├─> Validate magic number
   ├─> Start Thrift RPC server on port 9090
   └─> Wait for RPC connections

3. User starts BigModuleB
   ├─> Attach to shared memory (read-only)
   ├─> Validate magic number
   ├─> Connect to BigModuleC Thrift server (localhost:9090)
   └─> Start 5 Hz prediction loop
```

### Runtime Data Flow

```
BigModuleA (10 Hz loop):
   ├─> Generate temperature: T = pattern.compute(time)
   ├─> Write to shared memory:
   │   ├─> shared_mem->current_temp_C = T
   │   ├─> shared_mem->timestamp_s = now()
   │   └─> shared_mem->sample_count++
   └─> Sleep 100 ms

BigModuleB (5 Hz loop):
   ├─> Read from shared memory:
   │   ├─> T = shared_mem->current_temp_C
   │   └─> timestamp = shared_mem->timestamp_s
   ├─> Predict distortion:
   │   ├─> ΔT = T - 25.0
   │   ├─> distortion_x = 1.2*ΔT + 0.05*ΔT²
   │   └─> distortion_y = 0.9*ΔT + 0.03*ΔT²
   ├─> Send via RPC:
   │   └─> client->applyDistortion({distortion_x, distortion_y})
   └─> Sleep 200 ms

BigModuleC (Event-driven):
   ├─> Receive RPC: applyDistortion(distortion)
   ├─> Compute compensation:
   │   ├─> comp_x = -distortion_x
   │   └─> comp_y = -distortion_y
   ├─> Write to shared memory:
   │   ├─> shared_mem->compensation_x_nm = comp_x
   │   ├─> shared_mem->compensation_y_nm = comp_y
   │   └─> shared_mem->compensation_timestamp_s = now()
   └─> Return (ACK)
```

### Shutdown Sequence

```
1. User presses Ctrl+C in BigModuleB
   ├─> Catch SIGINT
   ├─> Stop prediction loop
   ├─> Disconnect from Thrift server
   ├─> Detach from shared memory (munmap)
   └─> Exit

2. User presses Ctrl+C in BigModuleC
   ├─> Catch SIGINT
   ├─> Stop Thrift RPC server
   ├─> Detach from shared memory (munmap)
   └─> Exit

3. User presses Ctrl+C in BigModuleA
   ├─> Catch SIGINT
   ├─> Stop temperature simulation loop
   ├─> Detach from shared memory (munmap)
   ├─> Destroy shared memory (shm_unlink)
   └─> Exit
```

---

## Threading Model

### BigModuleA (Single-threaded)
- **Main thread**: Temperature simulation loop (10 Hz)
- **Signal handler**: SIGINT/SIGTERM (same thread)
- **No concurrency**: Simple sequential execution

### BigModuleB (Single-threaded)
- **Main thread**: Prediction loop (5 Hz) with RPC calls
- **Signal handler**: SIGINT/SIGTERM (same thread)
- **Blocking RPC**: Synchronous Thrift calls (blocks until response)
- **No concurrency**: Simple sequential execution

### BigModuleC (Multi-threaded)
- **Main thread**: Server initialization and shutdown
- **Thrift server threads**: TThreadedServer spawns one thread per connection
- **RPC handler threads**: Each RPC call runs in separate thread
- **Synchronization**: Mutex in SharedMemoryWriter for concurrent writes

**Thread Safety:**
- **Shared memory writes** (BigModuleC): Mutex-protected
- **Shared memory reads** (BigModuleB): Read-only, no locking needed
- **Logger**: Mutex-protected for all modules
- **Thrift client**: Single-threaded, no concurrent calls

---

## Error Handling

### Shared Memory Errors

| Error | Cause | Handler |
|-------|-------|---------|
| `shm_open` fails | Module not started | Throw exception, log error, exit |
| `mmap` fails | Insufficient memory | Throw exception, log error, exit |
| Invalid magic | Corruption | Throw exception, log error, exit |
| Permission denied | Wrong UID/permissions | Throw exception, log error, exit |

### Thrift RPC Errors

| Error | Cause | Handler |
|-------|-------|---------|
| Connection refused | Server not started | Throw exception, log error, exit |
| Connection timeout | Network issue | Throw exception, log error, exit |
| Transport exception | Connection dropped | Log error, mark disconnected, exit |
| RPC timeout | Server overloaded | Throw exception, log error |

### Signal Handling

All modules handle:
- **SIGINT** (Ctrl+C): Graceful shutdown, cleanup resources
- **SIGTERM**: Graceful shutdown, cleanup resources

**Cleanup order:**
1. Stop main loop (set `running = false`)
2. Close connections (Thrift client/server)
3. Detach from shared memory (`munmap`)
4. Destroy shared memory if owner (`shm_unlink`)
5. Exit cleanly

---

## Design Patterns

### Singleton Pattern
**Used in:** All modules
**Classes:**
- `SharedMemoryManager` (BigModuleA)
- `SharedMemoryReader` (BigModuleB)
- `SharedMemoryWriter` (BigModuleC)

**Rationale:** Prevent multiple shared memory attachments, global access point

### Strategy Pattern
**Used in:** BigModuleA
**Classes:**
- `ITemperaturePattern` (interface)
- `SineWavePattern` (concrete strategy)
- `StepPattern` (concrete strategy)

**Rationale:** Different temperature generation algorithms, runtime selection

### Facade Pattern
**Used in:** BigModuleB, BigModuleC
**Classes:**
- `ThriftRPCClient` (BigModuleB) - Wraps Thrift client complexity
- `ThriftRPCServer` (BigModuleC) - Wraps TThreadedServer complexity

**Rationale:** Simplify Thrift API, hide boilerplate code

### Command Pattern (Implicit)
**Used in:** BigModuleC
**Classes:**
- `ICompensationControllerIf` (Thrift-generated interface)
- `CompensationControllerHandler` (command handler)

**Rationale:** Thrift RPC uses command pattern for request handling

---

## Performance Characteristics

### Latency

| Operation | Typical Latency | Notes |
|-----------|----------------|-------|
| Shared memory read | < 1 µs | Direct memory access |
| Shared memory write | < 1 µs | Direct memory access |
| Thrift RPC (localhost) | 50-100 µs | TCP loopback + serialization |
| Temperature generation | < 10 µs | Simple math (sin or step) |
| Distortion prediction | < 10 µs | Quadratic equation |
| Compensation computation | < 1 µs | Simple negation |

### Throughput

| Module | Update Rate | Throughput |
|--------|-------------|------------|
| BigModuleA | 10 Hz | 10 samples/sec |
| BigModuleB | 5 Hz | 5 predictions/sec |
| BigModuleC | Event-driven | 5 RPCs/sec (limited by client) |

### Memory Usage

| Module | RSS (Resident) | Shared Memory | Notes |
|--------|---------------|---------------|-------|
| BigModuleA | ~2 MB | 4 KB | Minimal footprint |
| BigModuleB | ~10 MB | 4 KB | Thrift client overhead |
| BigModuleC | ~15 MB | 4 KB | Thrift server overhead |

---

## Security Considerations

### Shared Memory
- **No encryption**: Data is plain text in memory
- **Access control**: Standard POSIX permissions (0666)
- **Validation**: Magic number check prevents random corruption
- **Isolation**: Per-user shared memory namespace

### Thrift RPC
- **No authentication**: Server accepts any client
- **No encryption**: Data sent in plain text over TCP
- **No authorization**: All clients have full access
- **Localhost only**: Recommended to bind to 127.0.0.1

**⚠️ WARNING**: This is a POC system. **DO NOT expose to untrusted networks.**

---

## Future Enhancements

### Potential Improvements
1. **TLS encryption** for Thrift RPC
2. **Authentication/authorization** for RPC server
3. **Graceful reconnection** on network failures
4. **Dynamic configuration** via config files
5. **Metrics/monitoring** endpoints
6. **Distributed tracing** for debugging
7. **Connection pooling** for multiple clients
8. **Compression** for RPC payloads

### Scalability
- Current design: 1 temperature monitor → 1 predictor → 1 controller
- Possible extensions:
  - Multiple predictors (load balancing)
  - Multiple controllers (redundancy)
  - Distributed deployment (remote machines)

---

**See RTDCS-User-Guide.md for usage instructions**
**See QUICK-START.md for quick command reference**
