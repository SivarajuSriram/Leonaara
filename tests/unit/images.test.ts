import { describe, it, expect } from 'vitest';
import { buildSources, aspectRatios, extractParam, imgUrl } from '@/lib/images';
import type { ImageRef } from '@/lib/content';

const full = { x: 0, y: 0, width: 1, height: 1 };
const hero: ImageRef = { src: '/images/a.jpg', width: 3000, height: 2001, alt: '', title: null, mime: 'image/jpeg', crop: { default: full, mobile: full } };

describe('buildSources', () => {
  it('matches the original _ipx sizes for the hero big image', () => {
    const s = buildSources(hero, { widthD: 1014, heightD: 780, widthM: 340, heightM: 260 });
    expect(s).toEqual([
      { media: '(min-width: 1920px)', width: 1352, height: 1040 },
      { media: '(min-width: 1440px)', width: 1014, height: 780 },
      { media: '(min-width: 1024px)', width: 761, height: 585 },
      { media: '(min-width: 768px)', width: 967, height: 740 },
      { media: '(min-width: 480px)', width: 725, height: 555 },
      { media: '(min-width: 0px)', width: 453, height: 347 },
    ]);
  });
  it('produces height-only sizes for logos', () => {
    const s = buildSources(hero, { heightD: 180, heightM: 120 });
    expect(s.map((x) => x.height)).toEqual([240, 180, 135, 341, 256, 160]);
    expect(s.every((x) => x.width === undefined)).toBe(true);
  });
});

describe('aspectRatios', () => {
  it('uses the preset ratio when width and height are given', () => {
    expect(aspectRatios(hero, { widthD: 1014, heightD: 780, widthM: 340, heightM: 260 })).toEqual([1.3, 1.3076923076923077]);
  });
  it('falls back to the cropped image ratio for height-only presets', () => {
    expect(aspectRatios(hero, { heightD: 180, heightM: 120 })).toEqual([3000 / 2001, 3000 / 2001]);
  });
});

describe('extractParam and imgUrl', () => {
  it('omits extract for the full image and encodes the src', () => {
    expect(extractParam(hero, 'default')).toBeUndefined();
    expect(imgUrl('/images/Hendrik_Stüwe/x.jpg', { w: 10, h: 5 })).toBe('/i?src=%2Fimages%2FHendrik_St%C3%BCwe%2Fx.jpg&w=10&h=5&q=80');
  });
  it('emits pixel extract for a partial crop', () => {
    const cropped: ImageRef = { ...hero, crop: { default: { x: 0, y: 0.10644216691068813, width: 1, height: 0.7871156661786237 }, mobile: full } };
    expect(extractParam(cropped, 'default')).toBe('0_213_3000_1561');
  });
});
