/**
 * RTDCS BigModuleA - ITemperaturePattern Interface
 *
 * Strategy pattern interface for temperature generation algorithms.
 * Allows different temperature patterns to be plugged into ThermalMonitor.
 *
 * Design Pattern: Strategy
 * Purpose: Define a family of temperature generation algorithms and make them interchangeable
 *
 * Concrete Implementations:
 * - SineWavePattern: Sinusoidal temperature variation
 * - StepPattern: Step-wise temperature changes
 *
 * Author: Developer Agent
 * Date: 2026-01-20
 */

#ifndef BIGMODULEA_ITEMPERATURE_PATTERN_H
#define BIGMODULEA_ITEMPERATURE_PATTERN_H

namespace bigmodulea {

/**
 * ITemperaturePattern - Abstract interface for temperature pattern algorithms
 *
 * This interface defines the contract for all temperature pattern strategies.
 * Each concrete implementation provides a different algorithm for generating
 * temperature values over time.
 *
 * Usage Example:
 * ```cpp
 * // Create a sine wave pattern
 * std::unique_ptr<ITemperaturePattern> pattern =
 *     std::make_unique<SineWavePattern>(25.0, 5.0, 0.1);
 *
 * // Get temperature at different times
 * double temp_at_0s = pattern->getTemperature(0.0);    // 25.0°C
 * double temp_at_2_5s = pattern->getTemperature(2.5);  // 30.0°C (peak)
 * double temp_at_5s = pattern->getTemperature(5.0);    // 25.0°C (back to base)
 * ```
 */
class ITemperaturePattern {
public:
    /**
     * Virtual destructor (required for interface class)
     *
     * Ensures proper cleanup when deleting through base class pointer.
     */
    virtual ~ITemperaturePattern() = default;

    /**
     * Get temperature value at given time
     *
     * Computes temperature in degrees Celsius based on the elapsed time
     * since the start of monitoring.
     *
     * @param time_s Time in seconds since start (e.g., 0.0, 0.1, 0.2, ...)
     * @return Temperature in degrees Celsius
     */
    virtual double getTemperature(double time_s) const = 0;
};

}  // namespace bigmodulea

#endif  // BIGMODULEA_ITEMPERATURE_PATTERN_H
