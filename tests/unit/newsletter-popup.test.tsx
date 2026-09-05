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

function clearDismissalCookie() {
  document.cookie = 'eriro_popup_dismissed=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

describe('NewsletterPopup', () => {
  beforeEach(() => {
    clearDismissalCookie();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    clearDismissalCookie();
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

  it('does not render if the dismissal cookie is set', () => {
    document.cookie = 'eriro_popup_dismissed=1; path=/';
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

  it('closes only via the close button and sets the dismissal cookie', () => {
    render(<NewsletterPopup />);
    advance5s();
    expect(screen.getByRole('dialog')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.cookie).toContain('eriro_popup_dismissed=1');
  });
});
