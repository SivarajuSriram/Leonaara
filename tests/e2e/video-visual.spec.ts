import { test, expect } from '@playwright/test';

// The homepage's only .mask_video instance (originsVideo) has no video source
// configured in content/en/home.ts (content.video / videosummer are both empty
// arrays), so Video.tsx renders an empty grid-container wrapper here — the
// <video> element this task restyles never mounts on the real page. This test
// still guards the wrapper/surrounding layout against any regression from
// deleting Video.css; the actual className conversion on the <video> element
// itself is verified directly in tests/unit/sections-basic.test.tsx (which
// renders Video with real content), since there's no visual content here to
// diff against.
test.describe('Video visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const section = page.locator('.mask_video');
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      await expect(section).toHaveScreenshot(`video-${viewport.width}.png`, { maxDiffPixels: 50 });
    });
  }
});
