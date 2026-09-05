import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  retries: 0,
  // The newsletter popup (components/layout/NewsletterPopup.tsx) opens 5s into
  // every page load unless its dismissal cookie is already set -- left
  // unsuppressed, it was popping open mid-test across the whole suite (a
  // credible chunk of this project's "CPU contention" flakiness). Every test
  // context starts with that cookie pre-set via this storageState fixture, so
  // the popup stays closed by default; newsletter-popup.spec.ts's own
  // `context.clearCookies()` removes it like any other cookie, letting that
  // spec exercise the popup normally.
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1920, height: 951 },
    storageState: 'tests/e2e/fixtures/popup-dismissed.storageState.json',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
