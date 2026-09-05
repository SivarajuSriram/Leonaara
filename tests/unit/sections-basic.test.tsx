import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ImgText } from '@/components/sections/ImgText';
import { Img } from '@/components/sections/Img';
import { Video } from '@/components/sections/Video';
import { Quote } from '@/components/sections/Quote';
import { Break } from '@/components/sections/Break';
import { home } from '@/content/en/home';
import type { VideoSection } from '@/lib/content';

vi.mock('@/lib/gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn(), timeline: vi.fn(() => ({ to: vi.fn() })) },
  SplitText: { create: vi.fn(() => ({ words: [], revert: vi.fn() })) },
  ScrollTrigger: { refresh: vi.fn() },
  useGSAP: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }));

// Video's Player subscribes to IntersectionObserver once it has real content (the
// homepage's own mask_video instance currently has none — see the "empty wrapper"
// test below — so this is only exercised by the Tailwind-classes test further
// down). jsdom has no implementation; a no-op stub is enough since we never need
// the callback to fire (we're only asserting the rendered className, not playback).
if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] { return []; }
  }
  window.IntersectionObserver = MockIntersectionObserver;
}

const sec = <T extends string>(i: number, type: T) => {
  const s = home.columns.colPos0[i];
  if (s.type !== type) throw new Error(`expected ${type} at ${i}, got ${s.type}`);
  return s as Extract<typeof s, { type: T }>;
};

describe('basic sections', () => {
  it('ImgText renders both images, title and text with the link', () => {
    const { container } = render(<ImgText section={sec(1, 'mask_imgtext')} />);
    expect(container.firstElementChild?.className).toBe('default space-before- mask mask_imgtext');
    const imgLeft = container.querySelector('.image-left picture img');
    expect([imgLeft?.getAttribute('width'), imgLeft?.getAttribute('height')]).toEqual(['501', '390']);
    const imgRight = container.querySelector('.image-right picture img');
    expect([imgRight?.getAttribute('width'), imgRight?.getAttribute('height')]).toEqual(['570', '510']);
    // The title renders through SplitWords, which strips the whitespace-only text
    // node the CMS export leaves after every <br> (see stripBreakWhitespace in
    // components/ui/SplitWords.tsx) before jsdom ever normalizes the CRLF, same as
    // tests/unit/hero.test.tsx.
    expect(container.querySelector('.content h2.title')?.innerHTML).toBe('Travel back <br>to the beginnings <br>of everything');
    expect(container.querySelector('.content .text a.linkdetail')?.getAttribute('href')).toBe('/alpine-hide/');
  });
  it('Img renders one full-bleed picture', () => {
    const { container } = render(<Img section={sec(7, 'mask_img')} />);
    expect(container.firstElementChild?.className).toBe('default space-before- mask mask_img grid-container');
    const img = container.querySelector('.image picture img');
    expect([img?.getAttribute('width'), img?.getAttribute('height')]).toEqual(['1920', '1080']);
  });
  it('Video renders an empty wrapper when there is no video', () => {
    const { container } = render(<Video section={sec(2, 'mask_video')} />);
    expect(container.firstElementChild?.className).toBe('default space-before- mask mask_video grid-container');
    expect(container.querySelector('video')).toBeNull();
  });
  it('Video applies its Tailwind grid/aspect classes to the <video> element when content exists', () => {
    // The homepage's real mask_video instance (originsVideo) has no video source
    // configured yet, so the case above never renders a <video> at all — this is
    // the only place that actually exercises Video.css's conversion.
    const section: VideoSection = {
      id: 999,
      type: 'mask_video',
      appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
      content: { video: [{ src: '/test.mp4', mime: 'video/mp4' }], videosummer: [] },
    };
    const { container } = render(<Video section={section} />);
    expect(container.querySelector('video')?.className).toBe(
      'aspect-[16/9] col-start-2 col-span-12 w-full max-lg:aspect-[16/10] max-lg:object-cover',
    );
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
    const breakLeft = container.querySelector('.image-left picture img');
    expect([breakLeft?.getAttribute('width'), breakLeft?.getAttribute('height')]).toEqual(['570', '510']);
    const breakRight = container.querySelector('.image-right picture img');
    expect([breakRight?.getAttribute('width'), breakRight?.getAttribute('height')]).toEqual(['352', '280']);
  });
});
