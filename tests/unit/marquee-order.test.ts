import { describe, it, expect } from 'vitest';
import { interleave } from '@/components/sections/PartnerMarquee';

describe('interleave', () => {
  it('reproduces the original 5-bucket round robin repeated three times', () => {
    const names = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'];
    const out = interleave(names);
    expect(out.length).toBe(45);
    expect(out.slice(0, 15).join('')).toBe('abcdefghijklmno');
    expect(out.slice(15, 30).join('')).toBe('abcdefghijklmno');
  });
  it('handles counts that are not multiples of five', () => {
    const out = interleave(['a','b','c','d','e','f','g']);
    expect(out.length).toBe(30);
    expect(out.slice(0, 10).join('')).toBe('abcdefgcde');
  });
  it('returns an empty list for no items', () => {
    expect(interleave([])).toEqual([]);
  });
});
