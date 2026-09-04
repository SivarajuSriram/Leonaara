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
import './Header.css';

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/en/' || pathname === '/en';
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

  const upperClass = ['upper grid-container', isOpen ? 'menu-open' : '', isHovered ? 'header-hover' : ''].filter(Boolean).join(' ');

  return (
    <header ref={headerRef} className={isOpen ? 'header-menu-open' : ''}>
      <div className={upperClass} onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div className="menu-wrapper">
          <MenuButton ref={buttonRef} onClick={toggleMenu} />
        </div>
        {/* Request / Book are hidden while the menu is open (original: v-show). */}
        <div className="button-wrapper" style={isOpen ? { display: 'none' } : undefined}>
          <BigLink className="small-font" href={site.pageLinks.request}>{site.t.request}</BigLink>
          <BigLink className="small-font" target="_blank" rel="noopener nofollow" href={site.bookingLink}>{site.t.book}</BigLink>
        </div>
        <div className="menu-bg" onClick={toggleMenu} ref={backgroundRef} />
        <MenuPanel ref={panelRef} isHome={isHome} pathname={pathname} />
      </div>
      <Logo />
    </header>
  );
}
