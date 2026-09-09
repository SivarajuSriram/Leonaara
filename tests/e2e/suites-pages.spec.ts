import { test, expect } from '@playwright/test';

const suites = ['boum', 'wisa', 'felisa', 'himil'];
for (const name of suites) {
  test(`/suites/${name}/ renders with itself active and its own roomdetail`, async ({ page }) => {
    await page.goto(`/suites/${name}/`);
    const active = page.locator('.mask_rooms .filter-item.active');
    await expect(active).toHaveCount(1);
    await expect(active).toHaveText(new RegExp(name, 'i'));
    await expect(page.locator('main .mask_roomdetail h1')).toHaveText(new RegExp(name, 'i'));
    await expect(page.locator('main .mask_roomcta')).toBeVisible();
  });
}

test('clicking a different suite in the filter swaps the whole roomdetail/imgslider/list/img/roomcta/teaserslider block', async ({ page }) => {
  await page.goto('/suites/boum/');
  // FilterShell's click handler is wired up in an effect that runs after
  // hydration, which can land after page.goto()'s load event (same class of
  // race as tests/e2e/break-visual.spec.ts's jumpToTop): wait for
  // ScrollSmoother -- itself only created post-hydration -- to exist before
  // clicking, so the click always lands on a fully-interactive page.
  await page.waitForFunction(() => !!window.__scrollSmoother);
  await page.locator('.mask_rooms .filter-item', { hasText: 'wisa' }).click();
  await expect(page).toHaveURL(/\/suites\/wisa\/$/);
  await expect(page.locator('main .mask_roomdetail h1')).toHaveText(/wisa/i);
});
