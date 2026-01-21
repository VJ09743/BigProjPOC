/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Logger Utility for BigModuleB
 *
 * Thread-safe logging utility with timestamp formatting.
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#ifndef RTDCS_BIGMODULEB_LOGGER_H
#define RTDCS_BIGMODULEB_LOGGER_H

#include <string>
#include <mutex>

namespace rtdcs {
namespace bigmoduleb {

/**
 * Logger - Thread-safe logging utility
 *
 * Provides static methods for logging at different levels with timestamps.
 * Thread-safe for concurrent logging from multiple threads.
 */
class Logger {
public:
    /**
     * Log informational message
     *
     * @param msg Message to log
     */
    static void info(const std::string& msg);

    /**
     * Log warning message
     *
     * @param msg Warning message to log
     */
    static void warn(const std::string& msg);

    /**
     * Log error message
     *
     * @param msg Error message to log
     */
    static void error(const std::string& msg);

private:
    /**
     * Get current timestamp as formatted string
     *
     * Format: YYYY-MM-DDTHH:MM:SS.mmm
     *
     * @return Timestamp string
     */
    static std::string currentTimestamp();

    /**
     * Mutex for thread-safe logging
     */
    static std::mutex mutex_;
};

}  // namespace bigmoduleb
}  // namespace rtdcs

#endif  // RTDCS_BIGMODULEB_LOGGER_H
