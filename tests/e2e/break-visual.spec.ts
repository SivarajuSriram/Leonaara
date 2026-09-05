import { test, expect } from '@playwright/test';

// Only one .mask_break section on the homepage.
test.describe('Break visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const section = page.locator('.mask_break');
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      await expect(section).toHaveScreenshot(`break-${viewport.width}.png`, { maxDiffPixels: 50 });
    });
  }
});
