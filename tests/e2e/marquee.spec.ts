import { test, expect } from '@playwright/test';

test('partner marquee moves, pauses on hover, and lays out 90 logos', async ({ page }) => {
  await page.goto('/');
  const wrap = page.locator('.mask_partnermarquee .marquee-wrapper');
  await wrap.scrollIntoViewIfNeeded();
  await expect(wrap.locator('.marquee-item')).toHaveCount(90);
  const first = wrap.locator('.marquee-item').first();
  const x1 = await first.evaluate((el) => el.getBoundingClientRect().left);
  await page.waitForTimeout(1000);
  const x2 = await first.evaluate((el) => el.getBoundingClientRect().left);
  expect(x2).not.toBe(x1);
  await wrap.hover({ position: { x: 900, y: 100 } });
  await page.waitForTimeout(300);
  const x3 = await first.evaluate((el) => el.getBoundingClientRect().left);
  await page.waitForTimeout(700);
  const x4 = await first.evaluate((el) => el.getBoundingClientRect().left);
  expect(Math.abs(x4 - x3)).toBeLessThan(1);
  await expect(page.locator('.mask_partnermarquee .swiper-container')).toBeHidden();
  // Was 'h=180' (the old /i?...h=180 crop-route query) — Picture now renders
  // through next/image's own optimizer, which doesn't encode the requested
  // height in the URL, so assert on the optimizer route itself instead.
  await expect(wrap.locator('.marquee-item img').first()).toHaveAttribute('src', /\/_next\/image\/?\?/);
});
