// Pixel-diffs every paired `NN.live.png` / `NN.local.png` under
// docs/qa/<route>/ and reports a diff-pixel percentage per pair, sorted
// worst-first, plus a `NN.diff.png` per pair. Run after `npm run qa:shots`
// has captured both sides, to triage which pairs are worth opening by eye.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const route = process.argv[2] ?? '/en/';
const dir = path.join('docs/qa', route.replace(/\//g, '_') || '_root');

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.live.png'));

type Result = { pair: string; percent: number; diffPixels: number; totalPixels: number; note?: string };
const results: Result[] = [];

for (const liveFile of files.sort()) {
  const localFile = liveFile.replace('.live.png', '.local.png');
  const livePath = path.join(dir, liveFile);
  const localPath = path.join(dir, localFile);
  const pair = liveFile.replace('.live.png', '');
  if (!fs.existsSync(localPath)) {
    results.push({ pair, percent: 100, diffPixels: -1, totalPixels: -1, note: 'MISSING local screenshot' });
    continue;
  }
  const live = PNG.sync.read(fs.readFileSync(livePath));
  const local = PNG.sync.read(fs.readFileSync(localPath));
  if (live.width !== local.width || live.height !== local.height) {
    results.push({
      pair,
      percent: 100,
      diffPixels: -1,
      totalPixels: -1,
      note: `SIZE MISMATCH live=${live.width}x${live.height} local=${local.width}x${local.height}`,
    });
    continue;
  }
  const { width, height } = live;
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(live.data, local.data, diff.data, width, height, { threshold: 0.1 });
  const totalPixels = width * height;
  const percent = (diffPixels / totalPixels) * 100;
  results.push({ pair, percent, diffPixels, totalPixels });
  fs.writeFileSync(path.join(dir, `${pair}.diff.png`), PNG.sync.write(diff));
}

results.sort((a, b) => b.percent - a.percent);
for (const r of results) {
  const pct = r.percent.toFixed(3).padStart(7);
  console.log(`${pct}%  ${r.pair}${r.note ? '  ' + r.note : ''}`);
}
console.log(`\n${results.length} pairs compared in ${dir}`);
