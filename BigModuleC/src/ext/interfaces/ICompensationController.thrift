/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Compensation Controller Interface Definition
 *
 * This Thrift IDL defines the RPC interface for BigModuleC (CompensationController).
 * BigModuleB (DistortionPredictor) acts as the Thrift client and sends distortion
 * predictions to BigModuleC via this interface.
 *
 * ⚠️ CRITICAL DISCLAIMER: The distortion and compensation models are FICTIONAL
 * and created solely for proof-of-concept demonstration purposes.
 *
 * Apache Thrift Version: 0.19.0
 * Protocol: Binary
 * Transport: Buffered over TCP
 * Port: 9090 (default)
 */

namespace cpp rtdcs.interfaces
namespace java com.rtdcs.interfaces
namespace py rtdcs.interfaces

/**
 * Reticle distortion vector in X and Y directions
 *
 * This structure represents the predicted thermal distortion of the reticle
 * based on the FICTIONAL Zeeman Thermal Expansion Model (computed by BigModuleB).
 *
 * ⚠️ FICTIONAL: This data structure is based on a completely made-up model
 * with no scientific validity. Real lithography systems use complex multi-parameter
 * distortion models.
 *
 * Units: Nanometers (nm) for distortion, seconds (s) for timestamp
 */
struct DistortionVector {
    /**
     * X-direction distortion in nanometers (nm)
     *
     * Represents the horizontal reticle distortion caused by thermal expansion.
     * Positive values indicate expansion, negative values indicate contraction.
     *
     * Typical range: -100.0 to +100.0 nm (FICTIONAL)
     */
    1: required double distortion_x_nm,

    /**
     * Y-direction distortion in nanometers (nm)
     *
     * Represents the vertical reticle distortion caused by thermal expansion.
     * Positive values indicate expansion, negative values indicate contraction.
     *
     * Typical range: -100.0 to +100.0 nm (FICTIONAL)
     */
    2: required double distortion_y_nm,

    /**
     * Timestamp when the distortion prediction was made
     *
     * Time since Unix epoch in seconds (with fractional seconds).
     * Used for logging, synchronization, and debugging.
     *
     * Format: Seconds since 1970-01-01T00:00:00Z (e.g., 1705756825.678)
     */
    3: required double timestamp_s
}

/**
 * Compensation Controller Service Interface
 *
 * This service defines the RPC interface for BigModuleC (CompensationController).
 * BigModuleB (DistortionPredictor) acts as the client and calls this service
 * to send predicted distortion vectors for compensation.
 *
 * Server: BigModuleC (CompensationController)
 * Client: BigModuleB (DistortionPredictor)
 * Protocol: TBinaryProtocol
 * Transport: TBufferedTransport over TCP
 * Port: 9090 (default)
 *
 * Threading Model: TThreadedServer (one thread per connection)
 */
service ICompensationController {

    /**
     * Apply reticle distortion compensation
     *
     * This RPC method receives a predicted distortion vector from BigModuleB
     * and applies compensation by computing the correction values and writing
     * them to the shared memory state.
     *
     * Implementation (FICTIONAL):
     * 1. Receive DistortionVector from BigModuleB
     * 2. Compute CompensationVector using SimpleNegationStrategy (compensation = -distortion)
     * 3. Write compensation values to shared memory (/rtdcs_shared_state)
     * 4. Log the operation with FICTIONAL warning
     *
     * Thread Safety: This method is thread-safe. Multiple concurrent calls from
     * different BigModuleB clients are supported (though only one client is used in POC).
     *
     * Error Handling:
     * - TApplicationException: Thrown if shared memory write fails
     * - TProtocolException: Thrown if deserialization fails
     * - TTransportException: Thrown if network I/O fails
     *
     * Performance:
     * - Expected latency: < 5 ms (localhost)
     * - Throughput: > 100 RPC/s
     *
     * @param distortion The predicted distortion vector from BigModuleB
     *                   (based on FICTIONAL Zeeman Thermal Expansion Model)
     *
     * @throws TApplicationException if compensation computation or shared memory write fails
     *
     * Example Usage (C++ Client):
     * ```cpp
     * DistortionVector distortion;
     * distortion.distortion_x_nm = 5.7;
     * distortion.distortion_y_nm = 4.6;
     * distortion.timestamp_s = getCurrentTime();
     *
     * client->applyDistortion(distortion);
     * ```
     *
     * Example Log Output (BigModuleC):
     * ```
     * [2026-01-20T14:23:47.200] [BigModuleC] [INFO] Received distortion: X=5.7nm, Y=4.6nm
     * [2026-01-20T14:23:47.201] [BigModuleC] [INFO] ⚠️ FICTIONAL Compensation: D(5.7nm, 4.6nm) → C(-5.7nm, -4.6nm)
     * [2026-01-20T14:23:47.202] [BigModuleC] [INFO] Compensation written to shared memory
     * ```
     */
    void applyDistortion(
        1: DistortionVector distortion
    )
}

/**
 * Design Notes:
 *
 * 1. Why void return type for applyDistortion()?
 *    - Compensation is fire-and-forget (no return value needed)
 *    - Errors are communicated via exceptions
 *    - Simpler client code (no need to check return value)
 *
 * 2. Why no asynchronous (oneway) modifier?
 *    - We want error feedback (exceptions) from server to client
 *    - Client should know if compensation failed
 *    - Performance impact is negligible (<5 ms latency)
 *
 * 3. Future Extensions:
 *    - Add getCompensationStatus() method to query current compensation state
 *    - Add resetCompensation() method to reset compensation to zero
 *    - Add getStatistics() method to retrieve RPC throughput metrics
 *    - Add health check method (ping/pong)
 *
 * 4. Versioning Strategy:
 *    - Use namespace versioning (e.g., rtdcs.interfaces.v2) for breaking changes
 *    - Add optional fields for backward-compatible changes
 *    - Maintain separate .thrift files for different versions
 */

/**
 * Generated Code:
 *
 * C++ (thrift --gen cpp ICompensationController.thrift):
 * - ICompensationController.h        # Service interface and types
 * - ICompensationController.cpp      # Type serialization/deserialization
 * - ICompensationController_types.h  # Struct definitions
 * - ICompensationController_types.cpp
 * - ICompensationController_server.skeleton.cpp  # Server boilerplate
 *
 * Java (thrift --gen java ICompensationController.thrift):
 * - ICompensationController.java     # Service interface
 * - DistortionVector.java            # Struct class
 *
 * Python (thrift --gen py ICompensationController.thrift):
 * - ICompensationController.py       # Service and types
 * - ttypes.py                         # Struct definitions
 */
