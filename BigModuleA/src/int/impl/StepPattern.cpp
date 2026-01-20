/**
 * RTDCS BigModuleA - StepPattern Implementation
 *
 * Author: Developer Agent
 * Date: 2026-01-20
 */

#include "StepPattern.h"
#include <cmath>  // floor

namespace bigmodulea {

StepPattern::StepPattern(double baseTemp,
                         double stepDelta,
                         double interval_s)
    : baseTemp_(baseTemp),
      stepDelta_(stepDelta),
      interval_s_(interval_s) {
    // Constructor initializes member variables
}

double StepPattern::getTemperature(double time_s) const {
    // Formula: T(t) = baseTemp + (floor(t / interval) % 2) * stepDelta
    //
    // Explanation:
    // - t / interval: Number of intervals elapsed (fractional)
    // - floor(t / interval): Number of complete intervals elapsed (integer)
    // - ... % 2: Alternates between 0 and 1 (0 = low, 1 = high)
    // - ... * stepDelta: Scales to 0 (low) or stepDelta (high)
    // - baseTemp + ...: Adds to base temperature
    //
    // Example: baseTemp=25, stepDelta=5, interval=3, time=4.5
    // - Intervals elapsed: 4.5 / 3.0 = 1.5
    // - Complete intervals: floor(1.5) = 1
    // - Alternation: 1 % 2 = 1 (high)
    // - Temperature: 25 + (1) * 5 = 30.0°C
    //
    // Timeline:
    // - t = 0.0-2.9s: floor(t/3) = 0, 0%2 = 0 → 25°C (low)
    // - t = 3.0-5.9s: floor(t/3) = 1, 1%2 = 1 → 30°C (high)
    // - t = 6.0-8.9s: floor(t/3) = 2, 2%2 = 0 → 25°C (low)
    // - t = 9.0-11.9s: floor(t/3) = 3, 3%2 = 1 → 30°C (high)

    const int intervals_elapsed = static_cast<int>(std::floor(time_s / interval_s_));
    const int step_level = intervals_elapsed % 2;  // Alternates 0, 1, 0, 1, ...
    const double temperature = baseTemp_ + (step_level * stepDelta_);

    return temperature;
}

}  // namespace bigmodulea
