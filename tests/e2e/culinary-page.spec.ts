import { test, expect } from '@playwright/test';

// Culinary (uid 61) lives in the header's slide-down menu (site.nav, rendered by
// components/layout/MenuPanel.tsx as `header nav[aria-label="Menu"]`) -- not in the
// footer (site.footerNav). Confirmed against content/site.ts directly. Same
// adaptation as tests/e2e/group-a-pages.spec.ts / group-c-pages.spec.ts applied here.
test('culinary resolves from the header menu and renders its hero', async ({ page }) => {
  await page.goto('/');
  await page.click('header .menu-button');
  await page.locator('header nav[aria-label="Menu"]').getByRole('link', { name: 'Culinary', exact: true }).click();
  await expect(page).toHaveURL(/\/culinary\/$/);
  await expect(page.locator('main .mask_hero')).toBeVisible();
});
