/** @type {import('jest').Config} */
module.exports = {
  displayName: 'integration',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/examples/integration'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    }]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/tools/helpers/jest-setup.ts'],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  maxWorkers: 1, // Run integration tests serially to avoid conflicts
  testTimeout: 60000, // 60 seconds for integration tests
  verbose: true,
  globalSetup: '<rootDir>/tools/helpers/integration-setup.ts',
  globalTeardown: '<rootDir>/tools/helpers/integration-teardown.ts'
};
