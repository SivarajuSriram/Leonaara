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
// plain placeholder text (no separate label) except Title/Tel, which get a
// small label + underline rule above the field like the reference does, and
// an outlined (not solid) Submit button sized to its content, not full-width.
const wrapperCls = 'grid-container mask mask_powermail';
// `[grid-column:1/span_14]` spans all 14 outer grid tracks (incl. margins)
// for the full-bleed white background -- same technique Img.tsx uses. But
// that div is then a plain box, not itself a grid, so its own children can't
// use col-start/col-span to line back up with the site's usual margins --
// hence nesting a second `grid-container` inside it, which recreates those
// same margin/content columns relative to this (now full-width) box.
const cardCls = '[grid-column:1/span_14] bg-white grid-container py-[6rem] max-lg:py-[3rem]';
// Matches the col-start-2/col-span-12 content width used everywhere else on
// the site (List, Accordions, etc.) -- the earlier max-w-[64rem] cap made
// the form much narrower than the reference's, which fills that same width.
const innerCls = 'col-start-2 col-span-12';
const fieldsetCls = 'mb-[3rem]';
const legendCls = 'mb-[1.6rem] block text-[2.4rem] font-light';
// The small label + underline rule sitting above Title/Tel, echoing the
// reference's own floating-label-on-the-border treatment.
const smallLabelRowCls = 'mb-[0.8rem] flex items-center gap-[1rem]';
const smallLabelCls = 'text-[1.4rem] text-ink/60 whitespace-nowrap';
const smallLabelRuleCls = 'h-px flex-1 bg-ink/20';
const inputCls =
  'block h-[6rem] w-full border border-ink/25 bg-transparent px-[1.6rem] text-[1.6rem] tracking-[0.02em] text-ink outline-none placeholder:text-ink/70 focus:border-ink';
const textareaCls = `${inputCls} h-[12rem] py-[1.2rem] resize-y`;
const titleGroupCls = 'flex h-[6rem] w-full max-w-[32rem] border border-ink/25';
// app/globals.css forces `border:1px solid #211d1d` on every button/input/
// textarea site-wide -- without `border-0` here, each pill got its own
// unwanted individual border on top of titleGroupCls's shared outer one.
// Selected state is a light background fill (matching the reference),
// not a border or bg-ink/text-color inversion.
const titlePillCls = (active: boolean) =>
  // `bg-transparent` is required even on the inactive branch -- without it
  // the browser's own default <button> background (a light gray) showed
  // through on BOTH pills, not just a difference on the active one.
  // Hovering an unselected pill previews a plain gray fill; clicking commits
  // it to the beige "selected" fill, which then persists regardless of
  // hover (an active pill doesn't need its own hover state -- it's already
  // filled in).
  `flex-1 flex items-center justify-center border-0 text-[1.6rem] cursor-pointer transition-colors ${active ? 'bg-beige text-ink' : 'bg-transparent hover:bg-ink/10 text-ink/60'}`;
const fieldRowCls = 'grid grid-cols-2 gap-[2rem] mb-[2rem] max-lg:grid-cols-1 max-lg:gap-[1.5rem]';
const submitCls =
  'inline-flex h-[5.6rem] items-center justify-center whitespace-nowrap border border-ink bg-transparent px-[3.5rem] text-[1.5rem] tracking-[0.03em] text-ink uppercase transition-colors outline-none hover:bg-ink hover:text-[#F5F4F2] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ink';

const TITLES = ['Mr.', 'Mrs.'] as const;

export function ContactForm({ section }: { section: ContactFormSection }) {
  const c = section.content;
  const [title, setTitle] = useState<(typeof TITLES)[number] | null>(null);
  const [consent, setConsent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // No backend wired up yet -- see file header comment.
  };

  return (
    <div className={wrapperCls} {...{ uid: `c${section.id}` }}>
      <div className={cardCls}>
        <div className={innerCls}>
          {c.title ? <h2 className="mb-[1rem] text-[3rem] font-light max-lg:text-[2.4rem]">{c.title}</h2> : null}
          {c.text ? <RichText className="mb-[3rem] text-ink/70" html={c.text} /> : null}
          <form onSubmit={onSubmit}>
            <fieldset className={fieldsetCls}>
              <legend className={legendCls}>Personal data</legend>
              <div className="mb-[2rem]">
                <div className={smallLabelRowCls}>
                  <span className={smallLabelCls}>Title*</span>
                  <span className={smallLabelRuleCls} />
                </div>
                <div className={titleGroupCls}>
                  {TITLES.map((t) => (
                    <button key={t} type="button" className={titlePillCls(title === t)} onClick={() => setTitle(t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className={fieldRowCls}>
                <input name="name" type="text" required placeholder="Name*" className={inputCls} />
                <input name="surname" type="text" required placeholder="Surname*" className={inputCls} />
              </div>
              <div className={fieldRowCls}>
                <div>
                  <div className={smallLabelRowCls}>
                    <span className={smallLabelCls}>Tel.</span>
                    <span className={smallLabelRuleCls} />
                  </div>
                  <input name="tel" type="tel" className={inputCls} />
                </div>
                <input name="email" type="email" required placeholder="E-Mail*" className={`${inputCls} self-end`} />
              </div>
              <textarea name="message" placeholder="Message" className={textareaCls} />
            </fieldset>
            <p className="mb-[1rem] text-right text-[1.3rem] text-ink/50">* Required fields</p>
            <label className="mb-[2.5rem] flex items-start gap-[1rem] text-[1.4rem] leading-[1.5] cursor-pointer">
              <input
                type="checkbox"
                name="consent"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-[0.3rem] h-[1.8rem] w-[1.8rem] shrink-0 accent-transparent border border-ink/40"
              />
              I authorize Leonaara and its representatives to Call, SMS, Email, or WhatsApp me about its services and offers. This consent overrides any registration for DND / NDNC.
            </label>
            <button type="submit" className={submitCls} disabled={!consent}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
