import { test, expect } from '@playwright/test';

// The 404 page's .loadingBar fills via a 5s CSS animation (1s delay, then 5s to
// full width — see app/not-found.tsx), and the whole page redirects home 6s
// after mount. Masking .loadingBar sidesteps both: the screenshot is stable
// regardless of exactly how many milliseconds elapsed between goto() and
// capture (no need to race the animation or freeze the clock), and the test
// never needs to wait anywhere near the 6s redirect.
test.describe('404 page visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/does-not-exist/');
      const section = page.locator('.mask_errorpage');
      await expect(section).toHaveScreenshot(`notfound-${viewport.width}.png`, {
        mask: [page.locator('.loadingBar')],
        maxDiffPixels: 50,
      });
    });
  }
});
