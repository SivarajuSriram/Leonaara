import { test, expect } from '@playwright/test';

// Only one .mask_partnermarquee section on the homepage. Its logo strip
// (.marquee-wrapper) auto-scrolls continuously via a GSAP horizontalLoop
// timeline that starts ticking on mount, so the logos' exact scroll offset at
// screenshot time is real-time-dependent and not reproducible run to run.
// Masking .marquee-wrapper isolates the diff to the section's static parts —
// the bg-canvas fill this task changes, plus the .content title/text block —
// which is what this test is actually meant to guard. (The marquee's own
// behavior — item count, hover-pause, image src — is covered separately by
// tests/e2e/marquee.spec.ts.)
test.describe('PartnerMarquee visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const section = page.locator('.mask_partnermarquee');
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      await expect(section).toHaveScreenshot(`partnermarquee-${viewport.width}.png`, {
        maxDiffPixels: 50,
        mask: [section.locator('.marquee-wrapper')],
      });
    });
  }
});
