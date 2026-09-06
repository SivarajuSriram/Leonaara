import { test, expect, type Page } from '@playwright/test';

// Three .mask_img sections share this component's CSS, so testing the first
// (spaImage) covers the conversion for all of them.
//
// This section is taller than the viewport at 1920/1440 (confirmed live:
// ~1270px at 1920x951, ~952px at 1440x900). expect(locator).toHaveScreenshot()
// internally scrolls-and-stitches multiple captures to build a full image of
// a locator taller than the viewport -- and that internal scroll ALSO fails
// under this site's virtualized GSAP ScrollSmoother (same underlying conflict
// as break-visual.spec.ts's scrollIntoViewIfNeeded() bug, different Playwright
// trigger), corrupting the bottom band of the resulting image. Fix: grow the
// viewport's HEIGHT (never width -- width drives the responsive breakpoints
// under test, height gates no CSS here) to comfortably fit the whole section
// before capturing, so Playwright never needs to stitch at all, then
// reposition deterministically via ScrollSmoother's own scrollTo() exactly as
// break-visual does (see its file for the full rationale on why wheel events/
// scrollIntoViewIfNeeded() are unreliable here).
async function jumpTo(page: Page, selector: string) {
  await page.waitForFunction(() => !!window.__scrollSmoother);
  const jump = () => page.evaluate((sel) => {
    window.__scrollSmoother?.scrollTo(sel, false, 'top top');
  }, selector);
  await jump();
  // A late-decoding image/font can still shift layout after the jump above --
  // jump again after a short settle to correct for that.
  await page.waitForTimeout(300);
  await jump();
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

test.describe('Img visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const section = page.locator('.mask_img').first();
      if (viewport.width >= 1024) {
        const height = await section.evaluate((el) => el.getBoundingClientRect().height);
        if (height > viewport.height) {
          await page.setViewportSize({ width: viewport.width, height: Math.ceil(height) + 100 });
          await page.waitForTimeout(200); // SmoothScroll's resize handler is debounced 150ms
        }
        await jumpTo(page, '.mask_img');
      } else {
        await section.scrollIntoViewIfNeeded();
      }
      await page.waitForTimeout(2000);
      await expect(section).toHaveScreenshot(`img-${viewport.width}.png`, { maxDiffPixels: 50 });
    });
  }
});
