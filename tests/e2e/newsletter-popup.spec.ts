import { test, expect } from '@playwright/test';

// The popup fires ~5s after the page is interactive, then runs its own
// 0.3s/0.5s open animation (see docs/reference/popup/REPORT.md) -- so
// `toBeVisible()` here polls rather than using a single fixed wait, which
// would be fragile under CPU contention (see this project's known flakiness
// with parallel Playwright workers).

test('popup opens after ~5s, closes only via the X button, and the dismissal persists', async ({ page, context }) => {
  await context.clearCookies();
  await page.goto('/');

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeHidden();
  await expect(dialog).toBeVisible({ timeout: 8000 });

  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible(); // Esc does nothing, per the capture

  await page.mouse.click(10, 10); // backdrop, far from the card
  await expect(dialog).toBeVisible(); // backdrop click does nothing either

  await page.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();

  await page.reload();
  await page.waitForTimeout(7000); // long enough for the 5s trigger to have fired, if it were going to
  await expect(dialog).toBeHidden(); // dismissal cookie persists across reload
});

test('step 1 submits to step 2 with the email carried over, and step 2 requires consent', async ({ page, context }) => {
  await context.clearCookies();
  await page.goto('/');

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible({ timeout: 8000 });

  await dialog.getByLabel('Email').fill('popup-capture-test@example.com');
  await dialog.getByRole('button', { name: /claim your €150 welcome gift/i }).click();

  await expect(dialog.getByText('Step 2 of 2')).toBeVisible();
  await expect(dialog.getByLabel('Email')).toHaveValue('popup-capture-test@example.com');

  await dialog.getByRole('button', { name: /claim your €150 welcome gift/i }).click();
  await expect(dialog.getByText('The privacy policy must be accepted')).toBeVisible();

  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
});
