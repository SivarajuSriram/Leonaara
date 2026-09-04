// Port of: smoother.effects(picture, { speed }) on desktop only.
'use client';
import { useEffect, type RefObject } from 'react';
import { onSmoother } from '@/lib/smoother';

export function useParallax(ref: RefObject<HTMLElement | null>, speed: number) {
  useEffect(() => {
    let triggers: { kill: () => void }[] = [];
    const off = onSmoother((s) => {
      if (!ref.current || window.innerWidth < 1024) return;
      triggers = s.effects(ref.current, { speed }) as unknown as { kill: () => void }[];
    });
    return () => {
      off();
      triggers.forEach((t) => t.kill());
    };
  }, [ref, speed]);
}
