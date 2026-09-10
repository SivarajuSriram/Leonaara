import { describe, it, expect, vi } from 'vitest';
import { setHeaderForceHover, onHeaderForceHover } from '@/lib/headerHover';

describe('headerHover pub/sub', () => {
  it('fires immediately with the current value, then again on every set', () => {
    const cb = vi.fn();
    const off = onHeaderForceHover(cb);
    expect(cb).toHaveBeenCalledWith(false); // starts false
    setHeaderForceHover(true);
    expect(cb).toHaveBeenCalledWith(true);
    off();
    setHeaderForceHover(false);
    expect(cb).toHaveBeenCalledTimes(2); // unsubscribed, no third call
  });
});
