import { test, expect } from '@playwright/test';
import { OPEN, CLOSED } from '../../components/layout/menuAnimations';

test.describe('header', () => {
  test('menu opens and closes with the original timeline', async ({ page }) => {
    await page.goto('/en/');
    const menu = page.locator('header .menu');
    await expect(menu).toHaveCSS('transform', /matrix\(1, 0, 0, 1, 0, -\d+/);
    await page.click('header .menu-button');
    await page.waitForTimeout(1700);
    await expect(page.locator('header')).toHaveClass(/header-menu-open/);
    await expect(menu).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await expect(page.locator('header .menu-bg')).toHaveCSS('opacity', '1');
    await expect(page.locator('header .menu-bg')).toHaveCSS('visibility', 'visible');
    expect(await page.locator('header .menu-button path.a1').getAttribute('d')).toBe(OPEN.a1);
    await expect(page.locator('header .button-wrapper')).toBeHidden();
    const links = page.locator('header .nav-main .level-0 a');
    await expect(links).toHaveCount(9);
    await expect(links.first()).toHaveText('Alpine Hide');
    // the open timeline tweens the .level-0 wrappers to opacity .6
    await expect(page.locator('header .nav-main .level-0').first()).toHaveCSS('opacity', '0.6');
    await page.click('header .menu-bg', { position: { x: 1500, y: 500 } });
    await page.waitForTimeout(800);
    await expect(page.locator('header')).not.toHaveClass(/header-menu-open/);
    expect(await page.locator('header .menu-button path.a1').getAttribute('d')).toBe(CLOSED.a1);
    await expect(page.locator('header .menu-bg')).toHaveCSS('visibility', 'hidden');
  });

  test('scrolled class follows the original rule and the logo scrubs out', async ({ page }) => {
    await page.goto('/en/');
    await page.evaluate(() => { document.body.style.minHeight = '6000px'; });
    const logo = page.locator('header .logo-wrapper');
    await expect(logo).toHaveCSS('opacity', '1');
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(200);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(600);
    await expect(page.locator('body')).toHaveClass(/scrolled/);
    await expect(page.locator('header .upper')).toHaveCSS('background-color', 'rgb(228, 224, 219)');
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(800);
    const opacity = await logo.evaluate((el) => parseFloat(getComputedStyle(el).opacity));
    expect(opacity).toBeLessThan(0.05);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).not.toHaveClass(/scrolled/);
  });
});
