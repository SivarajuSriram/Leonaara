import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { RoomSlider } from '@/components/sections/RoomSlider';
import { home } from '@/content/en/home';

vi.mock('@/lib/gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn(), timeline: vi.fn(() => ({ to: vi.fn() })) },
  SplitText: { create: vi.fn(() => ({ words: [], revert: vi.fn() })) },
  ScrollTrigger: { refresh: vi.fn() },
  useGSAP: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/en/' }));
// next/link normalizes trailing slashes via a webpack DefinePlugin flag that only
// exists in a real Next build; under Vitest it silently strips them, which would
// make this assertion fail for reasons unrelated to RoomSlider. Stub it with a
// plain anchor so the test checks what RoomSlider actually passes as href.
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe('RoomSlider', () => {
  // colPos0[4] is confirmed mask_roomslider (rooms: boum, wisa, felisa, himil).
  const roomSliderSection = home.columns.colPos0[4];
  if (roomSliderSection.type !== 'mask_roomslider') throw new Error('expected mask_roomslider');

  it('renders three synced swipers with boum as the first active slide', () => {
    const { container } = render(<RoomSlider section={roomSliderSection} />);

    // Three Swiper instances: left image slider, right image slider, content slider.
    expect(container.querySelectorAll('.swiper').length).toBe(3);
    expect(container.querySelector('.room-image-left')?.classList.contains('swiper')).toBe(true);
    expect(container.querySelector('.room-image-right')?.classList.contains('swiper')).toBe(true);
    expect(container.querySelector('.room-content')?.classList.contains('swiper')).toBe(true);

    const activeSlide = container.querySelector('.room-content .swiper-slide-active');
    expect(activeSlide?.querySelector('h2')?.textContent).toBe('boum');
    expect(activeSlide?.querySelector('.room-info-price')?.textContent).toBe(
      'from 775,- € / night per person / All-In'
    );
    expect(activeSlide?.querySelector('a.ht-button')?.getAttribute('href')).toBe('/en/suites/boum/');

    // Navigation renders because rooms.length (4) > 1.
    expect(container.querySelector('.navigation')).not.toBeNull();

    // navigation={{ prevEl: null, nextEl: null }} (not `true`) must keep Swiper
    // from rendering its own default .swiper-button-prev/-next elements — those
    // are the live site's blue chevrons and are not part of the original markup.
    expect(container.querySelectorAll('.swiper-button-prev, .swiper-button-next').length).toBe(0);
  });
});
