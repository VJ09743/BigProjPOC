/**
 * RTDCS BigModuleA - Main Application Entry Point
 *
 * ThermalMonitor: Simulates reticle temperature and updates shared memory
 * at 10 Hz using different temperature patterns.
 *
 * Author: Developer Agent
 * Date: 2026-01-20
 */

#include "SharedMemoryManager.h"
#include "ITemperaturePattern.h"
#include "SineWavePattern.h"
#include "StepPattern.h"
#include "Logger.h"

#include <iostream>
#include <memory>
#include <string>
#include <csignal>
#include <cstring>
#include <atomic>
#include <thread>
#include <chrono>

#ifdef __APPLE__
#include <unistd.h>  // usleep for macOS
#else
#include <time.h>    // clock_nanosleep for Linux
#endif

namespace bigmodulea {

// Global flag for graceful shutdown
std::atomic<bool> g_running(true);

/**
 * Signal handler for graceful shutdown
 * Handles SIGINT (Ctrl+C) and SIGTERM
 */
void signalHandler(int signum) {
    const char* signame = (signum == SIGINT) ? "SIGINT" : "SIGTERM";
    Logger::info(std::string("Received ") + signame + ", shutting down gracefully...");
    g_running = false;
}

/**
 * Print usage information
 */
void printUsage(const char* programName) {
    std::cout << "Usage: " << programName << " [OPTIONS]\n"
              << "\n"
              << "ThermalMonitor - Simulates reticle temperature at 10 Hz\n"
              << "\n"
              << "Options:\n"
              << "  --pattern <type>       Temperature pattern type (sine|step) [default: sine]\n"
              << "  --base-temp <value>    Base temperature in °C [default: 25.0]\n"
              << "  --amplitude <value>    Temperature variation amplitude in °C [default: 5.0]\n"
              << "  --frequency <value>    Frequency in Hz (sine pattern only) [default: 0.1]\n"
              << "  --step-delta <value>   Step delta in °C (step pattern only) [default: 5.0]\n"
              << "  --interval <value>     Step interval in seconds (step pattern only) [default: 3.0]\n"
              << "  --samples <count>      Number of samples to generate (0 = infinite) [default: 0]\n"
              << "  --help                 Show this help message\n"
              << "\n"
              << "⚠️  IMPORTANT: Sample Count Warning\n"
              << "  If you specify --samples with a finite value, BigModuleA will exit after\n"
              << "  generating that many samples and DESTROY the shared memory.\n"
              << "\n"
              << "  This will cause BigModuleB and BigModuleC to fail with:\n"
              << "    \"Failed to open shared memory\"\n"
              << "\n"
              << "  For testing all three modules together:\n"
              << "    • Use --samples 0 (infinite) and stop with Ctrl+C, OR\n"
              << "    • Coordinate sample counts: Run BigModuleB/C with shorter durations\n"
              << "\n"
              << "Examples:\n"
              << "  " << programName << " --pattern sine                                      # Run indefinitely\n"
              << "  " << programName << " --pattern sine --samples 0                          # Same (infinite)\n"
              << "  " << programName << " --pattern step --base-temp 25.0 --step-delta 5.0    # Run indefinitely\n"
              << std::endl;
}

/**
 * Parse command-line arguments
 */
struct Config {
    std::string pattern = "sine";
    double baseTemp = 25.0;
    double amplitude = 5.0;
    double frequency = 0.1;
    double stepDelta = 5.0;
    double interval = 3.0;
    uint32_t samples = 0;  // 0 = infinite
};

bool parseArguments(int argc, char* argv[], Config& config) {
    for (int i = 1; i < argc; ++i) {
        std::string arg = argv[i];

        if (arg == "--help") {
            printUsage(argv[0]);
            return false;
        } else if (arg == "--pattern") {
            if (i + 1 < argc) {
                config.pattern = argv[++i];
                if (config.pattern != "sine" && config.pattern != "step") {
                    std::cerr << "Error: Invalid pattern type '" << config.pattern
                              << "'. Must be 'sine' or 'step'." << std::endl;
                    return false;
                }
            } else {
                std::cerr << "Error: --pattern requires an argument" << std::endl;
                return false;
            }
        } else if (arg == "--base-temp") {
            if (i + 1 < argc) {
                config.baseTemp = std::stod(argv[++i]);
            } else {
                std::cerr << "Error: --base-temp requires an argument" << std::endl;
                return false;
            }
        } else if (arg == "--amplitude") {
            if (i + 1 < argc) {
                config.amplitude = std::stod(argv[++i]);
            } else {
                std::cerr << "Error: --amplitude requires an argument" << std::endl;
                return false;
            }
        } else if (arg == "--frequency") {
            if (i + 1 < argc) {
                config.frequency = std::stod(argv[++i]);
            } else {
                std::cerr << "Error: --frequency requires an argument" << std::endl;
                return false;
            }
        } else if (arg == "--step-delta") {
            if (i + 1 < argc) {
                config.stepDelta = std::stod(argv[++i]);
            } else {
                std::cerr << "Error: --step-delta requires an argument" << std::endl;
                return false;
            }
        } else if (arg == "--interval") {
            if (i + 1 < argc) {
                config.interval = std::stod(argv[++i]);
            } else {
                std::cerr << "Error: --interval requires an argument" << std::endl;
                return false;
            }
        } else if (arg == "--samples") {
            if (i + 1 < argc) {
                config.samples = std::stoul(argv[++i]);
            } else {
                std::cerr << "Error: --samples requires an argument" << std::endl;
                return false;
            }
        } else {
            std::cerr << "Error: Unknown argument '" << arg << "'" << std::endl;
            printUsage(argv[0]);
            return false;
        }
    }

    return true;
}

/**
 * Precise sleep until next interval
 * Sleeps until the next 100ms boundary (10 Hz = 100ms period)
 */
void sleepUntilNextInterval(const std::chrono::steady_clock::time_point& start,
                            uint32_t iteration) {
    // Calculate target time for next iteration
    const auto interval_ns = std::chrono::nanoseconds(100'000'000);  // 100ms = 10 Hz
    auto target = start + (iteration * interval_ns);
    auto now = std::chrono::steady_clock::now();

    if (target > now) {
        auto sleep_duration = target - now;

#ifdef __APPLE__
        // macOS: Use std::this_thread::sleep_for (less precise but portable)
        std::this_thread::sleep_for(sleep_duration);
#else
        // Linux: Use clock_nanosleep for better precision
        struct timespec ts;
        auto ns = std::chrono::duration_cast<std::chrono::nanoseconds>(sleep_duration).count();
        ts.tv_sec = ns / 1'000'000'000;
        ts.tv_nsec = ns % 1'000'000'000;
        clock_nanosleep(CLOCK_MONOTONIC, 0, &ts, nullptr);
#endif
    }
}

/**
 * Get current time in seconds (monotonic)
 */
double getCurrentTime() {
    auto now = std::chrono::steady_clock::now();
    auto duration = now.time_since_epoch();
    auto ns = std::chrono::duration_cast<std::chrono::nanoseconds>(duration).count();
    return static_cast<double>(ns) / 1e9;
}

}  // namespace bigmodulea

/**
 * Main entry point
 */
int main(int argc, char* argv[]) {
    using namespace bigmodulea;

    // Parse command-line arguments
    Config config;
    if (!parseArguments(argc, argv, config)) {
        return (argc > 1 && std::string(argv[1]) == "--help") ? 0 : 1;
    }

    // Log startup configuration
    Logger::info("=== RTDCS BigModuleA - ThermalMonitor ===");
    Logger::info("Pattern: " + config.pattern);
    Logger::info("Base Temperature: " + std::to_string(config.baseTemp) + " °C");

    if (config.pattern == "sine") {
        Logger::info("Amplitude: " + std::to_string(config.amplitude) + " °C");
        Logger::info("Frequency: " + std::to_string(config.frequency) + " Hz");
    } else {
        Logger::info("Step Delta: " + std::to_string(config.stepDelta) + " °C");
        Logger::info("Interval: " + std::to_string(config.interval) + " s");
    }

    if (config.samples > 0) {
        Logger::info("Samples: " + std::to_string(config.samples));
    } else {
        Logger::info("Samples: infinite (Ctrl+C to stop)");
    }

    Logger::info("Update Rate: 10 Hz (100ms interval)");
    Logger::info("==========================================");

    // Install signal handlers
    std::signal(SIGINT, signalHandler);
    std::signal(SIGTERM, signalHandler);

    // Initialize SharedMemoryManager
    Logger::info("Initializing shared memory...");
    SharedMemoryManager& shmManager = SharedMemoryManager::getInstance();

    if (!shmManager.initialize()) {
        Logger::error("Failed to initialize shared memory: " + shmManager.getLastError());
        return 1;
    }

    Logger::info("Shared memory initialized successfully");

    // Verify shared memory state
    const rtdcs::SharedLithoState* state = shmManager.getSharedState();
    if (!state || !state->isValid()) {
        Logger::error("Shared memory validation failed");
        shmManager.destroy();
        return 1;
    }

    Logger::info("Shared memory validated (magic: 0x" +
                 std::to_string(state->magic) + ")");

    // Create temperature pattern
    std::unique_ptr<ITemperaturePattern> pattern;

    if (config.pattern == "sine") {
        pattern = std::make_unique<SineWavePattern>(
            config.baseTemp, config.amplitude, config.frequency);
        Logger::info("Created SineWavePattern");
    } else {
        pattern = std::make_unique<StepPattern>(
            config.baseTemp, config.stepDelta, config.interval);
        Logger::info("Created StepPattern");
    }

    // Main loop: 10 Hz temperature update
    Logger::info("Starting temperature monitoring at 10 Hz...");

    const auto startTime = std::chrono::steady_clock::now();
    const double startTime_s = getCurrentTime();
    uint32_t iteration = 0;

    while (g_running) {
        // Check sample limit
        if (config.samples > 0 && iteration >= config.samples) {
            Logger::info("Reached sample limit (" + std::to_string(config.samples) + "), stopping...");
            break;
        }

        // Get current elapsed time
        const double elapsed_s = getCurrentTime() - startTime_s;

        // Calculate temperature from pattern
        const double temperature = pattern->getTemperature(elapsed_s);

        // Write to shared memory
        shmManager.writeTemperature(temperature, elapsed_s);

        // Log every 10 samples (1 second)
        if (iteration % 10 == 0) {
            Logger::info("Sample #" + std::to_string(iteration) +
                         " | Time: " + std::to_string(elapsed_s) + " s" +
                         " | Temp: " + std::to_string(temperature) + " °C");
        }

        // Increment iteration
        ++iteration;

        // Sleep until next 100ms interval
        sleepUntilNextInterval(startTime, iteration);
    }

    // Shutdown
    Logger::info("Stopping temperature monitoring...");
    Logger::info("Total samples generated: " + std::to_string(iteration));

    // Clean up shared memory
    Logger::info("Cleaning up shared memory...");
    shmManager.destroy();

    Logger::info("Shutdown complete");
    Logger::info("==========================================");

    return 0;
}
