import { describe, it, expect } from 'vitest';
import { home } from '@/content/en/home';
import { imprint } from '@/content/en/imprint';
import { privacy } from '@/content/en/privacy';
import { cookies } from '@/content/en/cookies';
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
  it('maps imprint meta, noIndex included', () => {
    const m = metadataFor(imprint);
    expect(m.title).toBe('eriro - our imprint');
    expect(m.robots).toEqual(expect.objectContaining({ index: false, follow: true }));
    expect(m.alternates?.canonical).toBe('/imprint/');
  });
  it('maps privacy meta', () => {
    const m = metadataFor(privacy);
    expect(m.title).toBe('eriro - Information on data privacy');
    expect(m.alternates?.canonical).toBe('/privacy/');
  });
  it('maps cookies meta', () => {
    const m = metadataFor(cookies);
    expect(m.title).toBe('Cookie policy of eriro');
    expect(m.alternates?.canonical).toBe('/cookies/');
  });
});
