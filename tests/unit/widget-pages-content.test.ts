import { describe, it, expect } from 'vitest';
import { newsletter } from '@/content/en/newsletter';
import { voucher } from '@/content/en/voucher';

describe('widget page content', () => {
  it('newsletter has hero then widget_newsletter, correct slug', () => {
    expect(newsletter.slug).toBe('/newsletter/');
    expect(newsletter.columns.colPos0[0].type).toBe('mask_hero');
    expect(newsletter.columns.colPos0[1].type).toBe('mask_widget_newsletter');
  });
  it('voucher has hero then widget_voucher, correct slug', () => {
    expect(voucher.slug).toBe('/voucher/');
    expect(voucher.columns.colPos0[0].type).toBe('mask_hero');
    expect(voucher.columns.colPos0[1].type).toBe('mask_widget_voucher');
  });
});
