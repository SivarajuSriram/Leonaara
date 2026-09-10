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
// `.room-image-left` Swiper root used to hit a genuine, deterministic layout
// bug (C1 in the final whole-branch review's fix wave): the class list
// carrying `.room-image-left` was missing `w-full`, so Swiper's own
// ResizeObserver-driven `updateSize()` read a runaway `el.clientWidth` that
// grew on each successive resize callback, eventually saturating at
// Chromium's max representable Blink LayoutUnit, 33554432px (2^25) --
// pushing everything after the hero gallery to a y-offset around 33 million
// px. Fixed by adding `w-full` to `roomImageLeftCls`
// (components/sections/RoomDetail.tsx); the 12 sub-tests below were
// `test.fixme()`'d while that defect stood and are un-fixme'd now that C1
// (and ImgSlider's matching C2/C3) are fixed and manually verified.
test.describe('Phase 4 pages visual regression', () => {
  for (const { path, name } of routes) {
    for (const viewport of viewports) {
      test(`${name} matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
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
        // A flat 800ms wait here used to be "clear of the 0.5s overlay fade
        // triggered by the last image's 'load' event" -- but on suites-felisa
        // and suites-himil at 1440x900 that margin proved marginal (2/2 repro
        // during this fix wave's stability check): both failures isolated to
        // one single below-fold TeaserSlider photo with a uniform, sub-pixel
        // diff spread across its whole bounding box -- the signature of a
        // dark overlay (Picture.tsx's `bg-ink` div, GSAP-faded to opacity 0)
        // not quite finished settling, not a real content difference (visual
        // diff crop confirmed pixel-identical to the eye). Poll each *loaded*
        // image's overlay opacity instead of guessing a fixed delay -- exact
        // regardless of how loaded the machine happens to be when the suite
        // runs. Only overlays whose own <img> is already `.complete` are
        // checked (matches the img-load poll above): ImgSlider keeps
        // off-screen carousel slides genuinely unloaded (and thus their
        // overlay genuinely still opaque) by design, not a bug -- confirmed
        // via a diagnostic dump showing several overlays permanently stuck at
        // opacity 1 because their sibling <img> never loads until scrolled
        // into the strip, which this test never does.
        await expect.poll(
          () =>
            main.evaluate((el) =>
              Array.from(el.querySelectorAll('picture')).every((pic) => {
                const img = pic.querySelector('img');
                const overlay = pic.querySelector<HTMLElement>(':scope > div');
                if (!img || !overlay || !img.complete) return true;
                return parseFloat(getComputedStyle(overlay).opacity) < 0.01;
              })
            ),
          { timeout: 5_000 }
        ).toBe(true);
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
