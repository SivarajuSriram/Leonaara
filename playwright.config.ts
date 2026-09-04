import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  retries: 0,
  use: { baseURL: 'http://localhost:3000', viewport: { width: 1920, height: 951 } },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000/en/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
