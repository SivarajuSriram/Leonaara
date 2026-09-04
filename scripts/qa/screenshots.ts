import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const LIVE = 'https://www.eriro.at';
const LOCAL = 'http://localhost:3000';
const SIZES = [[1920, 951], [1440, 900], [390, 844]] as const;

async function capture(base: string, route: string, tag: 'live' | 'local', sizes: readonly (readonly [number, number])[]) {
  const browser = await chromium.launch();
  for (const [width, height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const dir = path.join('docs/qa', route.replace(/\//g, '_') || '_root');
    fs.mkdirSync(dir, { recursive: true });
    let n = 0;
    for (let y = 0; y < total; y += height) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(dir, `${width}-${String(n).padStart(2, '0')}.${tag}.png`) });
      n++;
    }
    await page.close();
  }
  await browser.close();
}

// Minimal flag parsing, no CLI library: an optional route positional, plus
// `--only live|local` to capture just one side and `--width 390` to capture
// just one of the three SIZES (matched by its width).
function parseArgs(argv: string[]) {
  const onlyIndex = argv.indexOf('--only');
  const only = onlyIndex === -1 ? undefined : (argv[onlyIndex + 1] as 'live' | 'local');
  const widthIndex = argv.indexOf('--width');
  const width = widthIndex === -1 ? undefined : Number(argv[widthIndex + 1]);
  const flagValues = new Set([argv[onlyIndex + 1], argv[widthIndex + 1]]);
  const route = argv.find((a) => !a.startsWith('--') && !flagValues.has(a)) ?? '/en/';
  const sizes = width === undefined ? SIZES : SIZES.filter(([w]) => w === width);
  return { route, only, sizes };
}

// tsx transforms this file as CommonJS (no "type": "module" in package.json),
// which doesn't allow top-level await; wrap in an async main() instead.
async function main() {
  const { route, only, sizes } = parseArgs(process.argv.slice(2));
  if (!only || only === 'live') await capture(LIVE, route, 'live', sizes);
  if (!only || only === 'local') await capture(LOCAL, route, 'local', sizes);
  console.log('done: docs/qa');
}
main();
