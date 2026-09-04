// Port of: smoother.effects(picture, { speed }) on desktop only.
'use client';
import { useEffect, type RefObject } from 'react';
import { onSmoother } from '@/lib/smoother';
import type { ScrollTrigger } from '@/lib/gsap';

export function useParallax(ref: RefObject<HTMLElement | null>, speed: number) {
  useEffect(() => {
    let triggers: ScrollTrigger[] = [];
    const off = onSmoother((s) => {
      // original: parallax effects only on desktop (>= 1024px)
      if (!ref.current || window.innerWidth < 1024) return;
      triggers = s.effects(ref.current, { speed }) as ScrollTrigger[];
    });
    return () => {
      off();
      triggers.forEach((t) => t.kill());
    };
  }, [ref, speed]);
}
