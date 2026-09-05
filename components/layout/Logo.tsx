'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { site } from '@/content/site';
import { AppLink } from './AppLink';
import { LogoIcon } from '@/components/ui/icons';

// The fixed logo scrubs out while its own box scrolls past the top:
// original: translateY -80% (sine.inOut), opacity 0 with .1 delay, scale .6 (both expoScale(0.5,7,none)).
export function Logo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const timeline = gsap.timeline({ scrollTrigger: { trigger: wrapper, start: 'top top', end: 'bottom top', scrub: true } });
    timeline.to(wrapper, { translateY: '-80%', ease: 'sine.inOut' }, 0);
    timeline.to(wrapper, { opacity: 0, delay: 0.1, ease: 'expoScale(0.5,7,none)' }, 0);
    timeline.to(wrapper, { scale: 0.6, ease: 'expoScale(0.5,7,none)' }, 0);
  }, []);
  return (
    // header .logo-wrapper{padding-top:12.5rem;pointer-events:none;position:fixed}, mobile
    // padding-top:9rem. header,header>div{width:100%} (this div is a direct child of <header>).
    <div className="logo-wrapper grid-container fixed w-full pt-[12.5rem] pointer-events-none max-lg:pt-[9rem]" ref={wrapperRef}>
      {/* header .logo{...}, mobile override of the grid placement + explicit width.
          body.scrolled .logo-wrapper .logo{pointer-events:none} is declared identically inside
          both the desktop and mobile media-query blocks in Header.css, so it's unconditional here
          (no lg:/max-lg: prefix) rather than repeated for each breakpoint.
          header .logo svg{height:auto;margin-bottom:0;width:56.7rem}, mobile width:100% — applied
          via an [&_svg] descendant variant since LogoIcon is a bare <svg>, matching the original's
          plain `svg` tag selector rather than relying on the icon's own className. */}
      <div className="logo flex items-center justify-center [grid-column:5/span_4] pointer-events-auto [body.scrolled_&]:pointer-events-none max-lg:[grid-column:4/span_6] max-lg:justify-self-center max-lg:w-[16.5rem] [&_svg]:h-auto [&_svg]:mb-0 [&_svg]:w-[56.7rem] max-lg:[&_svg]:w-full">
        <AppLink href={site.pageLinks.home} className="router-link-active router-link-exact-active text-ink no-underline opacity-100">
          <LogoIcon />
        </AppLink>
      </div>
    </div>
  );
}
