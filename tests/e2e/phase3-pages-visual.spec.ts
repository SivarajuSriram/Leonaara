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
  'alpine-hide', 'all-in-service', 'culinary', 'origin', 'spa', 'summer', 'winter',
  'eriro-exclusive', 'booking-conditions', 'press', 'gallery', 'newsletter', 'voucher',
];
const viewports = [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }];

test.describe('Phase 3 pages visual regression', () => {
  for (const name of routes) {
    for (const viewport of viewports) {
      test(`${name} matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(`/${name}/`);
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
        // Growing the viewport to fit full-page content (above) suddenly brings every
        // lazy-loaded <Picture> image into view at once instead of one at a time as a
        // real visitor scrolls. Each one still has to finish loading and then run its
        // own 0.5s dark-overlay fade-out (Picture.tsx's `gsap.to(overlay, { opacity: 0,
        // duration: 0.5 })`, fired off img's 'load' event) before the page is visually
        // settled -- a flat wait long enough for a text-only page isn't long enough once
        // a route has many below-fold images. Wait for every genuinely *visible* image to
        // finish loading (via the browser's own IntersectionObserver, which -- unlike
        // getBoundingClientRect -- correctly accounts for clipping by an ancestor's
        // overflow:hidden) instead of guessing a flat delay. That distinction matters
        // twice over here: TeaserSlider's image-left/image-right are each their own small
        // Swiper carousel, and Swiper's loop mode additionally clones slides for several
        // sections below (summer/winter/eriro-exclusive/booking-conditions/press) -- in
        // both cases the inactive/clone <img> sits geometrically within the page but is
        // clipped by its swiper root, so loading="lazy" correctly never fires for it and
        // waiting on it (e.g. by src, since clones share the same src as the original)
        // would hang forever.
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
        // 1600ms, not 800ms: TeaserSlider's teaser-content Swiper (alpine-hide, culinary,
        // origin, spa) runs a `speed={1300}` EffectFade transition -- its 4th Swiper
        // mounts conditionally, one render after the other three (see TeaserSlider.tsx),
        // so the transition's start isn't reliably anchored to page load or image
        // completion, and 800ms wasn't consistently past its end.
        await page.waitForTimeout(1600);
        // GallerySlider (all-in-service, summer, winter, eriro-exclusive,
        // booking-conditions, press) is a continuously auto-scrolling GSAP marquee
        // (lib/horizontalLoop.ts, `repeat: -1, paused: false`) -- same pattern as, and
        // masked the same way as, the homepage's PartnerMarquee
        // (tests/e2e/partnermarquee-visual.spec.ts): it never settles, so mask it out
        // rather than chase an unreachable "stable" state. Video (newsletter's real,
        // successfully-loading /videos/eriro_alpinehide_nebel.mp4) is masked for the
        // same reason -- Video.tsx's Player autoplays once its IntersectionObserver
        // sees it, so its frames keep changing regardless of wait time. (origin/spa's
        // video never even starts, per the known broken-path issue, so masking it
        // there is a no-op, not a workaround for anything.)
        await expect(main).toHaveScreenshot(`${name}-${viewport.width}.png`, {
          // 1000, not 50: verified (cropped both images, eyeballed side-by-side,
          // pixel-identical to the eye) against two separate cases -- origin-1440's
          // "FLAVOUR OF MOUNTAIN ORIGINS" caption line (~300px) and alpine-hide-1440's
          // TeaserSlider title/caption/photo block (~674px) -- that this is
          // fully-deterministic (identical bbox and count across repeated runs, so not
          // animation/timing flakiness) sub-pixel anti-aliasing noise in font and photo
          // JPEG edges, concentrated in TeaserSlider's composite of four
          // Controller-synced Swiper instances. legal-pages-visual.spec.ts's 50 fits a
          // single-viewport plain-text page; these are full-page captures up to
          // ~14,000px tall (~25-27M pixels) with photo content, so more fixed noise at
          // this scale is expected. 1000 stays a tiny fraction (<0.01%) of any of
          // these images.
          maxDiffPixels: 1000,
          mask: [main.locator('.marquee-wrapper'), main.locator('video')],
          // Default 5s covers two+ comparison screenshots for a normal page, but
          // gallery/spa are ~14000/~13400px tall at 1920 wide (~25-27M pixels) --
          // a single screenshot of either measured at 2-3s standalone, leaving no
          // room for the internal stability retries within the default window.
          timeout: 20_000,
        });
      });
    }
  }
});
