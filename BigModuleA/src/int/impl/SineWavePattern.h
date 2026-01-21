/**
 * RTDCS BigModuleA - SineWavePattern
 *
 * Concrete implementation of ITemperaturePattern using sinusoidal variation.
 * Generates temperature following a sine wave pattern over time.
 *
 * Formula: T(t) = baseTemp + amplitude * sin(2π * frequency * t)
 *
 * Design Pattern: Strategy (concrete implementation)
 *
 * Author: Developer Agent
 * Date: 2026-01-20
 */

#ifndef BIGMODULEA_SINE_WAVE_PATTERN_H
#define BIGMODULEA_SINE_WAVE_PATTERN_H

#include "ITemperaturePattern.h"

namespace bigmodulea {

/**
 * SineWavePattern - Sinusoidal temperature variation
 *
 * Generates temperature following a sine wave pattern:
 * T(t) = baseTemp + amplitude * sin(2π * frequency * t)
 *
 * Parameters:
 * - baseTemp: Base temperature in °C (center of sine wave)
 * - amplitude: Temperature variation amplitude in °C (peak deviation from base)
 * - frequency: Frequency in Hz (cycles per second)
 *
 * Example: SineWavePattern(25.0, 5.0, 0.1)
 * - Base temperature: 25°C
 * - Oscillates between 20°C and 30°C
 * - Period: 10 seconds (0.1 Hz)
 * - At t=0s: 25.0°C (base)
 * - At t=2.5s: 30.0°C (peak)
 * - At t=5.0s: 25.0°C (base)
 * - At t=7.5s: 20.0°C (trough)
 * - At t=10.0s: 25.0°C (back to start)
 *
 * Usage Example:
 * ```cpp
 * // Create sine wave: 25°C ± 5°C at 0.1 Hz
 * SineWavePattern pattern(25.0, 5.0, 0.1);
 *
 * // Get temperature at different times
 * double temp0 = pattern.getTemperature(0.0);    // 25.0°C
 * double temp1 = pattern.getTemperature(2.5);    // 30.0°C
 * double temp2 = pattern.getTemperature(5.0);    // 25.0°C
 * double temp3 = pattern.getTemperature(7.5);    // 20.0°C
 * double temp4 = pattern.getTemperature(10.0);   // 25.0°C
 * ```
 */
class SineWavePattern : public ITemperaturePattern {
public:
    /**
     * Constructor
     *
     * @param baseTemp Base temperature in degrees Celsius (center of sine wave)
     * @param amplitude Temperature variation amplitude in degrees Celsius
     * @param frequency Frequency in Hz (cycles per second)
     */
    SineWavePattern(double baseTemp, double amplitude, double frequency);

    /**
     * Get temperature at given time
     *
     * Computes: T(t) = baseTemp + amplitude * sin(2π * frequency * t)
     *
     * @param time_s Time in seconds since start
     * @return Temperature in degrees Celsius
     */
    double getTemperature(double time_s) const override;

private:
    double baseTemp_;     ///< Base temperature in °C
    double amplitude_;    ///< Temperature variation amplitude in °C
    double frequency_;    ///< Frequency in Hz
};

}  // namespace bigmodulea

#endif  // BIGMODULEA_SINE_WAVE_PATTERN_H
