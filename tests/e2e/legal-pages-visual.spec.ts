import { test, expect, type Page } from '@playwright/test';

// These pages are plain typography with no scroll-linked animation, but they
// still render inside SmoothScroll's wrapper at desktop widths, and some (privacy
// especially, at ~20,000 characters of legal text) are far taller than any
// viewport -- the same stitching-under-ScrollSmoother hazard as img-visual.spec.ts,
// just for the whole page instead of one section. Same fix: grow the viewport's
// height to fit the whole `main` before capturing, then reposition deterministically.
async function jumpToTop(page: Page) {
  await page.waitForFunction(() => !!window.__scrollSmoother);
  const jump = () => page.evaluate(() => window.__scrollSmoother?.scrollTo('main', false, 'top top'));
  await jump();
  await page.waitForTimeout(300);
  await jump();
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

const routes = [
  { path: '/imprint/', name: 'imprint' },
  { path: '/privacy/', name: 'privacy' },
  { path: '/cookies/', name: 'cookies' },
];
const viewports = [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }];

test.describe('legal pages visual regression', () => {
  for (const { path, name } of routes) {
    for (const viewport of viewports) {
      test(`${name} matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        const main = page.locator('main');
        const height = await main.evaluate((el) => el.getBoundingClientRect().height);
        if (height > viewport.height) {
          await page.setViewportSize({ width: viewport.width, height: Math.ceil(height) + 100 });
          await page.waitForTimeout(200); // SmoothScroll's resize handler is debounced 150ms
        }
        if (viewport.width >= 1024) {
          await jumpToTop(page);
        } else {
          await main.scrollIntoViewIfNeeded();
        }
        await page.waitForTimeout(500);
        await expect(main).toHaveScreenshot(`${name}-${viewport.width}.png`, { maxDiffPixels: 50 });
      });
    }
  }
});
