import { test, expect, type Page, type Locator } from '@playwright/test';

// Regression guard for spec §16.6 / plan Task 16 (SmoothScroll/ScrollTrigger
// orphan bug). The plan's hypothesis: useParallax's one-shot onSmoother()
// subscription leaves smoother.effects() targets registered against a dead
// ScrollSmoother instance after SmoothScroll.tsx's resize-driven kill()/
// create() cycle at the 1024px breakpoint, and SplitWords'/Logo's own plain
// ScrollTriggers might go stale the same way.
//
// Investigation (see task-16-report.md) found the described freeze does not
// actually reproduce against this codebase: (1) smoother.effects() tags its
// target with a `data-speed` DOM attribute, and every ScrollSmoother.create()
// call (SmoothScroll always passes `effects: true`) auto-rescans
// `[data-speed]` elements and re-registers them independent of onSmoother --
// confirmed by reading node_modules/gsap/ScrollSmoother.js directly; (2)
// SplitWords'/Logo's plain ScrollTriggers are created in child components
// whose effects run (React's bottom-up mount order) before SmoothScroll's own
// effect creates the smoother and sets ScrollTrigger.defaults({scroller}), so
// they always use `window` as their scroller -- confirmed empirically via a
// temporary diagnostic log reading ScrollTrigger.getAll()[].scroller. Verified
// across single/triple resize cycles, mid-scrub positions, and a resize fired
// mid-wheel-scroll (race condition), with no console errors.
//
// onSmoother's one-shot design was still a real, confirmed (not hypothesized)
// contract defect -- fixed in lib/smoother.ts (now a persistent subscription)
// and components/ui/useParallax.ts (re-registers, clearing the previous
// registration, on every firing). These tests guard the observable behaviour
// that fix must not regress.
//
// Uses real wheel-driven scroll, not `scrollIntoViewIfNeeded()`: this
// project's ScrollSmoother decouples native scroll position from the visible
// viewport, and `scrollIntoViewIfNeeded()` moves an ancestor's `scrollTop`
// directly without going through the smoother at all (confirmed via
// diagnostic: window.scrollY stayed 0 and the scrub tween never updated after
// calling it) -- a real mouse wheel is the only reliable way to drive the
// smoother's virtual scroll position from Playwright here.

async function wheelBy(page: Page, dy: number, steps = 10) {
  await page.mouse.move(960, 475);
  const per = dy / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, per);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(600); // let ScrollSmoother's inertia settle
}

async function crossBreakpointRoundTrip(page: Page) {
  await page.setViewportSize({ width: 800, height: 951 }); // below 1024: SmoothScroll kills its instance
  await page.waitForTimeout(300); // SmoothScroll's resize handler is debounced 150ms
  await page.setViewportSize({ width: 1920, height: 951 }); // back above 1024: a NEW instance is created
  await page.waitForTimeout(300);
}

function wordOpacities(heading: Locator) {
  return heading.evaluate((el) => {
    const words = Array.from(el.children).filter((c) => c.getAttribute('aria-hidden') === 'true');
    return words.map((w) => Number(getComputedStyle(w).opacity));
  });
}

test.describe('SmoothScroll survives resizing across the 1024px breakpoint', () => {
  test('a scroll-linked heading reveal reaches full opacity after the resize round-trip', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 951 });
    await page.goto('/');
    await page.waitForTimeout(500);

    const heading = page.locator('.mask_imgtext .title').first();

    // Scroll the heading fully past its trigger's "end" (bottom 50%) so the
    // scrub tween has run to completion -- every word should be fully revealed.
    await wheelBy(page, 3000);
    const before = await wordOpacities(heading);
    for (const o of before) expect(o).toBeGreaterThan(0.9);

    await crossBreakpointRoundTrip(page);

    // Scroll back up to the same heading via wheel (not scrollIntoViewIfNeeded)
    // and confirm the reveal still completes -- a genuinely orphaned
    // ScrollTrigger would leave the words stuck at the tween's "from" state
    // (autoAlpha 0.2, per SplitWords.tsx) regardless of scroll position.
    await wheelBy(page, -6000);
    await wheelBy(page, 3000);
    const after = await wordOpacities(heading);
    for (const o of after) expect(o).toBeGreaterThan(0.9);
  });

  test('picture parallax keeps tracking scroll position after the resize round-trip', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 951 });
    await page.goto('/');
    await page.waitForTimeout(500);

    const picture = page.locator('.mask_imgtext .image-left picture').first();
    const readTransform = () => picture.evaluate((el) => getComputedStyle(el).transform);

    await wheelBy(page, 1500);
    const t1 = await readTransform();
    await wheelBy(page, 500);
    const t2 = await readTransform();
    // Sanity check the effect is live at all before resizing (it needs to be
    // driven by scroll, not a fixed value, for the rest of the test to mean anything).
    expect(t1).not.toBe(t2);

    await crossBreakpointRoundTrip(page);

    // useParallax's smoother.effects() target must still respond to scroll on
    // the NEW ScrollSmoother instance -- a stale/orphaned trigger would leave
    // this transform frozen no matter how far the page scrolls afterward.
    const t3 = await readTransform();
    await wheelBy(page, 500);
    const t4 = await readTransform();
    expect(t3).not.toBe(t4);
  });
});
