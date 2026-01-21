/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Compensation Controller Thrift RPC Handler Implementation
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#include "CompensationControllerHandler.h"
#include "Logger.h"
#include <sstream>
#include <iomanip>
#include <cmath>
#include <thrift/protocol/TBinaryProtocol.h>
#include <thrift/TApplicationException.h>

#ifdef __APPLE__
#include <sys/time.h>
#else
#include <time.h>
#endif

namespace rtdcs {
namespace bigmodulec {

CompensationControllerHandler::CompensationControllerHandler(
    SimpleNegationStrategy* strategy,
    SharedMemoryWriter* writer)
    : strategy_(strategy),
      writer_(writer),
      rpcCallCount_(0) {
    if (strategy_ == nullptr) {
        throw std::invalid_argument("CompensationControllerHandler: strategy cannot be null");
    }
    if (writer_ == nullptr) {
        throw std::invalid_argument("CompensationControllerHandler: writer cannot be null");
    }
    Logger::info("CompensationControllerHandler created");
}

CompensationControllerHandler::~CompensationControllerHandler() {
    Logger::info("CompensationControllerHandler destroyed (processed " +
                 std::to_string(rpcCallCount_) + " RPC calls)");
}

void CompensationControllerHandler::applyDistortion(
    const rtdcs::interfaces::DistortionVector& distortion) {

    std::lock_guard<std::mutex> lock(mutex_);
    rpcCallCount_++;

    try {
        // Log received distortion
        std::ostringstream oss;
        oss << std::fixed << std::setprecision(2)
            << "Received distortion: X=" << distortion.distortion_x_nm
            << "nm, Y=" << distortion.distortion_y_nm << "nm "
            << "(RPC #" << rpcCallCount_ << ")";
        Logger::info(oss.str());

        // Input validation (sanity check)
        const double MAX_DISTORTION = 1000.0;  // nm
        if (std::abs(distortion.distortion_x_nm) > MAX_DISTORTION ||
            std::abs(distortion.distortion_y_nm) > MAX_DISTORTION) {
            std::ostringstream err;
            err << "Invalid distortion values: X=" << distortion.distortion_x_nm
                << "nm, Y=" << distortion.distortion_y_nm
                << "nm (exceeds ±" << MAX_DISTORTION << "nm limit)";
            Logger::error(err.str());
            throw apache::thrift::TApplicationException(err.str());
        }

        // Compute compensation using strategy
        auto compensation = strategy_->computeCompensation(
            distortion.distortion_x_nm,
            distortion.distortion_y_nm);

        // Get current timestamp
        double timestamp = getCurrentTime();

        // Write compensation to shared memory
        writer_->writeCompensation(
            compensation.compensation_x_nm,
            compensation.compensation_y_nm,
            timestamp);

        // Log FICTIONAL compensation
        std::ostringstream logMsg;
        logMsg << std::fixed << std::setprecision(2)
               << "⚠️ FICTIONAL Compensation: "
               << "D(" << distortion.distortion_x_nm << "nm, "
               << distortion.distortion_y_nm << "nm) → "
               << "C(" << compensation.compensation_x_nm << "nm, "
               << compensation.compensation_y_nm << "nm)";
        Logger::info(logMsg.str());

        Logger::info("Compensation written to shared memory");

    } catch (const apache::thrift::TException& e) {
        Logger::error("Thrift exception in applyDistortion: " + std::string(e.what()));
        throw;  // Re-throw to client
    } catch (const std::exception& e) {
        Logger::error("Exception in applyDistortion: " + std::string(e.what()));
        throw apache::thrift::TApplicationException(
            "Failed to apply compensation: " + std::string(e.what()));
    }
}

double CompensationControllerHandler::getCurrentTime() const {
#ifdef __APPLE__
    // macOS: Use gettimeofday
    struct timeval tv;
    gettimeofday(&tv, nullptr);
    return tv.tv_sec + tv.tv_usec / 1e6;
#else
    // Linux: Use clock_gettime
    struct timespec ts;
    clock_gettime(CLOCK_REALTIME, &ts);
    return ts.tv_sec + ts.tv_nsec / 1e9;
#endif
}

}  // namespace bigmodulec
}  // namespace rtdcs
