/**
 * RTDCS BigModuleA - SineWavePattern Implementation
 *
 * Author: Developer Agent
 * Date: 2026-01-20
 */

#include "SineWavePattern.h"
#include <cmath>  // sin, M_PI

namespace bigmodulea {

SineWavePattern::SineWavePattern(double baseTemp,
                                 double amplitude,
                                 double frequency)
    : baseTemp_(baseTemp),
      amplitude_(amplitude),
      frequency_(frequency) {
    // Constructor initializes member variables
}

double SineWavePattern::getTemperature(double time_s) const {
    // Formula: T(t) = baseTemp + amplitude * sin(2π * frequency * t)
    //
    // Explanation:
    // - 2π * frequency * t: Angular position in radians
    // - sin(...): Sine function returns value in [-1, 1]
    // - amplitude * sin(...): Scales sine wave to temperature range
    // - baseTemp + ...: Shifts sine wave to center around base temperature
    //
    // Example: baseTemp=25, amplitude=5, frequency=0.1, time=2.5
    // - Angular position: 2π * 0.1 * 2.5 = 0.5π radians = 90°
    // - sin(0.5π) = 1.0
    // - Temperature: 25 + 5 * 1.0 = 30.0°C

    const double angular_position = 2.0 * M_PI * frequency_ * time_s;
    const double sine_value = std::sin(angular_position);
    const double temperature = baseTemp_ + amplitude_ * sine_value;

    return temperature;
}

}  // namespace bigmodulea
