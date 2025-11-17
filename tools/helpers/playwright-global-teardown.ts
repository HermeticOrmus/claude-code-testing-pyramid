/**
 * Playwright Global Teardown
 * Runs once after all Playwright tests complete
 */

import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up Playwright test environment...');

  // Clean up any resources created during global setup
  // Stop servers, close connections, etc.

  console.log('✅ Playwright cleanup complete');
}

export default globalTeardown;
