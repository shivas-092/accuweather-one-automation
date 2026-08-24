import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,

  workers: 1,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  timeout: 60000,

  expect: {
    timeout: 10000,
  },

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: 'https://www.accuweather.com',

    navigationTimeout: 30000,

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    viewport: {
      width: 1280,
      height: 720,
    },

    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },

    launchOptions: {
      args: [
        '--disable-http2',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    },
  },

  projects: [
    {
      name: 'setup',

      testMatch: /.*\.setup\.ts/,
    },

    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome'],

        storageState: 'state.json',
      },

      dependencies: ['setup'],
    },
  ],
});