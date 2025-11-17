import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'examples/e2e/cypress/**/*.cy.ts',
    supportFile: 'tools/helpers/cypress-support.ts',

    // Viewport
    viewportWidth: 1280,
    viewportHeight: 720,

    // Video and screenshots
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    screenshotOnRunFailure: true,

    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,

    // Retries
    retries: {
      runMode: 2,
      openMode: 0
    },

    // Test isolation
    testIsolation: true,

    setupNodeEvents(on, config) {
      // Implement node event listeners here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      return config;
    }
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    },
    specPattern: 'src/**/*.cy.tsx'
  },

  env: {
    // Environment variables for tests
    apiUrl: 'http://localhost:3000/api'
  }
});
