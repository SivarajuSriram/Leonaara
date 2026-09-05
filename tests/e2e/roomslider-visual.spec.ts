import { test, expect } from '@playwright/test';

// Only one .mask_roomslider section on the homepage.
test.describe('RoomSlider visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const section = page.locator('.mask_roomslider');
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      await expect(section).toHaveScreenshot(`roomslider-${viewport.width}.png`, { maxDiffPixels: 50 });
    });

    // A static screenshot won't catch a hover-only rule (.navigation .next:hover,
    // .navigation .prev:hover{opacity:.4}), so capture a second snapshot per
    // breakpoint with the mouse held over the next arrow.
    test(`next arrow hover state matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const section = page.locator('.mask_roomslider');
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      await section.locator('.navigation .next').hover();
      await expect(section).toHaveScreenshot(`roomslider-${viewport.width}-hover.png`, { maxDiffPixels: 50 });
    });
  }
});
