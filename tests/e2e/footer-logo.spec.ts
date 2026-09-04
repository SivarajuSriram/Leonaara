import { test, expect } from '@playwright/test';

// Task 16: clicking a link back to the page you're already on (footer logo →
// home) must jump straight to the top — instantly, no tween — instead of
// pushing a no-op history entry. The site no longer has a page-fade
// transition at all (removed per user request), so this also guards against
// any regression that would hide the page body. Covers both the desktop
// (ScrollSmoother) and mobile (native scroll) paths.

async function scrollToBottomAndClickLogo(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(2000);
  // A coordinate-based .click() can land on the wrong element here: right
  // after a raw window.scrollTo jump, ScrollSmoother's own visual transform
  // (which is what actually moves #smooth-content on screen) hasn't caught
  // up yet, so Playwright's bounding-box math briefly disagrees with what's
  // rendered and the click can miss the logo entirely, hitting <footer>
  // instead. dispatchEvent bypasses geometry and fires straight on the
  // element, which is what a real, on-target mouse click would also do.
  await page.locator('footer .link-logo').dispatchEvent('click');
}

// Reads scrollY on the next animation frame after the click (rather than
// polling with a wait) so a lingering tween — the very thing this test
// guards against — would show up as a nonzero value here, not just "slow".
function scrollYNextFrame(page: import('@playwright/test').Page) {
  return page.evaluate(
    () => new Promise<number>((resolve) => requestAnimationFrame(() => resolve(window.scrollY))),
  );
}

async function expectPageFullyVisible(page: import('@playwright/test').Page) {
  const masks = page.locator('main .mask');
  const first = masks.first();
  const last = masks.last();
  await expect(first).toHaveCSS('opacity', '1');
  await expect(last).toHaveCSS('opacity', '1');
  const filters = await masks.evaluateAll((els) => els.map((el) => getComputedStyle(el).filter));
  for (const filter of filters) expect(filter).not.toContain('blur');
}

test('footer logo jumps to the top instantly instead of navigating (desktop, ScrollSmoother)', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 951 });
  await scrollToBottomAndClickLogo(page);

  expect(await scrollYNextFrame(page)).toBe(0);
  expect(page.url()).toContain('/');
  await expectPageFullyVisible(page);
});

test('footer logo jumps to the top instantly instead of navigating (mobile, no smoother)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await scrollToBottomAndClickLogo(page);

  expect(await scrollYNextFrame(page)).toBe(0);
  expect(page.url()).toContain('/');
  await expectPageFullyVisible(page);
});
