/**
 * RTDCS BigModuleA - Logger Implementation
 *
 * Author: Developer Agent
 * Date: 2026-01-20
 */

#include "Logger.h"
#include <iostream>
#include <iomanip>
#include <sstream>
#include <ctime>

#ifdef __APPLE__
#include <sys/time.h>  // gettimeofday for macOS
#else
#include <time.h>      // clock_gettime for Linux
#endif

namespace bigmodulea {

// Initialize static mutex
std::mutex Logger::mutex_;

void Logger::info(const std::string& msg) {
    log("INFO", msg);
}

void Logger::warn(const std::string& msg) {
    log("WARN", msg);
}

void Logger::error(const std::string& msg) {
    log("ERROR", msg);
}

std::string Logger::currentTimestamp() {
    // Get current time with millisecond precision

#ifdef __APPLE__
    // macOS: Use gettimeofday (microsecond precision)
    struct timeval tv;
    gettimeofday(&tv, nullptr);

    time_t seconds = tv.tv_sec;
    long milliseconds = tv.tv_usec / 1000;
#else
    // Linux: Use clock_gettime (nanosecond precision)
    struct timespec ts;
    clock_gettime(CLOCK_REALTIME, &ts);

    time_t seconds = ts.tv_sec;
    long milliseconds = ts.tv_nsec / 1000000;
#endif

    // Convert to local time
    struct tm timeinfo;
    localtime_r(&seconds, &timeinfo);

    // Format timestamp: [YYYY-MM-DDTHH:MM:SS.mmm]
    std::ostringstream oss;
    oss << "["
        << std::setfill('0')
        << std::setw(4) << (timeinfo.tm_year + 1900) << "-"
        << std::setw(2) << (timeinfo.tm_mon + 1) << "-"
        << std::setw(2) << timeinfo.tm_mday << "T"
        << std::setw(2) << timeinfo.tm_hour << ":"
        << std::setw(2) << timeinfo.tm_min << ":"
        << std::setw(2) << timeinfo.tm_sec << "."
        << std::setw(3) << milliseconds
        << "]";

    return oss.str();
}

void Logger::log(const std::string& level, const std::string& msg) {
    // Lock mutex for thread-safe logging
    std::lock_guard<std::mutex> lock(mutex_);

    // Get timestamp
    std::string timestamp = currentTimestamp();

    // Log format: [timestamp] [BigModuleA] [LEVEL] message
    std::cout << timestamp
              << " [BigModuleA] "
              << "[" << level << "] "
              << msg
              << std::endl;
}

}  // namespace bigmodulea
