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
    //
    // Screenshotting `page` clipped to the ARROW's own bounding box (not the
    // whole `section` locator, and not the section's bounding box) is
    // deliberate, for two separate reasons:
    //
    // 1. expect(locator).toHaveScreenshot() re-runs its own actionability/
    //    visibility scroll on the locator immediately before capturing pixels.
    //    At 390px the section is taller than the viewport, so that internal
    //    re-scroll moved the page under the stationary OS-level cursor, firing
    //    a native mouseleave on `.navigation .next` and reversing the .5s
    //    opacity transition before the screenshot was actually taken —
    //    silently producing a "hover" baseline identical to the non-hover one.
    //    page.screenshot() performs no such re-scroll, so the hover state
    //    survives into the capture at every breakpoint.
    // 2. Clipping to the whole SECTION's bounding box (tried first) traded
    //    that bug for a flaky one: the section is taller than the viewport at
    //    every breakpoint tested here, so page.screenshot() (no fullPage)
    //    clamps the clip to whatever of it is currently on-screen — and how
    //    much that is depends on exactly where scrollIntoViewIfNeeded()
    //    settles for an oversized element, which was NOT stable run to run
    //    (observed 900px vs 492px tall captures for the same 1440 viewport,
    //    apparently due to unrelated layout/image-loading timing elsewhere on
    //    the page affecting total document height, and thus how far the
    //    browser could scroll, at the moment of the call).
    // 3. Padding the arrow's own bounding box (tried second) fixed (2) but
    //    reintroduced size instability at the clip-edge level: if the arrow
    //    itself happened to land close to the top/bottom of the viewport
    //    (still "fully visible" enough for hover()'s actionability check to
    //    pass), the padded clip got edge-clamped on some runs but not others,
    //    again changing the captured image's pixel dimensions.
    // The fix for all three: explicitly scroll the arrow to the vertical
    // CENTER of the viewport before hovering. That guarantees (a) hover()'s
    // own actionability scroll afterward is a no-op — the arrow is already
    // fully visible, so nothing moves under the stationary cursor — and
    // (b) the arrow sits far enough from every edge that the padded clip
    // below never gets edge-clamped, making the captured image size stable
    // run to run.
    test(`next arrow hover state matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const section = page.locator('.mask_roomslider');
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      const nextArrow = section.locator('.navigation .next');
      await nextArrow.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center' }));
      await nextArrow.hover();
      const arrowBox = await nextArrow.boundingBox();
      if (!arrowBox) throw new Error('.navigation .next has no bounding box to clip the screenshot to');
      const pad = 20;
      const x0 = Math.max(0, arrowBox.x - pad);
      const y0 = Math.max(0, arrowBox.y - pad);
      const x1 = Math.min(viewport.width, arrowBox.x + arrowBox.width + pad);
      const y1 = Math.min(viewport.height, arrowBox.y + arrowBox.height + pad);
      await expect(page).toHaveScreenshot(`roomslider-${viewport.width}-hover.png`, {
        clip: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 },
        maxDiffPixels: 50,
      });
    });
  }
});
