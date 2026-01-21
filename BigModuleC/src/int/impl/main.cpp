/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * BigModuleC (CompensationController) Main Entry Point
 *
 * This module receives distortion predictions from BigModuleB via Thrift RPC
 * and applies FICTIONAL compensation by writing values to shared memory.
 *
 * Architecture:
 * - Thrift RPC Server: Listens for applyDistortion() calls from BigModuleB
 * - Shared Memory Writer: Writes compensation values to /rtdcs_shared_state
 * - Compensation Strategy: SimpleNegationStrategy (FICTIONAL algorithm)
 *
 * Communication:
 * - Input: RPC from BigModuleB (DistortionVector)
 * - Output: Shared memory (/rtdcs_shared_state, compensation fields)
 *
 * ⚠️ FICTIONAL DISCLAIMER:
 * The compensation algorithm (simple negation) is completely made-up for
 * demonstration purposes. Real lithography systems use complex physics-based
 * compensation models.
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#include "Logger.h"
#include "SharedMemoryWriter.h"
#include "SimpleNegationStrategy.h"
#include "CompensationControllerHandler.h"
#include "ThriftRPCServer.h"
#include "SharedLithoState.h"

#include <iostream>
#include <string>
#include <csignal>
#include <atomic>
#include <memory>

using namespace rtdcs::bigmodulec;

// Global flag for graceful shutdown
std::atomic<bool> running(true);

// Global server pointer for signal handler
ThriftRPCServer* g_server = nullptr;

/**
 * Signal handler for graceful shutdown
 *
 * Handles SIGINT (Ctrl+C) and SIGTERM to gracefully stop the server.
 *
 * @param signum Signal number
 */
void signalHandler(int signum) {
    Logger::info("Shutdown signal received (signal " + std::to_string(signum) + ")");
    running = false;

    // Stop Thrift server
    if (g_server != nullptr) {
        g_server->stop();
    }
}

/**
 * Print usage information
 */
void printUsage(const char* program) {
    std::cout << "Usage: " << program << " [OPTIONS]\n"
              << "\n"
              << "BigModuleC (CompensationController) - RTDCS Proof of Concept\n"
              << "\n"
              << "This module receives distortion predictions from BigModuleB via Thrift RPC\n"
              << "and applies FICTIONAL compensation by writing values to shared memory.\n"
              << "\n"
              << "Options:\n"
              << "  --port <port>     Thrift RPC server port (default: 9090)\n"
              << "  --help            Show this help message\n"
              << "\n"
              << "⚠️ FICTIONAL DISCLAIMER:\n"
              << "The compensation algorithm is completely made-up for demonstration purposes.\n"
              << "Real lithography systems use complex physics-based models.\n"
              << "\n"
              << "Example:\n"
              << "  " << program << "                # Start server on default port 9090\n"
              << "  " << program << " --port 9090    # Start server on port 9090\n"
              << "\n"
              << "Prerequisites:\n"
              << "  - BigModuleA must be running (creates shared memory)\n"
              << "\n"
              << "Inter-Process Communication:\n"
              << "  - Input: Thrift RPC from BigModuleB (port 9090)\n"
              << "  - Output: Shared memory /rtdcs_shared_state (compensation fields)\n"
              << std::endl;
}

/**
 * Parse command-line arguments
 *
 * @param argc Argument count
 * @param argv Argument vector
 * @param port Output: Server port
 * @return true if arguments are valid, false otherwise
 */
bool parseArguments(int argc, char* argv[], int& port) {
    port = 9090;  // Default port

    for (int i = 1; i < argc; ++i) {
        std::string arg(argv[i]);

        if (arg == "--help" || arg == "-h") {
            printUsage(argv[0]);
            return false;
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
    Logger::info("RTDCS - BigModuleC (CompensationController)");
    Logger::info("⚠️ FICTIONAL compensation algorithm for POC only");
    Logger::info("=======================================================");

    // Parse command-line arguments
    int port;
    if (!parseArguments(argc, argv, port)) {
        return (argc > 1 && (std::string(argv[1]) == "--help" || std::string(argv[1]) == "-h")) ? 0 : 1;
    }

    Logger::info("Configuration:");
    Logger::info("  - Thrift RPC port: " + std::to_string(port));
    Logger::info("  - Shared memory: " + std::string(rtdcs::SHARED_MEMORY_NAME));

    // Install signal handlers
    signal(SIGINT, signalHandler);
    signal(SIGTERM, signalHandler);
    Logger::info("Signal handlers installed (SIGINT, SIGTERM)");

    try {
        // Attach to shared memory (created by BigModuleA)
        Logger::info("Attaching to shared memory...");
        SharedMemoryWriter* writer = SharedMemoryWriter::getInstance();
        writer->attach(rtdcs::SHARED_MEMORY_NAME);
        Logger::info("Successfully attached to shared memory (read-write)");

        // Create compensation strategy
        SimpleNegationStrategy strategy;
        Logger::info("Compensation strategy: SimpleNegationStrategy (FICTIONAL)");

        // Create Thrift RPC handler
        auto handler = std::make_shared<CompensationControllerHandler>(&strategy, writer);
        Logger::info("Thrift RPC handler created");

        // Create Thrift RPC server
        ThriftRPCServer server(port, handler);
        g_server = &server;  // Set global pointer for signal handler
        Logger::info("Thrift RPC server created");

        Logger::info("=======================================================");
        Logger::info("BigModuleC is ready");
        Logger::info("Waiting for RPC calls from BigModuleB...");
        Logger::info("Press Ctrl+C to stop");
        Logger::info("=======================================================");

        // Start server (BLOCKING)
        server.start();

        // Cleanup after server stops
        Logger::info("Shutting down...");
        writer->detach();
        Logger::info("Detached from shared memory");

    } catch (const std::exception& e) {
        Logger::error("Fatal error: " + std::string(e.what()));
        return 1;
    }

    Logger::info("BigModuleC shutdown complete");
    return 0;
}
