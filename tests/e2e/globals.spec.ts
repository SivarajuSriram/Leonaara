import { test, expect } from '@playwright/test';

test('root scale and body tokens match the original', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 951 });
  await page.goto('/en/');
  const html = page.locator('html');
  await expect(html).toHaveCSS('font-size', '10px');
  const body = page.locator('body');
  await expect(body).toHaveCSS('color', 'rgb(33, 29, 29)');
  await expect(body).toHaveCSS('background-color', 'rgb(228, 224, 219)');
  await expect(body).toHaveCSS('font-family', 'karol-sans, sans-serif');
  await expect(body).toHaveCSS('font-size', '25px');
  await expect(body).toHaveCSS('font-weight', '300');

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(html).toHaveCSS('font-size', '7.5px');

  await page.setViewportSize({ width: 390, height: 844 });
  const fs = await html.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(fs).toBeGreaterThan(10.82);
  expect(fs).toBeLessThan(10.84);

  const loaded = await page.evaluate(async () => {
    await (document as Document & { fonts: FontFaceSet }).fonts.ready;
    return document.fonts.check('300 20px karol-sans');
  });
  expect(loaded).toBe(true);
});
