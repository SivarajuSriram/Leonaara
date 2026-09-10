import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ImgSlider } from '@/components/sections/ImgSlider';
import type { ImgSliderSection } from '@/lib/content';

vi.mock('@/lib/gsap', () => ({ gsap: { to: vi.fn() }, useGSAP: vi.fn() }));

const image = {
  src: '/images/x.jpg', width: 1920, height: 1080, mime: 'image/jpeg', title: null, alt: 'x',
  crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
};

const section: ImgSliderSection = {
  id: 602, type: 'mask_imgslider',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: { images: [image, image, image] },
};

describe('ImgSlider', () => {
  it('renders one swiper slide per image with navigation (more than one image)', () => {
    const { container } = render(<ImgSlider section={section} />);
    expect(container.querySelectorAll('.swiper-slide').length).toBe(3);
    expect(container.querySelector('.swiper-container')?.classList.contains('swiper')).toBe(true);
    expect(container.querySelector('.navigation')).not.toBeNull();
  });

  it('hides navigation with a single image', () => {
    const single: ImgSliderSection = { ...section, content: { images: [image] } };
    const { container } = render(<ImgSlider section={single} />);
    expect(container.querySelector('.navigation')).toBeNull();
  });
});
