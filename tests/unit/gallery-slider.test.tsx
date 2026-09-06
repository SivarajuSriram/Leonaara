import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { GallerySlider } from '@/components/sections/GallerySlider';
import type { GallerySliderSection } from '@/lib/content';

vi.mock('@/lib/gsap', () => ({ useGSAP: (fn: () => void) => fn() }));
vi.mock('@/lib/horizontalLoop', () => ({ horizontalLoop: vi.fn(() => ({ pause: vi.fn(), resume: vi.fn(), kill: vi.fn() })) }));

const img = (n: number) => ({
  src: `/images/g${n}.jpg`, width: 2800, height: 1868, mime: 'image/jpeg', title: null, alt: `image ${n}`,
  crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
});
const section: GallerySliderSection = {
  id: 8,
  type: 'mask_galleryslider',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: 'medium', spaceAfter: '' },
  content: { images: [img(1), img(2), img(3), img(4), img(5), img(6)] },
};

describe('GallerySlider', () => {
  it('renders a marquee item per image, interleaved into the 5-bucket order', () => {
    const { container } = render(<GallerySlider section={section} />);
    expect(container.firstElementChild?.className).toContain('mask mask_galleryslider');
    // 6 images -> ceil(6/5)*5*3 = 30 marquee items (same interleave formula PartnerMarquee uses)
    expect(container.querySelectorAll('.marquee-item')).toHaveLength(30);
  });
  it('cycles the 4n+k size/margin class per item index', () => {
    const { container } = render(<GallerySlider section={section} />);
    const items = container.querySelectorAll('.marquee-item');
    expect(items[0].className).toContain('w-[27.3rem]');
    expect(items[1].className).toContain('w-[41rem]');
    expect(items[2].className).toContain('w-[27.3rem]');
    expect(items[3].className).toContain('w-[41rem]');
    expect(items[4].className).toContain('w-[27.3rem]'); // 4n+1 cycle restarts
  });
});
