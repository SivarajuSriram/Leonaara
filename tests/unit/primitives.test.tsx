import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Mask } from '@/components/sections/Mask';
import { isWinter } from '@/lib/season';
import { setSmoother, onSmoother } from '@/lib/smoother';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/en/' }));

describe('Mask', () => {
  it('renders the original wrapper classes and uid', () => {
    const { container } = render(
      <Mask type="imgtext" uid={75} appearance={{ layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }}>
        <span>x</span>
      </Mask>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toBe('default space-before- mask mask_imgtext');
    expect(el.getAttribute('uid')).toBe('c75');
  });
  it('adds extra classes after the mask classes', () => {
    const { container } = render(
      <Mask type="img" uid={712} className="grid-container" appearance={{ layout: 'default', frameClass: 'default', spaceBefore: 'large', spaceAfter: '' }} />,
    );
    expect((container.firstElementChild as HTMLElement).className).toBe('default space-before-large mask mask_img grid-container');
  });
});

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
  it('runs queued callbacks once a smoother is set', () => {
    const cb = vi.fn();
    setSmoother(null);
    onSmoother(cb);
    expect(cb).not.toHaveBeenCalled();
    const fake = {} as never;
    setSmoother(fake);
    expect(cb).toHaveBeenCalledWith(fake);
    const cb2 = vi.fn();
    onSmoother(cb2);
    expect(cb2).toHaveBeenCalledWith(fake);
  });
});
