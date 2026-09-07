import { test, expect } from '@playwright/test';

// All-In-Service, Summer and Winter live in the header's slide-down menu (site.nav,
// rendered by components/layout/MenuPanel.tsx as `header nav[aria-label="Menu"]`) --
// not in the footer. Only "eriro exclusive" is a footer link (site.footerNav, rendered
// by components/layout/Footer.tsx). Confirmed against content/site.ts and Footer.tsx/
// MenuPanel.tsx directly; the two navigation sources are exercised accordingly below.
const headerMenuRoutes = [
  { path: '/all-in-service/', nav: 'All-In-Service' },
  { path: '/summer/', nav: 'Summer' },
  { path: '/winter/', nav: 'Winter' },
];

for (const { path, nav } of headerMenuRoutes) {
  test(`${path} resolves from the header menu and renders its sections`, async ({ page }) => {
    await page.goto('/');
    await page.click('header .menu-button');
    await page.locator('header nav[aria-label="Menu"]').getByRole('link', { name: nav, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`\\${path}$`));
    await expect(page.locator('main .mask_hero')).toBeVisible();
    await expect(page.locator('main .mask_list')).toBeVisible();
    await expect(page.locator('main .mask_galleryslider')).toBeVisible();
  });
}

test('/eriro-exclusive/ resolves from the footer and renders its sections', async ({ page }) => {
  await page.goto('/');
  await page.locator('footer').getByRole('link', { name: 'eriro exclusive', exact: true }).click();
  await expect(page).toHaveURL(/\/eriro-exclusive\/$/);
  await expect(page.locator('main .mask_hero')).toBeVisible();
  await expect(page.locator('main .mask_list')).toBeVisible();
  await expect(page.locator('main .mask_galleryslider')).toBeVisible();
});
