import { describe, it, expect } from 'vitest';
import { gallery } from '@/content/en/gallery';

describe('gallery page content', () => {
  it('has a non-empty title and correct slug', () => {
    expect(gallery.meta.title.length).toBeGreaterThan(0);
    expect(gallery.slug).toBe('/gallery/');
  });
  it('has hero then a 34-image gallery section', () => {
    const [hero, gal] = gallery.columns.colPos0;
    expect(hero.type).toBe('mask_hero');
    expect(gal.type).toBe('mask_gallery');
    if (gal.type !== 'mask_gallery') throw new Error('expected gallery');
    expect(gal.content.images).toHaveLength(34);
  });
});
