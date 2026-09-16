// components/layout/Footer.tsx
import type { CSSProperties } from 'react';
import { site } from '@/content/site';
import { AppLink } from './AppLink';
import { LogoIcon } from '@/components/ui/icons';
import { RichText } from '@/components/ui/RichText';

const nl2br = (s: string) => s.replace(/\r?\n/g, '<br>');

// footer{font-size:2rem;font-weight:400;letter-spacing:.08em;line-height:125%;
// margin-top:19rem;text-transform:uppercase} — the file declares this twice more
// for max-width:1023px (once early, once in the big mobile block near the end);
// same specificity, so the later declaration wins per property: the final mobile
// values are font-size:1.3rem, letter-spacing:.05em, line-height:131%,
// margin-top:6rem (font-weight/text-transform are never restated at mobile, so
// they carry through unprefixed).
//
// footer a:not(.link-logo){color:#211d1d;text-decoration:underline;
// text-decoration-color:transparent} + mobile{font-size:1.3rem;letter-spacing:
// .05em;line-height:131%} / :hover{text-decoration-color:#211d1d} /
// .router-link-active{font-size:2rem;font-weight:300;letter-spacing:.08em;
// line-height:125%;opacity:.5;text-transform:uppercase} + mobile{font-size:
// 1.3rem;letter-spacing:.05em;line-height:131%;opacity:.5} / footer nav a{
// display:block} are all expressed here as footer-level descendant arbitrary
// variants instead of per-element classes, for two reasons: (1) it reaches
// every anchor in the footer including the ones RichText injects as raw HTML
// (social/partner links below) which can't carry their own className, and (2)
// the two nav-lang anchors must keep their className exactly
// 'router-link-active' / '' — asserted verbatim by tests/unit/footer.test.tsx —
// so no styling can be added directly to those two elements. .link-logo is
// excluded, same as the original :not().
//
// The anchor-level font-size/letter-spacing/line-height restatements look
// redundant against footer's own typography above (same values), but are NOT:
// a declaration on the element itself always wins over an inherited value, so
// for the one anchor nested inside .unikateur-signet (which sets its own,
// different 1.5rem/1.2rem) this restatement is what pulls it back to footer's
// values instead of leaving it at .unikateur-signet's — confirmed empirically
// against the pre-conversion baseline (the unikateur link renders 1px taller
// without it). Transcribed in full rather than assumed away.
const footerCls = [
  // overflow-x-clip (not overflow-hidden): the decorative branch below is
  // deliberately allowed to bleed upward past the footer's own top edge
  // into whatever section sits above it -- only horizontal overflow (which
  // would add a page-wide scrollbar) needs containing.
  'grid-container relative overflow-x-clip',
  'text-[2rem] font-normal tracking-[.08em] leading-[125%] mt-[19rem] uppercase',
  'max-lg:text-[1.3rem] max-lg:tracking-[.05em] max-lg:leading-[131%] max-lg:mt-[6rem]',
  '[&_a:not(.link-logo)]:text-ink [&_a:not(.link-logo)]:underline [&_a:not(.link-logo)]:decoration-transparent',
  'max-lg:[&_a:not(.link-logo)]:text-[1.3rem] max-lg:[&_a:not(.link-logo)]:tracking-[.05em] max-lg:[&_a:not(.link-logo)]:leading-[131%]',
  '[&_a:not(.link-logo):hover]:decoration-ink',
  '[&_a:not(.link-logo).router-link-active]:text-[2rem] [&_a:not(.link-logo).router-link-active]:font-light',
  '[&_a:not(.link-logo).router-link-active]:tracking-[.08em] [&_a:not(.link-logo).router-link-active]:leading-[125%]',
  '[&_a:not(.link-logo).router-link-active]:opacity-50 [&_a:not(.link-logo).router-link-active]:uppercase',
  'max-lg:[&_a:not(.link-logo).router-link-active]:text-[1.3rem] max-lg:[&_a:not(.link-logo).router-link-active]:tracking-[.05em]',
  'max-lg:[&_a:not(.link-logo).router-link-active]:leading-[131%] max-lg:[&_a:not(.link-logo).router-link-active]:opacity-50',
  '[&_nav_a]:block',
].join(' ');

// footer .footer-title{margin-bottom:1rem} + mobile{margin-bottom:.5rem}
const titleCls = 'mb-[1rem] max-lg:mb-[.5rem]';

// footer .invisible{visibility:hidden} — like .tel above, no element in this
// markup ever carries class "invisible" (grepped Footer.tsx and content/site.ts);
// dead CSS, correctly dropped.

// footer .upper-footer{border-top:2px solid #e4e0db (a border, stays beige — not
// a fill, per Global Constraints);grid-column-start:2;grid-column-end:span 12;
// padding-top:6rem;padding-bottom:6rem} + mobile{padding-top:2rem;
// padding-bottom:4rem} (column placement is restated identically at mobile, so
// it isn't repeated as a max-lg: variant)
const upperFooterCls = [
  'upper-footer relative z-10 grid-container-inner border-t-2 border-beige col-start-2 col-span-12',
  'pt-[6rem] pb-[6rem] max-lg:pt-[2rem] max-lg:pb-[4rem]',
].join(' ');

// footer .upper-footer .email,.social,.tel{grid-column-end:span 3} — .tel has no
// corresponding element anywhere in this markup (the phone link lives inside
// .email; grepped the whole repo, no element ever carries class "tel"), so its
// desktop span-3 and its mobile span-6/justify-end/text-right restatement are
// both dead CSS and correctly dropped here.
// The birch branch (branchWrapperCls below) is anchored bottom-left at full
// size and its foliage/twigs reach roughly 55-58% across the footer's
// width, so none of the three text groups below can start any earlier than
// that without sitting over it. Rather than one 12-column grid spanning the
// full footer, Contact/Follow Us/Address (and their lower-footer
// counterparts nav-extra/logo/footer-bottom-right, sharing this same
// wrapper) live in their own flex row confined to columns 8-12 (the
// branch-clear right ~42%), tightly spaced with justify-between instead of
// the wider even spacing they used across the full 12 columns.
const upperFooterRightCls = 'col-start-8 col-span-5 flex items-start justify-between gap-x-[1.6rem] max-lg:contents';

// .email itself: desktop span 3 (above) + mobile{grid-column-end:span 6}
const emailCls = 'email flex-1 max-lg:col-start-1 max-lg:col-span-6';

// social ("Follow Us") sits centered within its own flex-1 slot in
// upperFooterRightCls, directly above logoCls below (same flex layout in
// lowerFooterRightCls), so the two still stack exactly.
const socialCls = [
  'social flex-1 justify-self-center text-center',
  'max-lg:col-span-5 max-lg:col-start-8 max-lg:row-start-2 max-lg:justify-self-end max-lg:text-right max-lg:mt-[3rem]',
].join(' ');

// address is the last flex item in upperFooterRightCls, matching the
// last item in lowerFooterRightCls (footer-bottom-right). flex-[1.7] (was
// flex-1, splitting the row evenly with email/social) gives the address
// noticeably more width than those two -- a street address routinely needs
// more room than "info@leonaara.com" or "Instagram", and at an even 1/3
// share each of its 3 lines (site.ts's contact.address) was wrapping onto a
// 4th line instead of the 3 the user asked for.
// text-left/justify-self-start (was text-right/justify-self-end) -- per the
// user's explicit "align the address to left in that column" request.
const addressCls = 'address flex-[1.7] justify-self-start text-left max-lg:col-span-6 max-lg:mt-0';

// footer .lower-footer{align-items:flex-end;border-top:2px solid #e4e0db (border,
// stays beige);grid-column-start:2;grid-column-end:span 12;padding-top:6rem;
// padding-bottom:2.5rem} + mobile{align-items:flex-start;padding-top:2rem;
// padding-bottom:2rem} (column placement unchanged at mobile, not repeated)
const lowerFooterCls = [
  'lower-footer relative z-10 grid-container-inner items-end border-t-2 border-beige col-start-2 col-span-12',
  'pt-[3rem] pb-[2.5rem] max-lg:items-start max-lg:pt-[2rem] max-lg:pb-[2rem]',
].join(' ');

// Decorative birch-branch illustration (public/images/decor/tree-branch.png,
// a transparent PNG) anchored to the footer's bottom-left corner, trunk at
// the edge with the branch reaching rightward across the lower-footer row --
// purely decorative (aria-hidden, no alt text). No overflow-hidden on this
// wrapper: it's sized to the image's own rendered height, so the image is
// never clipped, and it's deliberately allowed to bleed above the footer's
// own top edge (see footerCls's overflow-x-clip comment).
// z-20, ABOVE upper-footer/lower-footer's z-10: those two containers each
// draw a beige border-top spanning the full 12-column row, which otherwise
// cuts a hard line across the tree where the two overlap. The tree's own
// footprint only reaches ~55-58% across the footer (see below), well short
// of the text columns confined to col-start-8+, so painting it above those
// containers hides the border line under the branch/leaves without ever
// covering the real text content.
const branchWrapperCls = 'pointer-events-none absolute bottom-0 left-0 z-20 w-[120rem] max-w-[100%] max-lg:w-[64rem]';
const branchImgCls = 'block w-full h-auto opacity-90';

// Leaf-color palette sampled directly from public/images/decor/tree-branch.png
// (every ~6th pixel scanned, kept if opaque and green-toned, then bucketed and
// ranked by frequency) -- dark olive through light yellow-green, matching the
// actual foliage instead of one flat invented green.
const LEAF_COLORS = ['#3c5028', '#506428', '#647828', '#788c3c', '#8ca050', '#a0b464'] as const;

// A handful of leaves drift down out of the branch and fade -- pure CSS
// (.leaf-fall keyframe in globals.css), no JS/client component needed.
// left/top are read directly off the actual foliage clusters in
// public/images/decor/tree-branch.png (as % of the image's own box, same
// aspect ratio as branchWrapperCls, so they land on real leaf mass instead
// of the empty space between branches) -- picked by eye against the source
// image, not arbitrary/evenly-spaced points. The rest (fall distance, sway,
// spin direction, duration, delay, size, color) are randomized per-leaf via
// CSS custom properties / the fill color on that leaf's own inline style so
// no two fall the same way, then the animation loops.
const FALLING_LEAVES = [
  { left: '10%', top: '22%', size: '2.4rem', duration: '11s', delay: '0s', sway: '2.4rem', spin: 1, fall: '30rem', color: LEAF_COLORS[0] },
  { left: '22%', top: '53%', size: '2.1rem', duration: '9.5s', delay: '2.4s', sway: '-3rem', spin: -1, fall: '28rem', color: LEAF_COLORS[3] },
  { left: '42%', top: '31%', size: '2.7rem', duration: '13s', delay: '5s', sway: '3.2rem', spin: 1, fall: '36rem', color: LEAF_COLORS[5] },
  { left: '50%', top: '49%', size: '1.9rem', duration: '10s', delay: '1.2s', sway: '-2.2rem', spin: -1, fall: '26rem', color: LEAF_COLORS[1] },
  { left: '60%', top: '58%', size: '2.5rem', duration: '12.5s', delay: '6.5s', sway: '2.8rem', spin: 1, fall: '34rem', color: LEAF_COLORS[4] },
  { left: '67%', top: '37%', size: '1.8rem', duration: '8.5s', delay: '3.6s', sway: '-2.6rem', spin: -1, fall: '24rem', color: LEAF_COLORS[2] },
  { left: '80%', top: '41%', size: '2.2rem', duration: '11.5s', delay: '7.5s', sway: '2rem', spin: 1, fall: '30rem', color: LEAF_COLORS[5] },
  { left: '92%', top: '29%', size: '2rem', duration: '9s', delay: '4.2s', sway: '-1.8rem', spin: -1, fall: '26rem', color: LEAF_COLORS[0] },
  { left: '97%', top: '28%', size: '1.8rem', duration: '10.5s', delay: '1.8s', sway: '2.2rem', spin: 1, fall: '28rem', color: LEAF_COLORS[3] },
] as const;

function FallingLeaf({ leaf }: { leaf: (typeof FALLING_LEAVES)[number] }) {
  const style = {
    left: leaf.left,
    top: leaf.top,
    width: `calc(${leaf.size} * 1.1)`,
    height: leaf.size,
    '--leaf-duration': leaf.duration,
    '--leaf-delay': leaf.delay,
    '--leaf-sway': leaf.sway,
    '--leaf-spin': leaf.spin,
    '--leaf-fall': leaf.fall,
    '--leaf-opacity': 0.85,
  } as CSSProperties;
  return (
    // Broad, rounded ovate leaf with a short pointed tip and a rounded base
    // (traced off the actual birch/aspen leaves in tree-branch.png -- see
    // scratchpad/leaf-closeup2.png), not a narrow diagonal teardrop.
    <svg viewBox="0 0 24 24" preserveAspectRatio="none" className="leaf-fall absolute" style={{ ...style, fill: leaf.color }} aria-hidden="true">
      <path d="M12 2C17 4 20.5 9 19.5 14C18.5 19 15 22 12 22C9 22 5.5 19 4.5 14C3.5 9 7 4 12 2Z" />
      <path d="M12 4.5V19.5M12 9 8 12M12 9l4 3M12 14l-3 2.5M12 14l3 2.5" stroke="#3c3020" strokeOpacity="0.35" strokeWidth="0.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// Mirrors upperFooterRightCls above: nav-extra/logo/footer-bottom-right
// live in their own flex row confined to the branch-clear columns 8-12
// instead of the full 12-column width.
const lowerFooterRightCls = 'col-start-8 col-span-5 flex items-end justify-between gap-x-[1.6rem] max-lg:contents';

// footer .lower-footer .logo,.nav-extra{grid-column-end:span 3} (shared) +
// mobile{grid-column-end:span 6;grid-row-start:1;text-align:right} (shared) +
// .nav-extra's own mobile{justify-self:flex-end;margin-bottom:3rem}
const navExtraCls = [
  'nav-extra flex-1 mb-[1.6rem]',
  'max-lg:col-start-1 max-lg:col-span-6 max-lg:row-start-1 max-lg:text-right max-lg:justify-self-end max-lg:mb-[3rem]',
].join(' ');

// same shared span-3/span-6/row-start-1/text-right rule as .nav-extra, plus
// .logo's own mobile{grid-column-start:1;justify-self:flex-start} and
// footer .lower-footer .logo svg{width:29.4rem} + mobile{width:13.7rem}
const logoCls = [
  'logo flex-1 justify-self-center [&_img]:w-[29.4rem] [&_img]:h-auto',
  'max-lg:col-start-1 max-lg:col-span-6 max-lg:row-start-1 max-lg:text-right max-lg:justify-self-start max-lg:[&_img]:w-[13.7rem]',
].join(' ');

// footer .lower-footer .footer-bottom-right{grid-column-end:span 3;justify-self:
// flex-end;text-align:right} + mobile{grid-column-start:1;grid-column-end:span 6;
// grid-row-start:2;justify-self:flex-start} (text-align:right isn't restated at
// mobile, so it carries through unprefixed)
const footerBottomRightCls = [
  'footer-bottom-right flex-1 mb-[1.6rem] justify-self-end text-right',
  'max-lg:col-start-1 max-lg:col-span-6 max-lg:row-start-2 max-lg:justify-self-start',
].join(' ');

// footer .lower-footer .nav-footer{margin-top:3rem} + mobile{margin-top:1.5rem}
// -- the margin-top existed to clear the language nav that used to sit above
// this (now removed per the user's request), so it's dropped on desktop;
// kept at mobile since privacy still stacks below the language-independent
// content there.
const navFooterCls = 'nav-footer max-lg:mt-[1.5rem] max-lg:justify-self-start max-lg:text-left';

export function Footer() {
  return (
    <footer className={footerCls}>
      <div className={branchWrapperCls}>
        {/* eslint-disable-next-line @next/next/no-img-element -- purely
            decorative full-bleed illustration, not real content; no
            next/image sizing/priority machinery needed for it. */}
        <img className={branchImgCls} src="/images/decor/tree-branch.png" alt="" aria-hidden="true" />
        {FALLING_LEAVES.map((leaf, i) => <FallingLeaf key={i} leaf={leaf} />)}
      </div>
      <div className={upperFooterCls}>
        <div className={upperFooterRightCls}>
          <div className={emailCls}>
            <h4 className={titleCls}>{site.t.contact}</h4>
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            <br />
            <a href={`tel:${site.contact.tel}`}>{site.contact.tel}</a>
          </div>
          <div className={socialCls}>
            <h4 className={titleCls}>{site.t.social}</h4>
            <RichText className="t3-ce-rte" html={nl2br(site.socialHtml)} />
          </div>
          <div className={addressCls}>
            <h4 className={titleCls}>{site.t.address}</h4>
            <RichText className="t3-ce-rte" html={nl2br(site.contact.address)} />
          </div>
        </div>
      </div>
      <div className={lowerFooterCls}>
        <div className={lowerFooterRightCls}>
          <nav className={navExtraCls} aria-label="Footer Menu">
            {site.footerNav.map((n) => <AppLink key={n.uid} href={n.link}>{n.title}</AppLink>)}
          </nav>
          <div className={logoCls}>
            <AppLink className="link-logo" href={site.pageLinks.home}><LogoIcon /></AppLink>
          </div>
          <div className={footerBottomRightCls}>
            <nav className={navFooterCls} aria-label="Footer Privacy">
              {site.privacyNav.map((n) => <AppLink key={n.uid} href={n.link}>{n.title}</AppLink>)}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
