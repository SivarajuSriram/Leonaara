// tests/unit/homepage-composition.test.tsx — replaces section-renderer.test.tsx's
// "every section renders with its mask class" assertion, now against app/page.tsx directly.
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import HomePage from '@/app/page';

vi.mock('@/lib/gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn(), timeline: vi.fn(() => ({ to: vi.fn() })) },
  SplitText: { create: vi.fn(() => ({ words: [], revert: vi.fn() })) },
  ScrollTrigger: { refresh: vi.fn() },
  ScrollSmoother: { create: vi.fn() },
  useGSAP: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }));

describe('HomePage', () => {
  it('renders all 15 sections in the spec §4 order with their mask classes', () => {
    const { container } = render(<HomePage />);
    const classes = Array.from(container.querySelectorAll(':scope > main > .mask')).map(
      (el) => Array.from(el.classList).find((c) => c.startsWith('mask_')),
    );
    expect(classes).toEqual([
      'mask_hero', 'mask_imgtext', 'mask_video', 'mask_quote', 'mask_roomslider',
      'mask_imgtext', 'mask_imgtext', 'mask_img', 'mask_break', 'mask_imgtext',
      'mask_img', 'mask_imgtext', 'mask_img', 'mask_teaserslider', 'mask_partnermarquee',
    ]);
  });
});
