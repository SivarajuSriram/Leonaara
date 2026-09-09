import { describe, it, expect } from 'vitest';
import { experiences } from '@/content/en/experiences';
import { leiba } from '@/content/en/leiba';
import { sela } from '@/content/en/sela';
import { herchomen } from '@/content/en/herchomen';
import { hantwerc } from '@/content/en/hantwerc';
import { sneo } from '@/content/en/sneo';

describe('Experience routes content', () => {
  it('experiences hub has hero, pagefilter, teaserslider in colPos0 and no colPos5', () => {
    expect(experiences.columns.colPos0.map((s) => s.type)).toEqual(['mask_hero', 'mask_pagefilter', 'mask_teaserslider']);
    expect(experiences.columns.colPos5).toBeUndefined();
    expect(experiences.slug).toBe('/experiences/');
  });

  const subpages = [
    ['leiba', leiba, ['mask_hero', 'mask_imgtext']],
    ['sela', sela, ['mask_hero', 'mask_imgtext', 'mask_video']],
    ['herchomen', herchomen, ['mask_hero', 'mask_imgtext']],
    ['hantwerc', hantwerc, ['mask_hero', 'mask_imgtext', 'mask_img']],
    ['sneo', sneo, ['mask_hero', 'mask_imgtext', 'mask_video']],
  ] as const;

  for (const [name, page, expectedTypes] of subpages) {
    it(`${name} shares the experiences hero+pagefilter in colPos0 and has its own colPos5`, () => {
      expect(page.columns.colPos0.map((s) => s.type)).toEqual(['mask_hero', 'mask_pagefilter']);
      expect(page.columns.colPos5?.map((s) => s.type)).toEqual([...expectedTypes]);
      expect(page.slug).toBe(`/${name}/`);
      expect(page.meta.title.length).toBeGreaterThan(0);
    });
  }
});
