// Hand-coded replacement for the live site's third-party ADDITIVE
// `OnPageLeadCampaign` widget (#10625) -- spec §16.5 forbids embedding any
// third-party popup script, so this reproduces the widget's *observable
// behaviour* (timing, copy, fields, animation, dismissal) from a fresh
// reference capture (docs/reference/popup/REPORT.md), not its internal
// mechanism. Notably: the live site's dismissal is a side effect of its own
// session-tracking cookie (`additivemc_session_information`) gaining a
// `pausedCampaigns` field -- that's vendor plumbing, not behaviour, so this
// component uses a small purpose-built flag instead (see REPORT.md §6).
//
// Deliberate deviation from the live site's own ~4h dismissal window
// (per user request): dismissal is tracked in sessionStorage, not a
// cookie, so the popup reappears every new browser session (tab/window
// close) instead of staying dismissed for hours.
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';
import { ContactForm, globalContactFormSection } from '@/components/sections/ContactForm';

const DISMISSED_KEY = 'leonaara_popup_dismissed';

function hasBeenDismissed() {
  if (typeof sessionStorage === 'undefined') return false;
  return sessionStorage.getItem(DISMISSED_KEY) === '1';
}

function dismiss() {
  sessionStorage.setItem(DISMISSED_KEY, '1');
}

// --- icons, paths taken verbatim from the captured markup (docs/reference/popup) ---

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? 'h-[2.4rem] w-[2.4rem] shrink-0 fill-current'} aria-hidden="true">
      <path d="M19.5 6C19.7761 6 20 6.22386 20 6.5V17.5C20 17.7761 19.7761 18 19.5 18H4.5C4.22386 18 4 17.7761 4 17.5V6.5C4 6.22386 4.22386 6 4.5 6H19.5ZM18.5 9.327L12.2918 13.7903C12.1175 13.9156 11.8825 13.9156 11.7082 13.7903L5.5 9.328V16.5H18.5V9.327ZM18.472 7.5H5.527L12 12.1527L18.472 7.5Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[2.4rem] w-[2.4rem] fill-ink" aria-hidden="true">
      <path d="M13.0578 12L17.8308 16.773C18.0261 16.9682 18.0261 17.2848 17.8308 17.4801L17.4772 17.8336C17.282 18.0289 16.9654 18.0289 16.7701 17.8336L11.9972 13.0607L7.2242 17.8336C7.02893 18.0289 6.71235 18.0289 6.51709 17.8336L6.16354 17.4801C5.96827 17.2848 5.96827 16.9682 6.16354 16.773L10.9365 12L6.16354 7.22703C5.96827 7.03177 5.96827 6.71519 6.16354 6.51993L6.51709 6.16637C6.71235 5.97111 7.02893 5.97111 7.2242 6.16637L11.9972 10.9393L16.7701 6.16637C16.9654 5.97111 17.282 5.97111 17.4772 6.16637L17.8308 6.51993C18.0261 6.71519 18.0261 7.03177 17.8308 7.22703L13.0578 12Z" />
    </svg>
  );
}

// The popup used to gate the actual contact form behind an email-only first
// step (the live ADDITIVE widget's own flow) and then reimplement the same
// fields a second time by hand. Per the user's explicit request it now
// reuses the site-wide ContactForm component directly -- same fields, same
// submit handling, no duplicate markup to drift out of sync -- with only the
// popup's own heading/copy above it and an onSubmitted callback wired to
// advance to the success state.
function FormStep({ onSubmitted }: { onSubmitted: () => void }) {
  return (
    <div>
      {/* Sized down from the original 42px/24px reference (and the intro
          paragraph shortened to one sentence): fitting the heading + copy +
          the full compact ContactForm into the popup's column without an
          internal scrollbar left no room for the fuller reference copy. */}
      <h2
        id="newsletter-popup-heading"
        className="pb-[1rem] text-[32px] leading-[36px] font-light tracking-[0.025em] text-ink max-lg:pb-[0.8rem] max-lg:text-[24px] max-lg:leading-[28px] max-lg:tracking-[0.05em]"
      >
        Discover an Unhurried Way of Life with Leonaara
      </h2>
      <p className="mb-[1.6rem] text-[1.7rem] leading-[2.3rem] tracking-[0.025em] text-ink">
        Join our family to receive advance previews, exclusive invitations, and privileges curated for those seeking stillness and a deeper connection with nature.
      </p>
      <ContactForm section={globalContactFormSection} onSubmitted={onSubmitted} compact />
    </div>
  );
}

// The vendor's real flow is a double opt-in (REPORT.md §4): submitting the
// form doesn't grant the offer, it shows this "check your email" state. This
// project has no email backend (spec §15's forms are validating stubs), so
// there's nothing beyond this to build -- it's a stub confirmation, not a
// functioning opt-in gate.
function SuccessState() {
  return (
    <div className="flex flex-col items-center gap-[1.6rem] py-[4rem] text-center">
      <EnvelopeIcon className="h-[4.8rem] w-[4.8rem] fill-ink" />
      {/* Same id as FormStep's heading -- see the card div's aria-labelledby
          below -- so the dialog gets an updated, still-valid accessible name
          once it reaches this state, instead of a dangling reference. */}
      <h2 id="newsletter-popup-heading" className="text-[2.4rem] leading-[2.8rem] font-light tracking-[0.025em] text-ink">Almost done!</h2>
      <p className="max-w-[42rem] text-[1.6rem] leading-[2.2rem] tracking-[0.025em] text-ink">
        Thank you for your registration. To complete your sign-up, please check your email inbox and click the confirmation
        link in the email we sent you.
      </p>
    </div>
  );
}

type Step = 1 | 2;

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);

  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasBeenDismissed()) return;
    const t = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(t);
  }, []);

  // Scroll lock: a plain useEffect, not useGSAP -- useGSAP defers its
  // returned cleanup to actual unmount when `dependencies` is non-empty
  // (see @gsap/react's deferCleanup behaviour), but this component never
  // unmounts (it lives in app/layout.tsx and just returns null when closed),
  // so a cleanup registered inside useGSAP would never run and the lock
  // would never release. A plain useEffect's cleanup runs on every
  // dependency change, which is what's needed here: lock while open,
  // unlock the instant `open` goes false.
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  // Open animation: backdrop fades 0->.5 opacity over 0.3s linear. The card's
  // entrance uses the same 0.5s cubic-bezier(.85,1.5,.5,1) overshoot curve on
  // both viewports, but a different property per the capture: desktop scales
  // .9->1, mobile (a bottom sheet) slides translateY(20%)->0 instead
  // (REPORT.md §1/§5) -- so pick the property from the viewport at open time.
  // GSAP's `ease` option can't parse a raw CSS cubic-bezier(...) string
  // (gsap.parseEase() returns undefined for one -- verified directly against
  // this project's installed gsap package), so the curve is registered once
  // as a named CustomEase ('popupCard', see lib/gsap.ts) and referenced by
  // that name here instead.
  useGSAP(() => {
    if (!open || !backdropRef.current || !cardRef.current) return;
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'linear' });
    const isMobile = window.innerWidth < 1024;
    gsap.fromTo(
      cardRef.current,
      isMobile ? { y: '20%' } : { scale: 0.9 },
      { y: '0%', scale: 1, duration: 0.5, ease: 'popupCard' },
    );
  }, { dependencies: [open] });

  const close = () => {
    dismiss();
    setOpen(false);
    setStep(1);
  };

  if (!open) return null;

  const body: ReactNode = step === 1 ? <FormStep onSubmitted={() => setStep(2)} /> : <SuccessState />;

  return (
    // Backdrop: intentionally has no onClick -- clicking it does nothing,
    // confirmed against the live site (REPORT.md §1).
    <div ref={backdropRef} className="fixed inset-0 z-[9999999] flex items-center justify-center bg-ink/50 max-lg:items-end">
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        // Both steps' body (FormStep's <h2>, SuccessState's <h2>) render an
        // element with this same id, so the dialog always has a valid,
        // non-dangling accessible name in either state.
        aria-labelledby="newsletter-popup-heading"
        // Side-by-side on desktop -- image and the heading/copy/form as two
        // even (flex-1/flex-1) columns -- so the form's fields are visible
        // without scrolling past the photo first. Mobile keeps the original
        // stacked layout (photo on top, form below).
        className="relative m-[4rem] flex max-h-[92%] min-h-[64rem] w-[128rem] max-w-[calc(100%-8rem)] overflow-hidden rounded-[0.2rem] bg-[#F4F2F1] shadow-[0_0.4rem_1.2rem_rgba(0,0,0,0.2),0_0_0_0.1rem_rgba(0,0,0,0.05)] max-lg:absolute max-lg:inset-x-0 max-lg:top-[5.1rem] max-lg:m-0 max-lg:max-h-[calc(100%-5.1rem)] max-lg:min-h-0 max-lg:w-full max-lg:max-w-full max-lg:flex-col max-lg:rounded-b-none"
      >
        {/* Close button lives outside the scrollable content below (matches
            the capture's DOM: sc-fFSQHq sits as a sibling of the scroll
            wrapper), so it stays put while the form content scrolls -- no
            Esc/backdrop dismissal exists anywhere in this component. */}
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-[2rem] right-[2rem] z-10 flex h-[4rem] w-[4rem] cursor-pointer items-center justify-center rounded-[0.2rem] border-0 bg-white/40 backdrop-blur-[2rem] max-lg:sticky max-lg:top-[1.6rem] max-lg:ml-auto max-lg:bg-[#F4F2F1] max-lg:backdrop-blur-none"
        >
          <CloseIcon />
        </button>

        {/* No `h-full` on the image div below: the row flex container's
            default align-items:stretch already sizes it to match the form
            column's height, but `h-full` (a percentage) can't resolve
            against the card's own auto/min-height box, and silently
            collapses to 0, hiding the image entirely. */}
        {step === 1 && (
          <div className="relative flex-1 self-stretch max-lg:h-[18.7rem] max-lg:flex-none max-lg:self-auto">
            <Image src="/images/leonaara-lakeside-repose.jpg" alt="" fill sizes="(max-width: 1023px) 100vw, 620px" className="object-cover" quality={80} />
            <div className="absolute inset-0 bg-ink/20" />
          </div>
        )}

        <div className="flex flex-1 flex-col justify-center overflow-auto p-[2.4rem]">{body}</div>
      </div>
    </div>
  );
}
