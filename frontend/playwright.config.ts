import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 30000,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'motors',
      testMatch: /(01_auth_gates|02_motors_journey|04_shared_features|05_dealer_vault_and_ledger|07_ai_concierge)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.MOTORS_URL || 'https://bkmotors.169-58-102-217.sslip.io',
      },
    },
    {
      name: 'properties',
      testMatch: /(01_auth_gates|03_properties_journey|04_shared_features|05_dealer_vault_and_ledger|07_ai_concierge)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.PROPERTIES_URL || 'https://bkproperties.169-58-102-217.sslip.io',
      },
    },
    {
      name: 'apis',
      testMatch: /06_ai_api\.spec\.ts/,
      use: {
        baseURL: process.env.AI_SERVICE_URL || 'https://bkai.169-58-102-217.sslip.io',
      },
    },
  ],
});
