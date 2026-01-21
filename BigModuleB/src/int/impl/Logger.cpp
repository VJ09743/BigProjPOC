/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Logger Utility Implementation for BigModuleB
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#include "Logger.h"
#include <iostream>
#include <iomanip>
#include <sstream>
#include <ctime>

#ifdef __APPLE__
#include <sys/time.h>  // For gettimeofday on macOS
#else
#include <time.h>      // For clock_gettime on Linux
#endif

namespace rtdcs {
namespace bigmoduleb {

// Static mutex initialization
std::mutex Logger::mutex_;

void Logger::info(const std::string& msg) {
    std::lock_guard<std::mutex> lock(mutex_);
    std::cout << "[" << currentTimestamp() << "] [BigModuleB] [INFO] " << msg << std::endl;
}

void Logger::warn(const std::string& msg) {
    std::lock_guard<std::mutex> lock(mutex_);
    std::cout << "[" << currentTimestamp() << "] [BigModuleB] [WARN] " << msg << std::endl;
}

void Logger::error(const std::string& msg) {
    std::lock_guard<std::mutex> lock(mutex_);
    std::cerr << "[" << currentTimestamp() << "] [BigModuleB] [ERROR] " << msg << std::endl;
}

std::string Logger::currentTimestamp() {
    // Get current time with milliseconds
#ifdef __APPLE__
    // macOS: Use gettimeofday (microsecond precision)
    struct timeval tv;
    gettimeofday(&tv, nullptr);
    time_t sec = tv.tv_sec;
    long msec = tv.tv_usec / 1000;
#else
    // Linux: Use clock_gettime (nanosecond precision)
    struct timespec ts;
    clock_gettime(CLOCK_REALTIME, &ts);
    time_t sec = ts.tv_sec;
    long msec = ts.tv_nsec / 1000000;
#endif

    // Convert to broken-down time (struct tm)
    struct tm tm_info;
#ifdef _WIN32
    localtime_s(&tm_info, &sec);
#else
    localtime_r(&sec, &tm_info);
#endif

    // Format timestamp: YYYY-MM-DDTHH:MM:SS.mmm
    std::ostringstream oss;
    oss << std::setfill('0')
        << std::setw(4) << (tm_info.tm_year + 1900) << "-"
        << std::setw(2) << (tm_info.tm_mon + 1) << "-"
        << std::setw(2) << tm_info.tm_mday << "T"
        << std::setw(2) << tm_info.tm_hour << ":"
        << std::setw(2) << tm_info.tm_min << ":"
        << std::setw(2) << tm_info.tm_sec << "."
        << std::setw(3) << msec;

    return oss.str();
}

}  // namespace bigmoduleb
}  // namespace rtdcs
