/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Thrift RPC Server Wrapper Implementation
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#include "ThriftRPCServer.h"
#include "Logger.h"
#include "ICompensationController.h"  // Thrift-generated processor
#include <stdexcept>

namespace rtdcs {
namespace bigmodulec {

ThriftRPCServer::ThriftRPCServer(
    int port,
    std::shared_ptr<CompensationControllerHandler> handler)
    : port_(port),
      handler_(handler),
      isRunning_(false) {

    if (handler_ == nullptr) {
        throw std::invalid_argument("ThriftRPCServer: handler cannot be null");
    }

    Logger::info("ThriftRPCServer created on port " + std::to_string(port_));
}

ThriftRPCServer::~ThriftRPCServer() {
    stop();
    Logger::info("ThriftRPCServer destroyed");
}

void ThriftRPCServer::start() {
    if (isRunning_) {
        Logger::warn("ThriftRPCServer: Server already running");
        return;
    }

    try {
        Logger::info("Starting Thrift RPC server on port " + std::to_string(port_) + "...");

        // Create processor (wraps handler)
        processor_ = std::make_shared<rtdcs::interfaces::ICompensationControllerProcessor>(handler_);

        // Create server socket (TCP)
        serverSocket_ = std::make_shared<apache::thrift::transport::TServerSocket>(port_);

        // Create transport factory (buffered transport)
        transportFactory_ = std::make_shared<apache::thrift::transport::TBufferedTransportFactory>();

        // Create protocol factory (binary protocol)
        protocolFactory_ = std::make_shared<apache::thrift::protocol::TBinaryProtocolFactory>();

        // Create threaded server
        server_ = std::make_shared<apache::thrift::server::TThreadedServer>(
            processor_,
            serverSocket_,
            transportFactory_,
            protocolFactory_);

        isRunning_ = true;
        Logger::info("Thrift RPC server started on port " + std::to_string(port_));
        Logger::info("Waiting for RPC connections from BigModuleB...");

        // Start server (BLOCKING)
        server_->serve();

        // This line is reached after stop() is called
        isRunning_ = false;
        Logger::info("Thrift RPC server stopped");

    } catch (const apache::thrift::TException& e) {
        isRunning_ = false;
        Logger::error("Thrift exception in server startup: " + std::string(e.what()));
        throw std::runtime_error("Failed to start Thrift RPC server: " + std::string(e.what()));
    } catch (const std::exception& e) {
        isRunning_ = false;
        Logger::error("Exception in server startup: " + std::string(e.what()));
        throw std::runtime_error("Failed to start Thrift RPC server: " + std::string(e.what()));
    }
}

void ThriftRPCServer::stop() {
    if (!isRunning_) {
        return;
    }

    Logger::info("Stopping Thrift RPC server...");

    if (server_) {
        server_->stop();
    }

    isRunning_ = false;
}

}  // namespace bigmodulec
}  // namespace rtdcs
