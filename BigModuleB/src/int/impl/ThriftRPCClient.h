/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Thrift RPC Client Wrapper for BigModuleB
 *
 * This class wraps the Apache Thrift client and provides a simplified
 * interface for sending distortion predictions to BigModuleC via RPC.
 *
 * Client Configuration:
 * - Protocol: TBinaryProtocol
 * - Transport: TBufferedTransport over TCP
 * - Server: BigModuleC (CompensationController)
 * - Port: Configurable (default: 9090)
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#ifndef RTDCS_BIGMODULEB_THRIFT_RPC_CLIENT_H
#define RTDCS_BIGMODULEB_THRIFT_RPC_CLIENT_H

#include "ICompensationController.h"  // Thrift-generated client
#include "ZeemanDistortionPredictor.h"
#include <thrift/transport/TSocket.h>
#include <thrift/transport/TBufferTransports.h>
#include <thrift/protocol/TBinaryProtocol.h>
#include <memory>
#include <string>

namespace rtdcs {
namespace bigmoduleb {

/**
 * ThriftRPCClient - Wrapper for Apache Thrift client
 *
 * This class provides a simplified interface for creating and managing
 * a Thrift RPC client that connects to BigModuleC's CompensationController
 * service.
 *
 * Design:
 * - Encapsulates Thrift client setup boilerplate
 * - Provides connect/disconnect interface
 * - Handles connection errors and reconnection
 *
 * Threading Model:
 * - Single-threaded (called from main loop)
 * - Synchronous RPC calls (blocking)
 *
 * Usage:
 * ```cpp
 * ThriftRPCClient client("localhost", 9090);
 * client.connect();
 *
 * DistortionVector distortion(5.7, 4.6);
 * client.sendDistortion(distortion);
 *
 * client.disconnect();
 * ```
 */
class ThriftRPCClient {
public:
    /**
     * Constructor
     *
     * Creates a Thrift RPC client configured to connect to BigModuleC.
     *
     * @param host Hostname or IP address of BigModuleC (default: "localhost")
     * @param port TCP port of BigModuleC Thrift server (default: 9090)
     */
    ThriftRPCClient(const std::string& host = "localhost", int port = 9090);

    /**
     * Destructor
     *
     * Disconnects if still connected.
     */
    ~ThriftRPCClient();

    /**
     * Connect to BigModuleC Thrift server
     *
     * Opens a TCP connection to BigModuleC and initializes the Thrift
     * transport and protocol layers.
     *
     * Workflow:
     * 1. Create TSocket to server host:port
     * 2. Wrap with TBufferedTransport
     * 3. Create TBinaryProtocol
     * 4. Create ICompensationControllerClient
     * 5. Open transport
     *
     * Error Handling:
     * - Throws std::runtime_error if connection fails
     * - Throws std::runtime_error if already connected
     *
     * @throws std::runtime_error on connection failure
     */
    void connect();

    /**
     * Disconnect from BigModuleC Thrift server
     *
     * Closes the TCP connection and cleans up Thrift resources.
     *
     * Note: Safe to call multiple times (idempotent)
     */
    void disconnect();

    /**
     * Send distortion prediction to BigModuleC
     *
     * Sends the predicted distortion vector to BigModuleC via the
     * applyDistortion() RPC method.
     *
     * Preconditions:
     * - connect() must have been called successfully
     *
     * RPC Method: applyDistortion(DistortionVector)
     * - Synchronous (blocking) RPC call
     * - Returns when BigModuleC acknowledges receipt
     *
     * Error Handling:
     * - Throws std::runtime_error if not connected
     * - Throws apache::thrift::TException on RPC failure
     *
     * @param distortion Distortion vector to send (X and Y in nm)
     * @throws std::runtime_error if not connected
     * @throws apache::thrift::TException on RPC failure
     */
    void sendDistortion(const DistortionVector& distortion);

    /**
     * Check if connected to server
     *
     * @return true if connected, false otherwise
     */
    bool isConnected() const {
        return isConnected_;
    }

    /**
     * Get server host
     *
     * @return Server hostname or IP address
     */
    std::string getHost() const {
        return host_;
    }

    /**
     * Get server port
     *
     * @return Server TCP port
     */
    int getPort() const {
        return port_;
    }

private:
    /**
     * Server hostname or IP address
     */
    std::string host_;

    /**
     * Server TCP port
     */
    int port_;

    /**
     * Thrift socket (TCP connection)
     */
    std::shared_ptr<apache::thrift::transport::TSocket> socket_;

    /**
     * Thrift transport (buffered transport)
     */
    std::shared_ptr<apache::thrift::transport::TTransport> transport_;

    /**
     * Thrift protocol (binary protocol)
     */
    std::shared_ptr<apache::thrift::protocol::TProtocol> protocol_;

    /**
     * Thrift client (ICompensationController client)
     */
    std::shared_ptr<rtdcs::interfaces::ICompensationControllerClient> client_;

    /**
     * Connection status flag
     */
    bool isConnected_;
};

}  // namespace bigmoduleb
}  // namespace rtdcs

#endif  // RTDCS_BIGMODULEB_THRIFT_RPC_CLIENT_H
