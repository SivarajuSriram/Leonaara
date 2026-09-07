import { test, expect } from '@playwright/test';

test('newsletter resolves and renders the empty widget placeholder', async ({ page }) => {
  await page.goto('/newsletter/');
  await expect(page.locator('#additive-newsletter-664458cf61093')).toBeAttached();
});
test('voucher resolves from the footer and renders the empty widget placeholder', async ({ page }) => {
  await page.goto('/');
  await page.locator('footer').getByRole('link', { name: 'Voucher', exact: true }).click();
  await expect(page).toHaveURL(/\/voucher\/$/);
  await expect(page.locator('#internetseite')).toBeAttached();
});
