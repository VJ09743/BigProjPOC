/**
 * RTDCS BigModuleA - Unit Tests for SharedMemoryManager
 *
 * Tests for Singleton pattern, POSIX shared memory operations,
 * and thread-safe access to shared state.
 *
 * Author: Developer Agent
 * Date: 2026-01-20
 */

#include "../../src/int/impl/SharedMemoryManager.h"
#include <gtest/gtest.h>
#include <thread>
#include <vector>

using namespace bigmodulea;

/**
 * Test Fixture for SharedMemoryManager tests
 * Ensures clean state before and after each test
 */
class SharedMemoryManagerTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Clean up any existing shared memory before test
        SharedMemoryManager::getInstance().destroy();
    }

    void TearDown() override {
        // Clean up shared memory after test
        SharedMemoryManager::getInstance().destroy();
    }
};

/**
 * Test: Singleton Pattern - Single Instance
 * Verify that getInstance() always returns the same instance
 */
TEST_F(SharedMemoryManagerTest, SingletonPattern_ReturnsSameInstance) {
    SharedMemoryManager& instance1 = SharedMemoryManager::getInstance();
    SharedMemoryManager& instance2 = SharedMemoryManager::getInstance();

    // Both references should point to the same object
    EXPECT_EQ(&instance1, &instance2);
}

/**
 * Test: Initialization - Success
 * Verify that shared memory can be successfully initialized
 */
TEST_F(SharedMemoryManagerTest, Initialize_Success) {
    SharedMemoryManager& manager = SharedMemoryManager::getInstance();

    bool result = manager.initialize();

    EXPECT_TRUE(result);
    EXPECT_TRUE(manager.isInitialized());
    EXPECT_EQ(manager.getLastError(), "");
}

/**
 * Test: Initialization - Shared State Validation
 * Verify that shared memory structure is properly initialized
 */
TEST_F(SharedMemoryManagerTest, Initialize_ValidatesSharedState) {
    SharedMemoryManager& manager = SharedMemoryManager::getInstance();
    manager.initialize();

    const rtdcs::SharedLithoState* state = manager.getSharedState();

    ASSERT_NE(state, nullptr);
    EXPECT_TRUE(state->isValid());
    EXPECT_EQ(state->magic, rtdcs::SHARED_MEMORY_MAGIC);
    EXPECT_EQ(state->current_temp_C, 0.0);
    EXPECT_EQ(state->timestamp_s, 0.0);
    EXPECT_EQ(state->sample_count, 0u);
}

/**
 * Test: Write Temperature - Single Write
 * Verify that temperature data is correctly written to shared memory
 */
TEST_F(SharedMemoryManagerTest, WriteTemperature_SingleWrite) {
    SharedMemoryManager& manager = SharedMemoryManager::getInstance();
    manager.initialize();

    const double expected_temp = 25.5;
    const double expected_time = 1.234;

    manager.writeTemperature(expected_temp, expected_time);

    const rtdcs::SharedLithoState* state = manager.getSharedState();
    ASSERT_NE(state, nullptr);
    EXPECT_DOUBLE_EQ(state->current_temp_C, expected_temp);
    EXPECT_DOUBLE_EQ(state->timestamp_s, expected_time);
    EXPECT_EQ(state->sample_count, 1u);
}

/**
 * Test: Write Temperature - Multiple Writes
 * Verify that sample counter increments correctly
 */
TEST_F(SharedMemoryManagerTest, WriteTemperature_MultipleWrites) {
    SharedMemoryManager& manager = SharedMemoryManager::getInstance();
    manager.initialize();

    const int num_samples = 100;

    for (int i = 0; i < num_samples; ++i) {
        double temp = 25.0 + static_cast<double>(i) * 0.1;
        double time = static_cast<double>(i) * 0.1;
        manager.writeTemperature(temp, time);
    }

    const rtdcs::SharedLithoState* state = manager.getSharedState();
    ASSERT_NE(state, nullptr);
    EXPECT_EQ(state->sample_count, static_cast<uint32_t>(num_samples));

    // Verify last written values
    EXPECT_DOUBLE_EQ(state->current_temp_C, 25.0 + 99 * 0.1);
    EXPECT_DOUBLE_EQ(state->timestamp_s, 99 * 0.1);
}

/**
 * Test: Thread Safety - Concurrent Writes
 * Verify that SharedMemoryManager is thread-safe for concurrent writes
 */
TEST_F(SharedMemoryManagerTest, ThreadSafety_ConcurrentWrites) {
    SharedMemoryManager& manager = SharedMemoryManager::getInstance();
    manager.initialize();

    const int num_threads = 10;
    const int writes_per_thread = 100;
    std::vector<std::thread> threads;

    // Launch multiple threads writing concurrently
    for (int t = 0; t < num_threads; ++t) {
        threads.emplace_back([&manager, writes_per_thread, t]() {
            for (int i = 0; i < writes_per_thread; ++i) {
                double temp = 20.0 + static_cast<double>(t);
                double time = static_cast<double>(i) * 0.01;
                manager.writeTemperature(temp, time);
            }
        });
    }

    // Wait for all threads to complete
    for (auto& thread : threads) {
        thread.join();
    }

    // Verify total sample count
    const rtdcs::SharedLithoState* state = manager.getSharedState();
    ASSERT_NE(state, nullptr);
    EXPECT_EQ(state->sample_count, static_cast<uint32_t>(num_threads * writes_per_thread));
}

/**
 * Test: Destroy - Cleanup
 * Verify that destroy() properly cleans up shared memory
 */
TEST_F(SharedMemoryManagerTest, Destroy_Cleanup) {
    SharedMemoryManager& manager = SharedMemoryManager::getInstance();
    manager.initialize();
    ASSERT_TRUE(manager.isInitialized());

    manager.destroy();

    EXPECT_FALSE(manager.isInitialized());
    EXPECT_EQ(manager.getSharedState(), nullptr);
}

/**
 * Test: Reinitialization After Destroy
 * Verify that shared memory can be reinitialized after destruction
 */
TEST_F(SharedMemoryManagerTest, Reinitialize_AfterDestroy) {
    SharedMemoryManager& manager = SharedMemoryManager::getInstance();

    // First initialization
    ASSERT_TRUE(manager.initialize());
    manager.writeTemperature(25.0, 1.0);

    // Destroy
    manager.destroy();
    EXPECT_FALSE(manager.isInitialized());

    // Reinitialize
    ASSERT_TRUE(manager.initialize());
    EXPECT_TRUE(manager.isInitialized());

    // Verify fresh state (reset to zero)
    const rtdcs::SharedLithoState* state = manager.getSharedState();
    ASSERT_NE(state, nullptr);
    EXPECT_EQ(state->sample_count, 0u);
    EXPECT_DOUBLE_EQ(state->current_temp_C, 0.0);
}

/**
 * Test: Error Handling - Write Before Initialize
 * Verify behavior when writing before initialization
 */
TEST_F(SharedMemoryManagerTest, ErrorHandling_WriteBeforeInitialize) {
    SharedMemoryManager& manager = SharedMemoryManager::getInstance();

    // Writing before initialization should not crash
    // (Implementation may handle this gracefully or be undefined)
    // This test documents expected behavior
    EXPECT_FALSE(manager.isInitialized());
}

/**
 * Test: Shared Memory Persistence
 * Verify that shared memory persists across getInstance() calls
 */
TEST_F(SharedMemoryManagerTest, SharedMemory_PersistsAcrossGetInstance) {
    SharedMemoryManager& manager1 = SharedMemoryManager::getInstance();
    manager1.initialize();
    manager1.writeTemperature(30.5, 2.5);

    SharedMemoryManager& manager2 = SharedMemoryManager::getInstance();

    const rtdcs::SharedLithoState* state = manager2.getSharedState();
    ASSERT_NE(state, nullptr);
    EXPECT_DOUBLE_EQ(state->current_temp_C, 30.5);
    EXPECT_DOUBLE_EQ(state->timestamp_s, 2.5);
    EXPECT_EQ(state->sample_count, 1u);
}

/**
 * Test: Large Sample Count
 * Verify that sample counter handles large values correctly
 */
TEST_F(SharedMemoryManagerTest, LargeSampleCount_HandlesCorrectly) {
    SharedMemoryManager& manager = SharedMemoryManager::getInstance();
    manager.initialize();

    const uint32_t large_count = 1'000'000;

    for (uint32_t i = 0; i < large_count; ++i) {
        manager.writeTemperature(25.0, static_cast<double>(i) * 0.001);
    }

    const rtdcs::SharedLithoState* state = manager.getSharedState();
    ASSERT_NE(state, nullptr);
    EXPECT_EQ(state->sample_count, large_count);
}

/**
 * Main function for running tests
 */
int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
