import type { FooterPageTextSection } from '@/lib/content';
import { RichText } from '@/components/ui/RichText';

// mask_footerpagetext .text,h1{grid-column-end:span 12;grid-column-start:2}
// Narrowed to a centered 8-of-12 columns at desktop (was col-span-12, full
// width) for the privacy-page redesign: unconstrained, a paragraph of legal
// body text runs well past a comfortable reading measure on wide screens.
// A separate max-w-[76rem] was tried first, but this site's root font-size
// is itself viewport-width-relative (see :root's vw-based font-size in
// globals.css, uncapped past the 1024px breakpoint) -- so rem values here
// aren't a stable measure the way they'd be in a normal fixed-16px-root
// site, and that max-w just squeezed the text into roughly the left 40% of
// the viewport, left-anchored, with a huge dead void to its right instead of
// centering it (this is what the user flagged as "messed up" on wide
// screens). Column spans within the site's own existing fluid grid scale
// and center correctly by construction, without fighting that system.
const contentCls = 'legal-content col-start-4 col-span-8 max-lg:col-start-2 max-lg:col-span-12';

// layout-8's original `main>div:first-child{margin-top:0;padding-top:45rem}`
// (mobile 25rem): tried shrinking this to pt-[20rem]/pt-[12rem] on the
// assumption the 720px gap was just excess, but it turned out load-bearing
// -- Header.tsx's <Logo/> is a large, fixed, centered wordmark that only
// fades away once the page scrolls (Logo.tsx's own scroll-scrubbed fade);
// pages with a real hero image sit the logo on top of that image
// harmlessly, but this page has no hero, so the shrunk padding put the logo
// directly over the "Privacy" title and controller details at first
// paint -- restored to (near) the original values.
export function FooterPageText({ section, first }: { section: FooterPageTextSection; first?: boolean }) {
  const c = section.content;
  const cls = [
    section.appearance.layout,
    `space-before-${section.appearance.spaceBefore}`,
    'mask',
    'mask_footerpagetext',
    first ? 'pt-[42rem] max-lg:pt-[24rem]' : '',
  ].filter(Boolean).join(' ');
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className="grid-container">
        {c.title ? <RichText as="h1" className={contentCls} html={c.title} /> : null}
        {c.text ? <RichText className={contentCls} html={c.text} /> : null}
      </div>
    </div>
  );
}
