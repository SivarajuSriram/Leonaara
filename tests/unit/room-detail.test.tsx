import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { RoomDetail } from '@/components/sections/RoomDetail';
import type { RoomDetailSection } from '@/lib/content';

vi.mock('@/lib/gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn() },
  SplitText: { create: vi.fn(() => ({ words: [], revert: vi.fn() })) },
  useGSAP: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}));

const image = {
  src: '/images/x.jpg', width: 866, height: 856, mime: 'image/jpeg', title: null, alt: 'x',
  crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
};
const iconImage = { ...image, src: '/images/icon.svg', mime: 'image/svg+xml', width: 120, height: 120 };

const section: RoomDetailSection = {
  id: 96, type: 'mask_roomdetail',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    room: {
      uid: '3', pid: '84', title: 'boum', description: '<p>Room text</p>',
      minprice: 'from 775,- € / night', people: 'for 2 persons', size: 'approx. 688 sq ft',
      previewimage: [image, image], images: [image],
    },
    icons: [iconImage, iconImage, iconImage],
  },
};

describe('RoomDetail', () => {
  it('renders the left gallery from room.previewimage (not room.images), the room info, and navigation when there are multiple previewimages', () => {
    const { container } = render(<RoomDetail section={section} />);
    expect(container.querySelectorAll('.room-image-left .swiper-slide').length).toBe(2);
    expect(container.querySelector('.room-image-right')).not.toBeNull();
    expect(container.querySelector('.navigation')).not.toBeNull();
    expect(container.querySelector('h1')?.textContent).toBe('boum');
    expect(container.querySelector('.room-info-size')?.textContent).toBe('approx. 688 sq ft');
    expect(container.querySelector('.room-info-people')?.textContent).toBe('for 2 persons');
    expect(container.querySelector('.room-info-price')?.textContent).toBe('from 775,- € / night');
    expect(container.querySelectorAll('.room-icons picture').length).toBe(3);
    expect(container.querySelector('.room-description')?.textContent).toContain('Room text');
  });

  it('hides navigation when there is only one previewimage', () => {
    const single: RoomDetailSection = { ...section, content: { ...section.content, room: { ...section.content.room, previewimage: [image] } } };
    const { container } = render(<RoomDetail section={single} />);
    expect(container.querySelector('.navigation')).toBeNull();
  });
});
