import type { Ref } from 'react';
import { site } from '@/content/site';
import { AppLink } from './AppLink';
import { TelIcon, MailIcon, MapIcon, VoucherIcon, GalleryIcon } from '@/components/ui/icons';

type Props = { ref: Ref<HTMLDivElement>; isHome: boolean; pathname: string };

// header .nav-info>div{margin-right:2.8rem;transition:all .5s} (mobile: margin-right:3.5rem),
// :last-child{margin-right:0}, :hover{opacity:.5}. Shared by all five contact icons below.
const navInfoIconCls = 'mr-[2.8rem] max-lg:mr-[3.5rem] last:mr-0 [transition:all_.5s] hover:opacity-50';
// header .nav-info a,header .nav-info svg{display:block}; header .nav-info svg{color:transparent;
// height:2.9rem;min-width:2rem;vertical-align:top;width:auto}, mobile height:3rem;min-width:2.1rem.
// color:transparent looks like it should hide these icons, but their paths carry their own
// stroke="#211D1D" attribute (and MailIcon uses inline style={{fill:...}}, which always wins over
// any stylesheet rule) — only the CSS-driven `fill` (from links.css's .filled *{fill:currentColor})
// goes transparent, so the stroke-drawn outline still renders visibly. Verified against the
// pre-conversion baseline screenshot (tests/e2e/header-visual.spec.ts-snapshots/header-390-open-*)
// and computed styles — the icons are visibly dark there, not a rendering bug to fix.
const navInfoLinkCls =
  'block text-ink no-underline [&_svg]:block [&_svg]:text-transparent [&_svg]:h-[2.9rem] [&_svg]:min-w-[2rem] [&_svg]:align-top [&_svg]:w-auto max-lg:[&_svg]:h-[3rem] max-lg:[&_svg]:min-w-[2.1rem]';

// The beige panel that slides down. Structure copied from the original header markup.
export function MenuPanel({ ref, isHome, pathname }: Props) {
  const isActive = (link: string) => pathname.startsWith(link.replace(/\/$/, ''));
  return (
    // header .menu-outline{bottom:2rem;left:2rem;overflow:hidden;pointer-events:none;
    // position:fixed;right:2rem;top:2rem}, mobile insets all become 0.
    <div className="menu-outline fixed inset-[2rem] overflow-hidden pointer-events-none max-lg:inset-0">
      {/* header .menu{background-color:#e4e0db;bottom:0;height:100%;left:0;overflow:hidden;
          padding:27rem 6rem 6rem;pointer-events:auto;top:0;transform:translateY(-101%);
          width:54.2rem;will-change:transform;z-index:50} — background-color moves to the canvas
          token per spec §16.3. Mobile overrides bottom/left/top (already 0 on desktop too) plus
          padding and width; transform/will-change are then driven inline by GSAP
          (menuAnimations.ts) once the menu opens/closes, which always wins over this CSS default
          (the initial closed position, verified by header.spec.ts's transform assertion). */}
      <div
        className="menu bg-canvas fixed top-0 left-0 bottom-0 h-full w-[54.2rem] overflow-hidden pointer-events-auto z-[50] [transform:translateY(-101%)] [will-change:transform] pt-[27rem] px-[6rem] pb-[6rem] max-lg:w-full max-lg:pt-[15rem] max-lg:pr-[1rem] max-lg:pb-[1.5rem] max-lg:pl-[6.8rem]"
        ref={ref}
      >
        <nav className="nav-info flex absolute right-[6rem] top-[10.5rem] max-lg:right-auto max-lg:top-auto max-lg:bottom-[7.5rem] max-lg:left-1/2 max-lg:-translate-x-1/2">
          <div className={`tel-icon ${navInfoIconCls}`}><a className={navInfoLinkCls} href={`tel:${site.contact.tel}`}><TelIcon /></a></div>
          <div className={`mail-icon ${navInfoIconCls}`}><a className={navInfoLinkCls} href={`mailto:${site.contact.email}`}><MailIcon /></a></div>
          <div className={`map-icon ${navInfoIconCls}`}><AppLink className={navInfoLinkCls} href={site.pageLinks.contact}><MapIcon /></AppLink></div>
          <div className={`voucher-icon ${navInfoIconCls}`}><AppLink className={navInfoLinkCls} href={site.pageLinks.voucher}><VoucherIcon /></AppLink></div>
          <div className={`gallery-icon ${navInfoIconCls}`}><AppLink className={navInfoLinkCls} href={site.pageLinks.gallery}><GalleryIcon /></AppLink></div>
        </nav>
        {/* header div.mobile-hr{...} lives entirely inside the max-width:1023px block in
            Header.css — at desktop it's an unstyled div (only header .menu>div{width:100%}
            applies to it there). */}
        <div className="mobile-hr w-full max-lg:absolute max-lg:bottom-[5rem] max-lg:left-[1rem] max-lg:h-px max-lg:w-[calc(100%-2rem)] max-lg:bg-ink" />
        {/* header .main-nav-wrapper{height:100%;overflow:auto} (same values at mobile) plus the
            shared header .menu>div{width:100%}. */}
        <div className="main-nav-wrapper h-full w-full overflow-auto">
          {/* Outside the home page the nav gets `fadeOut`: links dim to .6 opacity, the active one
              stays at 1 — but only while nothing in the nav is hovered (see the per-link comment
              below). group/nav stands in for header .nav-main:hover in the Tailwind restructuring.
              header .nav-main{min-height:calc(100% - 4.5rem)}, mobile max-height:calc(100% - 15rem);
              min-height:unset;overflow:auto. */}
          <nav
            aria-label="Menu"
            className={[
              'nav-main group/nav [min-height:calc(100%-4.5rem)] max-lg:[max-height:calc(100%-15rem)] max-lg:[min-height:unset] max-lg:overflow-auto',
              isHome ? '' : 'fadeOut',
            ].filter(Boolean).join(' ')}
          >
            {site.nav.map((item) => {
              const active = isActive(item.link);
              return (
                // header .menu .level-0{margin:1rem 0} (mobile only).
                <div key={item.uid} className="level-0 max-lg:my-[1rem]">
                  <AppLink
                    href={item.link}
                    className={[
                      'link-0 cursor-pointer text-ink no-underline',
                      active ? 'router-link-active' : '',
                      // header .menu .nav-main a{font-size:2rem;font-weight:400;letter-spacing:
                      // .05em;line-height:140%;text-transform:uppercase}, mobile font-size:3.1rem;
                      // line-height:100% (letter-spacing repeats the same .05em value) plus a
                      // separate mobile rule further down the file that sets font-weight:300.
                      'text-[2rem] font-normal tracking-[.05em] leading-[140%] uppercase',
                      'max-lg:text-[3.1rem] max-lg:leading-[100%] max-lg:font-light',
                      // header .nav-main:not(:hover).fadeOut .level-0 a{opacity:.6} /
                      // a.router-link-active{opacity:1} — the no-hover baseline: every link dims
                      // unless active or on the home page (no fadeOut there).
                      !isHome && !active ? 'opacity-60' : 'opacity-100',
                      // header .nav-main:hover .level-0 a{opacity:.6} / .level-0:hover a{opacity:1}
                      // — hovering ANYWHERE in the nav dims every link, active link included: the
                      // original has no router-link-active exception in this pair of rules
                      // (confirmed against the pre-conversion baseline — hovering a sibling link
                      // dims the active one too, restoring only on mouseleave). The hovered link's
                      // own :hover then restores it to full opacity. The trailing `!` (Tailwind v4's
                      // important syntax — v3's leading `!opacity-100` is not recognized by this
                      // project's Tailwind 4.3) is needed because group-hover/nav:opacity-60 and
                      // hover:opacity-100 compile to equal-specificity rules; without forcing it,
                      // Tailwind's own utility-generation order (not the order classes are written
                      // here) would decide the winner — exactly the ordering fragility the Protocol
                      // says to avoid.
                      'group-hover/nav:opacity-60 hover:opacity-100!',
                    ].filter(Boolean).join(' ')}
                  >
                    {item.title}{' '}
                  </AppLink>
                  {/* header .sub{max-height:0;overflow:hidden}, header .sub>div{padding:0 0 2rem
                      2rem}, mobile header .menu .sub>div{padding:1rem 2rem 2rem}. This div is
                      always empty in the current markup — see the task report's coverage-gap note
                      on .sub-link/.level-1/.level-0.open, the submenu-toggle rules this empty
                      placeholder was presumably built for but that have no matching element here. */}
                  <div className="sub max-h-0 overflow-hidden">
                    <div className="pt-0 pr-0 pb-[2rem] pl-[2rem] max-lg:pt-[1rem] max-lg:px-[2rem] max-lg:pb-[2rem]" />
                  </div>
                </div>
              );
            })}
          </nav>
          {/* header .nav-lang a{...}; desktop has no rule on the .nav-lang container itself (a
              plain block-level nav), so the two block-level anchors below stack vertically — the
              mobile block adds display:flex + absolute positioning, turning them into a row. */}
          <nav className="nav-lang max-lg:flex max-lg:absolute max-lg:bottom-[1rem] max-lg:right-[1rem]" aria-label="Language">
            {site.languages.map((language) => (
              <a
                key={language.code}
                className={[
                  // header .nav-lang a{display:block;font-size:1.3rem;font-size:1.5rem;
                  // font-weight:300;letter-spacing:.05em;line-height:131%;text-decoration:none;
                  // text-transform:uppercase;width:-moz-fit-content;width:fit-content} — two
                  // font-size declarations in the same rule; CSS keeps only the last (1.5rem), so
                  // 1.3rem is a dead declaration and correctly dropped here. :hover{opacity:.5}.
                  'block text-ink no-underline text-[1.5rem] font-light tracking-[.05em] leading-[131%] uppercase w-fit hover:opacity-50',
                  // header .nav-lang a:first-child{margin-bottom:.5rem}, mobile adds
                  // margin-right:1rem on top (it doesn't remove the margin-bottom).
                  'first:mb-[.5rem] max-lg:first:mr-[1rem]',
                  // header .nav-lang a.router-link-active{opacity:.5;pointer-events:none;
                  // text-decoration:none} — text-decoration:none is already the base state, so
                  // no-underline here is a no-op restated just for literal fidelity.
                  language.code === 'en' ? 'router-link-active opacity-50 pointer-events-none no-underline' : '',
                ].filter(Boolean).join(' ')}
                href={language.link}
              >
                <span>{language.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
