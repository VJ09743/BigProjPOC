/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Shared Memory Reader Implementation for BigModuleB
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#include "SharedMemoryReader.h"
#include "Logger.h"
#include <stdexcept>
#include <cstring>
#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>

namespace rtdcs {
namespace bigmoduleb {

// Static singleton instance initialization
SharedMemoryReader* SharedMemoryReader::instance_ = nullptr;

SharedMemoryReader::SharedMemoryReader()
    : shmFd_(-1),
      shmPtr_(nullptr),
      shmSize_(rtdcs::SHARED_MEMORY_SIZE) {
    Logger::info("SharedMemoryReader instance created");
}

SharedMemoryReader::~SharedMemoryReader() {
    detach();
    Logger::info("SharedMemoryReader instance destroyed");
}

SharedMemoryReader* SharedMemoryReader::getInstance() {
    if (instance_ == nullptr) {
        instance_ = new SharedMemoryReader();
    }
    return instance_;
}

void SharedMemoryReader::attach(const std::string& name) {
    if (shmPtr_ != nullptr) {
        throw std::runtime_error("SharedMemoryReader: Already attached to shared memory");
    }

    Logger::info("Attaching to shared memory: " + name);

    // Open existing shared memory (read-only)
    shmFd_ = shm_open(name.c_str(), O_RDONLY, 0666);
    if (shmFd_ == -1) {
        throw std::runtime_error("SharedMemoryReader: Failed to open shared memory '" + name +
                                 "' (shm_open failed). Ensure BigModuleA is running and has created the shared memory.");
    }

    // Map shared memory with read-only access
    void* ptr = mmap(nullptr, shmSize_, PROT_READ, MAP_SHARED, shmFd_, 0);
    if (ptr == MAP_FAILED) {
        close(shmFd_);
        shmFd_ = -1;
        throw std::runtime_error("SharedMemoryReader: Failed to map shared memory (mmap failed)");
    }

    shmPtr_ = static_cast<const rtdcs::SharedLithoState*>(ptr);

    // Validate magic number
    if (!shmPtr_->isValid()) {
        munmap(const_cast<rtdcs::SharedLithoState*>(shmPtr_), shmSize_);
        close(shmFd_);
        shmPtr_ = nullptr;
        shmFd_ = -1;
        throw std::runtime_error("SharedMemoryReader: Invalid shared memory magic number. "
                                 "Shared memory may be corrupted.");
    }

    Logger::info("Successfully attached to shared memory (read-only)");
}

TemperatureReading SharedMemoryReader::readTemperature() const {
    if (shmPtr_ == nullptr) {
        throw std::runtime_error("SharedMemoryReader: Not attached to shared memory. "
                                 "Call attach() first.");
    }

    TemperatureReading reading;
    reading.temperature_C = shmPtr_->current_temp_C;
    reading.timestamp_s = shmPtr_->timestamp_s;
    reading.sample_count = shmPtr_->sample_count;

    return reading;
}

void SharedMemoryReader::detach() {
    if (shmPtr_ != nullptr) {
        Logger::info("Detaching from shared memory");

        // Unmap shared memory
        munmap(const_cast<rtdcs::SharedLithoState*>(shmPtr_), shmSize_);
        shmPtr_ = nullptr;

        // Close file descriptor
        close(shmFd_);
        shmFd_ = -1;

        Logger::info("Successfully detached from shared memory");
    }
    // Note: We do NOT call shm_unlink() here because BigModuleA owns
    // the shared memory lifecycle and will destroy it on exit.
}

}  // namespace bigmoduleb
}  // namespace rtdcs
