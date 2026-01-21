/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Shared Memory Reader for BigModuleB (DistortionPredictor)
 *
 * This class manages read-only access to the POSIX shared memory segment
 * containing SharedLithoState. BigModuleB reads temperature values from
 * the shared memory written by BigModuleA.
 *
 * Pattern: Singleton
 * Thread Safety: Thread-safe (read-only access, no write conflicts)
 * Access Mode: Read-Only (O_RDONLY, PROT_READ)
 *
 * Lifecycle:
 * 1. BigModuleA creates shared memory
 * 2. BigModuleB attaches with read-only access
 * 3. BigModuleB reads temperature values
 * 4. BigModuleB detaches (does NOT destroy shared memory)
 * 5. BigModuleA destroys shared memory on exit
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#ifndef RTDCS_BIGMODULEB_SHARED_MEMORY_READER_H
#define RTDCS_BIGMODULEB_SHARED_MEMORY_READER_H

#include <string>
#include "SharedLithoState.h"

namespace rtdcs {
namespace bigmoduleb {

/**
 * TemperatureReading - Temperature data read from shared memory
 *
 * Simple struct to encapsulate temperature reading with timestamp.
 */
struct TemperatureReading {
    double temperature_C;   ///< Temperature in degrees Celsius
    double timestamp_s;     ///< Timestamp when temperature was written (Unix epoch)
    uint32_t sample_count;  ///< Sample counter from BigModuleA

    TemperatureReading() : temperature_C(0.0), timestamp_s(0.0), sample_count(0) {}
};

/**
 * SharedMemoryReader - Singleton class for reading from shared memory
 *
 * This class provides a singleton interface for attaching to the POSIX
 * shared memory segment and reading temperature values.
 *
 * Design Pattern: Singleton
 * - Ensures only one instance exists
 * - Prevents multiple attachments to shared memory
 * - Global point of access via getInstance()
 *
 * Thread Safety:
 * - readTemperature() is thread-safe (read-only access)
 * - No write operations, so no mutex needed
 *
 * Usage:
 * ```cpp
 * // Attach to shared memory
 * SharedMemoryReader* reader = SharedMemoryReader::getInstance();
 * reader->attach(rtdcs::SHARED_MEMORY_NAME);
 *
 * // Read temperature (thread-safe)
 * TemperatureReading reading = reader->readTemperature();
 *
 * // Detach on exit
 * reader->detach();
 * ```
 */
class SharedMemoryReader {
public:
    /**
     * Get singleton instance
     *
     * Returns the single instance of SharedMemoryReader.
     * Creates the instance on first call (lazy initialization).
     *
     * Thread Safety: Thread-safe (C++11 guarantees)
     *
     * @return Pointer to singleton instance
     */
    static SharedMemoryReader* getInstance();

    /**
     * Attach to existing shared memory
     *
     * Opens the existing shared memory segment created by BigModuleA
     * and maps it with read-only access.
     *
     * Preconditions:
     * - BigModuleA must have created the shared memory first
     * - Shared memory name must match SHARED_MEMORY_NAME
     *
     * Postconditions:
     * - Shared memory is mapped (read-only)
     * - Magic number is validated
     * - Ready for read operations
     *
     * Error Handling:
     * - Throws std::runtime_error if shm_open fails (shared memory doesn't exist)
     * - Throws std::runtime_error if mmap fails
     * - Throws std::runtime_error if magic number validation fails
     *
     * @param name Shared memory segment name (e.g., "/rtdcs_shared_state")
     * @throws std::runtime_error if attachment fails
     */
    void attach(const std::string& name);

    /**
     * Read temperature from shared memory
     *
     * Reads the current temperature value and metadata from the shared
     * memory segment. This method is thread-safe.
     *
     * Thread Safety: Thread-safe (read-only access)
     *
     * Preconditions:
     * - attach() must have been called successfully
     *
     * @return TemperatureReading containing temperature, timestamp, and sample count
     * @throws std::runtime_error if shared memory is not attached
     */
    TemperatureReading readTemperature() const;

    /**
     * Detach from shared memory
     *
     * Unmaps the shared memory segment. Does NOT destroy the shared memory
     * (only BigModuleA should destroy it).
     *
     * Postconditions:
     * - Shared memory is unmapped
     * - shmPtr_ is set to nullptr
     *
     * Note: Safe to call multiple times (idempotent)
     */
    void detach();

    /**
     * Check if attached to shared memory
     *
     * @return true if attached, false otherwise
     */
    bool isAttached() const {
        return (shmPtr_ != nullptr);
    }

    // Prevent copying and assignment (Singleton pattern)
    SharedMemoryReader(const SharedMemoryReader&) = delete;
    SharedMemoryReader& operator=(const SharedMemoryReader&) = delete;

private:
    /**
     * Private constructor (Singleton pattern)
     *
     * Constructor is private to prevent direct instantiation.
     * Use getInstance() to get the singleton instance.
     */
    SharedMemoryReader();

    /**
     * Destructor
     *
     * Detaches from shared memory if still attached.
     * Does NOT destroy shared memory (only BigModuleA should do that).
     */
    ~SharedMemoryReader();

    /**
     * Singleton instance
     *
     * Static pointer to the single instance of SharedMemoryReader.
     * Initialized on first call to getInstance().
     */
    static SharedMemoryReader* instance_;

    /**
     * Shared memory file descriptor
     *
     * File descriptor returned by shm_open().
     * Used for mmap() and close().
     */
    int shmFd_;

    /**
     * Pointer to mapped shared memory
     *
     * Points to the SharedLithoState structure in shared memory.
     * Const pointer for read-only access.
     * nullptr if not attached.
     */
    const rtdcs::SharedLithoState* shmPtr_;

    /**
     * Shared memory segment size
     *
     * Size of the shared memory segment in bytes (4096).
     */
    size_t shmSize_;
};

}  // namespace bigmoduleb
}  // namespace rtdcs

#endif  // RTDCS_BIGMODULEB_SHARED_MEMORY_READER_H
