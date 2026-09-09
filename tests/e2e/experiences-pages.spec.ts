import { test, expect } from '@playwright/test';

test('experiences hub renders the filter with nothing active and the teaserslider', async ({ page }) => {
  await page.goto('/experiences/');
  await expect(page.locator('.mask_pagefilter .filter-item.active')).toHaveCount(0);
  await expect(page.locator('main .mask_teaserslider')).toBeVisible();
});

const subpages = ['leiba', 'sela', 'herchomen', 'hantwerc', 'sneo'];
for (const name of subpages) {
  test(`/${name}/ renders directly with itself active in the filter`, async ({ page }) => {
    await page.goto(`/${name}/`);
    await expect(page.locator('main .mask_pagefilter')).toBeVisible();
    const active = page.locator('.mask_pagefilter .filter-item.active');
    await expect(active).toHaveCount(1);
    await expect(active).toHaveText(new RegExp(name, 'i'));
  });
}

test('clicking a different filter item swaps content and updates the URL without a full navigation', async ({ page }) => {
  await page.goto('/leiba/');
  await page.locator('.mask_pagefilter .filter-item', { hasText: 'Sela' }).click();
  await expect(page).toHaveURL(/\/sela\/$/);
  await expect(page.locator('.mask_pagefilter .filter-item.active')).toHaveText(/sela/i);
});
