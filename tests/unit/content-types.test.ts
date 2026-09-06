import { describe, it, expect } from 'vitest';
import type {
  AccordionsSection, ListSection, GallerySliderSection, GallerySection,
  NewsletterWidgetSection, VoucherWidgetSection, Section,
} from '@/lib/content';

describe('Phase 3 Section types', () => {
  it('AccordionsSection has the right shape', () => {
    const s: AccordionsSection = {
      id: 1, type: 'mask_accordions',
      appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
      content: {
        title: '', text: '',
        accordion: [{ uid: '1', title: 'T', info: '', text: '<p>x</p>', linktext: '', link: '' }],
      },
    };
    expect(s.type).toBe('mask_accordions');
    expect(s.content.accordion[0].title).toBe('T');
  });
  it('ListSection has the right shape', () => {
    const s: ListSection = {
      id: 2, type: 'mask_list',
      appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
      content: { title: '', text: '', listitems: [{ uid: '1', title: 'T', text: '<ul><li>x</li></ul>' }] },
    };
    expect(s.content.listitems[0].uid).toBe('1');
  });
  it('GallerySliderSection and GallerySection share an images-only shape', () => {
    const img = {
      src: '/images/a.jpg', width: 100, height: 100, mime: 'image/jpeg', title: null, alt: '',
      crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
    };
    const gs: GallerySliderSection = {
      id: 3, type: 'mask_galleryslider',
      appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
      content: { images: [img] },
    };
    const g: GallerySection = {
      id: 4, type: 'mask_gallery',
      appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
      content: { images: [img] },
    };
    expect(gs.content.images).toHaveLength(1);
    expect(g.content.images).toHaveLength(1);
  });
  it('NewsletterWidgetSection and VoucherWidgetSection are content-empty', () => {
    const n: NewsletterWidgetSection = {
      id: 5, type: 'mask_widget_newsletter',
      appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
      content: {},
    };
    const v: VoucherWidgetSection = {
      id: 6, type: 'mask_widget_voucher',
      appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
      content: {},
    };
    expect(n.type).toBe('mask_widget_newsletter');
    expect(v.type).toBe('mask_widget_voucher');
  });
  it('all six are assignable to Section', () => {
    const types: Section['type'][] = [
      'mask_accordions', 'mask_list', 'mask_galleryslider', 'mask_gallery',
      'mask_widget_newsletter', 'mask_widget_voucher',
    ];
    expect(types).toHaveLength(6);
  });
});
