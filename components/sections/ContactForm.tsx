'use client';
import { useState, type FormEvent } from 'react';
import type { ContactFormSection } from '@/lib/content';
import { RichText } from '@/components/ui/RichText';

// Visual-only: there's no form backend yet (eriro's own Powermail form posts
// into TYPO3's mail queue, which this project has no equivalent of), so
// Submit just prevents the page reload rather than sending anything.
// Wire up a real backend (API route, form service, mailto) before relying
// on this for actual leads.
//
// Styling matches eriro.at's own contact-and-arrival form closely: a white
// card, sharp-cornered outlined fields (no fill, no border-radius) with
// plain placeholder text (no separate label), and an outlined (not solid)
// Submit button sized to its content, not full-width.
const wrapperCls = 'grid-container mask mask_powermail';
// `[grid-column:1/span_14]` spans all 14 outer grid tracks (incl. margins)
// for the full-bleed white background -- same technique Img.tsx uses. But
// that div is then a plain box, not itself a grid, so its own children can't
// use col-start/col-span to line back up with the site's usual margins --
// hence nesting a second `grid-container` inside it, which recreates those
// same margin/content columns relative to this (now full-width) box.
const cardCls = '[grid-column:1/span_14] grid-container py-[6rem] max-lg:py-[3rem]';
// Matches the col-start-2/col-span-12 content width used everywhere else on
// the site (List, Accordions, etc.) -- the earlier max-w-[64rem] cap made
// the form much narrower than the reference's, which fills that same width.
const innerCls = 'col-start-2 col-span-12';
// `compact` (used when this form is embedded in the newsletter popup, a
// fixed-height dialog rather than a full page) trims the padding/spacing
// below that was sized for a full-width page section, so the whole form
// fits the popup's column without needing its own internal scroll.
const compactCardCls = '[grid-column:1/span_14] grid-container py-[2rem]';
const fieldsetCls = 'mb-[3rem]';
const compactFieldsetCls = 'mb-[1.2rem]';
const legendCls = 'mb-[1.6rem] block text-[2.4rem] font-light';
const compactLegendCls = 'mb-[1rem] block text-[2.2rem] font-light';
const inputCls =
  'block h-[6rem] w-full border border-ink/25 bg-transparent px-[1.6rem] text-[1.6rem] tracking-[0.02em] text-ink outline-none placeholder:text-ink/70 focus:border-ink';
const compactInputCls =
  'block h-[5.2rem] w-full border border-ink/25 bg-transparent px-[1.6rem] text-[1.8rem] tracking-[0.02em] text-ink outline-none placeholder:text-ink/70 focus:border-ink';
const textareaCls = `${inputCls} h-[12rem] py-[1.2rem] resize-y`;
const compactTextareaCls = `${compactInputCls} h-[7rem] py-[1.2rem] resize-y`;
const fieldRowCls = 'grid grid-cols-2 gap-[2rem] mb-[2rem] max-lg:grid-cols-1 max-lg:gap-[1.5rem]';
const compactFieldRowCls = 'grid grid-cols-2 gap-[1.4rem] mb-[1.4rem] max-lg:grid-cols-1 max-lg:gap-[1rem]';
const selectCls = `${inputCls} appearance-none bg-no-repeat pr-[4rem]`;
const compactSelectCls = `${compactInputCls} appearance-none bg-no-repeat pr-[3.6rem]`;
// Inline style, not a Tailwind arbitrary background-image utility: the
// data-URI's nested quotes/spaces don't survive Tailwind's arbitrary-value
// parsing reliably, which silently dropped the chevron entirely.
const selectChevronStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23211D1D' stroke-width='1.4'/%3E%3C/svg%3E\")",
  backgroundPosition: 'right 1.6rem center',
  backgroundSize: '1.2rem',
};
// wave-fill: the same water-fill hover as the site's other buttons
// (ht-button/ht-biglink/linkdetail in globals.css) -- it only supplies
// position:relative/overflow:hidden for the pseudo-elements, so the
// border/padding/font styling below is untouched; the old instant
// hover:bg-ink/hover:text-[...] swap is dropped since wave-fill's own
// hover rule (color:canvas, :not(:disabled)-guarded) replaces it.
const submitCls =
  'wave-fill inline-flex h-[5.6rem] items-center justify-center whitespace-nowrap border border-ink bg-transparent px-[3.5rem] text-[1.5rem] tracking-[0.03em] text-ink uppercase outline-none disabled:opacity-40 disabled:cursor-not-allowed';
const compactSubmitCls =
  'wave-fill inline-flex h-[5rem] items-center justify-center whitespace-nowrap border border-ink bg-transparent px-[3.2rem] text-[1.5rem] tracking-[0.03em] text-ink uppercase outline-none disabled:opacity-40 disabled:cursor-not-allowed';

export const VISIT_PURPOSES = ['Site Visit', 'Brochure Download', 'Other'] as const;

// Default section content for the site-wide instance mounted once in the
// root layout (below every page's own content, above the Footer) -- see
// app/layout.tsx. Pages that already define their own powermail_pi1 block
// (e.g. contact.ts) keep rendering that one too via the normal content
// pipeline; this constant only covers the global, page-content-independent
// mount point.
export const globalContactFormSection: ContactFormSection = {
  id: 0,
  type: 'powermail_pi1',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: { title: '', text: '' },
};

export function ContactForm({ section, onSubmitted, compact = false }: { section: ContactFormSection; onSubmitted?: () => void; compact?: boolean }) {
  const c = section.content;
  const [consent, setConsent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // No backend wired up yet -- see file header comment.
    onSubmitted?.();
  };

  return (
    <div className={wrapperCls} {...{ uid: `c${section.id}` }}>
      <div className={compact ? compactCardCls : cardCls}>
        <div className={innerCls}>
          {c.title ? <h2 className="mb-[1rem] text-[3rem] font-light max-lg:text-[2.4rem]">{c.title}</h2> : null}
          {c.text ? <RichText className="mb-[3rem] text-ink/70" html={c.text} /> : null}
          <form onSubmit={onSubmit}>
            <fieldset className={compact ? compactFieldsetCls : fieldsetCls}>
              <legend className={compact ? compactLegendCls : legendCls}>Personal data</legend>
              <div className={compact ? compactFieldRowCls : fieldRowCls}>
                <input name="name" type="text" required placeholder="Name*" className={compact ? compactInputCls : inputCls} />
                <input name="phone" type="tel" required placeholder="Phone*" className={compact ? compactInputCls : inputCls} />
              </div>
              <div className={compact ? compactFieldRowCls : fieldRowCls}>
                <input name="email" type="email" required placeholder="E-Mail*" className={compact ? compactInputCls : inputCls} />
                <select name="purpose" required defaultValue="" className={compact ? compactSelectCls : selectCls} style={selectChevronStyle}>
                  <option value="" disabled>Purpose of Visit*</option>
                  {VISIT_PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <textarea name="message" placeholder="Message" rows={compact ? 2 : undefined} className={compact ? compactTextareaCls : textareaCls} />
            </fieldset>
            <p className={`text-right text-ink/50 ${compact ? 'mb-[0.8rem] text-[1.5rem]' : 'mb-[1rem] text-[1.6rem]'}`}>* Required fields</p>
            <label className={`flex items-start gap-[1rem] cursor-pointer ${compact ? 'mb-[1.4rem] text-[1.8rem] leading-[1.5]' : 'mb-[2.5rem] text-[1.7rem] leading-[1.5]'}`}>
              <span className="relative mt-[0.2rem] h-[1.8rem] w-[1.8rem] shrink-0">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center border border-ink/40 peer-focus-visible:border-ink">
                  {consent && (
                    <svg viewBox="0 0 16 16" className="h-[1.2rem] w-[1.2rem] fill-none stroke-ink" aria-hidden="true">
                      <path d="M3 8.5l3 3 7-7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </span>
              I authorize Leonaara and its representatives to Call, SMS, Email, or WhatsApp me about its services and offers. This consent overrides any registration for DND / NDNC.
            </label>
            <button type="submit" className={compact ? compactSubmitCls : submitCls} disabled={!consent}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
