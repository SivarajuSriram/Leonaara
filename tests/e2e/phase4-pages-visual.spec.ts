import { test, expect, type Page } from '@playwright/test';

async function jumpToTop(page: Page) {
  await page.waitForFunction(() => !!window.__scrollSmoother);
  const jump = () => page.evaluate(() => window.__scrollSmoother?.scrollTo('main', false, 'top top'));
  await jump();
  await page.waitForTimeout(300);
  await jump();
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

const routes = [
  { path: '/experiences/', name: 'experiences' },
  { path: '/leiba/', name: 'leiba' },
  { path: '/sela/', name: 'sela' },
  { path: '/herchomen/', name: 'herchomen' },
  { path: '/hantwerc/', name: 'hantwerc' },
  { path: '/sneo/', name: 'sneo' },
  { path: '/suites/boum/', name: 'suites-boum' },
  { path: '/suites/wisa/', name: 'suites-wisa' },
  { path: '/suites/felisa/', name: 'suites-felisa' },
  { path: '/suites/himil/', name: 'suites-himil' },
];
const viewports = [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }];

// Suite routes render RoomDetail (components/sections/RoomDetail.tsx), whose
// `.room-image-left` Swiper hits a genuine, deterministic layout bug: Swiper's
// own ResizeObserver-driven `updateSize()` (swiper/shared/swiper-core.mjs)
// reads `el.clientWidth`, and for this specific Swiper instance that value
// grows on each successive resize callback (confirmed via an instrumented
// clientWidth getter: 21700 -> 108500 -> 542500 -> ... a geometric runaway),
// eventually saturating at Chromium's max representable Blink LayoutUnit,
// 33554432px (2^25). This is NOT a test-timing artifact -- it reproduces on a
// completely fresh navigation at a single fixed large viewport with zero
// setViewportSize calls, so real visitors hit it too. Once it fires, `main`'s
// own height inherits the runaway (everything after the hero gallery --
// icons, description, ImgSlider, List, Img, RoomCta, TeaserSlider, Footer --
// is pushed to a y-offset around 33 million px), which is both outside any
// screenshot tool's renderable range and not a meaningful "baseline" to
// encode even if it could be captured. This is a Critical, pre-existing
// product defect (not introduced by this test), reported in Task 9's report
// for the final whole-branch review's fix wave -- per this project's
// established process, defects found during a QA/visual-regression task are
// recorded, not silently patched mid-task. The 12 sub-tests below are marked
// fixme (not silently skipped) so the gap stays visible in test output until
// the bug is fixed and this annotation is removed.
const suiteRoutesBlockedByRoomImageLeftBug = new Set(['suites-boum', 'suites-wisa', 'suites-felisa', 'suites-himil']);

test.describe('Phase 4 pages visual regression', () => {
  for (const { path, name } of routes) {
    for (const viewport of viewports) {
      test(`${name} matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
        test.fixme(
          suiteRoutesBlockedByRoomImageLeftBug.has(name),
          'RoomDetail .room-image-left Swiper hits a deterministic ResizeObserver width runaway (clamps at 33554432px / 2^25) -- see comment above. Blocks full-main capture on all 4 suite routes. Tracked for the final whole-branch review fix wave.'
        );
        await page.setViewportSize(viewport);
        await page.goto(path);
        const main = page.locator('main');
        const height = await main.evaluate((el) => el.getBoundingClientRect().height);
        if (height > viewport.height) {
          await page.setViewportSize({ width: viewport.width, height: Math.ceil(height) + 100 });
          await page.waitForTimeout(200);
        }
        if (viewport.width >= 1024) {
          await jumpToTop(page);
        } else {
          await main.scrollIntoViewIfNeeded();
        }
        // Same root cause as phase3-pages-visual.spec.ts: growing the viewport to fit
        // full-page content (above) suddenly brings every lazy-loaded <Picture> image
        // into view at once, and each one still has to finish loading and then run its
        // own 0.5s dark-overlay fade-out (Picture.tsx's `gsap.to(overlay, { opacity: 0,
        // duration: 0.5 })`, fired off the img's 'load' event) before the page is
        // visually settled. A flat 500ms wasn't consistently enough for image-heavy
        // Phase 4 routes (sela, sneo) -- confirmed via a diff that isolated to a single
        // below-fold image's overlay mid-fade. Wait for every genuinely *visible* image
        // to finish loading (IntersectionObserver, which -- unlike getBoundingClientRect
        // -- correctly accounts for ancestor overflow clipping, relevant for ImgSlider's
        // free-scroll strip) before the flat wait.
        await expect.poll(
          async () =>
            main.evaluate(
              (el) =>
                new Promise<boolean>((resolve) => {
                  const imgs = Array.from(el.querySelectorAll('img'));
                  if (imgs.length === 0) {
                    resolve(true);
                    return;
                  }
                  let remaining = imgs.length;
                  let allLoaded = true;
                  const io = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                      const target = entry.target as HTMLImageElement;
                      if (entry.intersectionRatio > 0 && !target.complete) allLoaded = false;
                      remaining -= 1;
                    });
                    if (remaining <= 0) {
                      io.disconnect();
                      resolve(allLoaded);
                    }
                  });
                  imgs.forEach((img) => io.observe(img));
                })
            ),
          { timeout: 30_000 }
        ).toBe(true);
        // 800ms clear of the 0.5s overlay fade triggered by the last image's 'load' event.
        await page.waitForTimeout(800);
        // sela and sneo each have a mask_video section (Video.tsx); its Player
        // autoplays once its IntersectionObserver sees it, so its frames keep
        // changing regardless of wait time -- masked the same way
        // phase3-pages-visual.spec.ts masks origin's/spa's now-playing video.
        await expect(main).toHaveScreenshot(`${name}-${viewport.width}.png`, {
          maxDiffPixels: 50,
          timeout: 20_000,
          mask: [main.locator('video')],
        });
      });
    }
  }
});
