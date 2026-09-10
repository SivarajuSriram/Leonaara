// components/layout/useScrolledBody.ts
// The `scrolled` class itself is toggled by an inline <script> in app/layout.tsx's
// <head> (see ScrolledBodyInlineScript below), not from here -- see that script's
// own comment for why. This hook only owns the GSAP-dependent half of the
// original behavior, which can't run that early since it needs the GSAP module
// loaded first.
'use client';
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

export function useScrolledBody() {
  useEffect(() => {
    // The original refreshes ScrollTrigger whenever the body changes height.
    // ResizeObserver invokes its callback once immediately on observe() with
    // the current size, before any real resize has happened -- skip that
    // first call. Otherwise, if this effect (re)mounts while already scrolled
    // (e.g. a route change, or hydration finishing after a fast programmatic
    // scroll on a content-heavy page), that spurious first refresh() can nudge
    // ScrollSmoother's scroll position by a stray sub-pixel amount while
    // recalculating -- enough to fire an extra native 'scroll' event that
    // looks, to the delta rule above, like the user scrolled further.
    let first = true;
    const observer = new ResizeObserver(() => {
      if (first) { first = false; return; }
      if (window.scrollY) ScrollTrigger.refresh();
    });
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);
}

// Original rule: add `scrolled` when scrolling down from a non-zero position;
// remove it only back at the top -- byte-faithful to the live site's own Vue
// implementation (a ref seeded at 0, the same two-step "was already below top,
// and still going down" delta check). Living in a synchronous <head> script
// instead of a React effect is what makes this reliable: a React effect (even
// with useLayoutEffect) can't attach its listener until hydration reaches this
// component, and on a content-heavy page hydration can easily take longer than
// a fast wheel-scroll burst or a `scrollIntoViewIfNeeded()` jump takes to
// resolve -- so the listener can lose the race and miss the whole delta with no
// further event left to catch it on. A <head> script runs at parse time, before
// the page has *any* interactive content for a user or test action to act on,
// closing that race to nothing without changing the actual add/remove rule.
export const SCROLLED_BODY_INLINE_SCRIPT = `(function(){
  var lastY = window.scrollY;
  function onScroll(){
    var y = window.scrollY;
    if (lastY > 0 && y > lastY) { if (y) document.body.classList.add('scrolled'); }
    else if (!y) { document.body.classList.remove('scrolled'); }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll);
})();`;
