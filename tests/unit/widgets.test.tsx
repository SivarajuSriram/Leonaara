import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { NewsletterWidget } from '@/components/sections/NewsletterWidget';
import { VoucherWidget } from '@/components/sections/VoucherWidget';
import type { NewsletterWidgetSection, VoucherWidgetSection } from '@/lib/content';

const newsletterSection: NewsletterWidgetSection = {
  id: 10, type: 'mask_widget_newsletter',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: 'medium', spaceAfter: '' },
  content: {},
};
const voucherSection: VoucherWidgetSection = {
  id: 11, type: 'mask_widget_voucher',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: 'medium', spaceAfter: '' },
  content: {},
};

describe('NewsletterWidget', () => {
  it('renders the exact empty placeholder div, grid-positioned, no script', () => {
    const { container } = render(<NewsletterWidget section={newsletterSection} />);
    expect(container.firstElementChild?.className).toContain('mask mask_widget_newsletter');
    const widget = container.querySelector('.aa-newsletter-widget');
    expect(widget?.className).toContain('col-start-6');
    expect(widget?.className).toContain('col-span-6');
    const inner = container.querySelector('#additive-newsletter-664458cf61093');
    expect(inner).not.toBeNull();
    expect(inner?.innerHTML).toBe('');
    expect(container.querySelector('script')).toBeNull();
  });
});

describe('VoucherWidget', () => {
  it('renders the exact empty placeholder div, grid-positioned, no script', () => {
    const { container } = render(<VoucherWidget section={voucherSection} />);
    expect(container.firstElementChild?.className).toContain('mask mask_widget_voucher');
    const widget = container.querySelector('.aa-voucher-widget');
    expect(widget?.className).toContain('col-start-2');
    expect(widget?.className).toContain('col-span-12');
    expect(container.querySelector('#internetseite')).not.toBeNull();
    expect(container.querySelector('script')).toBeNull();
  });
});
