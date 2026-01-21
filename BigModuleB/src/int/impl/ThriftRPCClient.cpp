/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Thrift RPC Client Wrapper Implementation
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#include "ThriftRPCClient.h"
#include "Logger.h"
#include <stdexcept>
#include <thrift/transport/TTransportException.h>

namespace rtdcs {
namespace bigmoduleb {

ThriftRPCClient::ThriftRPCClient(const std::string& host, int port)
    : host_(host),
      port_(port),
      isConnected_(false) {
    Logger::info("ThriftRPCClient created (target: " + host + ":" + std::to_string(port) + ")");
}

ThriftRPCClient::~ThriftRPCClient() {
    disconnect();
    Logger::info("ThriftRPCClient destroyed");
}

void ThriftRPCClient::connect() {
    if (isConnected_) {
        throw std::runtime_error("ThriftRPCClient: Already connected to server");
    }

    try {
        Logger::info("Connecting to BigModuleC at " + host_ + ":" + std::to_string(port_) + "...");

        // Create socket (TCP connection)
        socket_ = std::make_shared<apache::thrift::transport::TSocket>(host_, port_);

        // Set socket timeout (5 seconds for connection, 10 seconds for send/receive)
        socket_->setConnTimeout(5000);   // 5 seconds
        socket_->setSendTimeout(10000);  // 10 seconds
        socket_->setRecvTimeout(10000);  // 10 seconds

        // Wrap with buffered transport
        transport_ = std::make_shared<apache::thrift::transport::TBufferedTransport>(socket_);

        // Create binary protocol
        protocol_ = std::make_shared<apache::thrift::protocol::TBinaryProtocol>(transport_);

        // Create client
        client_ = std::make_shared<rtdcs::interfaces::ICompensationControllerClient>(protocol_);

        // Open transport (connect to server)
        transport_->open();

        isConnected_ = true;
        Logger::info("Successfully connected to BigModuleC");

    } catch (const apache::thrift::transport::TTransportException& e) {
        isConnected_ = false;
        Logger::error("Thrift transport exception during connection: " + std::string(e.what()));
        throw std::runtime_error("Failed to connect to BigModuleC: " + std::string(e.what()));
    } catch (const apache::thrift::TException& e) {
        isConnected_ = false;
        Logger::error("Thrift exception during connection: " + std::string(e.what()));
        throw std::runtime_error("Failed to connect to BigModuleC: " + std::string(e.what()));
    } catch (const std::exception& e) {
        isConnected_ = false;
        Logger::error("Exception during connection: " + std::string(e.what()));
        throw std::runtime_error("Failed to connect to BigModuleC: " + std::string(e.what()));
    }
}

void ThriftRPCClient::disconnect() {
    if (!isConnected_) {
        return;
    }

    Logger::info("Disconnecting from BigModuleC...");

    try {
        if (transport_ && transport_->isOpen()) {
            transport_->close();
        }
    } catch (const std::exception& e) {
        Logger::warn("Exception during disconnect (ignored): " + std::string(e.what()));
    }

    client_.reset();
    protocol_.reset();
    transport_.reset();
    socket_.reset();

    isConnected_ = false;
    Logger::info("Disconnected from BigModuleC");
}

void ThriftRPCClient::sendDistortion(const DistortionVector& distortion) {
    if (!isConnected_) {
        throw std::runtime_error("ThriftRPCClient: Not connected to server. Call connect() first.");
    }

    try {
        // Create Thrift DistortionVector struct
        rtdcs::interfaces::DistortionVector thrift_distortion;
        thrift_distortion.distortion_x_nm = distortion.distortion_x_nm;
        thrift_distortion.distortion_y_nm = distortion.distortion_y_nm;

        // Send RPC call to BigModuleC
        client_->applyDistortion(thrift_distortion);

        // RPC succeeded (no exception thrown)
        // Note: We don't log every successful RPC to reduce log spam

    } catch (const apache::thrift::transport::TTransportException& e) {
        Logger::error("Thrift transport exception in sendDistortion: " + std::string(e.what()));
        isConnected_ = false;  // Mark as disconnected on transport error
        throw;  // Re-throw to caller
    } catch (const apache::thrift::TException& e) {
        Logger::error("Thrift exception in sendDistortion: " + std::string(e.what()));
        throw;  // Re-throw to caller
    } catch (const std::exception& e) {
        Logger::error("Exception in sendDistortion: " + std::string(e.what()));
        throw;  // Re-throw to caller
    }
}

}  // namespace bigmoduleb
}  // namespace rtdcs
