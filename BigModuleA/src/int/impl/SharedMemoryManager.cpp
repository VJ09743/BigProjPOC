/**
 * RTDCS BigModuleA - SharedMemoryManager Implementation
 *
 * Implements Singleton pattern for POSIX shared memory management.
 *
 * Author: Developer Agent
 * Date: 2026-01-20
 */

#include "SharedMemoryManager.h"

#include <sys/mman.h>    // shm_open, shm_unlink, mmap, munmap
#include <sys/stat.h>    // S_IRUSR, S_IWUSR
#include <fcntl.h>       // O_CREAT, O_RDWR
#include <unistd.h>      // ftruncate, close
#include <cerrno>        // errno
#include <cstring>       // strerror
#include <sstream>       // std::ostringstream

namespace bigmodulea {

// ============================================================================
// Public Methods
// ============================================================================

SharedMemoryManager& SharedMemoryManager::getInstance() {
    // Meyer's singleton - thread-safe in C++11 and later
    // The static local variable is guaranteed to be initialized only once,
    // even in the presence of concurrent calls from multiple threads.
    static SharedMemoryManager instance;
    return instance;
}

bool SharedMemoryManager::initialize() {
    // Check if already initialized
    if (initialized_) {
        lastError_ = "Shared memory already initialized";
        return true;  // Not an error, return success
    }

    // Step 1: Create shared memory segment
    // O_CREAT: Create if doesn't exist
    // O_EXCL: Fail if already exists (we want exclusive creation)
    // O_RDWR: Read and write access
    // 0666: rw-rw-rw- permissions
    shmFd_ = shm_open(rtdcs::SHARED_MEMORY_NAME,
                      O_CREAT | O_EXCL | O_RDWR,
                      0666);

    if (shmFd_ == -1) {
        // Check if shared memory already exists
        if (errno == EEXIST) {
            // Shared memory exists - try to unlink and recreate
            // This handles the case where previous instance didn't clean up
            if (shm_unlink(rtdcs::SHARED_MEMORY_NAME) != 0) {
                std::ostringstream oss;
                oss << "Failed to unlink existing shared memory: "
                    << std::strerror(errno);
                lastError_ = oss.str();
                return false;
            }

            // Try to create again
            shmFd_ = shm_open(rtdcs::SHARED_MEMORY_NAME,
                              O_CREAT | O_EXCL | O_RDWR,
                              0666);
            if (shmFd_ == -1) {
                std::ostringstream oss;
                oss << "Failed to create shared memory (retry): "
                    << std::strerror(errno);
                lastError_ = oss.str();
                return false;
            }
        } else {
            // Other error
            std::ostringstream oss;
            oss << "Failed to create shared memory: " << std::strerror(errno);
            lastError_ = oss.str();
            return false;
        }
    }

    // Step 2: Set size of shared memory to 4096 bytes
    if (ftruncate(shmFd_, rtdcs::SHARED_MEMORY_SIZE) == -1) {
        std::ostringstream oss;
        oss << "Failed to set shared memory size: " << std::strerror(errno);
        lastError_ = oss.str();

        // Cleanup partial state
        close(shmFd_);
        shm_unlink(rtdcs::SHARED_MEMORY_NAME);
        shmFd_ = -1;
        return false;
    }

    // Step 3: Map shared memory into process address space
    // mmap parameters:
    // - nullptr: Let kernel choose address
    // - SHARED_MEMORY_SIZE: Size of mapping
    // - PROT_READ | PROT_WRITE: Read and write access
    // - MAP_SHARED: Changes are visible to other processes
    // - shmFd_: File descriptor from shm_open
    // - 0: Offset (start from beginning)
    void* ptr = mmap(nullptr,
                     rtdcs::SHARED_MEMORY_SIZE,
                     PROT_READ | PROT_WRITE,
                     MAP_SHARED,
                     shmFd_,
                     0);

    if (ptr == MAP_FAILED) {
        std::ostringstream oss;
        oss << "Failed to map shared memory: " << std::strerror(errno);
        lastError_ = oss.str();

        // Cleanup partial state
        close(shmFd_);
        shm_unlink(rtdcs::SHARED_MEMORY_NAME);
        shmFd_ = -1;
        return false;
    }

    // Step 4: Initialize SharedLithoState structure using placement new
    // This calls the constructor to set magic number and zero all fields
    shmPtr_ = static_cast<rtdcs::SharedLithoState*>(ptr);
    new (shmPtr_) rtdcs::SharedLithoState();

    // Step 5: Verify magic number
    if (!shmPtr_->isValid()) {
        lastError_ = "Failed to initialize shared memory: Invalid magic number";

        // Cleanup partial state
        munmap(shmPtr_, rtdcs::SHARED_MEMORY_SIZE);
        close(shmFd_);
        shm_unlink(rtdcs::SHARED_MEMORY_NAME);
        shmPtr_ = nullptr;
        shmFd_ = -1;
        return false;
    }

    // Success!
    initialized_ = true;
    lastError_.clear();
    return true;
}

void SharedMemoryManager::writeTemperature(double temperature_C,
                                           double timestamp_s) {
    // Precondition check
    if (!initialized_ || shmPtr_ == nullptr) {
        // Silent failure - this should not happen in normal operation
        // In production code, might want to log an error
        return;
    }

    // Write temperature data to shared memory
    // Note: No mutex protection needed (single writer assumption)
    shmPtr_->current_temp_C = temperature_C;
    shmPtr_->timestamp_s = timestamp_s;
    shmPtr_->sample_count++;
}

const rtdcs::SharedLithoState* SharedMemoryManager::getSharedState() const {
    return shmPtr_;
}

bool SharedMemoryManager::isInitialized() const {
    return initialized_;
}

std::string SharedMemoryManager::getLastError() const {
    return lastError_;
}

void SharedMemoryManager::destroy() {
    // Check if already destroyed or never initialized
    if (!initialized_) {
        return;  // Nothing to do
    }

    // Step 1: Unmap shared memory
    if (shmPtr_ != nullptr) {
        if (munmap(shmPtr_, rtdcs::SHARED_MEMORY_SIZE) == -1) {
            // Log error but continue cleanup
            // In production code, might want to use a logger
        }
        shmPtr_ = nullptr;
    }

    // Step 2: Close file descriptor
    if (shmFd_ != -1) {
        if (close(shmFd_) == -1) {
            // Log error but continue cleanup
        }
        shmFd_ = -1;
    }

    // Step 3: Unlink shared memory from filesystem
    // This makes the shared memory segment unavailable to other processes
    // The segment will be destroyed when the last process unmaps it
    if (shm_unlink(rtdcs::SHARED_MEMORY_NAME) == -1) {
        // Ignore ENOENT (already unlinked)
        if (errno != ENOENT) {
            // Log error but continue
        }
    }

    // Mark as not initialized
    initialized_ = false;
}

SharedMemoryManager::~SharedMemoryManager() {
    // Cleanup on destruction
    destroy();
}

// ============================================================================
// Private Methods
// ============================================================================

SharedMemoryManager::SharedMemoryManager()
    : shmFd_(-1),
      shmPtr_(nullptr),
      initialized_(false),
      lastError_() {
    // Initialize member variables to safe defaults
}

}  // namespace bigmodulea
