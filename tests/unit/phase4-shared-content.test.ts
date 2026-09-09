import { describe, it, expect } from 'vitest';
import { experiencesHero, experiencesFilter } from '@/content/en/experiencesShared';
import { suitesHero, suitesRooms } from '@/content/en/suitesShared';

describe('Phase 4 shared filter content', () => {
  it('experiencesFilter has 5 pages with no /en/ prefix in any href', () => {
    expect(experiencesFilter.content.pages.length).toBe(5);
    expect(experiencesFilter.content.pages.map((p) => p.title)).toEqual(['Leiba', 'Sela', 'Herchomen', 'Hantwerc', 'Sneo']);
    for (const p of experiencesFilter.content.pages) {
      expect(p.href.startsWith('/')).toBe(true);
      expect(p.href).not.toContain('/en/');
    }
  });
  it('experiencesHero is a real hero section', () => {
    expect(experiencesHero.type).toBe('mask_hero');
    expect(experiencesHero.content.herolayout).toBe('only-text');
  });
  it('suitesRooms has 4 rooms with trailing-slash slugs', () => {
    expect(suitesRooms.content.rooms.length).toBe(4);
    expect(suitesRooms.content.rooms.map((r) => r.title)).toEqual(['boum', 'wisa', 'felisa', 'himil']);
    for (const r of suitesRooms.content.rooms) {
      expect(r.slug.endsWith('/')).toBe(true);
    }
  });
  it('suitesHero is a real hero section', () => {
    expect(suitesHero.type).toBe('mask_hero');
    expect(suitesHero.content.herolayout).toBe('only-text');
  });
});
