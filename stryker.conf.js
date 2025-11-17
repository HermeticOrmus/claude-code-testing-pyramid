/** @type {import('@stryker-mutator/core').PartialStrykerOptions} */
module.exports = {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress', 'dashboard'],
  testRunner: 'jest',
  coverageAnalysis: 'perTest',
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.js',
    enableFindRelatedTests: true
  },
  mutate: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts'
  ],
  thresholds: {
    high: 80,
    low: 60,
    break: 50
  },
  timeoutMS: 60000,
  timeoutFactor: 2,
  maxConcurrentTestRunners: 2,
  concurrency: 4,
  plugins: [
    '@stryker-mutator/jest-runner',
    '@stryker-mutator/typescript-checker'
  ],
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.json'
};
