import { defineConfig, devices } from '@playwright/test';
import { ENV } from './src/config/environment';
import * as path from 'path';

export const STORAGE_STATE = path.resolve(__dirname, 'state.json');

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 45000,

  use: {
    baseURL: ENV.BASE_URL,
    actionTimeout: 15000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
    permissions: ['geolocation'],
    geolocation: { latitude: 32.7767, longitude: -96.7970 },
  },

  projects: [
    // 1. Setup project that runs ONLY ONCE at the beginning
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // 2. Main testing project using the saved state
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
  ],
});