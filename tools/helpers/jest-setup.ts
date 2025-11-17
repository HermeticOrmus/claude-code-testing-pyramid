/**
 * Jest Setup File
 * Runs before each test suite
 */

// Extend Jest matchers if needed
// import '@testing-library/jest-dom';

// Set longer timeout for integration tests
jest.setTimeout(10000);

// Global test utilities
global.console = {
  ...console,
  // Suppress console.log in tests unless explicitly needed
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: console.warn,
  error: console.error,
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
