import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { NewsletterPopup } from '@/components/layout/NewsletterPopup';

// vi.advanceTimersByTime() runs the setTimeout callback (and its setState)
// outside any React-managed event, so React 19's automatic batching defers
// the resulting re-render to a microtask -- without act(), assertions right
// after would race the flush. Wrapping the advance in act() forces it to
// flush synchronously before the call returns.
function advance5s() {
  act(() => {
    vi.advanceTimersByTime(5000);
  });
}

vi.mock('@/lib/gsap', () => ({
  gsap: { fromTo: vi.fn(), to: vi.fn(), timeline: vi.fn(() => ({ to: vi.fn() })) },
  useGSAP: vi.fn(),
}));

describe('NewsletterPopup', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    sessionStorage.clear();
  });

  it('does not render before 5 seconds have elapsed', () => {
    render(<NewsletterPopup />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders after 5 seconds, when not previously dismissed', () => {
    render(<NewsletterPopup />);
    advance5s();
    expect(screen.getByRole('dialog')).not.toBeNull();
  });

  it('does not render if already dismissed this session', () => {
    sessionStorage.setItem('eriro_popup_dismissed', '1');
    render(<NewsletterPopup />);
    advance5s();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows step 1 content: the offer heading, email field and terms accordion', () => {
    render(<NewsletterPopup />);
    advance5s();
    expect(screen.getByText('€150 Towards Your First Escape at eriro')).not.toBeNull();
    expect(screen.getByLabelText('Email')).not.toBeNull();
    expect(screen.getByText('Show terms and conditions')).not.toBeNull();
    expect(screen.getByRole('button', { name: /claim your €150 welcome gift/i })).not.toBeNull();
  });

  it('advances to step 2 after submitting a valid email, prefilling it there', () => {
    render(<NewsletterPopup />);
    advance5s();
    const email = screen.getByLabelText('Email') as HTMLInputElement;
    fireEvent.change(email, { target: { value: 'popup-capture-test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /claim your €150 welcome gift/i }));

    expect(screen.getByText('Step 2 of 2')).not.toBeNull();
    const step2Email = screen.getByLabelText('Email') as HTMLInputElement;
    expect(step2Email.value).toBe('popup-capture-test@example.com');
  });

  it('blocks step-2 submit until the consent checkbox is checked, with the captured error copy', () => {
    render(<NewsletterPopup />);
    advance5s();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'popup-capture-test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /claim your €150 welcome gift/i }));

    fireEvent.click(screen.getByRole('button', { name: /claim your €150 welcome gift/i }));
    expect(screen.getByText('The privacy policy must be accepted')).not.toBeNull();
  });

  it('closes only via the close button and sets the session dismissal flag', () => {
    render(<NewsletterPopup />);
    advance5s();
    expect(screen.getByRole('dialog')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(sessionStorage.getItem('eriro_popup_dismissed')).toBe('1');
  });

  // Regression: the scroll lock used to be set from inside a useGSAP callback
  // whose cleanup only runs on unmount, not when `open` flips back to false --
  // since this component never unmounts (app/layout.tsx keeps it mounted and
  // it just returns null while closed), the lock was never released. It now
  // lives in a plain useEffect, whose cleanup DOES run on every dependency
  // change, so closing the popup must clear the inline style.
  it('locks scroll while open and releases it on close', () => {
    document.documentElement.style.overflow = '';
    render(<NewsletterPopup />);
    expect(document.documentElement.style.overflow).toBe('');

    advance5s();
    expect(document.documentElement.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(document.documentElement.style.overflow).toBe('');
  });

  // Regression test: the dialog's aria-labelledby="newsletter-popup-heading"
  // is hardcoded once in the card div, but each step renders its own body.
  // Querying with a `name` filter forces Testing Library to resolve the
  // accessible name via aria-labelledby -- if the id doesn't match a
  // rendered element in a given step, this throws (no match), unlike the
  // other tests above which query getByRole('dialog') with no name filter
  // and would pass even with a dangling reference.
  it('has a valid accessible name (aria-labelledby resolves) in all three states', () => {
    render(<NewsletterPopup />);
    advance5s();

    // Step 1: labelled by its visible offer heading.
    expect(screen.getByRole('dialog', { name: '€150 Towards Your First Escape at eriro' })).not.toBeNull();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'popup-capture-test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /claim your €150 welcome gift/i }));

    // Step 2: labelled by a visually hidden heading with the same id --
    // there is no visible on-screen heading on this step.
    expect(screen.getByRole('dialog', { name: '€150 Towards Your First Escape at eriro' })).not.toBeNull();

    fireEvent.click(screen.getByLabelText(/data protection regulations/i));
    fireEvent.click(screen.getByRole('button', { name: /claim your €150 welcome gift/i }));

    // Success state: labelled by its own visible "Almost done!" heading.
    expect(screen.getByRole('dialog', { name: 'Almost done!' })).not.toBeNull();
  });
});
