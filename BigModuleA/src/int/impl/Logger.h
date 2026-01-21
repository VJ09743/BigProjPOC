/**
 * RTDCS BigModuleA - Logger Utility
 *
 * Simple thread-safe logger for console output with timestamps.
 * Provides INFO, WARN, and ERROR log levels.
 *
 * Thread Safety: All methods are thread-safe (mutex-protected)
 *
 * Author: Developer Agent
 * Date: 2026-01-20
 */

#ifndef BIGMODULEA_LOGGER_H
#define BIGMODULEA_LOGGER_H

#include <string>
#include <mutex>

namespace bigmodulea {

/**
 * Logger - Thread-safe console logger
 *
 * Provides static methods for logging messages at different severity levels.
 * All log messages are timestamped and written to stdout.
 *
 * Log Format:
 * [timestamp] [BigModuleA] [LEVEL] message
 *
 * Example Output:
 * [2026-01-20T14:23:45.678] [BigModuleA] [INFO] Temperature: 25.3°C (sample 10/100)
 * [2026-01-20T14:23:45.779] [BigModuleA] [WARN] Temperature data is stale
 * [2026-01-20T14:23:45.880] [BigModuleA] [ERROR] Failed to initialize shared memory
 *
 * Usage Example:
 * ```cpp
 * Logger::info("Starting BigModuleA...");
 * Logger::info("Temperature: " + std::to_string(temp) + "°C");
 * Logger::warn("Temperature exceeds normal range");
 * Logger::error("Failed to write to shared memory");
 * ```
 */
class Logger {
public:
    /**
     * Log informational message
     *
     * Use for normal operational messages.
     *
     * @param msg Message to log
     */
    static void info(const std::string& msg);

    /**
     * Log warning message
     *
     * Use for unexpected but non-fatal conditions.
     *
     * @param msg Message to log
     */
    static void warn(const std::string& msg);

    /**
     * Log error message
     *
     * Use for error conditions and failures.
     *
     * @param msg Message to log
     */
    static void error(const std::string& msg);

private:
    /**
     * Get current timestamp string
     *
     * Format: [YYYY-MM-DDTHH:MM:SS.mmm] (ISO 8601 with milliseconds)
     * Example: [2026-01-20T14:23:45.678]
     *
     * @return Formatted timestamp string with brackets
     */
    static std::string currentTimestamp();

    /**
     * Log message with specified level
     *
     * Internal helper method called by info(), warn(), error().
     * Thread-safe (mutex-protected).
     *
     * @param level Log level string ("INFO", "WARN", "ERROR")
     * @param msg Message to log
     */
    static void log(const std::string& level, const std::string& msg);

    /**
     * Mutex for thread-safe logging
     *
     * Protects concurrent access to stdout from multiple threads.
     */
    static std::mutex mutex_;
};

}  // namespace bigmodulea

#endif  // BIGMODULEA_LOGGER_H
