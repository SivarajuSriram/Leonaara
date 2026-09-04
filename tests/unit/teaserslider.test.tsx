import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { TeaserSlider } from '@/components/sections/TeaserSlider';
import { home } from '@/content/en/home';

vi.mock('@/lib/gsap', () => ({ gsap: { to: vi.fn() }, useGSAP: vi.fn(), SplitText: {}, ScrollTrigger: {} }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/en/' }));
// next/link normalizes trailing slashes via a webpack DefinePlugin flag that only
// exists in a real Next build; under Vitest it silently strips them, which would
// make the href assertion below fail for reasons unrelated to TeaserSlider. Stub
// it with a plain anchor, same fix as tests/unit/roomslider.test.tsx.
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe('TeaserSlider', () => {
  it('renders the four swipers and hides navigation for a single slide', () => {
    const s = home.columns.colPos0[13];
    if (s.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
    const { container } = render(<TeaserSlider section={s} />);
    expect(container.querySelector('.teaser-wrapper.grid-container-inner')).not.toBeNull();
    expect(container.querySelector('.swiper.image-left picture img')?.getAttribute('src')).toContain('w=277&h=330');
    expect(container.querySelector('.swiper.image-right picture img')?.getAttribute('src')).toContain('w=876&h=960');
    expect(container.querySelector('.swiper.infotext p.infotext')?.textContent).toBe('Origins of the Alpine region');
    expect(container.querySelector('.swiper.teaser-content h2.title')?.textContent).toBe('Bask in stillness');
    const btn = container.querySelector('.swiper.teaser-content a.ht-button');
    expect(btn?.textContent).toBe('Path to regeneration');
    expect(btn?.getAttribute('href')).toBe('/en/spa/');
    expect(container.querySelector('.navigation')).toBeNull();
  });
  it('renders PREV / NEXT navigation for multiple slides', () => {
    const s = home.columns.colPos0[13];
    if (s.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
    const two = { ...s, content: { teaserslides: [s.content.teaserslides[0], { ...s.content.teaserslides[0], uid: '2' }] } };
    const { container } = render(<TeaserSlider section={two} />);
    expect(container.querySelector('.navigation .prev span')?.textContent).toBe('PREV');
    expect(container.querySelector('.navigation .spacer')?.textContent).toBe('/');
    expect(container.querySelector('.navigation .next span')?.textContent).toBe('NEXT');
  });
});
