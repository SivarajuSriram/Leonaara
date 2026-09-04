import { test, expect } from '@playwright/test';

test('Picture renders through next/image, not a custom resize route', async ({ page }) => {
  await page.goto('/');
  const picture = page.locator('.mask_hero .image-big picture').first();
  const img = picture.locator('img');
  // trailingSlash: true (next.config.ts) makes next/image's own optimizer route
  // render as /_next/image/?url=... (slash before the query string) rather than
  // /_next/image?url=... — the slash is optional here to match either.
  await expect(img).toHaveAttribute('src', /\/_next\/image\/?\?/);
  const source = picture.locator('source[media="(max-width: 1023px)"]');
  await expect(source).toHaveAttribute('srcset', /.+/);
});
