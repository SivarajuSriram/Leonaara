import { describe, it, expect } from 'vitest';
import { allInService } from '@/content/en/all-in-service';
import { eriroExclusive } from '@/content/en/eriro-exclusive';
import { summer } from '@/content/en/summer';
import { winter } from '@/content/en/winter';

describe('Group A page content', () => {
  for (const [name, page] of [['all-in-service', allInService], ['eriro-exclusive', eriroExclusive], ['summer', summer], ['winter', winter]] as const) {
    it(`${name} has hero, imgtext, list, galleryslider in order`, () => {
      expect(page.columns.colPos0.map((s) => s.type)).toEqual(['mask_hero', 'mask_imgtext', 'mask_list', 'mask_galleryslider']);
    });
    it(`${name} has a non-empty title and slug matching its route`, () => {
      expect(page.meta.title.length).toBeGreaterThan(0);
      expect(page.slug).toBe(`/${name}/`);
    });
  }
});
