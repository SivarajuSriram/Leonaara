// components/layout/Header.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useGSAP } from '@/lib/gsap';
import { site } from '@/content/site';
import { BigLink } from '@/components/ui/BigLink';
import { MenuButton } from './MenuButton';
import { MenuPanel } from './MenuPanel';
import { Logo } from './Logo';
import { openMenu, closeMenu, type MenuParts } from './menuAnimations';
import { useScrolledBody } from './useScrolledBody';

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  useScrolledBody();

  // contextSafe ties these tweens to the header's own GSAP context, so they're reverted on unmount
  // instead of leaking (the project rule: all GSAP work happens inside useGSAP).
  const { contextSafe } = useGSAP({ scope: headerRef });

  const parts = (): MenuParts | null => {
    if (!panelRef.current || !backgroundRef.current || !buttonRef.current) return null;
    return { panel: panelRef.current, background: backgroundRef.current, icon: buttonRef.current };
  };
  // contextSafe (the official @gsap/react pattern) only ever invokes this closure later, from the
  // click handler; it never reads the refs during render.
  // eslint-disable-next-line react-hooks/refs
  const toggleMenu = contextSafe(() => {
    const p = parts();
    if (!p) return;
    if (isOpen) closeMenu(p); else openMenu(p);
    setIsOpen(!isOpen);
  });

  // Navigating to another page closes the menu (original: page:loading:end hook).
  // Same as toggleMenu above: contextSafe defers this closure to the effect below, not render.
  // eslint-disable-next-line react-hooks/refs
  const closeIfOpen = contextSafe(() => {
    const p = parts();
    if (isOpen && p) { closeMenu(p); setIsOpen(false); }
  });
  useEffect(() => {
    closeIfOpen();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // header{left:0;position:relative;top:0;transition:all .5s;z-index:55} plus
  // header,header>div{width:100%}. z-index only becomes 100 while
  // header.header-menu-open (Header.css) — kept as a plain ternary rather than
  // stacking both z-[55] and z-[100] classes, since two arbitrary-value
  // utilities for the same property racing on Tailwind's generation order
  // would be fragile; a ternary guarantees only one is ever present.
  // Mobile-only `header{padding:0}` (Header.css, max-width:1023px block) is functionally a no-op —
  // base.css's universal `*{padding:0}` reset already zeroes it, and no other rule ever sets
  // padding on <header> itself — but it's included here so every Header.css selector has an
  // explicit home rather than a silently-dropped one.
  const headerCls = ['relative left-0 top-0 w-full [transition:all_.5s] max-lg:p-0', isOpen ? 'header-menu-open z-[100]' : 'z-[55]'].join(' ');

  // .upper: fixed/padding-top/width from Header.css, plus header .upper{z-index:100}
  // (unconditional — unlike header's own z-index, .upper is always 100).
  // body.scrolled .upper:not(.menu-open){background-color:#e4e0db!important;padding-bottom:2rem;
  // padding-top:4rem} only at desktop (the rule lives inside @media(min-width:1024px) in the
  // original) — `scrolled` is a body class toggled by useScrolledBody, not React state, so it's
  // expressed as an arbitrary ancestor+self-state variant rather than derived in JS.
  // header .upper{background-image:...(mobile blob, see Step 3)} covers the mobile-only
  // background-image/position/repeat/size and padding override.
  const upperClass = [
    'upper grid-container fixed top-0 z-[100] w-full pt-[12.5rem]',
    '[transition:padding_.5s_ease,background-color_.5s_ease]',
    "lg:[body.scrolled_&:not(.menu-open)]:bg-beige! lg:[body.scrolled_&:not(.menu-open)]:pb-[2rem] lg:[body.scrolled_&:not(.menu-open)]:pt-[4rem]",
    "max-lg:pt-[1.6rem] max-lg:pb-[1.6rem] max-lg:bg-[url('/images/header-mobile-blob.svg')] max-lg:bg-[100%_100%] max-lg:bg-no-repeat max-lg:bg-cover",
    isOpen ? 'menu-open' : '',
    isHovered ? 'header-hover' : '',
  ].filter(Boolean).join(' ');

  return (
    <header ref={headerRef} className={headerCls}>
      <div className={upperClass} onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {/* header .menu-wrapper{align-items:center;display:flex;grid-column-end:span 4;
            grid-column-start:2;justify-content:flex-start} — mobile only shifts the column
            start/row and flips justify-content (the span itself isn't redeclared at mobile,
            so it stays span 4 from the desktop rule). */}
        <div className="menu-wrapper flex items-center justify-start [grid-column:2/span_4] max-lg:justify-end max-lg:[grid-column-start:10] max-lg:[grid-row-start:1]">
          <MenuButton ref={buttonRef} onClick={toggleMenu} />
        </div>
        {/* Request / Book are hidden while the menu is open (original: v-show).
            header .button-wrapper{...} plus its mobile override (display:block!important). */}
        <div
          className="button-wrapper flex items-center justify-end [grid-column:10/span_4] pointer-events-auto max-lg:block! max-lg:justify-start max-lg:[grid-column:2/span_7] max-lg:[grid-row-start:1] max-lg:z-[5]"
          style={isOpen ? { display: 'none' } : undefined}
        >
          <BigLink className="small-font text-ink no-underline" href={site.pageLinks.request}>{site.t.request}</BigLink>
          {/* header .button-wrapper a:last-child{margin-left:3rem} */}
          <BigLink className="small-font text-ink no-underline ml-[3rem]" target="_blank" rel="noopener nofollow" href={site.bookingLink}>{site.t.book}</BigLink>
        </div>
        {/* header .menu-bg{background-color:#211d1db3;height:100%;left:0;opacity:0;padding:2rem;
            pointer-events:auto;position:fixed;top:0;visibility:hidden;width:100%} — the mobile
            override restates the same opacity:0/visibility:hidden values, so no max-lg: needed. */}
        <div className="menu-bg bg-[#211d1db3] fixed top-0 left-0 h-full w-full p-[2rem] opacity-0 invisible pointer-events-auto" onClick={toggleMenu} ref={backgroundRef} />
        <MenuPanel ref={panelRef} isHome={isHome} pathname={pathname} />
      </div>
      {/* header .logo-wrapper{...} lives inside Logo.tsx; header,header>div{width:100%} still
          applies to it since it's a direct child of <header>. */}
      <Logo />
    </header>
  );
}
