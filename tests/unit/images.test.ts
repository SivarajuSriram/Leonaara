import { describe, it, expect } from 'vitest';
import { staticSrc, aspectRatios, renderSize, extractParam } from '@/lib/images';
import type { ImageRef } from '@/lib/content';

const identityImage: ImageRef = {
  src: '/images/foo/bar.jpg', width: 2000, height: 1000, alt: '', title: null, mime: 'image/jpeg',
  crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
};
const croppedImage: ImageRef = {
  ...identityImage,
  crop: { default: { x: 0.1, y: 0.2, width: 0.5, height: 0.4 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
};

describe('staticSrc', () => {
  it('returns the original path for an identity crop', () => {
    expect(staticSrc(identityImage, 'default')).toBe('/images/foo/bar.jpg');
  });
  it('returns a deterministic cropped path for a real crop', () => {
    const extract = extractParam(croppedImage, 'default');
    expect(staticSrc(croppedImage, 'default')).toBe(`/images/foo/bar__default-${extract}.jpg`);
  });
  it('returns the original path for an SVG regardless of crop', () => {
    const svg: ImageRef = { ...croppedImage, mime: 'image/svg+xml' };
    expect(staticSrc(svg, 'default')).toBe(svg.src);
  });
});

describe('renderSize', () => {
  it('uses the preset override when given', () => {
    expect(renderSize(identityImage, { widthD: 500, heightD: 400 }, 'default')).toEqual({ width: 500, height: 400 });
  });
  it('falls back to a 1920px-wide desktop render at the natural aspect ratio', () => {
    const [arD] = aspectRatios(identityImage, {});
    expect(renderSize(identityImage, {}, 'default')).toEqual({ width: 1920, height: Math.round(1920 / arD) });
  });
  it('derives width from the natural aspect ratio when only heightD is given', () => {
    // PartnerMarquee.tsx's Logo only passes heightD/heightM (no width) — renderSize must not
    // silently discard that height and fall back to the 1920px hero-image base render size.
    const [arD] = aspectRatios(identityImage, {});
    expect(renderSize(identityImage, { heightD: 180 }, 'default')).toEqual({ width: Math.round(180 * arD), height: 180 });
  });
  it('derives height from the natural aspect ratio when only widthD is given', () => {
    const [arD] = aspectRatios(identityImage, {});
    expect(renderSize(identityImage, { widthD: 180 }, 'default')).toEqual({ width: 180, height: Math.round(180 / arD) });
  });
});
