import { describe, it, expect, vi } from 'vitest';
import type { ScrollSmoother } from 'gsap/ScrollSmoother';
import { isCurrentPage, isInternal, jumpToTop } from '@/lib/links';
import { getSmoother } from '@/lib/smoother';

vi.mock('@/lib/smoother', () => ({ getSmoother: vi.fn() }));

describe('isInternal', () => {
  it('accepts a same-origin path', () => {
    expect(isInternal('/en/')).toBe(true);
  });

  it('rejects a protocol-relative URL', () => {
    expect(isInternal('//example.com/')).toBe(false);
  });

  it('rejects an absolute external URL', () => {
    expect(isInternal('https://example.com/')).toBe(false);
  });
});

describe('isCurrentPage', () => {
  it('matches an identical href and pathname', () => {
    expect(isCurrentPage('/en/', '/en/')).toBe(true);
  });

  it('ignores a trailing slash on the href', () => {
    expect(isCurrentPage('/en', '/en/')).toBe(true);
  });

  it('ignores a trailing slash on the pathname', () => {
    expect(isCurrentPage('/en/', '/en')).toBe(true);
  });

  it('ignores a query string on the href', () => {
    expect(isCurrentPage('/en/?ref=footer', '/en/')).toBe(true);
  });

  it('ignores a hash on the href', () => {
    expect(isCurrentPage('/en/#top', '/en/')).toBe(true);
  });

  it('does not match a different route', () => {
    expect(isCurrentPage('/en/spa/', '/en/')).toBe(false);
  });
});

describe('jumpToTop', () => {
  it('jumps instantly (no tween) via the smoother when one exists', () => {
    const smoother = { scrollTo: vi.fn() } as unknown as ScrollSmoother;
    vi.mocked(getSmoother).mockReturnValue(smoother);

    jumpToTop();

    expect(smoother.scrollTo).toHaveBeenCalledWith(0, false);
  });

  it('falls back to an instant window.scrollTo when no smoother exists (mobile)', () => {
    vi.mocked(getSmoother).mockReturnValue(null);
    const windowScrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    jumpToTop();

    expect(windowScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
    windowScrollTo.mockRestore();
  });
});
