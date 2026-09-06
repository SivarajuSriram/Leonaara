import { test, expect } from '@playwright/test';

test.use({
  storageState: {
    cookies: [{
      name: 'eriro_popup_dismissed', value: '1', domain: 'localhost', path: '/',
      expires: 4102444800, httpOnly: false, secure: false, sameSite: 'Lax',
    }],
    origins: [],
  },
});

// vanilla-cookieconsent's `run()` defaults `hideFromBots: true`, which checks
// `navigator.webdriver` and silently no-ops (no modal, no error) when it's
// true -- which it is by default in every Playwright-controlled browser,
// headless or not (verified directly against this project's dev server: with
// this line removed, `document.getElementById('cc-main')` stays null and none
// of this spec's buttons ever appear). Spoofing the flag back to `false` only
// affects this spec's own browser context, not the CookieConsentBanner
// component or any other test file, and has no effect on real visitors.
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
});

test('banner shows on first visit and Accept all persists the choice', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Accept all' })).toBeVisible();
  await page.getByRole('button', { name: 'Accept all' }).click();
  await expect(page.getByRole('button', { name: 'Accept all' })).toBeHidden();
  const cookies = await context.cookies();
  expect(cookies.some((c) => c.name === 'cc_cookie')).toBe(true);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Accept all' })).not.toBeVisible();
});

test('Reject all closes the banner and still sets the cookie', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Reject all' }).click();
  await expect(page.getByRole('button', { name: 'Reject all' })).toBeHidden();
  const cookies = await context.cookies();
  expect(cookies.some((c) => c.name === 'cc_cookie')).toBe(true);
});

test('Manage preferences opens the preferences modal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Manage preferences' }).click();
  await expect(page.getByText('Consent Preferences Center')).toBeVisible();
});

test('the cookies page settings button opens the preferences modal directly', async ({ page }) => {
  await page.goto('/cookies/');
  await page.getByRole('button', { name: 'Accept all' }).click(); // dismiss the initial modal first
  await page.getByRole('button', { name: 'Cookies settings' }).click();
  await expect(page.getByText('Consent Preferences Center')).toBeVisible();
});
