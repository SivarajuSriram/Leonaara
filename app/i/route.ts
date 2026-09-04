import { NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

export const runtime = 'nodejs';
const PUBLIC = path.resolve(process.cwd(), 'public');
const IMAGES = path.join(PUBLIC, 'images');
const CACHE = path.resolve(process.cwd(), '.cache/img');

// `extract` must be four non-negative integers, "left_top_width_height" in pixels.
function parseExtract(value: string): { left: number; top: number; width: number; height: number } | null {
  const parts = value.split('_');
  if (parts.length !== 4) return null;
  const [left, top, width, height] = parts.map(Number);
  if (![left, top, width, height].every((n) => Number.isInteger(n) && n >= 0)) return null;
  return { left, top, width, height };
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const src = q.get('src') ?? '';
  const w = q.get('w') ? Number(q.get('w')) : undefined;
  const h = q.get('h') ? Number(q.get('h')) : undefined;
  const quality = q.get('q') ? Number(q.get('q')) : 80;
  const extractRaw = q.get('extract') ?? undefined;
  if (!src.startsWith('/images/') || src.includes('..')) return new NextResponse('bad src', { status: 400 });
  if ((w !== undefined && !(w > 0 && w < 5000)) || (h !== undefined && !(h > 0 && h < 5000))) return new NextResponse('bad size', { status: 400 });
  const extractBox = extractRaw !== undefined ? parseExtract(extractRaw) : undefined;
  if (extractRaw !== undefined && !extractBox) return new NextResponse('bad extract', { status: 400 });
  const file = path.resolve(PUBLIC, '.' + src);
  if (!file.startsWith(IMAGES + path.sep)) return new NextResponse('bad src', { status: 400 });
  try {
    await fs.access(file);
  } catch {
    return new NextResponse('not found', { status: 404 });
  }
  if (src.toLowerCase().endsWith('.svg')) {
    const svg = await fs.readFile(file);
    return new NextResponse(svg, { headers: { 'content-type': 'image/svg+xml', 'cache-control': 'public, max-age=31536000, immutable' } });
  }
  const key = crypto.createHash('sha1').update(`${src}|${w}|${h}|${quality}|${extractRaw}`).digest('hex');
  const cached = path.join(CACHE, `${key}.webp`);
  try {
    const buf = await fs.readFile(cached);
    return webp(buf);
  } catch { /* not cached */ }
  let img = sharp(file, { failOn: 'none' }).rotate();
  if (extractBox) img = img.extract(extractBox);
  if (w && h) img = img.resize(w, h, { fit: 'cover', position: 'centre', withoutEnlargement: false });
  else if (w) img = img.resize({ width: w });
  else if (h) img = img.resize({ height: h });
  const out = await img.webp({ quality }).toBuffer();
  await fs.mkdir(CACHE, { recursive: true });
  await fs.writeFile(cached, out);
  return webp(out);
}

function webp(buf: Buffer) {
  return new NextResponse(new Uint8Array(buf), {
    headers: { 'content-type': 'image/webp', 'cache-control': 'public, max-age=31536000, immutable' },
  });
}
