import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    env: {
      GITHUB_USER: 'test-user',
      GITHUB_ACCESS_TOKEN: 'mock-token'
    },
    specPattern: './cypress/e2e/*.{js,jsx,ts,tsx}',
    supportFile: false,  // No support files
    viewportWidth: 1600,
    viewportHeight: 1000,
    experimentalStudio: true,
  },
});