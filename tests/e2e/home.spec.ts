import { test, expect } from '@playwright/test';

test('homepage renders all 15 sections with the original text', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('eriro - Experience alpine originality');
  const masks = page.locator('main .mask');
  await expect(masks).toHaveCount(15);
  // Phase 1b (spec §16.4): Hero's Tailwind conversion dropped the `.titleh2`
  // class name in favor of inline utility strings; `.mask_hero` has exactly one h2.
  await expect(page.locator('.mask_hero h2')).toContainText('Rooted');
  await expect(page.locator('.mask_quote .quote')).toHaveText('eriro – One of the "World’s Greatest Places 2025"');
  await expect(page.locator('.mask_break h2.title')).toContainText('Experience');
  await expect(page.locator('.mask_partnermarquee h2.title')).toHaveText('Recommended by');
  await expect(page.locator('footer .unikateur-signet span')).toHaveText('unique hospitality concepts, by ');
  await expect(page.locator('body')).toHaveClass(/pid-1/);
  await expect(page.locator('#smooth-wrapper #smooth-content main')).toBeVisible();
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(total).toBeGreaterThan(18000); // original: 19667px at 1920×951
  expect(total).toBeLessThan(21000);
});

test('unknown routes show the error page', async ({ page }) => {
  await page.goto('/does-not-exist/');
  await expect(page.locator('.mask_errorpage .errorTitle')).toHaveText('something went wrong');
});
