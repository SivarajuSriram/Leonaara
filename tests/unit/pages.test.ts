import { describe, it, expect } from 'vitest';
import { home } from '@/content/en/home';
import { metadataFor } from '@/lib/pages';

describe('metadataFor', () => {
  it('maps the page meta to Next metadata', () => {
    const m = metadataFor(home);
    expect(m.title).toBe('eriro - Experience alpine originality');
    expect(m.description).toContain('smallest luxury hideaway');
    expect((m.openGraph as { title?: string }).title).toBe('eriro Alpine Hide');
    expect((m.openGraph as { images?: { url: string }[] }).images?.[0].url).toBe('/images/2c0a3fac2ab04ecb63b3c016f3214849.jpg');
    expect(m.alternates?.canonical).toBe('/');
  });
});
