import { chromium } from '@playwright/test';
import fs from 'node:fs';

const route = process.argv[2] ?? '/en/';
async function mainText(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 951 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const text = await page.evaluate(() => {
    const clone = document.querySelector('main')!.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.marquee-inner').forEach((el) => el.remove()); // marquee repeats logos, no text
    return clone.innerText;
  });
  await browser.close();
  return text.replace(/\s+/g, ' ').trim();
}
// tsx transforms this file as CommonJS (no "type": "module" in package.json),
// which doesn't allow top-level await; wrap in an async main() instead.
async function main() {
  const live = await mainText('https://www.eriro.at' + route);
  const local = await mainText('http://localhost:3000' + route);
  fs.mkdirSync('docs/qa', { recursive: true });
  fs.writeFileSync('docs/qa/text-live.txt', live);
  fs.writeFileSync('docs/qa/text-local.txt', local);
  if (live === local) { console.log('TEXT IDENTICAL'); process.exit(0); }
  const a = live.split(' '); const b = local.split(' ');
  let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
  console.log('FIRST DIFFERENCE at word', i);
  console.log('live :', a.slice(Math.max(0, i - 10), i + 10).join(' '));
  console.log('local:', b.slice(Math.max(0, i - 10), i + 10).join(' '));
  process.exit(1);
}
main();
