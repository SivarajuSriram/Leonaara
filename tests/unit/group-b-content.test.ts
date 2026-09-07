import { describe, it, expect } from 'vitest';
import { bookingConditions } from '@/content/en/booking-conditions';
import { press } from '@/content/en/press';

describe('Group B page content', () => {
  for (const [name, page] of [['booking-conditions', bookingConditions], ['press', press]] as const) {
    it(`${name} has hero, accordions, galleryslider in order`, () => {
      expect(page.columns.colPos0.map((s) => s.type)).toEqual(['mask_hero', 'mask_accordions', 'mask_galleryslider']);
    });
    it(`${name} has a non-empty title and slug matching its route`, () => {
      expect(page.meta.title.length).toBeGreaterThan(0);
      expect(page.slug).toBe(`/${name}/`);
    });
  }
});
