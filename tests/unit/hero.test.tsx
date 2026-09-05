import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { home } from '@/content/en/home';

vi.mock('@/lib/gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn(), timeline: vi.fn(() => ({ to: vi.fn() })) },
  SplitText: { create: vi.fn(() => ({ words: [], revert: vi.fn() })) },
  ScrollTrigger: { refresh: vi.fn() },
  useGSAP: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }));

describe('Hero', () => {
  const hero = home.columns.colPos0[0];
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  it('renders the default layout with summer images and literal copy', () => {
    const { container } = render(<Hero section={hero} />);
    const root = container.firstElementChild as HTMLElement;
    // Phase 1b (Tailwind conversion, spec §16.4): the `.mask_hero.space-before-`
    // padding-top override now lives as a Tailwind utility on this same outer
    // element (matching where the original CSS rule actually applied), not on
    // the inner .grid-container — see components/sections/Hero.tsx's `paddingTop`.
    expect(root.className).toBe('default space-before- mask mask_hero hero-default pt-[43rem] max-lg:pt-[22.5rem]');
    // The HTML parser normalizes CRLF to LF while setting innerHTML (WHATWG HTML
    // "preprocessing the input stream"), so the fixture's literal \r\n never survives
    // a dangerouslySetInnerHTML round-trip even in a real browser; normalize before comparing.
    const crlf = (s: string) => s.replace(/\r\n/g, '\n');
    // Tailwind conversion dropped the `.title`/`.titleimg`/`.titleh2`/`.image-big`/
    // `.image-small` class names in favor of inline utility strings, so these
    // elements are now found structurally (there's exactly one of each) or by
    // the Picture props (widthD) that identify big vs. small images.
    expect(container.querySelector('h1')?.innerHTML).toBe(crlf(hero.content.title));
    expect(container.querySelector('p.h1')?.innerHTML).toBe(crlf(hero.content.titleimg));
    // titleh2 renders through SplitWords, which also strips the whitespace-only text
    // node the CMS export leaves after every <br> (see stripBreakWhitespace in
    // components/ui/SplitWords.tsx) before the browser ever normalizes the CRLF.
    const stripBreakWhitespace = (s: string) => s.replace(/(<br\s*\/?>)\s+(?!<br)/gi, '$1');
    expect(container.querySelector('h2')?.innerHTML).toBe(crlf(stripBreakWhitespace(hero.content.titleh2)));
    const big = container.querySelector('img[width="1014"]') as HTMLImageElement;
    expect(big.getAttribute('src')).toContain('AlexMoling_Eriro_Exterior.jpg');
    expect([big.getAttribute('width'), big.getAttribute('height')]).toEqual(['1014', '780']);
    expect(big.getAttribute('loading')).toBeNull();
    const small = container.querySelector('img[width="272"]') as HTMLImageElement;
    expect([small.getAttribute('width'), small.getAttribute('height')]).toEqual(['272', '360']);
    // One art-direction <source> per Picture now (mobile variant); next/image's
    // own optimizer generates the responsive srcSet, replacing the old six
    // hand-built breakpoint <source> tags.
    expect(big.closest('picture')?.querySelectorAll('source').length).toBe(1);
  });
});
