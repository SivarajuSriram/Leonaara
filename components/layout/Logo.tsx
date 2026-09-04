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
    <div className="logo-wrapper grid-container" ref={wrapperRef}>
      <div className="logo">
        <AppLink href={site.pageLinks.home} className="router-link-active router-link-exact-active">
          <LogoIcon />
        </AppLink>
      </div>
    </div>
  );
}
