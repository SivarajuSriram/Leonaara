import { test, expect } from '@playwright/test';

// Alpine Hide, Origin and Spa all live in the header's slide-down menu (site.nav,
// rendered by components/layout/MenuPanel.tsx as `header nav[aria-label="Menu"]`) --
// none are in the footer (site.footerNav). Confirmed against content/site.ts directly.
// Same adaptation as tests/e2e/group-a-pages.spec.ts (Task 7) applied here.
const routes = [
  { path: '/alpine-hide/', nav: 'Alpine Hide' },
  { path: '/origin/', nav: 'Origin' },
  { path: '/spa/', nav: 'Spa' },
];

for (const { path, nav } of routes) {
  test(`${path} resolves from the header menu and renders its sections`, async ({ page }) => {
    await page.goto('/');
    await page.click('header .menu-button');
    await page.locator('header nav[aria-label="Menu"]').getByRole('link', { name: nav, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`\\${path}$`));
    await expect(page.locator('main .mask_hero')).toBeVisible();
    await expect(page.locator('main .mask_accordions').first()).toBeVisible();
  });

  test(`${path} accordion toggles open on click`, async ({ page }) => {
    await page.goto(path);
    const accordion = page.locator('main .mask_accordions').first();
    const header = accordion.locator('.accordion-header').first();
    const body = accordion.locator('.accordion-body').first();
    const before = await body.evaluate((el) => el.getBoundingClientRect().height);
    await header.click();
    await expect(async () => {
      const after = await body.evaluate((el) => el.getBoundingClientRect().height);
      expect(after).toBeGreaterThan(before);
    }).toPass();
  });
}
