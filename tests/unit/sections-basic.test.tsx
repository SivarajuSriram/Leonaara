import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ImgText } from '@/components/sections/ImgText';
import { Img } from '@/components/sections/Img';
import { Video } from '@/components/sections/Video';
import { Quote } from '@/components/sections/Quote';
import { Break } from '@/components/sections/Break';
import { home } from '@/content/en/home';

vi.mock('@/lib/gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn(), timeline: vi.fn(() => ({ to: vi.fn() })) },
  SplitText: { create: vi.fn(() => ({ words: [], revert: vi.fn() })) },
  ScrollTrigger: { refresh: vi.fn() },
  useGSAP: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/en/' }));

const sec = <T extends string>(i: number, type: T) => {
  const s = home.columns.colPos0[i];
  if (s.type !== type) throw new Error(`expected ${type} at ${i}, got ${s.type}`);
  return s as Extract<typeof s, { type: T }>;
};

describe('basic sections', () => {
  it('ImgText renders both images, title and text with the link', () => {
    const { container } = render(<ImgText section={sec(1, 'mask_imgtext')} />);
    expect(container.firstElementChild?.className).toBe('default space-before- mask mask_imgtext');
    expect(container.querySelector('.image-left picture img')?.getAttribute('src')).toContain('w=501&h=390');
    expect(container.querySelector('.image-right picture img')?.getAttribute('src')).toContain('w=570&h=510');
    // jsdom normalizes CRLF to LF while parsing the dangerouslySetInnerHTML fragment
    // (WHATWG "preprocessing the input stream"), same as tests/unit/hero.test.tsx.
    expect(container.querySelector('.content h2.title')?.innerHTML).toBe('Travel back <br>\nto the beginnings <br>\nof everything');
    expect(container.querySelector('.content .text a.linkdetail')?.getAttribute('href')).toBe('/en/alpine-hide/');
  });
  it('Img renders one full-bleed picture', () => {
    const { container } = render(<Img section={sec(7, 'mask_img')} />);
    expect(container.firstElementChild?.className).toBe('default space-before- mask mask_img grid-container');
    expect(container.querySelector('.image picture img')?.getAttribute('src')).toContain('w=1920&h=1080');
  });
  it('Video renders an empty wrapper when there is no video', () => {
    const { container } = render(<Video section={sec(2, 'mask_video')} />);
    expect(container.firstElementChild?.className).toBe('default space-before- mask mask_video grid-container');
    expect(container.querySelector('video')).toBeNull();
  });
  it('Quote renders text and author', () => {
    const { container } = render(<Quote section={sec(3, 'mask_quote')} />);
    expect(container.querySelector('.quote-wrapper .quote')?.textContent).toBe('eriro – One of the "World’s Greatest Places 2025"');
    expect(container.querySelector('.quote-wrapper .autor')?.textContent).toBe('TIME');
    expect(container.querySelector('.image')).toBeNull();
  });
  it('Break renders the beige wrapper with title and two images', () => {
    const { container } = render(<Break section={sec(8, 'mask_break')} />);
    expect(container.querySelector('.break-wrapper.grid-container')).not.toBeNull();
    expect(container.querySelector('h2.title')?.innerHTML).toContain('Touch what time<br>');
    expect(container.querySelector('.image-left picture img')?.getAttribute('src')).toContain('w=570&h=510');
    expect(container.querySelector('.image-right picture img')?.getAttribute('src')).toContain('w=352&h=280');
  });
});
