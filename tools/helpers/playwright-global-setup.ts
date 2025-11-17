/**
 * Playwright Global Setup
 * Runs once before all Playwright tests
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🎭 Setting up Playwright test environment...');

  // You can start a dev server here if needed
  // Or perform authentication that can be reused across tests

  // Example: Pre-authenticate and save state
  // const browser = await chromium.launch();
  // const page = await browser.newPage();
  // await page.goto('http://localhost:3000/login');
  // await page.fill('input[name="username"]', 'test-user');
  // await page.fill('input[name="password"]', 'test-password');
  // await page.click('button[type="submit"]');
  // await page.context().storageState({ path: 'auth-state.json' });
  // await browser.close();

  console.log('✅ Playwright environment ready');
}

export default globalSetup;
