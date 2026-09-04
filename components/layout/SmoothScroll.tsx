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
    const create = () => {
      if (instance) return;
      instance = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.5, // original: smooth
        effects: true, // original: effects
        smoothTouch: 0.1, // original: smoothTouch
        normalizeScroll: false, // original: normalizeScroll
      });
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
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(sync, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
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
