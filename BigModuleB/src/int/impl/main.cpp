/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * BigModuleB (DistortionPredictor) Main Entry Point
 *
 * This module reads temperature from shared memory, predicts reticle distortion
 * using a FICTIONAL Zeeman model, and sends the prediction to BigModuleC via
 * Thrift RPC.
 *
 * Architecture:
 * - Shared Memory Reader: Reads temperature from /rtdcs_shared_state
 * - Distortion Predictor: ZeemanDistortionPredictor (FICTIONAL algorithm)
 * - Thrift RPC Client: Sends distortion to BigModuleC
 *
 * Communication:
 * - Input: Shared memory (/rtdcs_shared_state, temperature fields)
 * - Output: Thrift RPC to BigModuleC (DistortionVector)
 *
 * Update Rate: 5 Hz (200 ms intervals)
 *
 * ⚠️ FICTIONAL DISCLAIMER:
 * The Zeeman Thermal Expansion Model is completely made-up for demonstration
 * purposes. Real lithography systems use complex physics-based models.
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#include "Logger.h"
#include "SharedMemoryReader.h"
#include "ZeemanDistortionPredictor.h"
#include "ThriftRPCClient.h"
#include "SharedLithoState.h"

#include <iostream>
#include <string>
#include <csignal>
#include <atomic>
#include <thread>
#include <chrono>
#include <iomanip>
#include <sstream>

using namespace rtdcs::bigmoduleb;

// Global flag for graceful shutdown
std::atomic<bool> running(true);

/**
 * Signal handler for graceful shutdown
 *
 * Handles SIGINT (Ctrl+C) and SIGTERM to gracefully stop the main loop.
 *
 * @param signum Signal number
 */
void signalHandler(int signum) {
    Logger::info("Shutdown signal received (signal " + std::to_string(signum) + ")");
    running = false;
}

/**
 * Print usage information
 */
void printUsage(const char* program) {
    std::cout << "Usage: " << program << " [OPTIONS]\n"
              << "\n"
              << "BigModuleB (DistortionPredictor) - RTDCS Proof of Concept\n"
              << "\n"
              << "This module reads temperature from shared memory, predicts distortion using\n"
              << "the FICTIONAL Zeeman model, and sends predictions to BigModuleC via RPC.\n"
              << "\n"
              << "Options:\n"
              << "  --host <host>     BigModuleC hostname (default: localhost)\n"
              << "  --port <port>     BigModuleC Thrift RPC port (default: 9090)\n"
              << "  --samples <n>     Number of samples to process (default: unlimited)\n"
              << "  --help            Show this help message\n"
              << "\n"
              << "⚠️ FICTIONAL DISCLAIMER:\n"
              << "The Zeeman Thermal Expansion Model is completely made-up for demonstration.\n"
              << "Real lithography systems use complex physics-based models.\n"
              << "\n"
              << "Example:\n"
              << "  " << program << "                          # Run with defaults\n"
              << "  " << program << " --host localhost --port 9090  # Explicit settings\n"
              << "  " << program << " --samples 100             # Process 100 samples and exit\n"
              << "\n"
              << "Prerequisites:\n"
              << "  - BigModuleA must be running (creates shared memory, writes temperature)\n"
              << "  - BigModuleC must be running (receives distortion predictions via RPC)\n"
              << "\n"
              << "Inter-Process Communication:\n"
              << "  - Input: Shared memory /rtdcs_shared_state (temperature fields)\n"
              << "  - Output: Thrift RPC to BigModuleC (DistortionVector)\n"
              << "  - Update Rate: 5 Hz (200 ms intervals)\n"
              << std::endl;
}

/**
 * Parse command-line arguments
 *
 * @param argc Argument count
 * @param argv Argument vector
 * @param host Output: BigModuleC hostname
 * @param port Output: BigModuleC port
 * @param max_samples Output: Maximum samples to process (0 = unlimited)
 * @return true if arguments are valid, false otherwise
 */
bool parseArguments(int argc, char* argv[], std::string& host, int& port, int& max_samples) {
    host = "localhost";
    port = 9090;
    max_samples = 0;  // Unlimited

    for (int i = 1; i < argc; ++i) {
        std::string arg(argv[i]);

        if (arg == "--help" || arg == "-h") {
            printUsage(argv[0]);
            return false;
        } else if (arg == "--host") {
            if (i + 1 < argc) {
                host = argv[++i];
            } else {
                std::cerr << "Error: --host requires an argument" << std::endl;
                return false;
            }
        } else if (arg == "--port") {
            if (i + 1 < argc) {
                try {
                    port = std::stoi(argv[++i]);
                    if (port < 1 || port > 65535) {
                        std::cerr << "Error: Invalid port number (must be 1-65535): " << port << std::endl;
                        return false;
                    }
                } catch (const std::exception&) {
                    std::cerr << "Error: Invalid port number: " << argv[i] << std::endl;
                    return false;
                }
            } else {
                std::cerr << "Error: --port requires an argument" << std::endl;
                return false;
            }
        } else if (arg == "--samples") {
            if (i + 1 < argc) {
                try {
                    max_samples = std::stoi(argv[++i]);
                    if (max_samples < 1) {
                        std::cerr << "Error: Invalid sample count (must be >= 1): " << max_samples << std::endl;
                        return false;
                    }
                } catch (const std::exception&) {
                    std::cerr << "Error: Invalid sample count: " << argv[i] << std::endl;
                    return false;
                }
            } else {
                std::cerr << "Error: --samples requires an argument" << std::endl;
                return false;
            }
        } else {
            std::cerr << "Error: Unknown option: " << arg << std::endl;
            printUsage(argv[0]);
            return false;
        }
    }

    return true;
}

/**
 * Main entry point
 */
int main(int argc, char* argv[]) {
    // Print banner
    Logger::info("=======================================================");
    Logger::info("RTDCS - BigModuleB (DistortionPredictor)");
    Logger::info("⚠️ FICTIONAL Zeeman algorithm for POC only");
    Logger::info("=======================================================");

    // Parse command-line arguments
    std::string host;
    int port;
    int max_samples;
    if (!parseArguments(argc, argv, host, port, max_samples)) {
        return (argc > 1 && (std::string(argv[1]) == "--help" || std::string(argv[1]) == "-h")) ? 0 : 1;
    }

    Logger::info("Configuration:");
    Logger::info("  - BigModuleC host: " + host);
    Logger::info("  - BigModuleC port: " + std::to_string(port));
    Logger::info("  - Shared memory: " + std::string(rtdcs::SHARED_MEMORY_NAME));
    Logger::info("  - Update rate: 5 Hz (200 ms)");
    if (max_samples > 0) {
        Logger::info("  - Max samples: " + std::to_string(max_samples));
    } else {
        Logger::info("  - Max samples: unlimited");
    }

    // Install signal handlers
    signal(SIGINT, signalHandler);
    signal(SIGTERM, signalHandler);
    Logger::info("Signal handlers installed (SIGINT, SIGTERM)");

    try {
        // Attach to shared memory (created by BigModuleA)
        Logger::info("Attaching to shared memory...");
        SharedMemoryReader* reader = SharedMemoryReader::getInstance();
        reader->attach(rtdcs::SHARED_MEMORY_NAME);
        Logger::info("Successfully attached to shared memory (read-only)");

        // Create distortion predictor
        ZeemanDistortionPredictor predictor;
        Logger::info("Distortion predictor: ZeemanDistortionPredictor (FICTIONAL)");
        Logger::info("  - Reference temperature: " + std::to_string(predictor.getReferenceTemperature()) + "°C");

        // Create Thrift RPC client
        ThriftRPCClient client(host, port);
        Logger::info("Thrift RPC client created");

        // Connect to BigModuleC
        Logger::info("Connecting to BigModuleC...");
        client.connect();
        Logger::info("Successfully connected to BigModuleC");

        Logger::info("=======================================================");
        Logger::info("BigModuleB is ready");
        Logger::info("Starting prediction loop (5 Hz)...");
        Logger::info("Press Ctrl+C to stop");
        Logger::info("=======================================================");

        // Main prediction loop (5 Hz = 200 ms intervals)
        int sample_count = 0;
        while (running && (max_samples == 0 || sample_count < max_samples)) {
            // Read temperature from shared memory
            TemperatureReading temp_reading = reader->readTemperature();

            // Predict distortion using FICTIONAL Zeeman model
            DistortionVector distortion = predictor.predict(temp_reading.temperature_C);

            // Send distortion to BigModuleC via RPC
            client.sendDistortion(distortion);

            sample_count++;

            // Log progress every 10 samples
            if (sample_count % 10 == 0) {
                std::ostringstream oss;
                oss << std::fixed << std::setprecision(2)
                    << "Sample " << sample_count << ": "
                    << "T=" << temp_reading.temperature_C << "°C → "
                    << "D(" << distortion.distortion_x_nm << "nm, "
                    << distortion.distortion_y_nm << "nm)";
                Logger::info(oss.str());
            }

            // Sleep for 200 ms (5 Hz update rate)
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
        }

        // Cleanup
        Logger::info("Shutting down...");
        Logger::info("Processed " + std::to_string(sample_count) + " samples");
        client.disconnect();
        Logger::info("Disconnected from BigModuleC");
        reader->detach();
        Logger::info("Detached from shared memory");

    } catch (const std::exception& e) {
        Logger::error("Fatal error: " + std::string(e.what()));
        return 1;
    }

    Logger::info("BigModuleB shutdown complete");
    return 0;
}
