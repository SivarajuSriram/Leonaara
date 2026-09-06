import { test, expect, type Locator } from '@playwright/test';

// The bundler serialises `.52083333vw` with ~6 significant digits, so computed sizes can be
// off by less than 0.001px from the original. Compare with a tolerance instead of a string.
async function expectPx(locator: Locator, property: string, expected: number) {
  const value = await locator.evaluate((el, prop) => parseFloat(getComputedStyle(el).getPropertyValue(prop)), property);
  expect(Math.abs(value - expected)).toBeLessThan(0.001);
}

test('root scale and body tokens match the original', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 951 });
  await page.goto('/');
  const html = page.locator('html');
  await expectPx(html, 'font-size', 10);
  const body = page.locator('body');
  await expect(body).toHaveCSS('color', 'rgb(33, 29, 29)');
  // spec §16.3: body's fill is the canvas token (--color-canvas #F2F1EF), not the
  // old beige #e4e0db — beige survives only on borders/rules. app/globals.css sets
  // `background-color: var(--color-canvas)` since the colour sweep (commit b77f9aa).
  await expect(body).toHaveCSS('background-color', 'rgb(242, 241, 239)');
  await expect(body).toHaveCSS('font-family', 'karol-sans, sans-serif');
  await expectPx(body, 'font-size', 25);
  await expect(body).toHaveCSS('font-weight', '300');

  await page.setViewportSize({ width: 1440, height: 900 });
  await expectPx(html, 'font-size', 7.5);

  await page.setViewportSize({ width: 390, height: 844 });
  // original: 2.77777778vw × 390px
  await expectPx(html, 'font-size', 2.77777778 * 3.9);

  const loaded = await page.evaluate(async () => {
    await (document as Document & { fonts: FontFaceSet }).fonts.ready;
    return document.fonts.check('300 20px karol-sans');
  });
  expect(loaded).toBe(true);
});
