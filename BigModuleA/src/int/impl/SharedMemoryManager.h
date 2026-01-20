/**
 * RTDCS BigModuleA - SharedMemoryManager (Singleton)
 *
 * This class manages POSIX shared memory for inter-process communication
 * between BigModuleA, BigModuleB, and BigModuleC.
 *
 * Design Pattern: Singleton (thread-safe Meyer's singleton)
 * Responsibility: Create, initialize, and destroy shared memory segment
 *
 * Lifecycle:
 * 1. BigModuleA creates shared memory on startup (O_CREAT | O_RDWR)
 * 2. Initializes SharedLithoState structure with magic number
 * 3. Provides write access to temperature fields
 * 4. Destroys shared memory on shutdown (shm_unlink)
 *
 * Thread Safety:
 * - Singleton instance creation is thread-safe (C++11 Meyer's singleton)
 * - Shared memory writes are NOT synchronized (single writer assumption)
 * - Multiple readers can read concurrently (eventual consistency model)
 *
 * Platform Support: Linux (Ubuntu 20.04+), macOS (11.0+)
 * Standard: POSIX.1-2001
 *
 * Author: Developer Agent
 * Date: 2026-01-20
 */

#ifndef BIGMODULEA_SHARED_MEMORY_MANAGER_H
#define BIGMODULEA_SHARED_MEMORY_MANAGER_H

#include "../../../../common_infra/shared_memory/SharedLithoState.h"
#include <memory>
#include <string>

namespace bigmodulea {

/**
 * SharedMemoryManager - Singleton class for POSIX shared memory management
 *
 * Responsibilities:
 * - Create POSIX shared memory segment (/rtdcs_shared_state)
 * - Initialize SharedLithoState structure
 * - Provide write access to temperature fields
 * - Destroy shared memory on cleanup
 *
 * Usage Example:
 * ```cpp
 * // Get singleton instance
 * SharedMemoryManager& shmMgr = SharedMemoryManager::getInstance();
 *
 * // Initialize shared memory (creates segment)
 * if (!shmMgr.initialize()) {
 *     std::cerr << "Failed to initialize shared memory: "
 *               << shmMgr.getLastError() << std::endl;
 *     return 1;
 * }
 *
 * // Write temperature
 * shmMgr.writeTemperature(25.3, getCurrentTime());
 *
 * // Cleanup (automatic on destruction)
 * shmMgr.destroy();
 * ```
 */
class SharedMemoryManager {
public:
    /**
     * Get singleton instance (thread-safe)
     *
     * Implementation: Meyer's singleton (C++11 guarantees thread safety)
     *
     * @return Reference to the singleton instance
     */
    static SharedMemoryManager& getInstance();

    /**
     * Initialize shared memory segment
     *
     * Creates POSIX shared memory (/rtdcs_shared_state), sets size to 4096 bytes,
     * maps it into process address space, and initializes SharedLithoState structure.
     *
     * Steps:
     * 1. shm_open(SHARED_MEMORY_NAME, O_CREAT | O_EXCL | O_RDWR, 0666)
     * 2. ftruncate(fd, SHARED_MEMORY_SIZE)
     * 3. mmap(nullptr, SHARED_MEMORY_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0)
     * 4. Placement new: new (ptr) SharedLithoState()
     * 5. Verify magic number
     *
     * Error Handling:
     * - If shared memory already exists (EEXIST), attempts to unlink and recreate
     * - If any step fails, cleans up partial state and returns false
     * - Last error message available via getLastError()
     *
     * @return true if successful, false on error
     */
    bool initialize();

    /**
     * Write temperature to shared memory
     *
     * Updates current_temp_C, timestamp_s, and increments sample_count.
     * This method is NOT thread-safe (single writer assumption).
     *
     * Precondition: initialize() must have been called successfully
     *
     * @param temperature_C Temperature in degrees Celsius
     * @param timestamp_s Timestamp in seconds since Unix epoch
     */
    void writeTemperature(double temperature_C, double timestamp_s);

    /**
     * Get pointer to shared memory structure (const)
     *
     * Allows direct read-only access to the SharedLithoState structure.
     * Useful for testing and debugging.
     *
     * Precondition: initialize() must have been called successfully
     *
     * @return Const pointer to SharedLithoState, or nullptr if not initialized
     */
    const rtdcs::SharedLithoState* getSharedState() const;

    /**
     * Check if shared memory is initialized
     *
     * @return true if initialize() was called successfully, false otherwise
     */
    bool isInitialized() const;

    /**
     * Get last error message
     *
     * Returns a human-readable error message from the last failed operation.
     * Empty string if no error has occurred.
     *
     * @return Last error message
     */
    std::string getLastError() const;

    /**
     * Destroy shared memory segment
     *
     * Unmaps shared memory from process address space and unlinks the segment
     * from the filesystem (makes it unavailable to other processes).
     *
     * Steps:
     * 1. munmap(shmPtr_, SHARED_MEMORY_SIZE)
     * 2. close(shmFd_)
     * 3. shm_unlink(SHARED_MEMORY_NAME)
     *
     * Called automatically by destructor.
     * Safe to call multiple times (idempotent).
     */
    void destroy();

    /**
     * Destructor - Cleanup shared memory
     *
     * Calls destroy() to ensure shared memory is properly cleaned up.
     */
    ~SharedMemoryManager();

private:
    /**
     * Private constructor (Singleton pattern)
     *
     * Initializes member variables to safe default values.
     */
    SharedMemoryManager();

    /**
     * Deleted copy constructor (Singleton pattern)
     */
    SharedMemoryManager(const SharedMemoryManager&) = delete;

    /**
     * Deleted assignment operator (Singleton pattern)
     */
    SharedMemoryManager& operator=(const SharedMemoryManager&) = delete;

    /**
     * Shared memory file descriptor
     *
     * File descriptor returned by shm_open().
     * -1 if not initialized.
     */
    int shmFd_;

    /**
     * Pointer to mapped shared memory
     *
     * Points to the SharedLithoState structure in shared memory.
     * nullptr if not initialized.
     */
    rtdcs::SharedLithoState* shmPtr_;

    /**
     * Initialization flag
     *
     * true if initialize() was called successfully, false otherwise.
     */
    bool initialized_;

    /**
     * Last error message
     *
     * Human-readable error message from the last failed operation.
     * Empty string if no error.
     */
    std::string lastError_;
};

}  // namespace bigmodulea

#endif  // BIGMODULEA_SHARED_MEMORY_MANAGER_H
