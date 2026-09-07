import { test, expect } from '@playwright/test';

const routes = [
  { path: '/booking-conditions/', nav: 'Booking conditions' },
  { path: '/press/', nav: 'Press' },
];

for (const { path, nav } of routes) {
  test(`${path} resolves from the footer and renders its sections`, async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').getByRole('link', { name: nav, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`\\${path}$`));
    await expect(page.locator('main .mask_hero')).toBeVisible();
    await expect(page.locator('main .mask_accordions')).toBeVisible();
    await expect(page.locator('main .mask_galleryslider')).toBeVisible();
  });
}
