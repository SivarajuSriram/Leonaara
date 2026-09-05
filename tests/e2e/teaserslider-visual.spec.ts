import { test, expect } from '@playwright/test';

// Only one .mask_teaserslider section on the homepage.
test.describe('TeaserSlider visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const section = page.locator('.mask_teaserslider');
      await section.scrollIntoViewIfNeeded();
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
