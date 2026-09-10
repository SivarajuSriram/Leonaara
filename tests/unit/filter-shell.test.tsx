import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { FilterShell } from '@/components/sections/FilterShell';

const scrollTriggerCreate = vi.fn();
// contextSafe is a pass-through in tests -- real @gsap/react ties it to
// component-unmount cleanup, which isn't under test here. useGSAP's real
// signature calls the callback with (context, contextSafe) synchronously
// (FilterShell.tsx relies on that second param, not the returned value,
// inside its own useGSAP callback -- see the comment there for why), and
// returns { context, contextSafe } once it completes.
const contextSafe = (fn: (...args: unknown[]) => unknown) => fn;
vi.mock('@/lib/gsap', () => ({
  gsap: { to: vi.fn() },
  ScrollTrigger: { create: (...args: unknown[]) => scrollTriggerCreate(...args), refresh: vi.fn() },
  useGSAP: (cb: (context?: unknown, contextSafe?: (fn: (...args: unknown[]) => unknown) => unknown) => void) => {
    cb(undefined, contextSafe);
    return { contextSafe };
  },
}));

const appearance = { layout: 'default', frameClass: 'default', spaceBefore: '' as const, spaceAfter: '' };
const items = [
  { uid: '1', title: 'Leiba', href: '/leiba/' },
  { uid: '4', title: 'Sela', href: '/sela/' },
];
const nodes = [<div key="a" data-testid="leiba-content">Leiba body</div>, <div key="b" data-testid="sela-content">Sela body</div>];
const metaByIndex = [
  { title: 'Leiba meta title', description: 'Leiba meta description' },
  { title: 'Sela meta title', description: 'Sela meta description' },
];

beforeEach(() => {
  scrollTriggerCreate.mockClear();
  document.title = '';
  document.head.innerHTML = '<meta name="description" content="" />';
  window.history.replaceState({}, '', '/leiba/');
});

// This project doesn't set vitest's `globals: true`, so Testing Library's
// auto-cleanup-after-each never registers (it needs a global `afterEach`) --
// same reason tests/unit/newsletter-popup.test.tsx calls cleanup() explicitly.
// Without it, renders from one `it` leak into the next test's DOM.
afterEach(() => {
  cleanup();
});

describe('FilterShell', () => {
  it('renders items and the initially active node, marks the active item', () => {
    const { container } = render(
      <FilterShell id={1} appearance={appearance} variant="pagefilter" items={items} nodes={nodes} activeIndex={0} metaByIndex={metaByIndex} />
    );
    expect(screen.getByTestId('leiba-content')).toBeInTheDocument();
    expect(screen.queryByTestId('sela-content')).not.toBeInTheDocument();
    const filterItems = container.querySelectorAll('.filter-item');
    expect(filterItems[0].classList.contains('active')).toBe(true);
    expect(filterItems[1].classList.contains('active')).toBe(false);
  });

  it('renders no content node when activeIndex is null (the hub with nothing selected)', () => {
    render(<FilterShell id={1} appearance={appearance} variant="pagefilter" items={items} nodes={nodes} activeIndex={null} metaByIndex={metaByIndex} />);
    expect(screen.queryByTestId('leiba-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sela-content')).not.toBeInTheDocument();
  });

  it('clicking a different item swaps the content, sets active class, updates title/meta and pushes history', () => {
    const { container } = render(
      <FilterShell id={1} appearance={appearance} variant="pagefilter" items={items} nodes={nodes} activeIndex={0} metaByIndex={metaByIndex} />
    );
    const filterItems = container.querySelectorAll('.filter-item');
    fireEvent.click(filterItems[1]);
    expect(screen.getByTestId('sela-content')).toBeInTheDocument();
    expect(screen.queryByTestId('leiba-content')).not.toBeInTheDocument();
    expect(filterItems[0].classList.contains('active')).toBe(false);
    expect(filterItems[1].classList.contains('active')).toBe(true);
    expect(document.title).toBe('Sela meta title');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Sela meta description');
    expect(window.location.pathname).toBe('/sela/');
  });

  it('mask class matches the variant', () => {
    const { container: pf } = render(<FilterShell id={1} appearance={appearance} variant="pagefilter" items={items} nodes={nodes} activeIndex={0} metaByIndex={metaByIndex} />);
    expect(pf.querySelector('.mask_pagefilter')).not.toBeNull();
    const { container: rm } = render(<FilterShell id={2} appearance={appearance} variant="rooms" items={items} nodes={nodes} activeIndex={0} metaByIndex={metaByIndex} />);
    expect(rm.querySelector('.mask_rooms')).not.toBeNull();
  });
});
