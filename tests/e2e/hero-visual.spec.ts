import { test, expect } from '@playwright/test';

test.describe('Hero visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await expect(page.locator('.mask_hero')).toHaveScreenshot(`hero-${viewport.width}.png`, { maxDiffPixels: 50 });
    });
  }
});
