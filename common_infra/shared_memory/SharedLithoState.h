/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Shared Memory State Structure Definition
 *
 * This header defines the SharedLithoState structure used for inter-process
 * communication (IPC) between BigModuleA, BigModuleB, and BigModuleC via
 * POSIX shared memory.
 *
 * Shared Memory Name: /rtdcs_shared_state
 * Size: 4096 bytes (one memory page)
 * Access Modes:
 *   - BigModuleA: Owner (O_RDWR, creates and destroys)
 *   - BigModuleB: Reader (O_RDONLY, reads temperature)
 *   - BigModuleC: Writer (O_RDWR, writes compensation)
 *
 * Platform Support: Linux (Ubuntu 20.04+), macOS (11.0+)
 * Standard: POSIX.1-2001
 *
 * Author: Architect Agent
 * Date: 2026-01-20
 * Version: 1.0
 */

#ifndef RTDCS_SHARED_LITHO_STATE_H
#define RTDCS_SHARED_LITHO_STATE_H

#include <cstdint>   // uint32_t
#include <cstring>   // memset

/**
 * Namespace for RTDCS interfaces and shared structures
 */
namespace rtdcs {

/**
 * Magic number for validating shared memory integrity
 *
 * Value: 0x4C49544F (ASCII "LITO" for "Lithography")
 * Purpose: Detect corruption, verify correct shared memory attachment
 *
 * All modules MUST verify this magic number after attaching to shared memory.
 * If the magic number doesn't match, the shared memory is invalid or corrupted.
 */
constexpr uint32_t SHARED_MEMORY_MAGIC = 0x4C49544F;  // "LITO"

/**
 * Shared memory segment name
 *
 * POSIX shared memory uses names starting with '/' followed by alphanumeric characters.
 * This name is used by shm_open() on all three modules.
 */
constexpr const char* SHARED_MEMORY_NAME = "/rtdcs_shared_state";

/**
 * Shared memory size in bytes
 *
 * Size: 4096 bytes (4 KB, one memory page)
 * Alignment: Most systems use 4096-byte pages, so this is page-aligned
 *
 * Note: The actual structure is much smaller (~100 bytes), but we allocate
 * a full page for alignment and future extensibility.
 */
constexpr size_t SHARED_MEMORY_SIZE = 4096;

/**
 * SharedLithoState - Main shared memory structure
 *
 * This structure contains the complete state shared between all three modules:
 * - Temperature data (written by BigModuleA, read by BigModuleB)
 * - Compensation data (written by BigModuleC, read by hypothetical actuator)
 * - Metadata (magic number, timestamps, sample counters)
 *
 * Memory Layout:
 * ```
 * Offset | Size | Field                        | Writer      | Readers
 * -------|------|------------------------------|-------------|-------------
 * 0      | 4    | magic                        | BigModuleA  | All
 * 4      | 8    | current_temp_C               | BigModuleA  | BigModuleB
 * 12     | 8    | timestamp_s                  | BigModuleA  | BigModuleB
 * 20     | 4    | sample_count                 | BigModuleA  | All
 * 24     | 8    | compensation_x_nm            | BigModuleC  | (Actuator)
 * 32     | 8    | compensation_y_nm            | BigModuleC  | (Actuator)
 * 40     | 8    | compensation_timestamp_s     | BigModuleC  | (Actuator)
 * 48     | 4048 | padding                      | -           | -
 * -------|------|------------------------------|-------------|-------------
 * Total: 4096 bytes
 * ```
 *
 * Concurrency:
 * - BigModuleA writes temperature fields (single writer)
 * - BigModuleB reads temperature fields (multiple readers OK)
 * - BigModuleC writes compensation fields (single writer, uses mutex)
 * - No explicit locking needed (single writer per field, readers accept eventual consistency)
 *
 * Alignment:
 * - All fields are naturally aligned (doubles on 8-byte boundaries, uint32_t on 4-byte)
 * - Total size is 4096 bytes (page-aligned)
 *
 * Initialization:
 * - BigModuleA creates and initializes the structure
 * - BigModuleA sets magic number to SHARED_MEMORY_MAGIC (0x4C49544F)
 * - BigModuleA zeros all data fields
 *
 * Validation:
 * - All modules MUST check magic == SHARED_MEMORY_MAGIC after attaching
 * - If magic is incorrect, shared memory is invalid or corrupted
 *
 * Lifecycle:
 * 1. BigModuleA: shm_open(O_CREAT | O_RDWR), ftruncate(), mmap(PROT_READ | PROT_WRITE)
 * 2. BigModuleB: shm_open(O_RDONLY), mmap(PROT_READ)
 * 3. BigModuleC: shm_open(O_RDWR), mmap(PROT_READ | PROT_WRITE)
 * 4. [All modules run and communicate via shared memory]
 * 5. BigModuleA: munmap(), shm_unlink() (destroys shared memory)
 * 6. BigModuleB/C: munmap() (detach but don't destroy)
 */
struct SharedLithoState {
    // ========================================================================
    // Metadata Fields (Written by BigModuleA)
    // ========================================================================

    /**
     * Magic number for integrity validation
     *
     * Value: 0x4C49544F (ASCII "LITO")
     * Writer: BigModuleA (sets during initialization)
     * Readers: All modules (validate after attaching)
     *
     * Purpose: Detect shared memory corruption or invalid attachment.
     * All modules MUST verify this field equals SHARED_MEMORY_MAGIC (0x4C49544F)
     * after successfully attaching to shared memory.
     *
     * Example validation:
     * ```cpp
     * if (shmPtr->magic != rtdcs::SHARED_MEMORY_MAGIC) {
     *     throw std::runtime_error("Invalid shared memory magic number");
     * }
     * ```
     */
    uint32_t magic;

    // ========================================================================
    // Temperature Data Fields (Written by BigModuleA, Read by BigModuleB)
    // ========================================================================

    /**
     * Current reticle temperature in degrees Celsius (°C)
     *
     * Writer: BigModuleA (ThermalMonitor)
     * Readers: BigModuleB (DistortionPredictor)
     * Update Frequency: 10 Hz (100 ms intervals)
     *
     * Description:
     * This field contains the current temperature reading from the thermal
     * monitoring system. In the POC, this is a simulated temperature using
     * either a sine wave pattern or step pattern (user-selectable).
     *
     * Typical Range:
     * - Minimum: 20.0°C (base temperature)
     * - Maximum: 30.0°C (base + amplitude)
     * - Default: 25.0°C (nominal operating temperature)
     *
     * Temperature Patterns (POC):
     * - Sine Wave: T(t) = 25.0 + 5.0 * sin(2π * 0.1 * t)
     * - Step: T(t) = 25.0 + (step_count % 2) * 5.0
     *
     * Usage by BigModuleB:
     * - Read this value every 200 ms (5 Hz)
     * - Feed into FICTIONAL Zeeman Thermal Expansion Model
     * - Compute distortion prediction
     *
     * Example:
     * ```cpp
     * // BigModuleA (Writer)
     * shmPtr->current_temp_C = 25.3;
     * shmPtr->timestamp_s = getCurrentTime();
     *
     * // BigModuleB (Reader)
     * double temp = shmPtr->current_temp_C;
     * DistortionVector distortion = predictor.predict(temp);
     * ```
     */
    double current_temp_C;

    /**
     * Timestamp when temperature was written (seconds since Unix epoch)
     *
     * Writer: BigModuleA (ThermalMonitor)
     * Readers: BigModuleB (DistortionPredictor), logging
     * Update Frequency: 10 Hz (same as current_temp_C)
     *
     * Description:
     * This field contains the timestamp (in seconds since Unix epoch) when
     * the current_temp_C field was last updated. It allows readers to know
     * the "freshness" of the temperature data.
     *
     * Format: Seconds since 1970-01-01T00:00:00Z with fractional seconds
     * Example: 1705756825.678 (2024-01-20T14:23:45.678Z)
     *
     * Precision: Microseconds (6 decimal places)
     *
     * Usage by BigModuleB:
     * - Read along with current_temp_C
     * - Use for logging and debugging
     * - Detect stale data (if timestamp is too old)
     *
     * Example:
     * ```cpp
     * // BigModuleA (Writer)
     * struct timespec ts;
     * clock_gettime(CLOCK_REALTIME, &ts);
     * shmPtr->timestamp_s = ts.tv_sec + ts.tv_nsec / 1e9;
     *
     * // BigModuleB (Reader)
     * double age_s = getCurrentTime() - shmPtr->timestamp_s;
     * if (age_s > 1.0) {
     *     Logger::warn("Temperature data is stale (age: " +
     *                  std::to_string(age_s) + " seconds)");
     * }
     * ```
     */
    double timestamp_s;

    /**
     * Total number of temperature samples written
     *
     * Writer: BigModuleA (ThermalMonitor)
     * Readers: All modules (for logging and debugging)
     * Update Frequency: 10 Hz (increments with each temperature update)
     *
     * Description:
     * This counter increments every time BigModuleA writes a new temperature
     * sample. It allows readers to detect missed updates and track overall
     * system uptime.
     *
     * Range: 0 to 4,294,967,295 (uint32_t max)
     * Overflow: After ~4.9 billion samples (~15.6 years at 10 Hz), wraps to 0
     *
     * Usage:
     * - Logging progress (e.g., "Temperature: 25.3°C (sample 10/100)")
     * - Detecting missed updates (if sample_count jumps by more than 1)
     * - Debugging (verify BigModuleA is actively writing)
     *
     * Example:
     * ```cpp
     * // BigModuleA (Writer)
     * shmPtr->current_temp_C = 25.3;
     * shmPtr->timestamp_s = getCurrentTime();
     * shmPtr->sample_count++;
     *
     * // BigModuleB (Reader)
     * uint32_t last_sample = 0;
     * uint32_t current_sample = shmPtr->sample_count;
     * if (current_sample != last_sample + 1) {
     *     Logger::warn("Missed " + std::to_string(current_sample - last_sample - 1) +
     *                  " temperature samples");
     * }
     * last_sample = current_sample;
     * ```
     */
    uint32_t sample_count;

    // ========================================================================
    // Compensation Data Fields (Written by BigModuleC, Read by Actuator)
    // ========================================================================

    /**
     * X-direction compensation value in nanometers (nm)
     *
     * Writer: BigModuleC (CompensationController)
     * Readers: (Hypothetical reticle actuator - not implemented in POC)
     * Update Frequency: Event-driven (on RPC from BigModuleB, ~5 Hz)
     *
     * Description:
     * This field contains the computed compensation value for the X-direction
     * (horizontal) reticle distortion. The value is computed by BigModuleC
     * using the FICTIONAL Simple Negation Strategy: compensation_x = -distortion_x
     *
     * Units: Nanometers (nm)
     * Sign Convention:
     *   - Positive: Move reticle right (to compensate for leftward distortion)
     *   - Negative: Move reticle left (to compensate for rightward distortion)
     *
     * Typical Range: -100.0 to +100.0 nm (FICTIONAL)
     *
     * ⚠️ FICTIONAL DISCLAIMER:
     * This compensation algorithm (simple negation) is completely made-up
     * for demonstration purposes. Real lithography systems use complex
     * multi-parameter correction models based on calibration data.
     *
     * Usage by BigModuleC:
     * - Receive DistortionVector from BigModuleB via Thrift RPC
     * - Compute compensation: compensation_x_nm = -distortion.distortion_x_nm
     * - Write to this field with mutex protection (thread-safe)
     *
     * Example:
     * ```cpp
     * // BigModuleC (Writer)
     * CompensationVector compensation = strategy->computeCompensation(distortion);
     * shmPtr->compensation_x_nm = compensation.compensation_x_nm;  // e.g., -5.7 nm
     * shmPtr->compensation_y_nm = compensation.compensation_y_nm;  // e.g., -4.6 nm
     * shmPtr->compensation_timestamp_s = getCurrentTime();
     * ```
     */
    double compensation_x_nm;

    /**
     * Y-direction compensation value in nanometers (nm)
     *
     * Writer: BigModuleC (CompensationController)
     * Readers: (Hypothetical reticle actuator - not implemented in POC)
     * Update Frequency: Event-driven (on RPC from BigModuleB, ~5 Hz)
     *
     * Description:
     * This field contains the computed compensation value for the Y-direction
     * (vertical) reticle distortion. The value is computed by BigModuleC
     * using the FICTIONAL Simple Negation Strategy: compensation_y = -distortion_y
     *
     * Units: Nanometers (nm)
     * Sign Convention:
     *   - Positive: Move reticle up (to compensate for downward distortion)
     *   - Negative: Move reticle down (to compensate for upward distortion)
     *
     * Typical Range: -100.0 to +100.0 nm (FICTIONAL)
     *
     * ⚠️ FICTIONAL DISCLAIMER:
     * This compensation algorithm (simple negation) is completely made-up
     * for demonstration purposes. Real lithography systems use complex
     * multi-parameter correction models based on calibration data.
     *
     * Usage: Same as compensation_x_nm (see above)
     */
    double compensation_y_nm;

    /**
     * Timestamp when compensation was written (seconds since Unix epoch)
     *
     * Writer: BigModuleC (CompensationController)
     * Readers: (Hypothetical actuator, logging)
     * Update Frequency: Event-driven (on RPC from BigModuleB, ~5 Hz)
     *
     * Description:
     * This field contains the timestamp when the compensation values were
     * last updated by BigModuleC. It allows readers to know the "freshness"
     * of the compensation data.
     *
     * Format: Seconds since 1970-01-01T00:00:00Z with fractional seconds
     * Example: 1705756825.678 (2024-01-20T14:23:45.678Z)
     *
     * Precision: Microseconds (6 decimal places)
     *
     * Usage:
     * - Detect stale compensation data
     * - Correlate with distortion predictions (via timestamp)
     * - Logging and debugging
     *
     * Example:
     * ```cpp
     * // BigModuleC (Writer)
     * shmPtr->compensation_timestamp_s = getCurrentTime();
     *
     * // Hypothetical Actuator (Reader)
     * double age_s = getCurrentTime() - shmPtr->compensation_timestamp_s;
     * if (age_s > 1.0) {
     *     Logger::warn("Compensation data is stale");
     * }
     * ```
     */
    double compensation_timestamp_s;

    // ========================================================================
    // Padding (Unused, for Future Extension and Alignment)
    // ========================================================================

    /**
     * Padding to align structure to 4096 bytes (one memory page)
     *
     * Purpose:
     * - Ensure total structure size is exactly 4096 bytes (page-aligned)
     * - Reserve space for future fields without breaking ABI
     * - Prevent accidental access beyond structure bounds
     *
     * Current Structure Size:
     * - magic: 4 bytes
     * - current_temp_C: 8 bytes
     * - timestamp_s: 8 bytes
     * - sample_count: 4 bytes
     * - compensation_x_nm: 8 bytes
     * - compensation_y_nm: 8 bytes
     * - compensation_timestamp_s: 8 bytes
     * - Total: 48 bytes
     *
     * Padding Size:
     * - 4096 - 48 = 4048 bytes
     *
     * Future Extensions (Examples):
     * - Add more temperature sensors (multi-zone monitoring)
     * - Add focus compensation (Z-direction)
     * - Add rotation compensation (theta)
     * - Add calibration coefficients
     * - Add diagnostic counters (errors, warnings)
     */
    char padding[4048];

    // ========================================================================
    // Constructor and Initialization
    // ========================================================================

    /**
     * Default constructor - Initialize all fields to zero
     *
     * Called by BigModuleA after creating shared memory.
     * Sets magic number and zeros all data fields.
     */
    SharedLithoState() {
        magic = SHARED_MEMORY_MAGIC;
        current_temp_C = 0.0;
        timestamp_s = 0.0;
        sample_count = 0;
        compensation_x_nm = 0.0;
        compensation_y_nm = 0.0;
        compensation_timestamp_s = 0.0;
        std::memset(padding, 0, sizeof(padding));
    }

    /**
     * Validate magic number
     *
     * Returns true if magic number is correct, false otherwise.
     * All modules MUST call this after attaching to shared memory.
     */
    bool isValid() const {
        return (magic == SHARED_MEMORY_MAGIC);
    }

    /**
     * Reset all data fields to zero (keep magic number)
     *
     * Called by BigModuleA during shutdown or reset.
     */
    void reset() {
        current_temp_C = 0.0;
        timestamp_s = 0.0;
        sample_count = 0;
        compensation_x_nm = 0.0;
        compensation_y_nm = 0.0;
        compensation_timestamp_s = 0.0;
        std::memset(padding, 0, sizeof(padding));
    }
};

// Compile-time assertion to verify structure size is exactly 4096 bytes
static_assert(sizeof(SharedLithoState) == SHARED_MEMORY_SIZE,
              "SharedLithoState size must be exactly 4096 bytes");

}  // namespace rtdcs

#endif  // RTDCS_SHARED_LITHO_STATE_H

/**
 * Usage Examples:
 *
 * BigModuleA (Owner - Create and Initialize):
 * ```cpp
 * #include "SharedLithoState.h"
 *
 * // Create shared memory
 * int shmFd = shm_open(rtdcs::SHARED_MEMORY_NAME, O_CREAT | O_RDWR, 0666);
 * ftruncate(shmFd, rtdcs::SHARED_MEMORY_SIZE);
 *
 * // Map shared memory
 * void* ptr = mmap(nullptr, rtdcs::SHARED_MEMORY_SIZE,
 *                  PROT_READ | PROT_WRITE, MAP_SHARED, shmFd, 0);
 * rtdcs::SharedLithoState* shmPtr = static_cast<rtdcs::SharedLithoState*>(ptr);
 *
 * // Initialize structure (calls constructor)
 * new (shmPtr) rtdcs::SharedLithoState();
 *
 * // Verify magic number
 * if (!shmPtr->isValid()) {
 *     throw std::runtime_error("Failed to initialize shared memory");
 * }
 *
 * // Write temperature (10 Hz loop)
 * shmPtr->current_temp_C = 25.3;
 * shmPtr->timestamp_s = getCurrentTime();
 * shmPtr->sample_count++;
 *
 * // Cleanup
 * munmap(shmPtr, rtdcs::SHARED_MEMORY_SIZE);
 * shm_unlink(rtdcs::SHARED_MEMORY_NAME);
 * ```
 *
 * BigModuleB (Reader - Read Temperature):
 * ```cpp
 * #include "SharedLithoState.h"
 *
 * // Attach to existing shared memory (read-only)
 * int shmFd = shm_open(rtdcs::SHARED_MEMORY_NAME, O_RDONLY, 0);
 * void* ptr = mmap(nullptr, rtdcs::SHARED_MEMORY_SIZE,
 *                  PROT_READ, MAP_SHARED, shmFd, 0);
 * const rtdcs::SharedLithoState* shmPtr =
 *     static_cast<const rtdcs::SharedLithoState*>(ptr);
 *
 * // Verify magic number
 * if (!shmPtr->isValid()) {
 *     throw std::runtime_error("Invalid shared memory magic number");
 * }
 *
 * // Read temperature (5 Hz loop)
 * double temp = shmPtr->current_temp_C;
 * double timestamp = shmPtr->timestamp_s;
 *
 * // Cleanup
 * munmap((void*)shmPtr, rtdcs::SHARED_MEMORY_SIZE);
 * ```
 *
 * BigModuleC (Writer - Write Compensation):
 * ```cpp
 * #include "SharedLithoState.h"
 *
 * // Attach to existing shared memory (read-write)
 * int shmFd = shm_open(rtdcs::SHARED_MEMORY_NAME, O_RDWR, 0);
 * void* ptr = mmap(nullptr, rtdcs::SHARED_MEMORY_SIZE,
 *                  PROT_READ | PROT_WRITE, MAP_SHARED, shmFd, 0);
 * rtdcs::SharedLithoState* shmPtr =
 *     static_cast<rtdcs::SharedLithoState*>(ptr);
 *
 * // Verify magic number
 * if (!shmPtr->isValid()) {
 *     throw std::runtime_error("Invalid shared memory magic number");
 * }
 *
 * // Write compensation (event-driven on RPC)
 * shmPtr->compensation_x_nm = -5.7;
 * shmPtr->compensation_y_nm = -4.6;
 * shmPtr->compensation_timestamp_s = getCurrentTime();
 *
 * // Cleanup
 * munmap(shmPtr, rtdcs::SHARED_MEMORY_SIZE);
 * ```
 */
