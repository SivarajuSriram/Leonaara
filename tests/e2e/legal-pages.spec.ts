import { test, expect } from '@playwright/test';

test('imprint renders the company details and resolves from the footer', async ({ page }) => {
  await page.goto('/');
  await page.locator('footer').getByRole('link', { name: 'Imprint' }).click();
  await expect(page).toHaveURL(/\/imprint\/$/);
  await expect(page).toHaveTitle('eriro - our imprint');
  await expect(page.locator('main h1')).toHaveText('Imprint');
  await expect(page.locator('main')).toContainText('Almkönig GmbH');
});

test('privacy renders all three sections and resolves from the footer', async ({ page }) => {
  await page.goto('/');
  await page.locator('footer').getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page).toHaveTitle('eriro - Information on data privacy');
  // .first() is required, not a shortcut: privacy genuinely renders two <h1>s --
  // both its FooterPageText sections ("Privacy" and the trailing " ADDITIVE+"
  // credit line) have non-empty titles, and FooterPageText renders any non-empty
  // title as an <h1>. Confirmed faithful to the original site -- do not "simplify"
  // this to a bare locator, it will break on the second <h1>.
  await expect(page.locator('main h1').first()).toHaveText('Privacy');
  await expect(page.locator('main')).toContainText('article 4, paragraph 7, GDPR');
  await expect(page.locator('main')).toContainText('ADDITIVE Srl');
});

test('cookies renders the policy and the settings button', async ({ page }) => {
  await page.goto('/');
  await page.locator('footer').getByRole('link', { name: 'Cookies' }).click();
  await expect(page).toHaveURL(/\/cookies\/$/);
  await expect(page).toHaveTitle('Cookie policy of eriro');
  await expect(page.locator('main')).toContainText('What is a cookie?');
  await expect(page.getByRole('button', { name: 'Cookies settings' })).toBeVisible();
});
