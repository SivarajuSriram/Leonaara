// scripts/gen-image-crops.ts
// One-time offline pass — never runs as part of the deployed app. Reads every
// image reference on the homepage, crops the ones with a non-identity crop
// rectangle using sharp, and writes the result at the exact path
// lib/images.ts's staticSrc() computes. Run manually after any content change
// that adds a new image or crop:
//   npx tsx scripts/gen-image-crops.ts
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { home } from '../content/en/home';
import { extractParam, staticSrc } from '../lib/images';
import type { ImageRef, Section } from '../lib/content';

const PUBLIC = path.resolve(__dirname, '..', 'public');

function isImageRef(v: unknown): v is ImageRef {
  return !!v && typeof v === 'object' && typeof (v as Record<string, unknown>).src === 'string'
    && typeof (v as Record<string, unknown>).width === 'number' && !!(v as Record<string, unknown>).crop;
}

function collectImages(node: unknown, out: ImageRef[] = []): ImageRef[] {
  if (Array.isArray(node)) { node.forEach((v) => collectImages(v, out)); return out; }
  if (node && typeof node === 'object') {
    if (isImageRef(node)) { out.push(node); return out; }
    Object.values(node as Record<string, unknown>).forEach((v) => collectImages(v, out));
  }
  return out;
}

async function main() {
  const images = collectImages((home.columns.colPos0 as unknown) as Section[]);
  const seen = new Set<string>();
  let written = 0;
  for (const image of images) {
    for (const which of ['default', 'mobile'] as const) {
      const extract = extractParam(image, which);
      if (!extract) continue; // identity crop, nothing to generate
      const outPath = staticSrc(image, which);
      if (seen.has(outPath)) continue;
      seen.add(outPath);
      const [left, top, width, height] = extract.split('_').map(Number);
      const srcFile = path.join(PUBLIC, image.src);
      const outFile = path.join(PUBLIC, outPath);
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await sharp(srcFile).extract({ left, top, width, height }).toFile(outFile);
      written++;
      console.log(`${image.src} [${which}] -> ${outPath}`);
    }
  }
  console.log(`\nWrote ${written} cropped image(s).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
