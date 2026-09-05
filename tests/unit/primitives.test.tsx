import { describe, it, expect, vi } from 'vitest';
import { isWinter } from '@/lib/season';
import { setSmoother, onSmoother } from '@/lib/smoother';

describe('isWinter', () => {
  it('is false when the start timestamp is 0 (site setting)', () => {
    expect(isWinter(new Date('2026-01-15T00:00:00Z'), 0, 1792999620)).toBe(false);
  });
  it('is true outside the summer window when both timestamps are set', () => {
    const start = Date.UTC(2020, 4, 1) / 1000; // 1 May
    const end = Date.UTC(2020, 9, 26) / 1000; // 26 Oct
    expect(isWinter(new Date('2026-12-15T00:00:00Z'), start, end)).toBe(true);
    expect(isWinter(new Date('2026-07-15T00:00:00Z'), start, end)).toBe(false);
  });
});

describe('smoother store', () => {
  it('notifies a subscriber immediately with the current value, even when null', () => {
    setSmoother(null);
    const cb = vi.fn();
    const off = onSmoother(cb);
    expect(cb).toHaveBeenCalledWith(null);
    off();
  });

  it('is a persistent subscription: fires again on every later setSmoother call, not just once', () => {
    // Mirrors SmoothScroll.tsx's resize-driven kill()/create() cycle at the
    // 1024px breakpoint: a real caller (useParallax) needs to hear about the
    // smoother dying (null) and the replacement instance, not just the first one.
    setSmoother(null);
    const cb = vi.fn();
    const off = onSmoother(cb);
    const instanceA = {} as never;
    setSmoother(instanceA); // create() at desktop width
    expect(cb).toHaveBeenCalledWith(instanceA);
    setSmoother(null); // kill() crossing below 1024px
    expect(cb).toHaveBeenCalledWith(null);
    const instanceB = {} as never;
    setSmoother(instanceB); // create() crossing back above 1024px -- a NEW instance
    expect(cb).toHaveBeenCalledWith(instanceB);
    expect(cb).toHaveBeenCalledTimes(4); // initial null, instanceA, null, instanceB
    off();
  });

  it('stops notifying once the returned unsubscribe function is called', () => {
    setSmoother(null);
    const cb = vi.fn();
    const off = onSmoother(cb);
    off();
    cb.mockClear();
    setSmoother({} as never);
    expect(cb).not.toHaveBeenCalled();
  });
});
