import { test, expect } from '@playwright/test';

test('room slider shows boum first and advances all three swipers together', async ({ page }) => {
  await page.goto('/en/');
  const section = page.locator('.mask_roomslider');
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator('.room-content .swiper-slide-active h2')).toHaveText('boum');
  await expect(section.locator('.room-content .swiper-slide-active .room-info-price')).toHaveText('from 775,- € / night per person / All-In');
  await expect(section.locator('.room-content .swiper-slide-active a.ht-button')).toHaveAttribute('href', '/en/suites/boum/');
  const leftBefore = await section.locator('.room-image-left .swiper-slide-active img').getAttribute('src');
  await section.locator('.navigation .next').click();
  await page.waitForTimeout(1500);
  await expect(section.locator('.room-content .swiper-slide-active h2')).toHaveText('wisa');
  const leftAfter = await section.locator('.room-image-left .swiper-slide-active img').getAttribute('src');
  expect(leftAfter).not.toBe(leftBefore);
  expect(leftAfter).toContain('wisa');
  await expect(section.locator('.room-image-right .swiper-slide-active img')).toHaveAttribute('src', /wisa-02/);
  await section.locator('.navigation .prev').click();
  await page.waitForTimeout(1500);
  await expect(section.locator('.room-content .swiper-slide-active h2')).toHaveText('boum');
});
