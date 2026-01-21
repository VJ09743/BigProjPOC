/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Shared Memory Writer Implementation for BigModuleC
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#include "SharedMemoryWriter.h"
#include "Logger.h"
#include <stdexcept>
#include <cstring>
#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>

namespace rtdcs {
namespace bigmodulec {

// Static singleton instance initialization
SharedMemoryWriter* SharedMemoryWriter::instance_ = nullptr;

SharedMemoryWriter::SharedMemoryWriter()
    : shmFd_(-1),
      shmPtr_(nullptr),
      shmSize_(rtdcs::SHARED_MEMORY_SIZE) {
    Logger::info("SharedMemoryWriter instance created");
}

SharedMemoryWriter::~SharedMemoryWriter() {
    detach();
    Logger::info("SharedMemoryWriter instance destroyed");
}

SharedMemoryWriter* SharedMemoryWriter::getInstance() {
    if (instance_ == nullptr) {
        instance_ = new SharedMemoryWriter();
    }
    return instance_;
}

void SharedMemoryWriter::attach(const std::string& name) {
    if (shmPtr_ != nullptr) {
        throw std::runtime_error("SharedMemoryWriter: Already attached to shared memory");
    }

    Logger::info("Attaching to shared memory: " + name);

    // Open existing shared memory (read-write)
    shmFd_ = shm_open(name.c_str(), O_RDWR, 0666);
    if (shmFd_ == -1) {
        throw std::runtime_error("SharedMemoryWriter: Failed to open shared memory '" + name +
                                 "' (shm_open failed). Ensure BigModuleA is running and has created the shared memory.");
    }

    // Map shared memory with read-write access
    void* ptr = mmap(nullptr, shmSize_, PROT_READ | PROT_WRITE, MAP_SHARED, shmFd_, 0);
    if (ptr == MAP_FAILED) {
        close(shmFd_);
        shmFd_ = -1;
        throw std::runtime_error("SharedMemoryWriter: Failed to map shared memory (mmap failed)");
    }

    shmPtr_ = static_cast<rtdcs::SharedLithoState*>(ptr);

    // Validate magic number
    if (!shmPtr_->isValid()) {
        munmap(shmPtr_, shmSize_);
        close(shmFd_);
        shmPtr_ = nullptr;
        shmFd_ = -1;
        throw std::runtime_error("SharedMemoryWriter: Invalid shared memory magic number. "
                                 "Shared memory may be corrupted.");
    }

    Logger::info("Successfully attached to shared memory (read-write)");
}

void SharedMemoryWriter::writeCompensation(double comp_x_nm, double comp_y_nm, double timestamp_s) {
    std::lock_guard<std::mutex> lock(mutex_);

    if (shmPtr_ == nullptr) {
        throw std::runtime_error("SharedMemoryWriter: Not attached to shared memory. "
                                 "Call attach() first.");
    }

    // Write compensation values to shared memory
    shmPtr_->compensation_x_nm = comp_x_nm;
    shmPtr_->compensation_y_nm = comp_y_nm;
    shmPtr_->compensation_timestamp_s = timestamp_s;

    // Log write operation (optional, can be removed for performance)
    // Logger::info("Wrote compensation: X=" + std::to_string(comp_x_nm) +
    //              "nm, Y=" + std::to_string(comp_y_nm) + "nm");
}

void SharedMemoryWriter::detach() {
    if (shmPtr_ != nullptr) {
        Logger::info("Detaching from shared memory");

        // Unmap shared memory
        munmap(shmPtr_, shmSize_);
        shmPtr_ = nullptr;

        // Close file descriptor
        close(shmFd_);
        shmFd_ = -1;

        Logger::info("Successfully detached from shared memory");
    }
    // Note: We do NOT call shm_unlink() here because BigModuleA owns
    // the shared memory lifecycle and will destroy it on exit.
}

}  // namespace bigmodulec
}  // namespace rtdcs
