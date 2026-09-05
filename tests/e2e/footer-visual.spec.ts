import { test, expect } from '@playwright/test';

// The footer sits below the fold, and at desktop widths (>=1024px) scrolling is
// driven by GSAP ScrollSmoother (a transform on #smooth-content, not native
// scrollTop) — same setup tests/e2e/footer-logo.spec.ts already relies on.
// window.scrollTo still drives it, it just needs a moment to settle before the
// screenshot, hence the wait.
async function scrollToFooter(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(2000);
}

test.describe('Footer visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await scrollToFooter(page);
      await expect(page.locator('footer')).toHaveScreenshot(`footer-${viewport.width}.png`, { maxDiffPixels: 50 });
    });
  }
});
