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
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/en/' }));

describe('Hero', () => {
  const hero = home.columns.colPos0[0];
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  it('renders the default layout with summer images and literal copy', () => {
    const { container } = render(<Hero section={hero} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toBe('default space-before- mask mask_hero hero-default');
    // The HTML parser normalizes CRLF to LF while setting innerHTML (WHATWG HTML
    // "preprocessing the input stream"), so the fixture's literal \r\n never survives
    // a dangerouslySetInnerHTML round-trip even in a real browser; normalize before comparing.
    const crlf = (s: string) => s.replace(/\r\n/g, '\n');
    expect(container.querySelector('h1.title')?.innerHTML).toBe(crlf(hero.content.title));
    expect(container.querySelector('p.titleimg.h1')?.innerHTML).toBe(crlf(hero.content.titleimg));
    // titleh2 renders through SplitWords, which also strips the whitespace-only text
    // node the CMS export leaves after every <br> (see stripBreakWhitespace in
    // components/ui/SplitWords.tsx) before the browser ever normalizes the CRLF.
    const stripBreakWhitespace = (s: string) => s.replace(/(<br\s*\/?>)\s+(?!<br)/gi, '$1');
    expect(container.querySelector('h2.titleh2')?.innerHTML).toBe(crlf(stripBreakWhitespace(hero.content.titleh2)));
    const big = container.querySelector('.image-big picture img') as HTMLImageElement;
    expect(big.getAttribute('src')).toContain('AlexMoling_Eriro_Exterior.jpg');
    expect(big.getAttribute('src')).toContain('w=1014&h=780');
    expect(big.getAttribute('loading')).toBeNull();
    const small = container.querySelector('.image-small picture img') as HTMLImageElement;
    expect(small.getAttribute('src')).toContain('w=272&h=360');
    expect(container.querySelectorAll('.image-big source').length).toBe(6);
  });
});
