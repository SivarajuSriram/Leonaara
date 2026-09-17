// scripts/optimize-source-images.ts
//
// Why this exists: next/image (see components/ui/Picture.tsx, which every
// real photo on the site renders through) already auto-transcodes every
// image to AVIF/WebP on the fly and resizes it to whatever the page
// actually needs (next.config.ts doesn't set `images.unoptimized`, so the
// default `formats: ['image/avif', 'image/webp']` is live) -- that half of
// "make images load fast" is already handled, per-request, with no extra
// code needed. What it DOESN'T fix is an oversized SOURCE file: next/image
// still has to read and decode the original before it can resize/transcode
// it, and a handful of the images added to this project came in at
// 9-18MB and 5000-12000px on the long edge (way past anything the site
// ever renders, even at 2x retina on a 1920px hero). That's real,
// avoidable work on every cache miss (every unique size next/image hasn't
// generated yet -- which in dev mode is most requests).
//
// This script re-encodes any source image over the given thresholds down
// to a sane ceiling, in place. It does NOT need to output .webp/.avif
// files itself -- next/image already owns that conversion at serve time;
// re-encoding the source as a smaller, still-high-quality JPEG/PNG is what
// actually speeds up every one of next/image's own transforms downstream.
//
// Usage:
//   npx tsx scripts/optimize-source-images.ts [file-or-glob ...]
//   npx tsx scripts/optimize-source-images.ts                    # scans public/images/**
//   npx tsx scripts/optimize-source-images.ts --max-edge=2400 public/images/foo.jpg
//
// After running this on an image with a non-identity `crop` in content
// (see lib/images.ts), update that ImageRef's width/height to match the
// new dimensions this prints, then re-run
// `npx tsx scripts/gen-image-crops.ts` so the derived crop files match.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const PUBLIC_IMAGES = path.resolve(__dirname, '..', 'public', 'images');

// 3200px covers this site's own "ask the designer for" guidance for a
// full-bleed hero (see the image-resolution reference doc): 2-3x the
// largest thing actually rendered (native next/image srcset tops out
// around 1920/3840 for this project's widest slots). Nothing on this site
// is ever displayed larger than that, even at 2x DPR on a wide desktop.
const DEFAULT_MAX_EDGE = 3200;
// Below this, a file isn't worth touching -- re-encoding a already-small
// JPEG can occasionally make it slightly LARGER (mozjpeg's overhead vs.
// whatever encoder made the original), and it's not the problem this
// script exists to fix.
const SKIP_UNDER_BYTES = 1.5 * 1024 * 1024; // 1.5MB
const EXTS = new Set(['.jpg', '.jpeg', '.png']);

async function findImages(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await findImages(full));
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

async function optimize(file: string, maxEdge: number) {
  const before = (await fs.stat(file)).size;
  if (before < SKIP_UNDER_BYTES) return null;

  const img = sharp(file);
  const meta = await img.metadata();
  const { width, height } = meta;
  if (!width || !height) return null;

  const longEdge = Math.max(width, height);
  const needsResize = longEdge > maxEdge;
  const scale = needsResize ? maxEdge / longEdge : 1;
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);

  // Re-encode even when no resize is needed, IF the file is still over the
  // skip threshold: a large PNG (lossless) or a JPEG saved at very high
  // quality by whatever tool produced it both compress noticeably further
  // under mozjpeg at quality 85 with no visible loss.
  let pipeline = img.rotate(); // bakes in EXIF orientation before any resize
  if (needsResize) pipeline = pipeline.resize({ width: newWidth, height: newHeight, fit: 'inside' });
  const isPng = path.extname(file).toLowerCase() === '.png';
  const buffer = isPng
    ? await pipeline.png({ quality: 85, compressionLevel: 9 }).toBuffer()
    : await pipeline.jpeg({ quality: 85, mozjpeg: true }).toBuffer();

  // Only overwrite if it's actually an improvement -- see SKIP_UNDER_BYTES
  // comment above on why re-encoding isn't always a win.
  if (buffer.length >= before && !needsResize) return null;

  await fs.writeFile(file, buffer);
  return { width: newWidth, height: newHeight, before, after: buffer.length };
}

async function main() {
  const args = process.argv.slice(2);
  const maxEdgeArg = args.find((a) => a.startsWith('--max-edge='));
  const maxEdge = maxEdgeArg ? Number(maxEdgeArg.split('=')[1]) : DEFAULT_MAX_EDGE;
  const explicit = args.filter((a) => !a.startsWith('--'));

  const files = explicit.length > 0 ? explicit.map((f) => path.resolve(f)) : await findImages(PUBLIC_IMAGES);

  let touched = 0;
  let savedBytes = 0;
  for (const file of files) {
    const result = await optimize(file, maxEdge);
    if (!result) continue;
    touched++;
    savedBytes += result.before - result.after;
    const rel = path.relative(process.cwd(), file);
    console.log(
      `${rel}: ${(result.before / 1024 / 1024).toFixed(1)}MB -> ${(result.after / 1024 / 1024).toFixed(1)}MB`
      + ` (now ${result.width}x${result.height})`,
    );
  }
  console.log(`\n${touched} file(s) optimized, ${(savedBytes / 1024 / 1024).toFixed(1)}MB saved.`);
  if (touched > 0) {
    console.log('If any of these have a non-identity `crop` in content/en/*.ts, update that');
    console.log('ImageRef\'s width/height to the new dimensions above, then re-run:');
    console.log('  npx tsx scripts/gen-image-crops.ts');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
