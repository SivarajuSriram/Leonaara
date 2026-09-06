import { describe, it, expect } from 'vitest';
import { imprint } from '@/content/en/imprint';
import { privacy } from '@/content/en/privacy';
import { cookies } from '@/content/en/cookies';

describe('legal pages content', () => {
  it('imprint has one footerpagetext section with the literal copy', () => {
    expect(imprint.columns.colPos0.map((s) => s.type)).toEqual(['mask_footerpagetext']);
    const s = imprint.columns.colPos0[0];
    if (s.type !== 'mask_footerpagetext') throw new Error('expected footerpagetext');
    expect(s.content.title).toBe('Imprint');
    expect(s.content.text).toContain('Almkönig GmbH');
    expect(s.content.text).toContain('Ulrike Meutzner Photography');
    expect(imprint.meta.title).toBe('eriro - our imprint');
    expect(imprint.meta.robots.noIndex).toBe(true);
    expect(imprint.id).toBe(5);
    expect(imprint.slug).toBe('/imprint/');
  });

  it('privacy has footerpagetext, includepage, footerpagetext in order', () => {
    expect(privacy.columns.colPos0.map((s) => s.type)).toEqual([
      'mask_footerpagetext', 'hanthaincludepage_includepage', 'mask_footerpagetext',
    ]);
    const first = privacy.columns.colPos0[0];
    if (first.type !== 'mask_footerpagetext') throw new Error('expected footerpagetext');
    expect(first.content.title).toBe('Privacy');
    expect(first.content.text).toContain('article 4, paragraph 7, GDPR');
    const include = privacy.columns.colPos0[1];
    if (include.type !== 'hanthaincludepage_includepage') throw new Error('expected includepage');
    expect(include.content.html.length).toBeGreaterThan(20000);
    const last = privacy.columns.colPos0[2];
    if (last.type !== 'mask_footerpagetext') throw new Error('expected footerpagetext');
    expect(last.content.title).toBe(' ADDITIVE+');
    expect(last.content.text).toContain('ADDITIVE Srl');
  });

  it('cookies has an empty placeholder, an includepage, and the consent button', () => {
    expect(cookies.columns.colPos0.map((s) => s.type)).toEqual([
      'mask_footerpagetext', 'hanthaincludepage_includepage', 'mask_cookieconsentbutton',
    ]);
    const placeholder = cookies.columns.colPos0[0];
    if (placeholder.type !== 'mask_footerpagetext') throw new Error('expected footerpagetext');
    expect(placeholder.content.title).toBe('');
    expect(placeholder.content.text).toBe('');
    const include = cookies.columns.colPos0[1];
    if (include.type !== 'hanthaincludepage_includepage') throw new Error('expected includepage');
    expect(include.content.html.length).toBeGreaterThan(9000);
    const button = cookies.columns.colPos0[2];
    if (button.type !== 'mask_cookieconsentbutton') throw new Error('expected cookieconsentbutton');
    expect(button.content.buttontext).toBe('Cookies settings');
  });
});
