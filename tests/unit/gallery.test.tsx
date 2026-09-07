import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Gallery } from '@/components/sections/Gallery';
import type { GallerySection } from '@/lib/content';

vi.mock('@/lib/smoother', () => ({ onSmoother: vi.fn(() => () => {}) }));

const img = (n: number) => ({
  src: `/images/gal${n}.jpg`, width: 2800, height: 1868, mime: 'image/jpeg', title: null, alt: `image ${n}`,
  crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
});
const section: GallerySection = {
  id: 9,
  type: 'mask_gallery',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: { images: Array.from({ length: 9 }, (_, i) => img(i + 1)) },
};

describe('Gallery', () => {
  it('renders one picture per image inside the mask_Gallery grid', () => {
    const { container } = render(<Gallery section={section} />);
    expect(container.firstElementChild?.className).toContain('mask mask_Gallery');
    expect(container.querySelectorAll('picture')).toHaveLength(9);
  });
  it('cycles the 8n+k grid position class per image index', () => {
    const { container } = render(<Gallery section={section} />);
    const wrappers = container.querySelectorAll('.grid-container > div');
    expect(wrappers[0].className).toContain('col-start-1');
    expect(wrappers[0].className).toContain('col-span-5');
    expect(wrappers[8].className).toContain('col-start-1'); // index 8 = position 0 again (8n+1 cycle)
    expect(wrappers[8].className).toContain('col-span-5');
  });
});
