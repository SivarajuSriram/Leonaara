import { describe, it, expect } from 'vitest';
import { boum } from '@/content/en/boum';
import { wisa } from '@/content/en/wisa';
import { felisa } from '@/content/en/felisa';
import { himil } from '@/content/en/himil';

describe('Suite pages content', () => {
  for (const [name, page] of [['boum', boum], ['wisa', wisa], ['felisa', felisa], ['himil', himil]] as const) {
    it(`${name} has hero+rooms in colPos0 and the full 6-section colPos5`, () => {
      expect(page.columns.colPos0.map((s) => s.type)).toEqual(['mask_hero', 'mask_rooms']);
      expect(page.columns.colPos5?.map((s) => s.type)).toEqual([
        'mask_roomdetail', 'mask_imgslider', 'mask_list', 'mask_img', 'mask_roomcta', 'mask_teaserslider',
      ]);
      expect(page.slug).toBe(`/suites/${name}/`);
      const roomdetail = page.columns.colPos5![0];
      if (roomdetail.type !== 'mask_roomdetail') throw new Error('expected roomdetail');
      expect(roomdetail.content.room.title).toBe(name);
      expect(roomdetail.content.room.previewimage.length).toBeGreaterThan(1);
    });
  }
});
