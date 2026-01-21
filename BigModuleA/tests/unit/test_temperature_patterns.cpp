/**
 * RTDCS BigModuleA - Unit Tests for Temperature Patterns
 *
 * Tests for Strategy pattern implementations:
 * - SineWavePattern
 * - StepPattern
 *
 * Author: Developer Agent
 * Date: 2026-01-20
 */

#include "../../src/int/impl/ITemperaturePattern.h"
#include "../../src/int/impl/SineWavePattern.h"
#include "../../src/int/impl/StepPattern.h"
#include <gtest/gtest.h>
#include <cmath>
#include <memory>

using namespace bigmodulea;

// Tolerance for floating-point comparisons
const double EPSILON = 1e-6;

/**
 * Test Suite: SineWavePattern
 */
class SineWavePatternTest : public ::testing::Test {
protected:
    // Default parameters for testing
    const double baseTemp_ = 25.0;
    const double amplitude_ = 5.0;
    const double frequency_ = 0.1;  // 0.1 Hz = 10 second period
};

/**
 * Test: SineWavePattern - Constructor
 * Verify that pattern can be constructed with valid parameters
 */
TEST_F(SineWavePatternTest, Constructor_ValidParameters) {
    EXPECT_NO_THROW({
        SineWavePattern pattern(baseTemp_, amplitude_, frequency_);
    });
}

/**
 * Test: SineWavePattern - Temperature at t=0
 * At t=0, sine wave should be at base temperature
 * T(0) = baseTemp + amplitude * sin(0) = baseTemp
 */
TEST_F(SineWavePatternTest, GetTemperature_AtTimeZero) {
    SineWavePattern pattern(baseTemp_, amplitude_, frequency_);

    double temp = pattern.getTemperature(0.0);

    EXPECT_NEAR(temp, baseTemp_, EPSILON);
}

/**
 * Test: SineWavePattern - Temperature at Peak
 * At t = T/4 (quarter period), sine should be at maximum
 * For frequency = 0.1 Hz, period = 10s, peak at t = 2.5s
 * T(2.5) = baseTemp + amplitude * sin(π/2) = baseTemp + amplitude
 */
TEST_F(SineWavePatternTest, GetTemperature_AtPeak) {
    SineWavePattern pattern(baseTemp_, amplitude_, frequency_);

    const double quarter_period = 2.5;  // T/4 for 0.1 Hz
    double temp = pattern.getTemperature(quarter_period);

    EXPECT_NEAR(temp, baseTemp_ + amplitude_, EPSILON);
}

/**
 * Test: SineWavePattern - Temperature at Trough
 * At t = 3T/4, sine should be at minimum
 * For frequency = 0.1 Hz, period = 10s, trough at t = 7.5s
 * T(7.5) = baseTemp + amplitude * sin(3π/2) = baseTemp - amplitude
 */
TEST_F(SineWavePatternTest, GetTemperature_AtTrough) {
    SineWavePattern pattern(baseTemp_, amplitude_, frequency_);

    const double three_quarter_period = 7.5;  // 3T/4 for 0.1 Hz
    double temp = pattern.getTemperature(three_quarter_period);

    EXPECT_NEAR(temp, baseTemp_ - amplitude_, EPSILON);
}

/**
 * Test: SineWavePattern - Temperature at Full Period
 * At t = T (full period), sine should return to base temperature
 * For frequency = 0.1 Hz, period = 10s
 * T(10) = baseTemp + amplitude * sin(2π) = baseTemp
 */
TEST_F(SineWavePatternTest, GetTemperature_AtFullPeriod) {
    SineWavePattern pattern(baseTemp_, amplitude_, frequency_);

    const double full_period = 10.0;  // T for 0.1 Hz
    double temp = pattern.getTemperature(full_period);

    EXPECT_NEAR(temp, baseTemp_, EPSILON);
}

/**
 * Test: SineWavePattern - Multiple Cycles
 * Verify pattern repeats correctly over multiple cycles
 */
TEST_F(SineWavePatternTest, GetTemperature_MultipleCycles) {
    SineWavePattern pattern(baseTemp_, amplitude_, frequency_);

    const double period = 10.0;
    double temp1 = pattern.getTemperature(0.0);
    double temp2 = pattern.getTemperature(period);
    double temp3 = pattern.getTemperature(2 * period);

    EXPECT_NEAR(temp1, temp2, EPSILON);
    EXPECT_NEAR(temp2, temp3, EPSILON);
}

/**
 * Test: SineWavePattern - Different Frequencies
 * Verify that different frequencies produce correct periods
 */
TEST_F(SineWavePatternTest, GetTemperature_DifferentFrequencies) {
    const double freq_1Hz = 1.0;
    SineWavePattern pattern(baseTemp_, amplitude_, freq_1Hz);

    // For 1 Hz, period = 1s, peak at t = 0.25s
    double temp_peak = pattern.getTemperature(0.25);
    EXPECT_NEAR(temp_peak, baseTemp_ + amplitude_, EPSILON);

    // Trough at t = 0.75s
    double temp_trough = pattern.getTemperature(0.75);
    EXPECT_NEAR(temp_trough, baseTemp_ - amplitude_, EPSILON);
}

/**
 * Test: SineWavePattern - Zero Amplitude
 * With amplitude = 0, temperature should always equal baseTemp
 */
TEST_F(SineWavePatternTest, GetTemperature_ZeroAmplitude) {
    SineWavePattern pattern(baseTemp_, 0.0, frequency_);

    EXPECT_NEAR(pattern.getTemperature(0.0), baseTemp_, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(2.5), baseTemp_, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(5.0), baseTemp_, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(7.5), baseTemp_, EPSILON);
}

/**
 * Test: SineWavePattern - Polymorphic Usage
 * Verify that pattern works correctly through interface pointer
 */
TEST_F(SineWavePatternTest, PolymorphicUsage_ThroughInterface) {
    std::unique_ptr<ITemperaturePattern> pattern =
        std::make_unique<SineWavePattern>(baseTemp_, amplitude_, frequency_);

    double temp = pattern->getTemperature(0.0);
    EXPECT_NEAR(temp, baseTemp_, EPSILON);
}

/**
 * Test Suite: StepPattern
 */
class StepPatternTest : public ::testing::Test {
protected:
    // Default parameters for testing
    const double baseTemp_ = 25.0;
    const double stepDelta_ = 5.0;
    const double interval_s_ = 3.0;
};

/**
 * Test: StepPattern - Constructor
 * Verify that pattern can be constructed with valid parameters
 */
TEST_F(StepPatternTest, Constructor_ValidParameters) {
    EXPECT_NO_THROW({
        StepPattern pattern(baseTemp_, stepDelta_, interval_s_);
    });
}

/**
 * Test: StepPattern - First Interval (Low State)
 * During first interval [0, 3s), temperature should be baseTemp
 */
TEST_F(StepPatternTest, GetTemperature_FirstInterval) {
    StepPattern pattern(baseTemp_, stepDelta_, interval_s_);

    EXPECT_NEAR(pattern.getTemperature(0.0), baseTemp_, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(1.0), baseTemp_, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(2.9), baseTemp_, EPSILON);
}

/**
 * Test: StepPattern - Second Interval (High State)
 * During second interval [3, 6s), temperature should be baseTemp + stepDelta
 */
TEST_F(StepPatternTest, GetTemperature_SecondInterval) {
    StepPattern pattern(baseTemp_, stepDelta_, interval_s_);

    double expected = baseTemp_ + stepDelta_;

    EXPECT_NEAR(pattern.getTemperature(3.0), expected, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(4.0), expected, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(5.9), expected, EPSILON);
}

/**
 * Test: StepPattern - Third Interval (Low State)
 * During third interval [6, 9s), temperature should be baseTemp again
 */
TEST_F(StepPatternTest, GetTemperature_ThirdInterval) {
    StepPattern pattern(baseTemp_, stepDelta_, interval_s_);

    EXPECT_NEAR(pattern.getTemperature(6.0), baseTemp_, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(7.0), baseTemp_, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(8.9), baseTemp_, EPSILON);
}

/**
 * Test: StepPattern - Fourth Interval (High State)
 * During fourth interval [9, 12s), temperature should be baseTemp + stepDelta
 */
TEST_F(StepPatternTest, GetTemperature_FourthInterval) {
    StepPattern pattern(baseTemp_, stepDelta_, interval_s_);

    double expected = baseTemp_ + stepDelta_;

    EXPECT_NEAR(pattern.getTemperature(9.0), expected, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(10.0), expected, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(11.9), expected, EPSILON);
}

/**
 * Test: StepPattern - Alternation Over Many Intervals
 * Verify correct alternation over extended time
 */
TEST_F(StepPatternTest, GetTemperature_ManyIntervals) {
    StepPattern pattern(baseTemp_, stepDelta_, interval_s_);

    // Even intervals (0, 2, 4, 6, ...) should be low (baseTemp)
    EXPECT_NEAR(pattern.getTemperature(0.5), baseTemp_, EPSILON);   // Interval 0
    EXPECT_NEAR(pattern.getTemperature(6.5), baseTemp_, EPSILON);   // Interval 2
    EXPECT_NEAR(pattern.getTemperature(12.5), baseTemp_, EPSILON);  // Interval 4

    // Odd intervals (1, 3, 5, ...) should be high (baseTemp + stepDelta)
    double expected = baseTemp_ + stepDelta_;
    EXPECT_NEAR(pattern.getTemperature(3.5), expected, EPSILON);   // Interval 1
    EXPECT_NEAR(pattern.getTemperature(9.5), expected, EPSILON);   // Interval 3
    EXPECT_NEAR(pattern.getTemperature(15.5), expected, EPSILON);  // Interval 5
}

/**
 * Test: StepPattern - Exact Interval Boundaries
 * Verify behavior at exact transition points
 */
TEST_F(StepPatternTest, GetTemperature_ExactBoundaries) {
    StepPattern pattern(baseTemp_, stepDelta_, interval_s_);

    double expected_high = baseTemp_ + stepDelta_;

    // At exact boundaries, should transition to new state
    EXPECT_NEAR(pattern.getTemperature(0.0), baseTemp_, EPSILON);       // Start of interval 0
    EXPECT_NEAR(pattern.getTemperature(3.0), expected_high, EPSILON);   // Start of interval 1
    EXPECT_NEAR(pattern.getTemperature(6.0), baseTemp_, EPSILON);       // Start of interval 2
    EXPECT_NEAR(pattern.getTemperature(9.0), expected_high, EPSILON);   // Start of interval 3
}

/**
 * Test: StepPattern - Different Interval Durations
 * Verify that different intervals produce correct timing
 */
TEST_F(StepPatternTest, GetTemperature_DifferentIntervals) {
    const double short_interval = 1.0;
    StepPattern pattern(baseTemp_, stepDelta_, short_interval);

    double expected_high = baseTemp_ + stepDelta_;

    EXPECT_NEAR(pattern.getTemperature(0.5), baseTemp_, EPSILON);       // Interval 0
    EXPECT_NEAR(pattern.getTemperature(1.5), expected_high, EPSILON);   // Interval 1
    EXPECT_NEAR(pattern.getTemperature(2.5), baseTemp_, EPSILON);       // Interval 2
    EXPECT_NEAR(pattern.getTemperature(3.5), expected_high, EPSILON);   // Interval 3
}

/**
 * Test: StepPattern - Zero Step Delta
 * With stepDelta = 0, temperature should always equal baseTemp
 */
TEST_F(StepPatternTest, GetTemperature_ZeroStepDelta) {
    StepPattern pattern(baseTemp_, 0.0, interval_s_);

    EXPECT_NEAR(pattern.getTemperature(0.0), baseTemp_, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(3.0), baseTemp_, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(6.0), baseTemp_, EPSILON);
    EXPECT_NEAR(pattern.getTemperature(9.0), baseTemp_, EPSILON);
}

/**
 * Test: StepPattern - Polymorphic Usage
 * Verify that pattern works correctly through interface pointer
 */
TEST_F(StepPatternTest, PolymorphicUsage_ThroughInterface) {
    std::unique_ptr<ITemperaturePattern> pattern =
        std::make_unique<StepPattern>(baseTemp_, stepDelta_, interval_s_);

    double temp = pattern->getTemperature(0.0);
    EXPECT_NEAR(temp, baseTemp_, EPSILON);
}

/**
 * Test: StepPattern - Large Time Values
 * Verify pattern works correctly with large time values
 */
TEST_F(StepPatternTest, GetTemperature_LargeTimeValues) {
    StepPattern pattern(baseTemp_, stepDelta_, interval_s_);

    const double large_time = 1000.0;  // ~333 intervals
    double temp = pattern.getTemperature(large_time);

    // Interval 333 is odd, so should be high
    double expected = baseTemp_ + stepDelta_;
    EXPECT_NEAR(temp, expected, EPSILON);
}

/**
 * Test Suite: Interface Polymorphism
 */
class TemperaturePatternInterfaceTest : public ::testing::Test {
protected:
    const double baseTemp_ = 25.0;
    const double amplitude_ = 5.0;
    const double frequency_ = 0.1;
    const double stepDelta_ = 5.0;
    const double interval_s_ = 3.0;
};

/**
 * Test: Strategy Pattern - Interchangeable Patterns
 * Verify that patterns can be swapped at runtime through interface
 */
TEST_F(TemperaturePatternInterfaceTest, StrategyPattern_InterchangeablePatterns) {
    std::unique_ptr<ITemperaturePattern> pattern;

    // Use SineWavePattern
    pattern = std::make_unique<SineWavePattern>(baseTemp_, amplitude_, frequency_);
    double temp_sine = pattern->getTemperature(0.0);
    EXPECT_NEAR(temp_sine, baseTemp_, EPSILON);

    // Switch to StepPattern
    pattern = std::make_unique<StepPattern>(baseTemp_, stepDelta_, interval_s_);
    double temp_step = pattern->getTemperature(0.0);
    EXPECT_NEAR(temp_step, baseTemp_, EPSILON);
}

/**
 * Test: Virtual Destructor
 * Verify that polymorphic deletion works correctly
 */
TEST_F(TemperaturePatternInterfaceTest, VirtualDestructor_PolymorphicDeletion) {
    // Create through interface pointer
    ITemperaturePattern* pattern1 = new SineWavePattern(baseTemp_, amplitude_, frequency_);
    ITemperaturePattern* pattern2 = new StepPattern(baseTemp_, stepDelta_, interval_s_);

    // Delete through base class pointer (should not leak)
    EXPECT_NO_THROW({
        delete pattern1;
        delete pattern2;
    });
}

/**
 * Main function for running tests
 */
int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
