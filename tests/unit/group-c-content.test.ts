import { describe, it, expect } from 'vitest';
import { alpineHide } from '@/content/en/alpine-hide';
import { origin } from '@/content/en/origin';
import { spa } from '@/content/en/spa';

describe('Group C page content', () => {
  it('alpine-hide has a non-empty title and correct slug', () => {
    expect(alpineHide.meta.title.length).toBeGreaterThan(0);
    expect(alpineHide.slug).toBe('/alpine-hide/');
  });
  it('origin has a non-empty title and correct slug', () => {
    expect(origin.meta.title.length).toBeGreaterThan(0);
    expect(origin.slug).toBe('/origin/');
  });
  it('spa has a non-empty title and correct slug', () => {
    expect(spa.meta.title.length).toBeGreaterThan(0);
    expect(spa.slug).toBe('/spa/');
  });
  it('every page has at least one accordions section', () => {
    for (const page of [alpineHide, origin, spa]) {
      expect(page.columns.colPos0.some((s) => s.type === 'mask_accordions')).toBe(true);
    }
  });
});
