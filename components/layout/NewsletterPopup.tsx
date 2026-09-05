// Hand-coded replacement for the live site's third-party ADDITIVE
// `OnPageLeadCampaign` widget (#10625) -- spec §16.5 forbids embedding any
// third-party popup script, so this reproduces the widget's *observable
// behaviour* (timing, copy, fields, animation, dismissal) from a fresh
// reference capture (docs/reference/popup/REPORT.md), not its internal
// mechanism. Notably: the live site's dismissal is a side effect of its own
// session-tracking cookie (`additivemc_session_information`) gaining a
// `pausedCampaigns` field -- that's vendor plumbing, not behaviour, so this
// component uses a small purpose-built cookie instead (see REPORT.md §6).
'use client';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';

const COOKIE = 'eriro_popup_dismissed';
const COOKIE_HOURS = 4; // sliding expiry, matching the capture's ~4h window

function hasBeenDismissed() {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((c) => c.startsWith(`${COOKIE}=`));
}

function dismiss() {
  const expires = new Date(Date.now() + COOKIE_HOURS * 3600 * 1000).toUTCString();
  document.cookie = `${COOKIE}=1; expires=${expires}; path=/`;
}

const TERMS = [
  'Valid for your first stay only',
  'Direct hotel bookings only',
  'Minimum stay of 3 nights',
  'Cannot be combined with other offers, discounts or vouchers',
];

const PRIVACY_HREF = 'https://www.eriro.at/en/privacy/';
const ADDITIVE_HREF = 'https://www.additive.eu/?utm_medium=popup&utm_source=www.eriro.at';

// base.css's original global reset (`button,input,textarea{border:1px solid
// #211d1d}`) targets these elements too -- it's in the `base` cascade layer
// so these Tailwind utilities (`utilities` layer) win, but only for
// properties actually declared here, hence the explicit `border-0`.
const inputCls =
  'block h-[4.8rem] w-full rounded-[0.2rem] border-0 bg-ink/5 px-[1.6rem] py-[1.2rem] text-[2rem] leading-[2.6rem] tracking-[0.05em] text-ink shadow-[inset_0_0_0_1px_rgba(33,29,29,0.1)] outline-none placeholder:text-ink/50 hover:bg-ink/10 focus:bg-transparent focus:shadow-[inset_0_0_0_1px_rgba(33,29,29,0.5)]';

const labelCls = 'block pb-[0.4rem] text-[1.4rem] leading-[1.6rem] tracking-[0.025em] text-ink/62';

const submitCls =
  'flex h-[4.8rem] w-full cursor-pointer items-center justify-center rounded-[0.2rem] border-0 bg-ink px-[2.8rem] text-[2rem] leading-[2.5rem] tracking-[0.03em] text-[#F5F4F2] uppercase shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[filter] duration-100 outline-none hover:brightness-110 active:brightness-95';

// --- icons, paths taken verbatim from the captured markup (docs/reference/popup) ---

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? 'h-[2.4rem] w-[2.4rem] shrink-0 fill-current'} aria-hidden="true">
      <path d="M19.5 6C19.7761 6 20 6.22386 20 6.5V17.5C20 17.7761 19.7761 18 19.5 18H4.5C4.22386 18 4 17.7761 4 17.5V6.5C4 6.22386 4.22386 6 4.5 6H19.5ZM18.5 9.327L12.2918 13.7903C12.1175 13.9156 11.8825 13.9156 11.7082 13.7903L5.5 9.328V16.5H18.5V9.327ZM18.472 7.5H5.527L12 12.1527L18.472 7.5Z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[2.4rem] w-[2.4rem] shrink-0 fill-ink" aria-hidden="true">
      <path d="M14.5 4C14.7761 4 15 4.22386 15 4.5V5H18.5C18.7761 5 19 5.22386 19 5.5V18.5C19 18.7761 18.7761 19 18.5 19H5.5C5.22386 19 5 18.7761 5 18.5V5.5C5 5.22386 5.22386 5 5.5 5H9V4.5C9 4.22386 9.22386 4 9.5 4H14.5ZM9 6.5H6.5V17.5H17.5V6.5H15V8.5C15 8.77614 14.7761 9 14.5 9H9.5C9.22386 9 9 8.77614 9 8.5V6.5ZM15.5 14C15.7761 14 16 14.2239 16 14.5V15C16 15.2761 15.7761 15.5 15.5 15.5H8.5C8.22386 15.5 8 15.2761 8 15V14.5C8 14.2239 8.22386 14 8.5 14H15.5ZM15.5 11C15.7761 11 16 11.2239 16 11.5V12C16 12.2761 15.7761 12.5 15.5 12.5H8.5C8.22386 12.5 8 12.2761 8 12V11.5C8 11.2239 8.22386 11 8.5 11H15.5ZM13.5 5.5H10.5V7.5H13.5V5.5Z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className ?? 'h-[1.6rem] w-[1.6rem] shrink-0 fill-ink transition-transform duration-300'} aria-hidden="true">
      <path d="M5.04315 6.52708C4.88556 6.30646 5.04327 6 5.31439 6H10.6856C10.9567 6 11.1144 6.30646 10.9568 6.52708L8.27124 10.2869C8.1383 10.473 7.86169 10.473 7.72875 10.2869L5.04315 6.52708Z" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 14 12" className="h-[1.2rem] w-[1.4rem] shrink-0 fill-ink" aria-hidden="true">
      <path d="M2.97018 5.37482H12.7113C12.9414 5.37482 13.128 5.56137 13.128 5.79149V6.20816C13.128 6.43827 12.9414 6.62482 12.7113 6.62482H2.97018L6.60861 10.2633C6.77133 10.426 6.77133 10.6898 6.60861 10.8525L6.31398 11.1471C6.15126 11.3099 5.88744 11.3099 5.72473 11.1471L0.872039 6.29445C0.70932 6.13173 0.70932 5.86791 0.872039 5.70519L5.72473 0.852508C5.88744 0.689789 6.15126 0.689789 6.31398 0.852508L6.60861 1.14714C6.77133 1.30985 6.77133 1.57367 6.60861 1.73639L2.97018 5.37482Z" />
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

// wordmark, captured from the popup's own "powered by" footer link
function AdditiveLogo() {
  return (
    <svg viewBox="0 0 90 24" className="h-[1.6rem] w-auto fill-current" aria-hidden="true">
      <path d="M89.5413 9.1505C89.5413 9.20742 89.5213 9.25548 89.4818 9.29503C89.4419 9.33496 89.3938 9.35455 89.3373 9.35455H87.0509V11.6342C87.0509 11.6912 87.031 11.7392 86.9914 11.7788C86.9519 11.8187 86.9034 11.8383 86.8469 11.8383H85.1975C85.1409 11.8383 85.0925 11.8187 85.0529 11.7788C85.0134 11.7392 84.9934 11.6912 84.9934 11.6342V9.35455H82.7071C82.6502 9.35455 82.6021 9.33496 82.5625 9.29503C82.5226 9.25548 82.503 9.20742 82.503 9.1505V7.50109C82.503 7.44453 82.5226 7.39647 82.5625 7.35655C82.6021 7.317 82.6502 7.29703 82.7071 7.29703H84.9934V5.00405C84.9934 4.94749 85.0134 4.89944 85.0529 4.85951C85.0925 4.81996 85.1409 4.8 85.1975 4.8H86.8469C86.9034 4.8 86.9519 4.81996 86.9914 4.85951C87.031 4.89944 87.0509 4.94749 87.0509 5.00405V7.29703H89.3373C89.3938 7.29703 89.4419 7.317 89.4818 7.35655C89.5213 7.39647 89.5413 7.44453 89.5413 7.50109V9.1505ZM73.4413 17.0575C73.4413 17.1144 73.4693 17.1425 73.5263 17.1425H78.0834C78.14 17.1425 78.188 17.1624 78.228 17.202C78.2675 17.2419 78.2875 17.29 78.2875 17.3465V18.9959C78.2875 19.0529 78.2675 19.1009 78.228 19.1405C78.188 19.1804 78.14 19.2 78.0834 19.2H71.2477C71.1908 19.2 71.1427 19.1804 71.1032 19.1405C71.0632 19.1009 71.0437 19.0529 71.0437 18.9959V7.50109C71.0437 7.44453 71.0632 7.39647 71.1032 7.35655C71.1427 7.317 71.1908 7.29703 71.2477 7.29703H78.0834C78.14 7.29703 78.188 7.317 78.228 7.35655C78.2675 7.39647 78.2875 7.44453 78.2875 7.50109V9.1505C78.2875 9.20742 78.2675 9.25548 78.228 9.29503C78.188 9.33496 78.14 9.35455 78.0834 9.35455H73.5263C73.4693 9.35455 73.4413 9.38301 73.4413 9.43957V12.0922C73.4413 12.1492 73.4693 12.1772 73.5263 12.1772H77.231C77.2875 12.1772 77.3356 12.1972 77.3755 12.2368C77.4151 12.2767 77.435 12.3247 77.435 12.3813V14.0307C77.435 14.0876 77.4151 14.1357 77.3755 14.1752C77.3356 14.2152 77.2875 14.2348 77.231 14.2348H73.5263C73.4693 14.2348 73.4413 14.2632 73.4413 14.3198V17.0575ZM64.514 19.03C64.48 19.1434 64.4006 19.2 64.276 19.2H62.1164C61.9915 19.2 61.9124 19.1434 61.8784 19.03L58.9196 7.51809V7.45007C58.9196 7.34805 58.9817 7.29703 59.1067 7.29703H61.2662C61.3908 7.29703 61.4644 7.35951 61.4873 7.48408L63.2047 15.3911C63.2158 15.4365 63.2328 15.4591 63.2557 15.4591C63.2783 15.4591 63.2953 15.4365 63.3067 15.3911L65.0072 7.48408C65.0297 7.35951 65.1033 7.29703 65.2282 7.29703H67.3197C67.4783 7.29703 67.5408 7.37097 67.5068 7.51809L64.514 19.03ZM55.1451 19.1405C55.1051 19.1804 55.0571 19.2 55.0005 19.2H53.011C52.9541 19.2 52.9061 19.1804 52.8665 19.1405C52.8266 19.1009 52.807 19.0529 52.807 18.9959V7.50109C52.807 7.44453 52.8266 7.39647 52.8665 7.35655C52.9061 7.317 52.9541 7.29703 53.011 7.29703H55.0005C55.0571 7.29703 55.1051 7.317 55.1451 7.35655C55.1846 7.39647 55.2046 7.44453 55.2046 7.50109V18.9959C55.2046 19.0529 55.1846 19.1009 55.1451 19.1405ZM49.357 9.31204C49.3171 9.35196 49.269 9.37155 49.2124 9.37155H46.6278C46.5709 9.37155 46.5428 9.40002 46.5428 9.45657V18.9959C46.5428 19.0529 46.5228 19.1009 46.4833 19.1405C46.4433 19.1804 46.3953 19.2 46.3387 19.2H44.3492C44.2923 19.2 44.2442 19.1804 44.2047 19.1405C44.1648 19.1009 44.1452 19.0529 44.1452 18.9959V9.45657C44.1452 9.40002 44.1167 9.37155 44.0602 9.37155H41.5605C41.5036 9.37155 41.4556 9.35196 41.416 9.31204C41.3761 9.27248 41.3565 9.22443 41.3565 9.1675V7.50109C41.3565 7.44453 41.3761 7.39647 41.416 7.35655C41.4556 7.317 41.5036 7.29703 41.5605 7.29703H49.2124C49.269 7.29703 49.3171 7.317 49.357 7.35655C49.3965 7.39647 49.4165 7.44453 49.4165 7.50109V9.1675C49.4165 9.22443 49.3965 9.27248 49.357 9.31204ZM37.9135 19.1405C37.8736 19.1804 37.8255 19.2 37.769 19.2H35.7795C35.7225 19.2 35.6745 19.1804 35.6349 19.1405C35.595 19.1009 35.5754 19.0529 35.5754 18.9959V7.50109C35.5754 7.44453 35.595 7.39647 35.6349 7.35655C35.6745 7.317 35.7225 7.29703 35.7795 7.29703H37.769C37.8255 7.29703 37.8736 7.317 37.9135 7.35655C37.953 7.39647 37.973 7.44453 37.973 7.50109V18.9959C37.973 19.0529 37.953 19.1009 37.9135 19.1405ZM31.161 17.5676C30.8434 18.0892 30.3928 18.4917 29.8091 18.7749C29.2251 19.0584 28.5534 19.2 27.7941 19.2H24.1382C24.0813 19.2 24.0332 19.1804 23.9937 19.1405C23.9538 19.1009 23.9342 19.0529 23.9342 18.9959V7.50109C23.9342 7.44453 23.9538 7.39647 23.9937 7.35655C24.0332 7.317 24.0813 7.29703 24.1382 7.29703H27.7941C28.5534 7.29703 29.2251 7.43898 29.8091 7.72214C30.3928 8.00567 30.8434 8.40822 31.161 8.92944C31.4781 9.45103 31.6371 10.0576 31.6371 10.7489V15.7481C31.6371 16.4398 31.4781 17.0464 31.161 17.5676ZM29.2395 15.4761V11.021C29.2395 10.5108 29.109 10.1057 28.8484 9.80516C28.5874 9.505 28.2418 9.35455 27.8111 9.35455H26.4168C26.3599 9.35455 26.3318 9.38301 26.3318 9.43957V17.0575C26.3318 17.1144 26.3599 17.1425 26.4168 17.1425L27.8111 17.1255C28.2303 17.1255 28.5704 16.9754 28.8314 16.6749C29.092 16.3747 29.228 15.9751 29.2395 15.4761ZM19.6491 17.5676C19.3319 18.0892 18.8813 18.4917 18.2973 18.7749C17.7136 19.0584 17.0419 19.2 16.2823 19.2H12.6263C12.5698 19.2 12.5217 19.1804 12.4818 19.1405C12.4423 19.1009 12.4223 19.0529 12.4223 18.9959V7.50109C12.4223 7.44453 12.4423 7.39647 12.4818 7.35655C12.5217 7.317 12.5698 7.29703 12.6263 7.29703H16.2823C17.0419 7.29703 17.7136 7.43898 18.2973 7.72214C18.8813 8.00567 19.3319 8.40822 19.6491 8.92944C19.9666 9.45103 20.1252 10.0576 20.1252 10.7489V15.7481C20.1252 16.4398 19.9666 17.0464 19.6491 17.5676ZM17.7276 15.4761V11.021C17.7276 10.5108 17.5975 10.1057 17.3365 9.80516C17.0759 9.505 16.7303 9.35455 16.2993 9.35455H14.9049C14.8484 9.35455 14.8199 9.38301 14.8199 9.43957V17.0575C14.8199 17.1144 14.8484 17.1425 14.9049 17.1425L16.2993 17.1255C16.7188 17.1255 17.0589 16.9754 17.3195 16.6749C17.5805 16.3747 17.7165 15.9751 17.7276 15.4761ZM9.10684 19.047C9.10684 19.149 9.04437 19.2 8.9198 19.2H6.82827C6.71479 19.2 6.64123 19.1434 6.60722 19.03L4.61772 10.5108C4.60626 10.4657 4.58926 10.4458 4.56671 10.4513C4.54379 10.4572 4.52679 10.4768 4.5157 10.5108L2.47519 19.03C2.44118 19.1434 2.3617 19.2 2.23713 19.2H0.179618C0.0321245 19.2 -0.024433 19.1264 0.00957545 18.9789L3.07034 7.46708C3.10435 7.35396 3.18345 7.29703 3.3084 7.29703H5.77401C5.89859 7.29703 5.97806 7.35396 6.01207 7.46708L9.08984 18.9789L9.10684 19.047Z" />
    </svg>
  );
}

function PoweredByAdditive() {
  return (
    <a href={ADDITIVE_HREF} target="_blank" rel="noopener noreferrer" className="mt-[1.6rem] flex items-center justify-end gap-[0.8rem] text-ink/50">
      <span className="text-[1.4rem] leading-[1.6rem] tracking-[0.025em]">powered by</span>
      <AdditiveLogo />
    </a>
  );
}

// Identical accordion on both steps: collapsed via `grid-template-rows: 0fr`
// (clipped by the inner overflow-hidden wrapper), expanded via `1fr` -- the
// same CSS grid trick the capture found, just written as a Tailwind class swap.
function TermsAccordion() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mb-[0.8rem] flex cursor-pointer items-center gap-[0.8rem] border-0 text-left"
      >
        <ClipboardIcon />
        <span className="text-[1.4rem] leading-[1.6rem] tracking-[0.025em] text-ink">Show terms and conditions</span>
        <ChevronDownIcon className={`h-[1.6rem] w-[1.6rem] shrink-0 fill-ink transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <ul className="list-disc pl-[2.4rem] text-[1.4rem] leading-[1.6rem] tracking-[0.025em] text-ink">
            {TERMS.map((t) => (
              <li key={t} className="mb-[0.4rem]">{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ConsentCheckbox({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error: boolean }) {
  return (
    <div className="mt-[1.6rem]">
      <label className="flex cursor-pointer items-start gap-[1.2rem]">
        {/* base.css's global reset forces `-webkit-appearance:none!important`
            on every input (including checkboxes), which silently strips the
            native checkmark -- confirmed by screenshot: a checked native
            checkbox rendered visually blank, and only another `!important`
            rule can out-rank one, which Tailwind's arbitrary-property syntax
            couldn't express reliably for a vendor-prefixed property. Since
            `checked` is already tracked in React state, it's simpler and
            more robust to keep the native input for accessibility (focusable,
            labelled, real keyboard/checked semantics) but visually hidden,
            and drive a decorative box's look directly from that state
            instead of fighting the CSS reset. */}
        <span className="relative mt-[0.2rem] inline-block h-[2rem] w-[2rem] shrink-0">
          {/* `peer` + a following sibling's `peer-*` variant requires the two
              to actually be siblings -- this input must come before, and be
              a sibling of, the decorative box below, not its child. */}
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[0.2rem] bg-ink/5 shadow-[inset_0_0_0_1px_rgba(33,29,29,0.1)] peer-focus-visible:shadow-[inset_0_0_0_2px_rgba(33,29,29,0.8)]">
            {checked && (
              <svg viewBox="0 0 16 16" className="h-[1.2rem] w-[1.2rem] fill-none stroke-ink" aria-hidden="true">
                <path d="M3 8.5l3 3 7-7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </span>
        <span className="text-[1.4rem] leading-[1.6rem] tracking-[0.025em] text-ink">
          I have acknowledged the{' '}
          <a href={PRIVACY_HREF} target="_blank" rel="noopener noreferrer" className="underline">
            data protection regulations
          </a>
        </span>
      </label>
      {error && <p className="mt-[0.4rem] text-[1.4rem] leading-[1.6rem] tracking-[0.025em] text-[#EB5A61]">The privacy policy must be accepted</p>}
    </div>
  );
}

type FieldState = {
  email: string; setEmail: (v: string) => void;
  salutation: string; setSalutation: (v: string) => void;
  givenName: string; setGivenName: (v: string) => void;
  familyName: string; setFamilyName: (v: string) => void;
  consent: boolean; setConsent: (v: boolean) => void;
  consentError: boolean;
};

function Step1({ fields, onSubmit }: { fields: FieldState; onSubmit: (e: FormEvent) => void }) {
  return (
    <div className="grid grid-cols-2 gap-x-[4.8rem] max-lg:grid-cols-1 max-lg:gap-y-[2.4rem]">
      <div>
        <h2
          id="newsletter-popup-heading"
          className="pb-[1.6rem] text-[4.2rem] leading-[3.94rem] font-light tracking-[0.025em] text-ink max-lg:pb-[0.8rem] max-lg:text-[2.4rem] max-lg:leading-[2.8rem] max-lg:tracking-[0.1em] max-lg:uppercase"
        >
          €150 Towards Your First Escape at eriro
        </h2>
        <p className="text-[2rem] leading-[2.6rem] tracking-[0.05em] text-ink">
          Welcome to 1,550 metres, where the mountain&apos;s timeless energy shapes every moment. Join our newsletter and enjoy
          €150 towards your first stay at eriro—an intimate Alpine hideaway with just nine suites, created for those seeking
          stillness, space and a deeper connection with nature.
        </p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col pt-[8rem] max-lg:pt-0">
        <label className={labelCls} htmlFor="popup-email-1">Email</label>
        <input
          id="popup-email-1"
          name="email"
          type="email"
          required
          placeholder="Email"
          value={fields.email}
          onChange={(e) => fields.setEmail(e.target.value)}
          className={inputCls}
        />
        <div className="mt-[4rem]">
          <TermsAccordion />
        </div>
        <button type="submit" className={`mt-[1.6rem] ${submitCls}`}>
          <EnvelopeIcon />
          <span className="ml-[1.2rem]">Claim Your €150 Welcome Gift</span>
        </button>
        <PoweredByAdditive />
      </form>
    </div>
  );
}

function Step2({ fields, barRef, onBack, onSubmit }: { fields: FieldState; barRef: React.RefObject<HTMLDivElement | null>; onBack: () => void; onSubmit: (e: FormEvent) => void }) {
  return (
    <div>
      {/* Step 2's capture has no visible on-screen heading (unlike step 1's
          <h2> and the success state's "Almost done!"), but the dialog's
          aria-labelledby (see the card div below) needs an element with id
          "newsletter-popup-heading" to exist in every step, or assistive
          tech gets a dangling reference and the dialog reads as unlabeled.
          A visually hidden heading keeps the same accessible name across
          steps 1 and 2 (same offer/form) without adding anything to the
          capture's visible DOM. */}
      <h2 id="newsletter-popup-heading" className="sr-only">
        €150 Towards Your First Escape at eriro
      </h2>
      <div className="mb-[2.4rem]">
        <button type="button" onClick={onBack} className="inline-flex cursor-pointer items-center gap-[0.4rem] border-0 border-b border-ink pb-[0.4rem] text-[1.4rem] leading-[1.6rem] tracking-[0.025em] font-bold text-ink">
          <BackIcon />
          <span>Back</span>
        </button>
        <div className="mt-[4rem]">
          <div className="mb-[0.8rem] flex items-center justify-between text-[1.4rem] leading-[1.6rem] tracking-[0.025em] text-ink/50">
            <span>Step 2 of 2</span>
            <span>100 %</span>
          </div>
          <div className="flex w-full gap-[0.8rem]">
            <div className="h-[0.4rem] flex-1 overflow-hidden rounded-[0.2rem] bg-ink/5">
              <div className="h-full w-full origin-left rounded-[0.2rem] bg-ink" />
            </div>
            <div className="h-[0.4rem] flex-1 overflow-hidden rounded-[0.2rem] bg-ink/5">
              <div ref={barRef} className="h-full w-full origin-left scale-x-0 rounded-[0.2rem] bg-ink" />
            </div>
          </div>
        </div>
      </div>

      {/*
        Desktop is a real 2-column CSS grid with explicit per-field grid-area
        placement (col 1: Salutation/Given/Family in document flow; col 2:
        Email/consent/submit pinned to rows 1-3 -- see REPORT.md §8's
        `.jdxYcn`/`.hvHjON`/`.fceoxO`/`.ghdedO`/`.cxdlxA` rules). On mobile
        the grid collapses to one column and grid-area resets to auto, so
        the *document order* below is written to match the mobile stacking
        order from the capture (Salutation, Given, Family, Email, terms,
        submit) -- desktop's explicit grid-area placement is unaffected by
        this order.
      */}
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-x-[1.6rem] gap-y-[0.4rem] max-lg:grid-cols-1 max-lg:gap-y-[2rem]">
        <div className="self-end max-lg:self-auto">
          <label className={labelCls} htmlFor="popup-salutation">Salutation</label>
          <select
            id="popup-salutation"
            name="salutation"
            value={fields.salutation}
            onChange={(e) => fields.setSalutation(e.target.value)}
            className={inputCls}
          >
            <option value="">Choose salutation</option>
            <option value="none">None</option>
            <option value="f">Ms.</option>
            <option value="m">Mr.</option>
          </select>
        </div>
        <div className="self-end max-lg:self-auto">
          <label className={labelCls} htmlFor="popup-given-name">Given name</label>
          <input
            id="popup-given-name"
            name="givenName"
            placeholder="Given name"
            value={fields.givenName}
            onChange={(e) => fields.setGivenName(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="self-end max-lg:self-auto">
          <label className={labelCls} htmlFor="popup-family-name">Family name</label>
          <input
            id="popup-family-name"
            name="familyName"
            placeholder="Family name"
            value={fields.familyName}
            onChange={(e) => fields.setFamilyName(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="self-end max-lg:self-auto [grid-area:1/2] max-lg:[grid-area:auto]">
          <label className={labelCls} htmlFor="popup-email-2">Email</label>
          <input
            id="popup-email-2"
            name="email"
            type="email"
            required
            placeholder="Email"
            value={fields.email}
            onChange={(e) => fields.setEmail(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col self-end max-lg:self-auto [grid-area:2/2] max-lg:[grid-area:auto]">
          <TermsAccordion />
          <ConsentCheckbox checked={fields.consent} onChange={fields.setConsent} error={fields.consentError} />
        </div>
        <div className="mt-[2rem] self-end max-lg:mt-0 max-lg:self-auto [grid-area:3/2] max-lg:[grid-area:auto]">
          <button type="submit" className={submitCls}>
            <EnvelopeIcon />
            <span className="ml-[1.2rem]">Claim Your €150 Welcome Gift</span>
          </button>
        </div>
      </form>
      <PoweredByAdditive />
    </div>
  );
}

// The vendor's real flow is a double opt-in (REPORT.md §4): submitting step 2
// doesn't grant the offer, it shows this "check your email" state. This
// project has no email backend (spec §15's forms are validating stubs), so
// there's nothing beyond this to build -- it's a stub confirmation, not a
// functioning opt-in gate.
function SuccessState() {
  return (
    <div className="flex flex-col items-center gap-[1.6rem] py-[4rem] text-center">
      <EnvelopeIcon className="h-[4.8rem] w-[4.8rem] fill-ink" />
      {/* Same id as Step1's and Step2's heading -- see the card div's
          aria-labelledby below -- so the dialog gets an updated, still-valid
          accessible name once it reaches this state, instead of a dangling
          reference. */}
      <h2 id="newsletter-popup-heading" className="text-[2.4rem] leading-[2.8rem] font-light tracking-[0.025em] text-ink">Almost done!</h2>
      <p className="max-w-[42rem] text-[1.6rem] leading-[2.2rem] tracking-[0.025em] text-ink">
        Thank you for your registration. To complete your sign-up, please check your email inbox and click the confirmation
        link in the email we sent you.
      </p>
      <PoweredByAdditive />
    </div>
  );
}

type Step = 1 | 2 | 3;

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [salutation, setSalutation] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasBeenDismissed()) return;
    const t = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(t);
  }, []);

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
    document.documentElement.style.overflow = 'hidden';
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'linear' });
    const isMobile = window.innerWidth < 1024;
    gsap.fromTo(
      cardRef.current,
      isMobile ? { y: '20%' } : { scale: 0.9 },
      { y: '0%', scale: 1, duration: 0.5, ease: 'popupCard' },
    );
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, { dependencies: [open] });

  // Step-2 progress bar: the 2nd segment fills in on mount (NEW finding in
  // the capture, separate from the card-open animation above).
  useGSAP(() => {
    if (step !== 2 || !barRef.current) return;
    gsap.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'popupBar' });
  }, { dependencies: [step] });

  const reset = () => {
    setStep(1);
    setEmail('');
    setSalutation('');
    setGivenName('');
    setFamilyName('');
    setConsent(false);
    setConsentError(false);
  };

  const close = () => {
    dismiss();
    setOpen(false);
    reset();
  };

  const submitStep1 = (e: FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const submitStep2 = (e: FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    setStep(3);
  };

  if (!open) return null;

  const fields: FieldState = { email, setEmail, salutation, setSalutation, givenName, setGivenName, familyName, setFamilyName, consent, setConsent, consentError };

  let body: ReactNode;
  if (step === 1) body = <Step1 fields={fields} onSubmit={submitStep1} />;
  else if (step === 2) body = <Step2 fields={fields} barRef={barRef} onBack={() => setStep(1)} onSubmit={submitStep2} />;
  else body = <SuccessState />;

  return (
    // Backdrop: intentionally has no onClick -- clicking it does nothing,
    // confirmed against the live site (REPORT.md §1).
    <div ref={backdropRef} className="fixed inset-0 z-[9999999] flex items-center justify-center bg-ink/50 max-lg:items-end">
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        // Every step's body (Step1's <h2>, Step2's sr-only <h2>,
        // SuccessState's <h2>) renders an element with this same id, so the
        // dialog always has a valid, non-dangling accessible name -- not
        // just on step 1.
        aria-labelledby="newsletter-popup-heading"
        className="relative m-[4rem] flex max-h-[85%] min-h-[36rem] w-[84rem] max-w-[calc(100%-8rem)] flex-col overflow-hidden rounded-[0.2rem] bg-[#F4F2F1] shadow-[0_0.4rem_1.2rem_rgba(0,0,0,0.2),0_0_0_0.1rem_rgba(0,0,0,0.05)] max-lg:absolute max-lg:inset-x-0 max-lg:top-[5.1rem] max-lg:m-0 max-lg:max-h-[calc(100%-5.1rem)] max-lg:min-h-0 max-lg:w-full max-lg:max-w-full max-lg:rounded-b-none"
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

        {step === 1 && (
          <div className="relative h-[32rem] w-full shrink-0 max-lg:h-[18.7rem]">
            <Image src="/images/eriro-alpine-hide-oesterreich-ehrwald-luxus-08.jpg" alt="" fill sizes="84rem" className="object-cover" quality={80} />
            <div className="absolute inset-0 bg-ink/20" />
          </div>
        )}

        <div className="flex-1 overflow-auto p-[3.2rem]">{body}</div>
      </div>
    </div>
  );
}
