import { test, expect } from '@playwright/test';

// Three .mask_img sections share this component's CSS, so testing the first
// (spaImage) covers the conversion for all of them.
test.describe('Img visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const section = page.locator('.mask_img').first();
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      await expect(section).toHaveScreenshot(`img-${viewport.width}.png`, { maxDiffPixels: 50 });
    });
  }
});
