import { devices } from '@playwright/test';

const config = {
  testDir: './',
  outputDir: 'test-results',
  testMatch: /.*\.spec\.js/,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
};

export default config;
