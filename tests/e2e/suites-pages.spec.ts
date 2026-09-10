import { test, expect } from '@playwright/test';

const suites = ['boum', 'wisa', 'felisa', 'himil'];
for (const name of suites) {
  test(`/suites/${name}/ renders with itself active and its own roomdetail`, async ({ page }) => {
    await page.goto(`/suites/${name}/`);
    const active = page.locator('.mask_rooms .filter-item.active');
    await expect(active).toHaveCount(1);
    await expect(active).toHaveText(new RegExp(name, 'i'));
    await expect(page.locator('main .mask_roomdetail h1')).toHaveText(new RegExp(name, 'i'));
    await expect(page.locator('main .mask_roomcta')).toBeVisible();
  });
}

test('clicking a different suite in the filter swaps the whole roomdetail/imgslider/list/img/roomcta/teaserslider block', async ({ page }) => {
  await page.goto('/suites/boum/');
  // FilterShell's click handler is wired up in an effect that runs after
  // hydration, which can land after page.goto()'s load event (same class of
  // race as tests/e2e/break-visual.spec.ts's jumpToTop): wait for
  // ScrollSmoother -- itself only created post-hydration -- to exist before
  // clicking, so the click always lands on a fully-interactive page.
  await page.waitForFunction(() => !!window.__scrollSmoother);
  await page.locator('.mask_rooms .filter-item', { hasText: 'wisa' }).click();
  await expect(page).toHaveURL(/\/suites\/wisa\/$/);
  await expect(page.locator('main .mask_roomdetail h1')).toHaveText(/wisa/i);
});

// Regression guard for C4 (final whole-branch review fix wave): FilterShell's
// pin offset used to be a bare 10px, which put the pinned filter bar directly
// behind the fixed `header .upper` (0..166px at desktop), making every
// .filter-item unhoverable/unclickable while pinned. This test drives the
// page into the actually-pinned state (not just scroll-top, which the
// pre-existing filter-swap test above only ever exercised) and asserts the
// filter bar is still hittable there.
test('filter bar stays clickable while pinned mid-scroll (desktop)', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 951 });
  await page.goto('/suites/boum/');
  await page.waitForFunction(() => !!window.__scrollSmoother);
  // FilterShell.tsx creates its pinning ScrollTrigger 500ms after mount --
  // wait past that before scrolling, or the pin trigger won't exist yet.
  await page.waitForTimeout(600);
  // Scroll well past the filter bar's own top (jumping to the roomdetail
  // section it's still wrapping, per FilterShell.tsx's `filterOuter` -- the
  // pin's `end: 'bottom top'` extends through the whole active suite's
  // content, so this lands solidly mid-pin, not at its edge). Two hops
  // (a small one first, then the real target) rather than one direct jump:
  // useScrolledBody.ts's `scrolled` body class (which shrinks the fixed
  // header via CSS) only arms on the *second* scroll event it observes
  // (`lastY > 0 && y > lastY` -- a faithfully-ported original quirk, first
  // tick never qualifies since lastY starts at 0), matching how a real user
  // scrolling incrementally would always fire multiple scroll events long
  // before reaching this depth. A single direct jump would leave the header
  // artificially at its full, un-shrunk height -- not a real reachable state.
  await page.evaluate(() => window.__scrollSmoother?.scrollTo(200, false));
  await page.waitForTimeout(50);
  await page.evaluate(() => window.__scrollSmoother?.scrollTo('.mask_roomdetail', false, 'top top'));
  await page.waitForTimeout(300);

  const filterItem = page.locator('.mask_rooms .filter-item', { hasText: 'wisa' });
  await expect(filterItem).toBeVisible();
  const box = await filterItem.boundingBox();
  if (!box) throw new Error('.filter-item has no bounding box while pinned');
  const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };

  // The header sits at z-index above most content -- if the pin offset regresses
  // back to a bare 10px, elementFromPoint at the filter item's own center would
  // resolve to the header instead of the filter item.
  const hitClass = await page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y)?.closest('.filter-item')?.className ?? null,
    center
  );
  expect(hitClass).toContain('filter-item');

  // A real click (no {force: true}) must succeed -- Playwright's actionability
  // check itself fails if another element is intercepting pointer events here.
  await filterItem.click();
  await expect(page).toHaveURL(/\/suites\/wisa\/$/);
});

// Regression guard for C2 (final whole-branch review fix wave): ImgSlider's
// `.swiper-container` was missing `w-full`, which combined with a Swiper
// ResizeObserver runaway produced ~2000px+ of horizontal page overflow on
// mobile.
test('does not overflow horizontally at mobile width (390px)', async ({ page }) => {
  const viewport = { width: 390, height: 844 };
  await page.setViewportSize(viewport);
  await page.goto('/suites/boum/');
  await page.waitForTimeout(500);
  const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(viewport.width);
});
