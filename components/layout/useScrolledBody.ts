// components/layout/useScrolledBody.ts
// Original rule: add `scrolled` when scrolling down from a non-zero position; remove it only back at the top.
'use client';
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

export function useScrolledBody() {
  useEffect(() => {
    // Seed from the real current position, not 0: effects (this one
    // included) are expected to tolerate being stopped and restarted --
    // React itself re-runs every effect once, synchronously, in dev -- and
    // assuming "fresh page load, top of page" on every (re)start desyncs
    // lastY from window.scrollY whenever that happens after the page is
    // already scrolled, so the very next scroll event compares against a
    // stale 0 instead of where the page actually is.
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (lastY > 0 && y > lastY) {
        if (y) document.body.classList.add('scrolled');
      } else if (!y) {
        document.body.classList.remove('scrolled');
      }
      lastY = y;
    };
    // The original refreshes ScrollTrigger whenever the body changes height.
    const observer = new ResizeObserver(() => { if (window.scrollY) ScrollTrigger.refresh(); });
    observer.observe(document.body);
    window.addEventListener('scroll', onScroll);
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);
}
