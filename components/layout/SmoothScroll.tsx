// Reproduces the original #smooth-wrapper/#smooth-content pair driven by GSAP
// ScrollSmoother, created only at desktop widths (the original disables the
// smoother below 1024px and lets the page scroll natively on touch devices).
'use client';
import { useEffect, type ReactNode } from 'react';
import { ScrollSmoother, ScrollTrigger } from '@/lib/gsap';
import { setSmoother } from '@/lib/smoother';

const DESKTOP = 1024; // original: smoother only runs at desktop widths

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    let instance: ScrollSmoother | null = null;
    // ScrollSmoother.create() unconditionally zeroes the scroll position as
    // part of its own setup (it sets wrapper.scrollTop = 0 -- see GSAP's own
    // source). kill()+create() is the normal way this effect toggles the
    // smoother off and on across the 1024px breakpoint, and effects are
    // expected to tolerate being stopped and restarted -- most visibly,
    // React re-runs this exact effect once, synchronously, in dev, so
    // restoring the position captured immediately beforehand isn't a
    // resize-only nicety, it's what keeps a page load that's already
    // scrolled (by the time this effect re-settles) from silently snapping
    // back to the top.
    const create = () => {
      if (instance) return;
      const restoreY = window.scrollY;
      instance = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.5, // original: smooth
        effects: true, // original: effects
        smoothTouch: 0.1, // original: smoothTouch
        normalizeScroll: false, // original: normalizeScroll
      });
      if (restoreY) instance.scrollTop(restoreY);
      setSmoother(instance);
    };
    const kill = () => {
      instance?.kill();
      instance = null;
      setSmoother(null);
    };
    const sync = () => {
      if (window.innerWidth >= DESKTOP) create();
      else kill();
      ScrollTrigger.refresh();
    };
    sync();
    let t: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (t) clearTimeout(t);
      t = setTimeout(sync, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      if (t) clearTimeout(t);
      window.removeEventListener('resize', onResize);
      kill();
    };
  }, []);
  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
