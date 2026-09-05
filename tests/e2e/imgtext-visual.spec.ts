import { test, expect } from '@playwright/test';

// Five .mask_imgtext sections share this component's CSS, so testing the first
// (originsText, right after Hero) covers the conversion for all of them.
test.describe('ImgText visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const section = page.locator('.mask_imgtext').first();
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      await expect(section).toHaveScreenshot(`imgtext-${viewport.width}.png`, { maxDiffPixels: 50 });
    });
  }
});
