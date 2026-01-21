/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Compensation Controller Thrift RPC Handler for BigModuleC
 *
 * This class implements the ICompensationControllerIf interface defined
 * in the Thrift IDL. It handles incoming RPC requests from BigModuleB
 * (DistortionPredictor) to apply reticle distortion compensation.
 *
 * Design Pattern: Handler (part of Command pattern in Thrift architecture)
 * Thread Safety: Thread-safe (uses mutex, supports concurrent RPC calls)
 * Threading Model: TThreadedServer (one thread per connection)
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#ifndef RTDCS_BIGMODULEC_COMPENSATION_CONTROLLER_HANDLER_H
#define RTDCS_BIGMODULEC_COMPENSATION_CONTROLLER_HANDLER_H

#include "ICompensationController.h"  // Thrift-generated interface
#include "SimpleNegationStrategy.h"
#include "SharedMemoryWriter.h"
#include <mutex>
#include <memory>

namespace rtdcs {
namespace bigmodulec {

/**
 * CompensationControllerHandler - Thrift RPC handler implementation
 *
 * This class implements the ICompensationControllerIf interface generated
 * by Thrift. It handles the applyDistortion() RPC method by:
 * 1. Receiving distortion vector from BigModuleB
 * 2. Computing compensation using SimpleNegationStrategy
 * 3. Writing compensation to shared memory
 * 4. Logging the operation
 *
 * Thread Safety:
 * - Thread-safe (uses mutex for critical sections)
 * - Supports concurrent RPC calls from multiple clients
 * - TThreadedServer creates one thread per connection
 *
 * Design:
 * - Uses dependency injection (strategy and writer passed in constructor)
 * - Decoupled from specific strategy implementation
 * - Easy to unit test with mocks
 *
 * Usage:
 * ```cpp
 * SimpleNegationStrategy strategy;
 * SharedMemoryWriter* writer = SharedMemoryWriter::getInstance();
 *
 * auto handler = std::make_shared<CompensationControllerHandler>(&strategy, writer);
 * // Pass handler to Thrift server
 * ```
 */
class CompensationControllerHandler : public rtdcs::interfaces::ICompensationControllerIf {
public:
    /**
     * Constructor with dependency injection
     *
     * @param strategy Pointer to compensation strategy (not owned, must outlive handler)
     * @param writer Pointer to shared memory writer (not owned, must outlive handler)
     */
    CompensationControllerHandler(SimpleNegationStrategy* strategy,
                                  SharedMemoryWriter* writer);

    /**
     * Destructor
     */
    ~CompensationControllerHandler() override;

    /**
     * Apply distortion compensation (Thrift RPC method)
     *
     * This method implements the applyDistortion() RPC defined in the Thrift IDL.
     * It is called by BigModuleB to send distortion predictions for compensation.
     *
     * Algorithm:
     * 1. Log received distortion vector
     * 2. Validate input (sanity check: |distortion| < 1000 nm)
     * 3. Compute compensation using strategy
     * 4. Write compensation to shared memory (thread-safe)
     * 5. Log FICTIONAL compensation applied
     *
     * Thread Safety: Thread-safe (uses mutex)
     *
     * Error Handling:
     * - Throws TApplicationException if input validation fails
     * - Throws TApplicationException if shared memory write fails
     * - Catches and logs all exceptions
     *
     * @param distortion Distortion vector from BigModuleB (FICTIONAL Zeeman model)
     * @throws apache::thrift::TException on errors
     */
    void applyDistortion(const rtdcs::interfaces::DistortionVector& distortion) override;

private:
    /**
     * Get current time since Unix epoch (seconds with fractional part)
     *
     * @return Current time in seconds
     */
    double getCurrentTime() const;

    /**
     * Compensation strategy
     *
     * Pointer to SimpleNegationStrategy (not owned by this class).
     * Must remain valid for the lifetime of this handler.
     */
    SimpleNegationStrategy* strategy_;

    /**
     * Shared memory writer
     *
     * Pointer to SharedMemoryWriter (not owned by this class).
     * Must remain valid for the lifetime of this handler.
     */
    SharedMemoryWriter* writer_;

    /**
     * Mutex for thread-safe RPC handling
     *
     * Protects critical sections during RPC processing.
     * Allows concurrent RPC calls from multiple client threads.
     */
    std::mutex mutex_;

    /**
     * RPC call counter
     *
     * Counts the total number of applyDistortion() calls received.
     * Used for logging and debugging.
     */
    uint64_t rpcCallCount_;
};

}  // namespace bigmodulec
}  // namespace rtdcs

#endif  // RTDCS_BIGMODULEC_COMPENSATION_CONTROLLER_HANDLER_H
