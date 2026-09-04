import type { ImageRef } from './content';

export type SizePreset = { widthD?: number; heightD?: number; widthM?: number; heightM?: number };
export type SourceSpec = { media: string; width?: number; height?: number };

// original Img.vue: desktop renders at 1920 and serves 2560/1920/1440 sources;
// mobile renders at 360 and serves 1024/768/480 sources.
const CONFIGS = [
  { id: 'default' as const, size: 1920, breakpoints: [{ view: 1920, size: 2560 }, { view: 1440, size: 1920 }, { view: 1024, size: 1440 }] },
  { id: 'mobile' as const, size: 360, breakpoints: [{ view: 768, size: 1024 }, { view: 480, size: 768 }, { view: 0, size: 480 }] },
];

// original truncates the crop fraction to 2 decimals before multiplying
function trunc2(n: number): number {
  const m = n.toString().match(/^-?\d+(?:\.\d{0,2})?/);
  return m ? parseFloat(m[0]) : n;
}
function dims(preset: SizePreset, id: 'default' | 'mobile') {
  return id === 'default' ? { width: preset.widthD, height: preset.heightD } : { width: preset.widthM, height: preset.heightM };
}

export function extractParam(image: ImageRef, which: 'default' | 'mobile'): string | undefined {
  const c = image.crop[which];
  if (c.x === 0 && c.y === 0 && c.width === 1 && c.height === 1) return undefined;
  return [
    Math.round(c.x * image.width), Math.round(c.y * image.height),
    Math.round(trunc2(c.width) * image.width), Math.round(trunc2(c.height) * image.height),
  ].join('_');
}

export function buildSources(image: ImageRef, preset: SizePreset): SourceSpec[] {
  const out: SourceSpec[] = [];
  for (const cfg of CONFIGS) {
    const { width, height } = dims(preset, cfg.id);
    // r: how many source pixels one rendered pixel maps to at this config's render size (cfg.size / width).
    const r = width ? cfg.size / width : 0;
    // n: the preset's width/height ratio, or render-size/height when only a height is given.
    const n = width && height ? width / height : height ? cfg.size / height : 0;
    for (const bp of cfg.breakpoints) {
      out.push({
        media: `(min-width: ${bp.view}px)`,
        width: r !== 0 ? Math.round(bp.size / r) : undefined,
        height: width && height ? Math.round(bp.size / r / n) : n !== 0 ? Math.round(bp.size / n) : undefined,
      });
    }
  }
  return out;
}

export function aspectRatios(image: ImageRef, preset: SizePreset): [number, number] {
  const ratio = (id: 'default' | 'mobile') => {
    const { width, height } = dims(preset, id);
    if (width && height) return width / height;
    const c = image.crop[id];
    return (image.width * c.width) / (image.height * c.height);
  };
  return [ratio('default'), ratio('mobile')];
}

export function imgUrl(src: string, o: { w?: number; h?: number; q?: number; extract?: string }): string {
  const p = new URLSearchParams();
  p.set('src', src);
  if (o.w) p.set('w', String(o.w));
  if (o.h) p.set('h', String(o.h));
  p.set('q', String(o.q ?? 80));
  if (o.extract) p.set('extract', o.extract);
  return `/i?${p.toString().replace(/\+/g, '%20')}`;
}
