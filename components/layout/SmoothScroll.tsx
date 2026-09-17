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
    // Fixes the scroll-triggered word-fill text (SplitWords.tsx, used by
    // Hero/Quote/Break/ImgText/etc.) intermittently glitching: every one of
    // those ScrollTriggers has its start/end computed from the *current*
    // rendered position and height of the split words at the moment it's
    // created. Junge (the heading font, loaded via a Google Fonts <link> in
    // app/layout.tsx, not preloaded like the self-hosted body font) can
    // finish loading and swap in AFTER that -- it renders visibly larger
    // than the fallback it swaps in for (see globals.css's own comment on
    // reducing .h2/.h3 sizes for this), which reflows heading height and
    // shifts every trigger below it out of sync with its own text until the
    // next refresh. document.fonts.ready fires once every font actually in
    // use has finished loading/swapping, so this refresh re-measures every
    // trigger against final, settled layout instead of relying on whatever
    // resize/scroll happens to trigger one next.
    document.fonts?.ready?.then(() => ScrollTrigger.refresh()).catch(() => {});
    // Same root cause as the fonts.ready refresh above, different trigger:
    // every ScrollTrigger (most visibly SplitWords.tsx's scroll-linked word
    // fade-in) has its start/end computed from the rendered position/height
    // at the moment it's created -- but next/image only reserves an
    // aspect-ratio box up front and swaps the real pixels in once each
    // image's own request resolves, which doesn't shift layout height the
    // way a font swap does, EXCEPT for any image still missing explicit
    // width/height (or a parent that sizes itself off the image rather than
    // the reserved box), where the page genuinely reflows on load. With as
    // many images as this site has, those late, uncoordinated reflows leave
    // triggers below them pinned to stale bounds, which reads as the word
    // animation "glitching"/re-fading once you scroll past where its
    // (wrong) end boundary now falls. `load` doesn't bubble, so this listens
    // in the capture phase on document instead of attaching one listener
    // per <img>; debounced the same 150ms as the resize handler above since
    // a content-heavy page can fire this dozens of times during initial load.
    let imgT: ReturnType<typeof setTimeout> | undefined;
    const onResourceLoad = (e: Event) => {
      if (!(e.target instanceof HTMLImageElement)) return;
      if (imgT) clearTimeout(imgT);
      imgT = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    document.addEventListener('load', onResourceLoad, true);
    return () => {
      if (t) clearTimeout(t);
      if (imgT) clearTimeout(imgT);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('load', onResourceLoad, true);
      kill();
    };
  }, []);
  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
