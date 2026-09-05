import { test, expect } from '@playwright/test';

// `header` itself collapses to zero height (its only children, `.upper` and `.logo-wrapper`,
// are both position:fixed and so contribute nothing to its in-flow box) so it can't be used as
// a screenshot locator directly. `.logo-wrapper` is a fixed, full-width box tall enough to cover
// both the top bar (`.upper`'s menu button / request+book links) and the logo beneath it, so it
// doubles as "the closed header" region. When the mobile menu is open, `.menu-outline` covers the
// full viewport (an opaque drawer + backdrop), so it's used instead to capture the open drawer.
test.describe('Header visual regression', () => {
  test('1920x951 unscrolled', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 951 });
    await page.goto('/');
    await expect(page.locator('header .logo-wrapper')).toHaveScreenshot('header-1920-unscrolled.png', { maxDiffPixels: 50 });
  });

  test('1920x951 scrolled', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 951 });
    await page.goto('/');
    // ScrollSmoother scrolls #smooth-content, so the placeholder page needs height there, not on body
    // (same setup as header.spec.ts's scroll test). Two wheel events are needed: useScrolledBody only
    // adds `scrolled` once it has seen a prior non-zero scrollY to compare against.
    await page.evaluate(() => { (document.querySelector('#smooth-content') as HTMLElement).style.minHeight = '6000px'; });
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(200);
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(600);
    await expect(page.locator('body')).toHaveClass(/scrolled/);
    await expect(page.locator('header .logo-wrapper')).toHaveScreenshot('header-1920-scrolled.png', { maxDiffPixels: 50 });
  });

  test('1440x900', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('header .logo-wrapper')).toHaveScreenshot('header-1440.png', { maxDiffPixels: 50 });
  });

  test('390x844 menu closed', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('header .logo-wrapper')).toHaveScreenshot('header-390-closed.png', { maxDiffPixels: 50 });
  });

  test('390x844 menu open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.click('header .menu-button');
    await page.waitForTimeout(1700);
    await expect(page.locator('header .menu-outline')).toHaveScreenshot('header-390-open.png', { maxDiffPixels: 50 });
  });
});
