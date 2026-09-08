import { describe, it, expect } from 'vitest';
import type {
  PageFilterSection, RoomsSection, RoomDetailSection, ImgSliderSection, RoomCtaSection, Section,
} from '@/lib/content';

const appearance = { layout: 'default', frameClass: 'default', spaceBefore: '' as const, spaceAfter: '' };
const image = {
  src: '/images/x.jpg', width: 100, height: 100, mime: 'image/jpeg', title: null, alt: '',
  crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
};

describe('Phase 4 Section types', () => {
  it('PageFilterSection has the right shape', () => {
    const s: PageFilterSection = {
      id: 1, type: 'mask_pagefilter', appearance,
      content: { pages: [{ uid: '1', title: 'Leiba', href: '/leiba/' }] },
    };
    expect(s.type).toBe('mask_pagefilter');
    expect(s.content.pages[0].href).toBe('/leiba/');
  });
  it('RoomsSection has the right shape', () => {
    const s: RoomsSection = {
      id: 2, type: 'mask_rooms', appearance,
      content: { rooms: [{ uid: '3', title: 'boum', slug: '/suites/boum/', pid: '84' }] },
    };
    expect(s.content.rooms[0].slug).toBe('/suites/boum/');
  });
  it('RoomDetailSection reuses the existing Room type', () => {
    const s: RoomDetailSection = {
      id: 3, type: 'mask_roomdetail', appearance,
      content: {
        room: {
          uid: '3', pid: '84', title: 'boum', description: '<p>x</p>', minprice: 'from 1', people: 'for 2', size: 'a',
          previewimage: [image], images: [image],
        },
        icons: [image],
      },
    };
    expect(s.content.room.title).toBe('boum');
    expect(s.content.icons.length).toBe(1);
  });
  it('ImgSliderSection has the right shape', () => {
    const s: ImgSliderSection = { id: 4, type: 'mask_imgslider', appearance, content: { images: [image] } };
    expect(s.content.images.length).toBe(1);
  });
  it('RoomCtaSection has the right shape', () => {
    const s: RoomCtaSection = {
      id: 5, type: 'mask_roomcta', appearance,
      content: { room: { uid: '3', title: 'boum', asacode: '1', bookingcode: '' } },
    };
    expect(s.content.room.asacode).toBe('1');
  });
  it('Section union accepts all five', () => {
    const items: Section['type'][] = ['mask_pagefilter', 'mask_rooms', 'mask_roomdetail', 'mask_imgslider', 'mask_roomcta'];
    expect(items.length).toBe(5);
  });
});
