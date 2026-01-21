/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Logger Utility for BigModuleC (CompensationController)
 *
 * This module provides a simple logging utility with timestamped output.
 * All logs are prefixed with [BigModuleC] to identify the source module.
 *
 * Thread Safety: Thread-safe using mutex for concurrent logging
 * Output: stdout (can be redirected to file if needed)
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#ifndef RTDCS_BIGMODULEC_LOGGER_H
#define RTDCS_BIGMODULEC_LOGGER_H

#include <string>
#include <mutex>

namespace rtdcs {
namespace bigmodulec {

/**
 * Logger - Simple timestamped logging utility
 *
 * Static class providing INFO, WARN, and ERROR logging with timestamps.
 * All logs are prefixed with [BigModuleC] for module identification.
 *
 * Usage:
 * ```cpp
 * Logger::info("Server started on port 9090");
 * Logger::warn("Connection timeout, retrying...");
 * Logger::error("Failed to attach to shared memory");
 * ```
 *
 * Output Format:
 * [timestamp] [BigModuleC] [LEVEL] message
 *
 * Example:
 * [2026-01-21T09:45:12.345] [BigModuleC] [INFO] Compensation written to shared memory
 *
 * Thread Safety:
 * All methods are thread-safe using a static mutex. Multiple threads
 * can log concurrently without interleaving output.
 */
class Logger {
public:
    /**
     * Log an informational message
     *
     * Use for normal operational messages (e.g., startup, progress, status).
     *
     * @param msg The message to log
     */
    static void info(const std::string& msg);

    /**
     * Log a warning message
     *
     * Use for non-critical issues (e.g., retries, degraded performance).
     *
     * @param msg The message to log
     */
    static void warn(const std::string& msg);

    /**
     * Log an error message
     *
     * Use for critical errors (e.g., failures, exceptions).
     *
     * @param msg The message to log
     */
    static void error(const std::string& msg);

private:
    /**
     * Get current timestamp as ISO 8601 string with milliseconds
     *
     * Format: YYYY-MM-DDTHH:MM:SS.mmm
     * Example: 2026-01-21T09:45:12.345
     *
     * @return Timestamp string
     */
    static std::string currentTimestamp();

    /**
     * Mutex for thread-safe logging
     *
     * Protects stdout writes to prevent interleaved output from multiple threads.
     */
    static std::mutex mutex_;
};

}  // namespace bigmodulec
}  // namespace rtdcs

#endif  // RTDCS_BIGMODULEC_LOGGER_H
