'use client';
import { useState, type Ref } from 'react';
import { site } from '@/content/site';
import { AppLink } from './AppLink';
import { TelIcon, MailIcon } from '@/components/ui/icons';
import { RichText } from '@/components/ui/RichText';

type Props = { ref: Ref<HTMLDivElement>; isHome: boolean; pathname: string };

const nl2br = (s: string) => s.replace(/\r?\n/g, '<br>');

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
  // Which nav item's submenu (Projects -> Kadamba/Anantha Meadows) is open,
  // by uid. Added at the user's request: only Projects has children today,
  // but this scales to any future item that gets a `children` array in
  // content/site.ts.
  const [openUid, setOpenUid] = useState<number | null>(null);
  return (
    // header .menu-outline{bottom:2rem;left:2rem;overflow:hidden;pointer-events:none;
    // position:fixed;right:2rem;top:2rem}, mobile insets all become 0.
    <div className="menu-outline fixed inset-[2rem] overflow-hidden pointer-events-none max-lg:inset-0">
      {/* header .menu{background-color:#e4e0db;bottom:0;height:100%;left:0;overflow:hidden;
          padding:27rem 6rem 6rem;pointer-events:auto;top:0;transform:translateY(-101%);
          width:54.2rem;will-change:transform;z-index:50} — background-color moves to the canvas
          token per spec §16.3. Note this rule has NO `position` property (verified against the
          raw crawled CSS, not just the cleaned copy) — top/bottom/left are dead declarations on
          what is actually a plain flow (static) block. It's sized by `height:100%` of its
          `.menu-outline` PARENT (position:fixed, inset 2rem — see the outer div below), and
          being an in-flow child, that parent's overflow:hidden clips it correctly. Do NOT add
          `fixed`/`top-0`/`left-0`/`bottom-0` here (an earlier version of this file did): making
          this div itself position:fixed resolves height:100% against the real viewport (100vh,
          not viewport-4rem) AND lets it escape the parent's overflow:hidden clipping entirely —
          a real CSS quirk where overflow:hidden does not clip a position:fixed descendant unless
          the ancestor itself carries a transform. That bug made the panel render edge-to-edge and
          touch the bottom of the screen instead of stopping 2rem short on all sides like the live
          site. Mobile overrides bottom/left/top (already dead there too) plus padding and width;
          transform/will-change are then driven inline by GSAP (menuAnimations.ts) once the menu
          opens/closes, which always wins over this CSS default (the initial closed position,
          verified by header.spec.ts's transform assertion). */}
      {/* pt/pb shrunk from the original 27rem/6rem (mobile 15rem/1.5rem): the original
          spacious top padding was sized for a short, static 4-item list. With bigger nav
          text, the Projects submenu, and the new address/social block all living in this
          panel now, keeping that padding pushed total content past the panel's own
          height -- and pushing it down further to manually clear Header's MenuButton
          (the hamburger/X icon, a SEPARATE fixed-position element painted above this
          panel) made things worse. Per the user's explicit "move them down, center the
          nav links, pin address/social to the bottom" -- the fix is structural, not more
          padding: main-nav-wrapper is now a column flexbox (see below) that vertically
          centers the nav in the space between this top padding and the bottom-anchored
          address block, so the icon-clearance problem and the "single frame, no
          scrollbar" requirement solve each other instead of fighting. */}
      <div
        className="menu bg-canvas h-full w-[54.2rem] overflow-hidden pointer-events-auto z-[50] [transform:translateY(-101%)] [will-change:transform] pt-[9rem] px-[6rem] pb-[3rem] max-lg:w-full max-lg:pt-[9rem] max-lg:pr-[1rem] max-lg:pb-[1.5rem] max-lg:pl-[6.8rem]"
        ref={ref}
      >
        {/* top pushed down from 4rem to 10.5rem, swapping vertically with the
            header's own close/hamburger button (Header.tsx's MenuButton, moved
            up via its own conditional translate) -- per the user's explicit
            "swap their positions, line-wise" request. */}
        <nav className="nav-info flex absolute right-[6rem] top-[10.5rem] max-lg:right-auto max-lg:top-auto max-lg:bottom-[7.5rem] max-lg:left-1/2 max-lg:-translate-x-1/2">
          <div className={`tel-icon ${navInfoIconCls}`}><a className={navInfoLinkCls} href={`tel:${site.contact.tel}`}><TelIcon /></a></div>
          <div className={`mail-icon ${navInfoIconCls}`}><a className={navInfoLinkCls} href={`mailto:${site.contact.email}`}><MailIcon /></a></div>
        </nav>
        {/* header div.mobile-hr{...} lives entirely inside the max-width:1023px block in
            Header.css — at desktop it's an unstyled div (only header .menu>div{width:100%}
            applies to it there). */}
        <div className="mobile-hr w-full max-lg:absolute max-lg:bottom-[5rem] max-lg:left-[1rem] max-lg:h-px max-lg:w-[calc(100%-2rem)] max-lg:bg-ink" />
        {/* overflow-hidden (was overflow-auto): per the user's explicit "do not add a
            scroll bar" -- everything now fits within the panel's own height, so this is
            a safety net against a scrollbar ever appearing rather than something relied
            on to clip real content. flex-col + the nav's own flex-1/justify-center below
            is what actually vertically centers the nav links in the space above the
            bottom-anchored address/social block (mt-auto), per the user's request. */}
        <div className="main-nav-wrapper h-full w-full overflow-hidden flex flex-col">
          {/* Outside the home page the nav gets `fadeOut`: links dim to .6 opacity, the active one
              stays at 1 — but only while nothing in the nav is hovered (see the per-link comment
              below). group/nav stands in for header .nav-main:hover in the Tailwind restructuring.
              header .nav-main{min-height:calc(100% - 4.5rem)}, mobile max-height:calc(100% - 15rem);
              min-height:unset;overflow:auto. flex-1/flex-col/justify-center (new): centers the
              nav items vertically within the space main-nav-wrapper doesn't give to the
              bottom-anchored address block. */}
          <nav
            aria-label="Menu"
            className={[
              // pb biases the centered content upward within nav-main's own box (per the
              // user's "move the navigation links a bit up" follow-up to dead-centering).
              'nav-main group/nav flex-1 flex flex-col justify-center min-h-0 pb-[8rem] max-lg:pb-[10rem]',
              isHome ? '' : 'fadeOut',
            ].filter(Boolean).join(' ')}
          >
            {site.nav.map((item) => {
              const active = isActive(item.link);
              const hasChildren = !!item.children?.length;
              const isOpen = hasChildren && openUid === item.uid;
              return (
                // header .menu .level-0{margin:1rem 0} (mobile only).
                <div key={item.uid} className="level-0 max-lg:my-[1rem]">
                  <div className="flex items-center gap-[1.2rem]">
                  <AppLink
                    href={item.link}
                    className={[
                      'link-0 cursor-pointer text-ink no-underline',
                      active ? 'router-link-active' : '',
                      // header .menu .nav-main a{font-size:2rem;font-weight:400;letter-spacing:
                      // .05em;line-height:140%;text-transform:uppercase}, mobile font-size:3.1rem;
                      // line-height:100% (letter-spacing repeats the same .05em value) plus a
                      // separate mobile rule further down the file that sets font-weight:300.
                      // Sized up further from the original 2rem/3.1rem at the user's explicit
                      // "increase the font size for the items in the menu overlay more" request.
                      'text-[2.8rem] font-normal tracking-[.05em] leading-[140%] uppercase',
                      'max-lg:text-[3.8rem] max-lg:leading-[100%] max-lg:font-light',
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
                  {hasChildren ? (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.title} submenu`}
                      onClick={() => setOpenUid(isOpen ? null : item.uid)}
                      className="appearance-none border-0 bg-transparent p-0 cursor-pointer text-ink opacity-70 transition-opacity duration-300 hover:opacity-100 [&_svg]:block [&_svg]:h-[1rem] [&_svg]:w-[1.4rem]"
                    >
                      <svg viewBox="0 0 14 8" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ) : null}
                  </div>
                  {/* header .sub{max-height:0;overflow:hidden}, header .sub>div{padding:0 0 2rem
                      2rem}, mobile header .menu .sub>div{padding:1rem 2rem 2rem}. Filled in with
                      Projects' children (Kadamba, Anantha Meadows) at the user's request --
                      max-height toggles via isOpen instead of the empty placeholder this was
                      previously left as (see the task report's coverage-gap note on
                      .sub-link/.level-1/.level-0.open, the submenu-toggle rules this placeholder
                      was presumably built for but had no matching element). */}
                  <div className={`sub overflow-hidden transition-[max-height] duration-300 ${isOpen ? 'max-h-[20rem]' : 'max-h-0'}`}>
                    {/* pb reduced from 2rem -> .5rem: the trailing padding here (not the
                        gap between Kadamba/Anantha Meadows) was what read as "too much gap
                        after Anantha Meadows" before the next top-level item (Contact). */}
                    <div className="pt-0 pr-0 pb-[.5rem] pl-[2rem] max-lg:pt-[1rem] max-lg:px-[2rem] max-lg:pb-[1rem] flex flex-col gap-0">
                      {item.children?.map((child) => {
                        // Anantha Meadows isn't public yet (per the user's "make totally
                        // unaccessible" request, its page route itself 404s regardless of URL --
                        // see app/projects/ananthameadows/page.tsx). This nav entry mirrors that:
                        // a plain, non-navigating span instead of AppLink, so clicking it can't
                        // even send a visitor toward that dead end in the first place. It still
                        // gets the always-visible "Coming soon" pill (a different design than an
                        // earlier hover-only tooltip version, per the user's own feedback); Kadamba
                        // is live, so it keeps a real link and no pill.
                        const comingSoon = child.title === 'Anantha Meadows';
                        // Sized up (2rem -> 2.4rem) with the rest of the menu, and leading
                        // tightened (140% -> 110%) -- flex `gap` alone wasn't the only source of
                        // the "too much gap between the project names" the user kept flagging;
                        // each link's own line-height was adding space on top of it.
                        const linkCls = 'text-ink text-[2.4rem] font-normal tracking-[.05em] leading-[110%] uppercase max-lg:text-[3rem]';
                        return (
                          <div key={child.uid} className="sub-link level-1 flex items-center gap-[1rem] w-fit">
                            {comingSoon ? (
                              <span className={`${linkCls} cursor-not-allowed select-none opacity-40`} aria-disabled="true">
                                {child.title}
                              </span>
                            ) : (
                              <AppLink
                                href={child.link}
                                className={`${linkCls} cursor-pointer no-underline opacity-70 transition-opacity duration-300 hover:opacity-100`}
                              >
                                {child.title}
                              </AppLink>
                            )}
                            {comingSoon ? (
                              <span className="whitespace-nowrap rounded-full border border-ink/30 px-[1.1rem] py-[.3rem] text-[1.1rem] font-normal tracking-[.08em] uppercase text-ink/70 max-lg:text-[1.4rem] max-lg:px-[1.3rem]">
                                Coming soon
                              </span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
          {/* Address + social links, added at the user's request. mt-auto (was a fixed
              mt-[1.5rem]) pins this to the very bottom of main-nav-wrapper's flex column,
              per the user's explicit "address and sm handles will be at the bottom of the
              card" -- same content/site.ts fields and RichText+nl2br treatment the footer
              uses for these two (components/layout/Footer.tsx). "Office Address" heading
              added above the divider (was: divider directly on this wrapper, no heading) --
              per the user's explicit request. */}
          <div className="menu-contact mt-auto shrink-0">
            <h4 className="text-[1.4rem] font-normal tracking-[.08em] uppercase text-ink/60 mb-[.8rem] max-lg:text-[1.6rem]">
              Office Address
            </h4>
            <div className="pt-[1rem] border-t border-ink/15">
              {/* Sized to match the sub-nav items (Kadamba/Anantha Meadows' linkCls above) --
                  per the user's explicit "use the same font size as of the elements in the
                  overlay", up from an earlier, much smaller 1.4rem/1.8rem. */}
              <RichText
                className="text-[2.4rem] font-normal tracking-[.05em] leading-[130%] text-ink/70 max-lg:text-[3rem]"
                html={nl2br(site.contact.address)}
              />
              <RichText
                className="mt-[1.2rem] flex gap-[1.6rem] text-[2.4rem] font-normal tracking-[.05em] uppercase [&_a]:text-ink [&_a]:no-underline [&_a]:opacity-70 [&_a]:transition-opacity [&_a]:duration-300 [&_a:hover]:opacity-100 max-lg:text-[3rem]"
                html={site.socialHtml.replace(/\r?\n/g, '')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
