import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Accordions } from '@/components/sections/Accordions';
import type { AccordionsSection } from '@/lib/content';

// SplitText and gsap.from are added here (not in the brief's literal mock)
// because this component's title renders via SplitWords
// (components/ui/SplitWords.tsx), which also imports from '@/lib/gsap' and
// calls SplitText.create()/gsap.from() inside its own useGSAP effect. Since
// useGSAP here actually invokes its callback (so Accordions' own morph/height
// effect runs for real against jsdom), SplitWords' effect runs too and needs
// both -- without them the suite fails with "No 'SplitText' export is
// defined..."/"gsap.from is not a function", not a real Accordions bug. Same
// shape already used in tests/unit/sections-basic.test.tsx and
// tests/unit/roomslider.test.tsx.
vi.mock('@/lib/gsap', () => ({
  gsap: { to: vi.fn(), from: vi.fn() },
  SplitText: { create: vi.fn(() => ({ words: [], revert: vi.fn() })) },
  useGSAP: (fn: () => void) => fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }));
// next/link normalizes trailing slashes via a webpack DefinePlugin flag that
// only exists in a real Next build; under Vitest it silently strips them,
// which would fail the biglink href assertion below for reasons unrelated to
// Accordions. Stub it with a plain anchor, same precedent already used in
// tests/unit/roomslider.test.tsx and tests/unit/applink.test.tsx.
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const section: AccordionsSection = {
  id: 42,
  type: 'mask_accordions',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: 'medium', spaceAfter: '' },
  content: {
    title: 'Architecture', text: '',
    accordion: [
      { uid: '1', title: 'First', info: '', text: '<p>First body</p>', linktext: '', link: '' },
      { uid: '2', title: 'Second', info: '', text: '<p>Second body</p>', linktext: 'Apply', link: { href: '/jobs/', target: null, class: null, title: null, linkText: 'Apply', additionalAttributes: [] } },
    ],
  },
};

describe('Accordions', () => {
  it('renders the section title, all headers, and hidden bodies', () => {
    const { container, getByText } = render(<Accordions section={section} />);
    expect(container.firstElementChild?.className).toContain('mask mask_accordions');
    expect(getByText('Architecture')).toBeTruthy();
    expect(container.querySelectorAll('.accordion-header')).toHaveLength(2);
    expect(container.querySelectorAll('.accordion')).toHaveLength(2);
  });
  it('renders each accordion body text', () => {
    const { container } = render(<Accordions section={section} />);
    expect(container.textContent).toContain('First body');
    expect(container.textContent).toContain('Second body');
  });
  it('renders the optional biglink only on the item that has one', () => {
    const { container } = render(<Accordions section={section} />);
    const links = container.querySelectorAll('a.ht-biglink');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toBe('/jobs/');
    expect(links[0].textContent).toBe('Apply');
  });
  it('toggles the open class on click, only one at a time', () => {
    const { container } = render(<Accordions section={section} />);
    const headers = container.querySelectorAll('.accordion-header');
    fireEvent.click(headers[0]);
    expect(container.querySelectorAll('.accordion')[0].className).toContain('open');
    fireEvent.click(headers[1]);
    expect(container.querySelectorAll('.accordion')[0].className).not.toContain('open');
    expect(container.querySelectorAll('.accordion')[1].className).toContain('open');
  });
});
