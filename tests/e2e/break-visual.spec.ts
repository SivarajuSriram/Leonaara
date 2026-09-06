import { test, expect, type Page } from '@playwright/test';

// Only one .mask_break section on the homepage.
//
// At desktop widths (>=1024px, the breakpoint SmoothScroll.tsx itself uses to
// decide whether to mount a smoother at all), GSAP ScrollSmoother owns the
// page's scroll and decouples it from native scroll position:
// `scrollIntoViewIfNeeded()` moves an ancestor's scrollTop directly, without
// going through the smoother, and the smoother immediately reverts that back
// to 0 -- confirmed via diagnostic: window.scrollY stayed exactly 0 the whole
// time, so by the time toHaveScreenshot() captures pixels the page is back at
// the top and the screenshot shows Hero's content (whatever's actually at
// scroll position 0) clipped to Break's bounding box, not Break's own
// content. Below 1024px SmoothScroll never creates a smoother at all, so
// plain `scrollIntoViewIfNeeded()` scrolls the real page and needs no special
// handling.
//
// Driving the smoother via simulated wheel events (as
// tests/e2e/smoothscroll-resize.spec.ts and tests/e2e/header-visual.spec.ts
// do) works for those specs because they only assert loose/boolean
// conditions (a CSS class, an opacity threshold, "did this transform
// change"), not exact pixel positions. Break needs the latter: it screenshots
// a section containing useParallax elements (.image-right runs at 1.5x
// speed), and ScrollSmoother's inertia (`smooth: 1.5` in SmoothScroll.tsx)
// settles at a slightly different sub-pixel resting position on every
// simulated-wheel run -- confirmed empirically (repeated runs of a
// wheel-driven version of this test failed intermittently with small,
// position-only diffs even once motion had genuinely and verifiably
// stopped). No amount of extra polling/waiting fixes that: the position is
// stable, just not reproducible. So this test instead jumps the smoother
// straight to an exact offset via its own scrollTo(target, smooth=false,
// position) API (lib/smoother.ts exposes the live instance on
// window.__scrollSmoother for exactly this, dev/test builds only) --
// eliminating the physics (and its run-to-run variance) entirely instead of
// trying to detect when it's "settled enough".
async function jumpToTop(page: Page, selector: string) {
  // SmoothScroll.tsx creates the ScrollSmoother in an effect that runs after
  // hydration, which can land after page.goto()'s load event -- wait for the
  // hook to actually exist before using it (a real readiness check, unlike
  // the physics-settle polling this replaces).
  await page.waitForFunction(() => !!window.__scrollSmoother);
  const jump = () => page.evaluate((sel) => {
    window.__scrollSmoother?.scrollTo(sel, false, 'top top');
  }, selector);
  await jump();
  // A late-decoding image/font can still shift layout after the jump above,
  // which would carry the section (and ScrollTrigger's own cached trigger
  // positions) out from under it -- jump again after a short settle to
  // correct for that, same margin the rest of this suite gives late content
  // (e.g. img-visual.spec.ts's flat 2s wait).
  await page.waitForTimeout(300);
  await jump();
  // Let GSAP's scroll-linked effects (useParallax, SplitWords' scrub) recompute
  // against the now-exact scroll position before the screenshot is taken.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

test.describe('Break visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const section = page.locator('.mask_break');
      if (viewport.width >= 1024) {
        await jumpToTop(page, '.mask_break');
      } else {
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(2000);
      }
      await expect(section).toHaveScreenshot(`break-${viewport.width}.png`, { maxDiffPixels: 50 });
    });
  }
});
