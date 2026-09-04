import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { home } from '@/content/en/home';
import { metadataFor } from '@/lib/pages';

vi.mock('@/lib/gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn(), timeline: vi.fn(() => ({ to: vi.fn() })) },
  SplitText: { create: vi.fn(() => ({ words: [], revert: vi.fn() })) },
  ScrollTrigger: { refresh: vi.fn() },
  ScrollSmoother: { create: vi.fn() },
  useGSAP: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/en/' }));

describe('SectionRenderer', () => {
  it('renders every homepage section in order with its mask class', () => {
    const { container } = render(<SectionRenderer sections={home.columns.colPos0} />);
    const classes = Array.from(container.querySelectorAll(':scope > .mask')).map((el) => Array.from(el.classList).find((c) => c.startsWith('mask_')));
    expect(classes).toEqual(home.columns.colPos0.map((s) => s.type));
  });
  it('skips unknown section types', () => {
    // 'mask_gallery' is a real TYPO3 content type (see lib/content.ts's UnknownSection) with no
    // renderer yet, so it exercises SectionRenderer's default case without an unsound type cast.
    const { container } = render(
      <SectionRenderer sections={[{ id: 1, type: 'mask_gallery', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: {} }]} />,
    );
    expect(container.children.length).toBe(0);
  });
});

describe('metadataFor', () => {
  it('maps the page meta to Next metadata', () => {
    const m = metadataFor(home);
    expect(m.title).toBe('eriro - Experience alpine originality');
    expect(m.description).toContain('smallest luxury hideaway');
    expect((m.openGraph as { title?: string }).title).toBe('eriro Alpine Hide');
    expect((m.openGraph as { images?: { url: string }[] }).images?.[0].url).toBe('/images/2c0a3fac2ab04ecb63b3c016f3214849.jpg');
    expect(m.alternates?.canonical).toBe('/en/');
  });
});
