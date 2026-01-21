/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Thrift RPC Server Wrapper for BigModuleC
 *
 * This class wraps the Apache Thrift TThreadedServer and provides a
 * simple interface for starting and stopping the RPC server.
 *
 * Server Configuration:
 * - Protocol: TBinaryProtocol
 * - Transport: TBufferedTransport over TCP
 * - Threading Model: TThreadedServer (one thread per connection)
 * - Port: Configurable (default: 9090)
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#ifndef RTDCS_BIGMODULEC_THRIFT_RPC_SERVER_H
#define RTDCS_BIGMODULEC_THRIFT_RPC_SERVER_H

#include "CompensationControllerHandler.h"
#include <thrift/server/TThreadedServer.h>
#include <thrift/transport/TServerSocket.h>
#include <thrift/transport/TBufferTransports.h>
#include <thrift/protocol/TBinaryProtocol.h>
#include <thrift/TProcessor.h>
#include <memory>

namespace rtdcs {
namespace bigmodulec {

/**
 * ThriftRPCServer - Wrapper for Apache Thrift server
 *
 * This class provides a simplified interface for creating and managing
 * a Thrift RPC server for the CompensationController service.
 *
 * Design:
 * - Encapsulates Thrift server setup boilerplate
 * - Provides start/stop interface
 * - Handles graceful shutdown
 *
 * Threading Model:
 * - TThreadedServer: Creates one thread per connection
 * - Suitable for low-to-moderate connection counts
 * - Each RPC call runs in its own thread
 *
 * Usage:
 * ```cpp
 * auto handler = std::make_shared<CompensationControllerHandler>(...);
 * ThriftRPCServer server(9090, handler);
 *
 * // Start server (blocking)
 * server.start();
 *
 * // In signal handler:
 * server.stop();
 * ```
 */
class ThriftRPCServer {
public:
    /**
     * Constructor
     *
     * Creates a Thrift RPC server with the given handler.
     *
     * @param port TCP port to listen on (default: 9090)
     * @param handler Shared pointer to CompensationControllerHandler
     */
    ThriftRPCServer(int port,
                    std::shared_ptr<CompensationControllerHandler> handler);

    /**
     * Destructor
     *
     * Stops the server if still running.
     */
    ~ThriftRPCServer();

    /**
     * Start the Thrift RPC server
     *
     * This method is BLOCKING and will not return until stop() is called
     * from another thread (e.g., signal handler).
     *
     * Workflow:
     * 1. Create TServerSocket on specified port
     * 2. Create TThreadedServer with handler processor
     * 3. Log server startup
     * 4. Call server->serve() [BLOCKING]
     * 5. Log server shutdown
     *
     * Thread Safety: Call from main thread, stop from signal handler thread
     *
     * @throws std::runtime_error if server cannot start
     */
    void start();

    /**
     * Stop the Thrift RPC server
     *
     * Gracefully shuts down the server. This method is thread-safe and
     * can be called from a signal handler.
     *
     * Workflow:
     * 1. Call server->stop()
     * 2. Wait for serve() to return
     * 3. Log shutdown
     *
     * Thread Safety: Thread-safe, can be called from signal handler
     */
    void stop();

    /**
     * Check if server is running
     *
     * @return true if server is running, false otherwise
     */
    bool isRunning() const {
        return isRunning_;
    }

    /**
     * Get server port
     *
     * @return TCP port the server is listening on
     */
    int getPort() const {
        return port_;
    }

private:
    /**
     * Server port
     */
    int port_;

    /**
     * Thrift handler (implements ICompensationControllerIf)
     */
    std::shared_ptr<CompensationControllerHandler> handler_;

    /**
     * Thrift processor (wraps handler)
     */
    std::shared_ptr<apache::thrift::TProcessor> processor_;

    /**
     * Thrift server socket (listens on TCP port)
     */
    std::shared_ptr<apache::thrift::transport::TServerSocket> serverSocket_;

    /**
     * Thrift transport factory (buffered transport)
     */
    std::shared_ptr<apache::thrift::transport::TTransportFactory> transportFactory_;

    /**
     * Thrift protocol factory (binary protocol)
     */
    std::shared_ptr<apache::thrift::protocol::TProtocolFactory> protocolFactory_;

    /**
     * Thrift threaded server
     */
    std::shared_ptr<apache::thrift::server::TThreadedServer> server_;

    /**
     * Server running flag
     */
    bool isRunning_;
};

}  // namespace bigmodulec
}  // namespace rtdcs

#endif  // RTDCS_BIGMODULEC_THRIFT_RPC_SERVER_H
