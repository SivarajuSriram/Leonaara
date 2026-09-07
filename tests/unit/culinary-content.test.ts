import { describe, it, expect } from 'vitest';
import { culinary } from '@/content/en/culinary';

describe('culinary page content', () => {
  it('has a non-empty title and correct slug', () => {
    expect(culinary.meta.title.length).toBeGreaterThan(0);
    expect(culinary.slug).toBe('/culinary/');
  });
  it('uses only already-existing section types', () => {
    const known = ['mask_hero', 'mask_imgtext', 'mask_img', 'mask_teaserslider'];
    for (const s of culinary.columns.colPos0) expect(known).toContain(s.type);
  });
});
