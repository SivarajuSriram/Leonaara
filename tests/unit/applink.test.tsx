import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import type { ReactNode, MouseEvent } from 'react';
import type { ScrollSmoother } from 'gsap/ScrollSmoother';
import { AppLink } from '@/components/layout/AppLink';
import { getSmoother } from '@/lib/smoother';

vi.mock('next/navigation', () => ({ usePathname: () => '/', useRouter: () => ({ push: vi.fn() }) }));
// See tests/unit/roomslider.test.tsx: next/link silently strips trailing slashes
// under Vitest (a webpack-only DefinePlugin flag), so stub it with a plain anchor.
// The stub deliberately has no href attribute: jsdom has no router behind it, so
// a real href on an unprevented click makes it try (and fail, noisily) to
// navigate. AppLink's own click logic reads href from the prop, not the DOM.
vi.mock('next/link', () => ({
  default: ({ children, onClick }: { href: string; children: ReactNode; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void }) => (
    <a onClick={onClick}>{children}</a>
  ),
}));
vi.mock('@/lib/smoother', () => ({ getSmoother: vi.fn() }));

const smoother = { scrollTo: vi.fn() } as unknown as ScrollSmoother;

describe('AppLink same-route clicks', () => {
  beforeEach(() => {
    vi.mocked(getSmoother).mockReset().mockReturnValue(smoother);
    vi.mocked(smoother.scrollTo).mockClear();
  });

  it('jumps to top instantly via the smoother instead of navigating when href matches the current pathname', () => {
    const { container } = render(<AppLink href="/">Home</AppLink>);
    const anchor = container.querySelector('a')!;

    const notCancelled = fireEvent.click(anchor, { button: 0 });

    expect(notCancelled).toBe(false); // preventDefault() was called
    expect(smoother.scrollTo).toHaveBeenCalledWith(0, false); // false: instant, no tween
  });

  it('treats a href missing the trailing slash as the same route', () => {
    const { container } = render(<AppLink href="/">Home</AppLink>);
    const anchor = container.querySelector('a')!;

    const notCancelled = fireEvent.click(anchor, { button: 0 });

    expect(notCancelled).toBe(false);
    expect(smoother.scrollTo).toHaveBeenCalledWith(0, false);
  });

  it('lets a link to a different route navigate normally, with no scroll override', () => {
    const { container } = render(<AppLink href="/spa/">Spa</AppLink>);
    const anchor = container.querySelector('a')!;

    const notCancelled = fireEvent.click(anchor, { button: 0 });

    expect(notCancelled).toBe(true); // AppLink did not call preventDefault() itself
    expect(smoother.scrollTo).not.toHaveBeenCalled();
  });

  it('falls back to an instant window.scrollTo when no ScrollSmoother exists (mobile)', () => {
    vi.mocked(getSmoother).mockReturnValue(null);
    const windowScrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const { container } = render(<AppLink href="/">Home</AppLink>);
    const anchor = container.querySelector('a')!;

    fireEvent.click(anchor, { button: 0 });

    expect(windowScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
    windowScrollTo.mockRestore();
  });
});
