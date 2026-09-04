import { test, expect } from '@playwright/test';
import sharp from 'sharp';

test('/i resizes to the exact requested box as webp', async ({ request }) => {
  const res = await request.get('/i?src=%2Fimages%2Funikateur_Bilder%2FAlexMoling_Eriro_Exterior.jpg&w=1352&h=1040&q=80');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toBe('image/webp');
  const meta = await sharp(await res.body()).metadata();
  expect(meta.width).toBe(1352);
  expect(meta.height).toBe(1040);
});

test('/i height-only keeps the aspect ratio', async ({ request }) => {
  const res = await request.get('/i?src=%2Fimages%2FLogos%2Fbilanz.png&h=180&q=80');
  const meta = await sharp(await res.body()).metadata();
  expect(meta.height).toBe(180);
  expect(meta.width).toBe(Math.round((180 * 3750) / 2084));
});

test('/i rejects paths outside public/images', async ({ request }) => {
  const res = await request.get('/i?src=%2F..%2Fpackage.json&w=10');
  expect(res.status()).toBe(400);
});

test('/i returns 404 for a missing file', async ({ request }) => {
  const res = await request.get('/i?src=%2Fimages%2Fdoes-not-exist.jpg&w=10');
  expect(res.status()).toBe(404);
});

test('/i rejects a malformed extract', async ({ request }) => {
  const res = await request.get('/i?src=%2Fimages%2FLogos%2Fbilanz.png&w=10&extract=a_b');
  expect(res.status()).toBe(400);
});
