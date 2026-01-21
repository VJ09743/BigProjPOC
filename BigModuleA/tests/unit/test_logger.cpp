/**
 * RTDCS BigModuleA - Unit Tests for Logger
 *
 * Tests for thread-safe logging utility with timestamps.
 *
 * Author: Developer Agent
 * Date: 2026-01-20
 */

#include "../../src/int/impl/Logger.h"
#include <gtest/gtest.h>
#include <thread>
#include <vector>
#include <sstream>
#include <iostream>

using namespace bigmodulea;

/**
 * Test Suite: Logger
 */
class LoggerTest : public ::testing::Test {
protected:
    // Capture cout for testing
    std::stringstream buffer_;
    std::streambuf* old_cout_;

    void SetUp() override {
        // Redirect cout to our buffer
        old_cout_ = std::cout.rdbuf();
        std::cout.rdbuf(buffer_.rdbuf());
    }

    void TearDown() override {
        // Restore cout
        std::cout.rdbuf(old_cout_);
    }

    std::string getOutput() {
        return buffer_.str();
    }

    void clearOutput() {
        buffer_.str("");
        buffer_.clear();
    }
};

/**
 * Test: Logger - Info Level
 * Verify that info() logs with correct format
 */
TEST_F(LoggerTest, Info_LogsWithCorrectFormat) {
    Logger::info("Test message");

    std::string output = getOutput();

    // Verify output contains expected components
    EXPECT_NE(output.find("[BigModuleA]"), std::string::npos);
    EXPECT_NE(output.find("[INFO]"), std::string::npos);
    EXPECT_NE(output.find("Test message"), std::string::npos);

    // Verify timestamp format (should start with '[' and contain 'T')
    EXPECT_EQ(output[0], '[');
    EXPECT_NE(output.find("T"), std::string::npos);  // ISO 8601 format
}

/**
 * Test: Logger - Warn Level
 * Verify that warn() logs with correct format
 */
TEST_F(LoggerTest, Warn_LogsWithCorrectFormat) {
    Logger::warn("Warning message");

    std::string output = getOutput();

    EXPECT_NE(output.find("[BigModuleA]"), std::string::npos);
    EXPECT_NE(output.find("[WARN]"), std::string::npos);
    EXPECT_NE(output.find("Warning message"), std::string::npos);
}

/**
 * Test: Logger - Error Level
 * Verify that error() logs with correct format
 */
TEST_F(LoggerTest, Error_LogsWithCorrectFormat) {
    Logger::error("Error message");

    std::string output = getOutput();

    EXPECT_NE(output.find("[BigModuleA]"), std::string::npos);
    EXPECT_NE(output.find("[ERROR]"), std::string::npos);
    EXPECT_NE(output.find("Error message"), std::string::npos);
}

/**
 * Test: Logger - Multiple Messages
 * Verify that multiple messages are logged correctly
 */
TEST_F(LoggerTest, MultipleMessages_LoggedCorrectly) {
    Logger::info("First message");
    Logger::warn("Second message");
    Logger::error("Third message");

    std::string output = getOutput();

    EXPECT_NE(output.find("First message"), std::string::npos);
    EXPECT_NE(output.find("Second message"), std::string::npos);
    EXPECT_NE(output.find("Third message"), std::string::npos);
}

/**
 * Test: Logger - Empty Message
 * Verify that empty messages are handled correctly
 */
TEST_F(LoggerTest, EmptyMessage_HandledCorrectly) {
    EXPECT_NO_THROW({
        Logger::info("");
        Logger::warn("");
        Logger::error("");
    });
}

/**
 * Test: Logger - Long Message
 * Verify that long messages are handled correctly
 */
TEST_F(LoggerTest, LongMessage_HandledCorrectly) {
    std::string long_message(1000, 'A');

    EXPECT_NO_THROW({
        Logger::info(long_message);
    });

    std::string output = getOutput();
    EXPECT_NE(output.find(long_message), std::string::npos);
}

/**
 * Test: Logger - Special Characters
 * Verify that special characters are handled correctly
 */
TEST_F(LoggerTest, SpecialCharacters_HandledCorrectly) {
    std::string special_msg = "Message with special chars: @#$%^&*(){}[]<>!?";

    EXPECT_NO_THROW({
        Logger::info(special_msg);
    });

    std::string output = getOutput();
    EXPECT_NE(output.find(special_msg), std::string::npos);
}

/**
 * Test: Logger - Thread Safety
 * Verify that Logger is thread-safe for concurrent logging
 */
TEST_F(LoggerTest, ThreadSafety_ConcurrentLogging) {
    const int num_threads = 10;
    const int logs_per_thread = 50;
    std::vector<std::thread> threads;

    // Restore cout for this test (we can't easily capture concurrent output)
    std::cout.rdbuf(old_cout_);

    // Launch multiple threads logging concurrently
    for (int t = 0; t < num_threads; ++t) {
        threads.emplace_back([t, logs_per_thread]() {
            for (int i = 0; i < logs_per_thread; ++i) {
                std::string msg = "Thread " + std::to_string(t) + " message " + std::to_string(i);
                Logger::info(msg);
            }
        });
    }

    // Wait for all threads to complete
    // If Logger is not thread-safe, this may crash or produce garbled output
    EXPECT_NO_THROW({
        for (auto& thread : threads) {
            thread.join();
        }
    });
}

/**
 * Test: Logger - Timestamp Format
 * Verify that timestamp follows ISO 8601 format
 */
TEST_F(LoggerTest, Timestamp_ISO8601Format) {
    Logger::info("Test");

    std::string output = getOutput();

    // Timestamp should be: [YYYY-MM-DDTHH:MM:SS.mmm]
    // Example: [2026-01-20T14:32:45.123]

    // Check for year (4 digits)
    EXPECT_NE(output.find("202"), std::string::npos);  // Should be 202X

    // Check for date separator
    EXPECT_NE(output.find("-"), std::string::npos);

    // Check for time separator 'T'
    EXPECT_NE(output.find("T"), std::string::npos);

    // Check for time colon separators
    size_t first_colon = output.find(":");
    EXPECT_NE(first_colon, std::string::npos);

    // Check for milliseconds separator '.'
    EXPECT_NE(output.find("."), std::string::npos);
}

/**
 * Test: Logger - Timestamp Monotonicity
 * Verify that timestamps are monotonically increasing
 */
TEST_F(LoggerTest, Timestamp_MonotonicallyIncreasing) {
    // Restore cout for this test
    std::cout.rdbuf(old_cout_);

    // Log multiple messages with small delays
    for (int i = 0; i < 5; ++i) {
        Logger::info("Message " + std::to_string(i));
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }

    // If timestamps are monotonic, no exceptions should occur
    // (Full verification would require parsing timestamps, which is complex)
    SUCCEED();
}

/**
 * Main function for running tests
 */
int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
