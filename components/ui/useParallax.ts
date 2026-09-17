// Port of: smoother.effects(picture, { speed }) on desktop only.
'use client';
import { useEffect, type RefObject } from 'react';
import { onSmoother } from '@/lib/smoother';
import type { ScrollTrigger } from '@/lib/gsap';

export function useParallax(ref: RefObject<HTMLElement | null>, speed: number) {
  useEffect(() => {
    let triggers: ScrollTrigger[] = [];
    const clear = () => {
      triggers.forEach((t) => t.kill());
      triggers = [];
    };
    // onSmoother is a persistent subscription (lib/smoother.ts): it fires
    // immediately, and again every time SmoothScroll kills/recreates its
    // ScrollSmoother instance across the 1024px breakpoint. Always drop
    // whatever the previous instance registered before registering fresh --
    // the old triggers point at an instance that may already be dead.
    const off = onSmoother((s) => {
      clear();
      // original: parallax effects only on desktop (>= 1024px)
      if (!s || !ref.current || window.innerWidth < 1024) return;
      // The original queries container.querySelectorAll('picture') and passes the
      // <picture> element itself to smoother.effects(), never the wrapping
      // .image-left/.image-right/.image div that `ref` points at. Those wrappers
      // are CSS grid items that can stretch taller than the <picture> they contain
      // (grid rows stretch to their tallest item by default), which hands GSAP's
      // ScrollTrigger a different scroll range to compute progress against and
      // puts the parallax offset out of phase with the original. Target the
      // <picture> descendant(s) to match -- querySelectorAll so a wrapper
      // stacking more than one image (ImgText.tsx's imageLeftCls/imageRightCls,
      // when a side has more than one image) gets the effect on each of them,
      // not just whichever happens to be first; effects() accepts a NodeList.
      // Falls back to the ref itself if there's no <picture> inside it.
      const targets = ref.current.querySelectorAll('picture');
      const target = targets.length > 0 ? targets : ref.current;
      triggers = s.effects(target, { speed }) as ScrollTrigger[];
    });
    return () => {
      off();
      clear();
    };
  }, [ref, speed]);
}
