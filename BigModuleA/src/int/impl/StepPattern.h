/**
 * RTDCS BigModuleA - StepPattern
 *
 * Concrete implementation of ITemperaturePattern using step-wise changes.
 * Generates temperature that alternates between two levels at regular intervals.
 *
 * Formula: T(t) = baseTemp + (floor(t / interval) % 2) * stepDelta
 *
 * Design Pattern: Strategy (concrete implementation)
 *
 * Author: Developer Agent
 * Date: 2026-01-20
 */

#ifndef BIGMODULEA_STEP_PATTERN_H
#define BIGMODULEA_STEP_PATTERN_H

#include "ITemperaturePattern.h"

namespace bigmodulea {

/**
 * StepPattern - Step-wise temperature changes
 *
 * Generates temperature that alternates between two levels:
 * - Low: baseTemp
 * - High: baseTemp + stepDelta
 *
 * The temperature steps between these two levels at regular intervals.
 *
 * Formula: T(t) = baseTemp + (floor(t / interval) % 2) * stepDelta
 *
 * Parameters:
 * - baseTemp: Base (low) temperature in °C
 * - stepDelta: Temperature increase for high level in °C
 * - interval_s: Time interval between steps in seconds
 *
 * Example: StepPattern(25.0, 5.0, 3.0)
 * - Low temperature: 25°C
 * - High temperature: 30°C
 * - Steps every 3 seconds
 * - At t=0-3s: 25.0°C (low)
 * - At t=3-6s: 30.0°C (high)
 * - At t=6-9s: 25.0°C (low)
 * - At t=9-12s: 30.0°C (high)
 * - Pattern repeats every 6 seconds
 *
 * Usage Example:
 * ```cpp
 * // Create step pattern: 25°C / 30°C, step every 3 seconds
 * StepPattern pattern(25.0, 5.0, 3.0);
 *
 * // Get temperature at different times
 * double temp0 = pattern.getTemperature(0.0);   // 25.0°C (low)
 * double temp1 = pattern.getTemperature(2.9);   // 25.0°C (still low)
 * double temp2 = pattern.getTemperature(3.0);   // 30.0°C (high)
 * double temp3 = pattern.getTemperature(5.9);   // 30.0°C (still high)
 * double temp4 = pattern.getTemperature(6.0);   // 25.0°C (low again)
 * ```
 */
class StepPattern : public ITemperaturePattern {
public:
    /**
     * Constructor
     *
     * @param baseTemp Base (low) temperature in degrees Celsius
     * @param stepDelta Temperature increase for high level in degrees Celsius
     * @param interval_s Time interval between steps in seconds
     */
    StepPattern(double baseTemp, double stepDelta, double interval_s);

    /**
     * Get temperature at given time
     *
     * Computes: T(t) = baseTemp + (floor(t / interval) % 2) * stepDelta
     *
     * @param time_s Time in seconds since start
     * @return Temperature in degrees Celsius
     */
    double getTemperature(double time_s) const override;

private:
    double baseTemp_;      ///< Base (low) temperature in °C
    double stepDelta_;     ///< Temperature increase for high level in °C
    double interval_s_;    ///< Time interval between steps in seconds
};

}  // namespace bigmodulea

#endif  // BIGMODULEA_STEP_PATTERN_H
