import type { ImageRef } from './content';

export type SizePreset = { widthD?: number; heightD?: number; widthM?: number; heightM?: number };

function dims(preset: SizePreset, which: 'default' | 'mobile') {
  return which === 'default' ? { width: preset.widthD, height: preset.heightD } : { width: preset.widthM, height: preset.heightM };
}

// original truncates the crop fraction to 2 decimals before multiplying
function trunc2(n: number): number {
  const m = n.toString().match(/^-?\d+(?:\.\d{0,2})?/);
  return m ? parseFloat(m[0]) : n;
}

export function extractParam(image: ImageRef, which: 'default' | 'mobile'): string | undefined {
  const c = image.crop[which];
  if (c.x === 0 && c.y === 0 && c.width === 1 && c.height === 1) return undefined;
  return [
    Math.round(c.x * image.width), Math.round(c.y * image.height),
    Math.round(trunc2(c.width) * image.width), Math.round(trunc2(c.height) * image.height),
  ].join('_');
}

// Deterministic static path for a (source, crop) pair: same directory as the
// original, same extension, suffixed with which+extract. scripts/gen-image-crops.ts
// writes files at exactly this path — this function and the script must never
// drift apart, which is why both live in this repo (not one computed, one hardcoded).
export function staticSrc(image: ImageRef, which: 'default' | 'mobile'): string {
  if (image.mime === 'image/svg+xml') return image.src;
  const extract = extractParam(image, which);
  if (!extract) return image.src; // identity crop: the original file already is the answer
  const dot = image.src.lastIndexOf('.');
  return `${image.src.slice(0, dot)}__${which}-${extract}${image.src.slice(dot)}`;
}

export function aspectRatios(image: ImageRef, preset: SizePreset): [number, number] {
  const ratio = (which: 'default' | 'mobile') => {
    const { width, height } = dims(preset, which);
    if (width && height) return width / height;
    const c = image.crop[which];
    return (image.width * c.width) / (image.height * c.height);
  };
  return [ratio('default'), ratio('mobile')];
}

// The width/height next/image's own optimizer needs: the preset override when
// given, otherwise the natural aspect ratio at a base render size (1920 desktop,
// 360 mobile — the original's own Img.vue render widths). next/image's `sizes`
// prop handles picking a smaller device size for narrower viewports from there;
// there is no need to enumerate breakpoints by hand any more.
export function renderSize(image: ImageRef, preset: SizePreset, which: 'default' | 'mobile'): { width: number; height: number } {
  const { width, height } = dims(preset, which);
  const ar = aspectRatios(image, preset)[which === 'default' ? 0 : 1];
  if (width && height) return { width, height };
  if (width) return { width, height: Math.round(width / ar) };
  if (height) return { width: Math.round(height * ar), height };
  const base = which === 'default' ? 1920 : 360;
  return { width: base, height: Math.round(base / ar) };
}
