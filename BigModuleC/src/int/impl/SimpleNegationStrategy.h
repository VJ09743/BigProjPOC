/**
 * RTDCS (Reticle Thermal Distortion Compensation System)
 * Simple Negation Compensation Strategy for BigModuleC
 *
 * ⚠️ CRITICAL DISCLAIMER: This compensation algorithm is COMPLETELY FICTIONAL
 * and created solely for proof-of-concept demonstration purposes. Real lithography
 * systems use complex multi-parameter compensation models based on extensive
 * calibration data and physics-based distortion models.
 *
 * Algorithm: Simple Negation
 * Formula: compensation = -distortion
 *
 * This FICTIONAL algorithm assumes that applying the negative of the predicted
 * distortion will perfectly cancel out the reticle thermal expansion. In reality,
 * lithography compensation involves:
 * - Multi-zone correction maps
 * - High-order polynomial models
 * - Non-linear actuator response curves
 * - Dynamic feedback loops
 * - Calibration against wafer metrology data
 *
 * Pattern: Strategy
 * Thread Safety: Thread-safe (stateless, no mutable data)
 *
 * Author: Developer Agent
 * Date: 2026-01-21
 * Version: 1.0
 */

#ifndef RTDCS_BIGMODULEC_SIMPLE_NEGATION_STRATEGY_H
#define RTDCS_BIGMODULEC_SIMPLE_NEGATION_STRATEGY_H

namespace rtdcs {
namespace bigmodulec {

/**
 * SimpleNegationStrategy - FICTIONAL compensation algorithm
 *
 * This class implements a completely made-up compensation strategy
 * for demonstration purposes only.
 *
 * Design Pattern: Strategy
 * - Encapsulates compensation algorithm
 * - Allows future extension (add more sophisticated strategies)
 * - Decouples algorithm from Thrift handler
 *
 * ⚠️ FICTIONAL DISCLAIMER:
 * This algorithm has NO scientific validity. Real systems use complex models.
 *
 * Algorithm:
 * ```
 * compensation_x = -distortion_x
 * compensation_y = -distortion_y
 * ```
 *
 * Thread Safety:
 * - Thread-safe (no mutable state)
 * - Multiple threads can call computeCompensation() concurrently
 */
class SimpleNegationStrategy {
public:
    /**
     * CompensationResult - Output of compensation computation
     *
     * Contains the computed compensation values in X and Y directions.
     */
    struct CompensationResult {
        /**
         * X-direction compensation in nanometers
         *
         * Positive: Move reticle right
         * Negative: Move reticle left
         */
        double compensation_x_nm;

        /**
         * Y-direction compensation in nanometers
         *
         * Positive: Move reticle up
         * Negative: Move reticle down
         */
        double compensation_y_nm;
    };

    /**
     * Default constructor
     */
    SimpleNegationStrategy() = default;

    /**
     * Compute compensation using simple negation
     *
     * ⚠️ FICTIONAL: This algorithm is completely made-up for demonstration.
     * Real lithography systems use complex physics-based models.
     *
     * Algorithm:
     * - compensation_x = -distortion_x
     * - compensation_y = -distortion_y
     *
     * Example:
     * ```cpp
     * SimpleNegationStrategy strategy;
     * auto result = strategy.computeCompensation(5.7, 4.6);
     * // result.compensation_x_nm = -5.7
     * // result.compensation_y_nm = -4.6
     * ```
     *
     * Thread Safety: Thread-safe (stateless)
     *
     * @param distortion_x_nm X-direction distortion in nanometers
     * @param distortion_y_nm Y-direction distortion in nanometers
     * @return CompensationResult containing compensation values
     */
    CompensationResult computeCompensation(double distortion_x_nm,
                                           double distortion_y_nm) const;
};

}  // namespace bigmodulec
}  // namespace rtdcs

#endif  // RTDCS_BIGMODULEC_SIMPLE_NEGATION_STRATEGY_H
