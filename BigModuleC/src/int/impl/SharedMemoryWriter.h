/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Shared Memory Writer for BigModuleC (CompensationController)
 *
 * This class manages write access to the POSIX shared memory segment
 * containing SharedLithoState. BigModuleC writes compensation values
 * to the shared memory after receiving distortion predictions from BigModuleB.
 *
 * Pattern: Singleton
 * Thread Safety: Thread-safe (uses mutex for concurrent RPC threads)
 * Access Mode: Read-Write (O_RDWR, PROT_READ | PROT_WRITE)
 *
 * Lifecycle:
 * 1. BigModuleA creates shared memory
 * 2. BigModuleC attaches with read-write access
 * 3. BigModuleC writes compensation values
 * 4. BigModuleC detaches (does NOT destroy shared memory)
 * 5. BigModuleA destroys shared memory on exit
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#ifndef RTDCS_BIGMODULEC_SHARED_MEMORY_WRITER_H
#define RTDCS_BIGMODULEC_SHARED_MEMORY_WRITER_H

#include <string>
#include <mutex>
#include "SharedLithoState.h"

namespace rtdcs {
namespace bigmodulec {

/**
 * SharedMemoryWriter - Singleton class for writing to shared memory
 *
 * This class provides a singleton interface for attaching to the POSIX
 * shared memory segment and writing compensation values.
 *
 * Design Pattern: Singleton
 * - Ensures only one instance exists
 * - Prevents multiple attachments to shared memory
 * - Global point of access via getInstance()
 *
 * Thread Safety:
 * - writeCompensation() is thread-safe (uses mutex)
 * - Multiple RPC threads can write concurrently
 *
 * Usage:
 * ```cpp
 * // Attach to shared memory
 * SharedMemoryWriter* writer = SharedMemoryWriter::getInstance();
 * writer->attach(rtdcs::SHARED_MEMORY_NAME);
 *
 * // Write compensation values (thread-safe)
 * writer->writeCompensation(-5.7, -4.6, getCurrentTime());
 *
 * // Detach on exit
 * writer->detach();
 * ```
 */
class SharedMemoryWriter {
public:
    /**
     * Get singleton instance
     *
     * Returns the single instance of SharedMemoryWriter.
     * Creates the instance on first call (lazy initialization).
     *
     * Thread Safety: Thread-safe (C++11 guarantees)
     *
     * @return Pointer to singleton instance
     */
    static SharedMemoryWriter* getInstance();

    /**
     * Attach to existing shared memory
     *
     * Opens the existing shared memory segment created by BigModuleA
     * and maps it with read-write access.
     *
     * Preconditions:
     * - BigModuleA must have created the shared memory first
     * - Shared memory name must match SHARED_MEMORY_NAME
     *
     * Postconditions:
     * - Shared memory is mapped
     * - Magic number is validated
     * - Ready for write operations
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
     * Write compensation values to shared memory
     *
     * Writes the computed compensation values (X, Y, timestamp) to the
     * shared memory segment. This method is thread-safe and can be called
     * concurrently from multiple RPC threads.
     *
     * Thread Safety: Thread-safe (uses mutex)
     *
     * Preconditions:
     * - attach() must have been called successfully
     *
     * @param comp_x_nm X-direction compensation in nanometers
     * @param comp_y_nm Y-direction compensation in nanometers
     * @param timestamp_s Timestamp when compensation was computed (Unix epoch seconds)
     * @throws std::runtime_error if shared memory is not attached
     */
    void writeCompensation(double comp_x_nm, double comp_y_nm, double timestamp_s);

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
    SharedMemoryWriter(const SharedMemoryWriter&) = delete;
    SharedMemoryWriter& operator=(const SharedMemoryWriter&) = delete;

private:
    /**
     * Private constructor (Singleton pattern)
     *
     * Constructor is private to prevent direct instantiation.
     * Use getInstance() to get the singleton instance.
     */
    SharedMemoryWriter();

    /**
     * Destructor
     *
     * Detaches from shared memory if still attached.
     * Does NOT destroy shared memory (only BigModuleA should do that).
     */
    ~SharedMemoryWriter();

    /**
     * Singleton instance
     *
     * Static pointer to the single instance of SharedMemoryWriter.
     * Initialized on first call to getInstance().
     */
    static SharedMemoryWriter* instance_;

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
     * nullptr if not attached.
     */
    rtdcs::SharedLithoState* shmPtr_;

    /**
     * Shared memory segment size
     *
     * Size of the shared memory segment in bytes (4096).
     */
    size_t shmSize_;

    /**
     * Mutex for thread-safe writes
     *
     * Protects writeCompensation() to allow concurrent RPC threads
     * to safely write to shared memory.
     */
    std::mutex mutex_;
};

}  // namespace bigmodulec
}  // namespace rtdcs

#endif  // RTDCS_BIGMODULEC_SHARED_MEMORY_WRITER_H
