import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { List } from '@/components/sections/List';
import type { ListSection } from '@/lib/content';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }));

const section: ListSection = {
  id: 7,
  type: 'mask_list',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: 'medium', spaceAfter: '' },
  content: {
    title: 'Included services', text: '',
    listitems: [
      { uid: '1', title: 'General', text: '<ul><li>overnight stay</li></ul>' },
      { uid: '2', title: 'Dining', text: '<ul><li>breakfast</li></ul>' },
    ],
  },
};

describe('List', () => {
  it('renders the section title and every list item', () => {
    const { container } = render(<List section={section} />);
    expect(container.firstElementChild?.className).toContain('mask mask_list');
    // SplitWords splits text into separate divs, so check via aria-label
    const titleEl = container.querySelector('h2[aria-label="Included services"]');
    expect(titleEl).toBeTruthy();
    expect(container.querySelectorAll('.list-item-row')).toHaveLength(2);
  });
  it('renders each item title as h4 and text with border-top except no bottom padding on the last', () => {
    const { container } = render(<List section={section} />);
    const items = container.querySelectorAll('.list-item-row');
    expect(items[0].querySelector('.list-title')?.tagName).toBe('H4');
    expect(items[0].querySelector('.list-title')?.textContent).toBe('General');
    expect(items[0].className).not.toContain('last:pb-0');
    expect(items[items.length - 1].className).toContain('last:pb-0');
    expect(container.textContent).toContain('breakfast');
  });
});
