/**
 * Global teardown for integration tests
 * Runs once after all integration tests complete
 */

export default async function globalTeardown() {
  console.log('🧹 Cleaning up integration test environment...');

  // Stop Docker containers
  // Close database connections
  // Clean up test data

  delete process.env.INTEGRATION_TEST_MODE;

  console.log('✅ Integration test cleanup complete');
}
