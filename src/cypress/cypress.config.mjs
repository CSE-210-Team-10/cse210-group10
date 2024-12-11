import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    /**
     *
     * @param on
     * @param config
     */
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      GITHUB_USER: 'test-user',
      GITHUB_ACCESS_TOKEN: 'mock-token'
    },
    specPattern: '../cypress/e2e/*.{js,jsx,ts,tsx}',
    supportFile: false,  // No support files
    viewportWidth: 1280,
    viewportHeight: 720,
    experimentalStudio: true,
  },
});