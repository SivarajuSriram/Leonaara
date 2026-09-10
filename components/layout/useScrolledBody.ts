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
    // Also reflect that seeded position immediately, not just silently: this
    // effect's own attachment can itself lag behind real scrolling (dev-mode
    // hydration delay, or a slow device/CPU-throttled session) long enough
    // that the whole scroll-down burst finishes before any listener exists to
    // see the delta -- with no further scroll event to trigger `onScroll`'s
    // add-on-delta rule below, `scrolled` would otherwise never get applied
    // even though the page is genuinely below the top. Below-the-top at
    // (re)attach time is itself sufficient justification to apply it.
    if (lastY > 0) document.body.classList.add('scrolled');
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
