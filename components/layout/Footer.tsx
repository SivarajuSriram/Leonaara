// components/layout/Footer.tsx
import { site } from '@/content/site';
import { AppLink } from './AppLink';
import { LogoIcon, UnikateurIcon } from '@/components/ui/icons';
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
  'grid-container',
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
  'upper-footer grid-container-inner border-t-2 border-beige col-start-2 col-span-12',
  'pt-[6rem] pb-[6rem] max-lg:pt-[2rem] max-lg:pb-[4rem]',
].join(' ');

// footer .upper-footer .email,.social,.tel{grid-column-end:span 3} — .tel has no
// corresponding element anywhere in this markup (the phone link lives inside
// .email; grepped the whole repo, no element ever carries class "tel"), so its
// desktop span-3 and its mobile span-6/justify-end/text-right restatement are
// both dead CSS and correctly dropped here.
// .email itself: desktop span 3 (above) + mobile{grid-column-end:span 6}
const emailCls = 'email col-span-3 max-lg:col-span-6';

// footer .upper-footer .social{grid-column-end:span 3;justify-self:flex-start;
// text-align:left} + mobile{grid-column-end:span 5;grid-column-start:8;
// grid-row-start:2;justify-self:flex-end;margin-top:3rem;text-align:right}
const socialCls = [
  'social col-span-3 justify-self-start text-left',
  'max-lg:col-span-5 max-lg:col-start-8 max-lg:row-start-2 max-lg:justify-self-end max-lg:text-right max-lg:mt-[3rem]',
].join(' ');

// footer .upper-footer .address{grid-column-end:span 3;justify-self:flex-end;
// text-align:right} + mobile{grid-column-end:span 6;margin-top:0}
const addressCls = 'address col-span-3 justify-self-end text-right max-lg:col-span-6 max-lg:mt-0';

// footer .upper-footer .partner{grid-column-end:span 3;justify-self:flex-end;
// text-align:right} + mobile{grid-column-end:span 6;justify-self:flex-start;
// margin-top:3rem;text-align:left}
const partnerCls = [
  'partner col-span-3 justify-self-end text-right',
  'max-lg:col-span-6 max-lg:justify-self-start max-lg:mt-[3rem] max-lg:text-left',
].join(' ');

// footer .lower-footer{align-items:flex-end;border-top:2px solid #e4e0db (border,
// stays beige);grid-column-start:2;grid-column-end:span 12;padding-top:6rem;
// padding-bottom:2.5rem} + mobile{align-items:flex-start;padding-top:2rem;
// padding-bottom:2rem} (column placement unchanged at mobile, not repeated)
const lowerFooterCls = [
  'lower-footer grid-container-inner items-end border-t-2 border-beige col-start-2 col-span-12',
  'pt-[6rem] pb-[2.5rem] max-lg:items-start max-lg:pt-[2rem] max-lg:pb-[2rem]',
].join(' ');

// footer .lower-footer .logo,.nav-extra{grid-column-end:span 3} (shared) +
// mobile{grid-column-end:span 6;grid-row-start:1;text-align:right} (shared) +
// .nav-extra's own mobile{justify-self:flex-end;margin-bottom:3rem}
const navExtraCls = [
  'nav-extra col-span-3',
  'max-lg:col-span-6 max-lg:row-start-1 max-lg:text-right max-lg:justify-self-end max-lg:mb-[3rem]',
].join(' ');

// same shared span-3/span-6/row-start-1/text-right rule as .nav-extra, plus
// .logo's own mobile{grid-column-start:1;justify-self:flex-start} and
// footer .lower-footer .logo svg{width:29.4rem} + mobile{width:13.7rem}
const logoCls = [
  'logo col-span-3 [&_img]:w-[29.4rem] [&_img]:h-auto',
  'max-lg:col-span-6 max-lg:col-start-1 max-lg:row-start-1 max-lg:text-right max-lg:justify-self-start max-lg:[&_img]:w-[13.7rem]',
].join(' ');

// footer .lower-footer .luxury-hotels-logo{grid-column-start:9;grid-column-end:
// span 1;justify-self:flex-end;text-align:right;width:90%} + mobile{align-self:
// flex-end;grid-column-start:10;grid-column-end:span 3} (justify-self/text-align
// aren't restated at mobile, so they carry through unprefixed) + img{width:100%}
// (all sizes, applied directly to the <img> below)
const luxuryLogoCls = [
  'luxury-hotels-logo col-span-1 col-start-9 justify-self-end text-right w-[90%]',
  'max-lg:self-end max-lg:col-span-3 max-lg:col-start-10',
].join(' ');

// footer .lower-footer .footer-bottom-right{grid-column-end:span 3;justify-self:
// flex-end;text-align:right} + mobile{grid-column-start:1;grid-column-end:span 6;
// grid-row-start:2;justify-self:flex-start} (text-align:right isn't restated at
// mobile, so it carries through unprefixed)
const footerBottomRightCls = [
  'footer-bottom-right col-span-3 justify-self-end text-right',
  'max-lg:col-span-6 max-lg:col-start-1 max-lg:row-start-2 max-lg:justify-self-start',
].join(' ');

// footer .lower-footer .nav-footer,.nav-lang{justify-self:flex-start;
// text-align:left} (mobile only)
const navLangCls = 'nav-lang max-lg:justify-self-start max-lg:text-left';

// footer .lower-footer .nav-footer{margin-top:3rem} + mobile{margin-top:1.5rem}
// plus the shared mobile-only justify-self/text-align rule above
const navFooterCls = 'nav-footer mt-[3rem] max-lg:mt-[1.5rem] max-lg:justify-self-start max-lg:text-left';

// footer .lower-footer .unikateur-signet{font-size:1.5rem;font-weight:400;
// grid-column-start:1;grid-column-end:span 12;justify-self:flex-end;
// letter-spacing:.07em;line-height:100%;margin-top:6rem;text-transform:none} +
// mobile — resolving the file's two duplicate mobile rules for this selector
// (one at max-width:1023px, a final one at the redundant max-width:1023px AND
// max-width:1023px) last-wins per property: font-size:1.2rem (the later rule),
// letter-spacing:.07em/line-height:100%/font-weight:400 unchanged from desktop,
// margin-top:4rem (only ever set once, at mobile). Plus footer .lower-footer
// .unikateur-signet svg{height:100%;width:7.1rem} + mobile{width:6rem}.
const unikateurCls = [
  'unikateur-signet col-span-12 col-start-1 justify-self-end',
  'text-[1.5rem] font-normal tracking-[.07em] leading-[100%] normal-case mt-[6rem]',
  'max-lg:text-[1.2rem] max-lg:mt-[4rem]',
  '[&_svg]:h-full [&_svg]:w-[7.1rem] max-lg:[&_svg]:w-[6rem]',
].join(' ');

// footer .lower-footer .unikateur-signet a{display:inline-flex;white-space:pre} +
// mobile{align-items:baseline}
const unikateurLinkCls = 'inline-flex whitespace-pre max-lg:items-baseline';

export function Footer() {
  return (
    <footer className={footerCls}>
      <div className={upperFooterCls}>
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
        <div className={partnerCls}>
          <h4 className={titleCls}>{site.t.partner}</h4>
          <RichText html={site.partnerHtml} />
        </div>
      </div>
      <div className={lowerFooterCls}>
        <nav className={navExtraCls} aria-label="Footer Menu">
          {site.footerNav.map((n) => <AppLink key={n.uid} href={n.link}>{n.title}</AppLink>)}
        </nav>
        <div className={logoCls}>
          <AppLink className="link-logo" href={site.pageLinks.home}><LogoIcon /></AppLink>
        </div>
        <div className={luxuryLogoCls}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="w-full" src="/slh_black.png" alt="Small Luxury Hotels of the World" />
        </div>
        <div className={footerBottomRightCls}>
          <nav className={navLangCls} aria-label="Footer Language">
            {site.languages.map((l) => <a key={l.code} className={l.code === 'en' ? 'router-link-active' : ''} href={l.link}>{l.title}</a>)}
          </nav>
          <nav className={navFooterCls} aria-label="Footer Privacy">
            {site.privacyNav.map((n) => <AppLink key={n.uid} href={n.link}>{n.title}</AppLink>)}
          </nav>
        </div>
        <div className={unikateurCls}>
          <a className={unikateurLinkCls} href={site.unikateur} target="_blank" rel="noopener"><span>{site.t.unikSignet}</span><UnikateurIcon /></a>
        </div>
      </div>
    </footer>
  );
}
