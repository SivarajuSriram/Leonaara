import { test, expect } from '@playwright/test';

test('gallery resolves and renders all 34 images', async ({ page }) => {
  await page.goto('/gallery/');
  await expect(page).toHaveTitle(/eriro/);
  await expect(page.locator('main .mask_Gallery picture')).toHaveCount(34);
});
