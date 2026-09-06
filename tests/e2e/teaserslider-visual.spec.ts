import { test, expect, type Page } from '@playwright/test';

// This section is taller than the viewport at 1920 (confirmed live: ~1196px
// at 1920x951); it fits at 1440x900 (~897px), so no growth is needed there.
// expect(locator).toHaveScreenshot() internally scrolls-and-stitches multiple
// captures to build a full image of a locator taller than the viewport -- and
// that internal scroll ALSO fails under this site's virtualized GSAP
// ScrollSmoother (same underlying conflict as break-visual.spec.ts's
// scrollIntoViewIfNeeded() bug, different Playwright trigger), corrupting the
// bottom band of the resulting image. Fix: grow the viewport's HEIGHT (never
// width -- width drives the responsive breakpoints under test, height gates
// no CSS here) to comfortably fit the whole section before capturing, so
// Playwright never needs to stitch at all, then reposition deterministically
// via ScrollSmoother's own scrollTo() exactly as break-visual does (see its
// file for the full rationale on why wheel events/scrollIntoViewIfNeeded()
// are unreliable here).
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

// Only one .mask_teaserslider section on the homepage.
test.describe('TeaserSlider visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const section = page.locator('.mask_teaserslider');
      if (viewport.width >= 1024) {
        const height = await section.evaluate((el) => el.getBoundingClientRect().height);
        if (height > viewport.height) {
          await page.setViewportSize({ width: viewport.width, height: Math.ceil(height) + 100 });
          await page.waitForTimeout(200); // SmoothScroll's resize handler is debounced 150ms
        }
        await jumpTo(page, '.mask_teaserslider');
      } else {
        await section.scrollIntoViewIfNeeded();
      }
      await page.waitForTimeout(2000);
      await expect(section).toHaveScreenshot(`teaserslider-${viewport.width}.png`, { maxDiffPixels: 50 });
    });

    // A static screenshot won't catch a hover-only rule (.navigation>div:not(.spacer)
    // :hover / .navigation .next:hover,.navigation .prev:hover{opacity:.4}), so
    // capture a second snapshot per breakpoint with the mouse held over the next
    // arrow. This component only renders .navigation when there's more than one
    // slide (see the `multi` check in TeaserSlider.tsx) — the homepage's real
    // teaserSlider content (content/en/home.ts) has exactly one slide, so
    // .navigation never renders on the live page. Skip with a clear reason
    // instead of silently reporting green: the hover rule itself uses the exact
    // same value/technique (hover:opacity-40) as RoomSlider's, which IS covered
    // for real by roomslider-visual.spec.ts (4 rooms there, navigation renders).
    test(`next arrow hover state matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const section = page.locator('.mask_teaserslider');
      await section.scrollIntoViewIfNeeded();
      const nextArrow = section.locator('.navigation .next');
      if ((await nextArrow.count()) === 0) {
        test.skip(true, 'homepage teaserSlider content has only one slide, so .navigation never renders — see roomslider-visual.spec.ts for the equivalent hover:opacity-40 coverage');
        return;
      }
      await page.waitForTimeout(2000);
      await nextArrow.hover();
      await expect(section).toHaveScreenshot(`teaserslider-${viewport.width}-hover.png`, { maxDiffPixels: 50 });
    });
  }
});
