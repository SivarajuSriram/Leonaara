// A tiny pub/sub for the page's single ScrollSmoother instance: components that
// need it (e.g. useParallax) subscribe with onSmoother instead of importing
// SmoothScroll directly, so they work whether the smoother already exists, is
// still being created, or gets killed and recreated later (SmoothScroll kills
// and recreates its ScrollSmoother instance every time the viewport crosses
// the 1024px breakpoint -- see SmoothScroll.tsx).
import type { ScrollSmoother } from 'gsap/ScrollSmoother';

type Cb = (s: ScrollSmoother | null) => void;

let current: ScrollSmoother | null = null;
const subscribers = new Set<Cb>();

// Test-only escape hatch (never shipped: dead-code-eliminated in production
// builds since NODE_ENV is statically known at bundle time). Playwright's
// visual-regression specs need to position scroll-scrubbed content at an
// *exact*, reproducible offset -- driving GSAP's ScrollSmoother via simulated
// wheel events lets its own inertia settle at a slightly different sub-pixel
// resting position every run (confirmed empirically: tests/e2e/break-visual.spec.ts's
// history), which is fine for real users but not for pixel-diffing. Calling
// window.__scrollSmoother.scrollTo(target, false, position) jumps instantly
// to an exact offset with no physics involved, eliminating that noise at the
// source instead of trying to poll for "settled enough".
declare global {
  interface Window {
    __scrollSmoother?: ScrollSmoother | null;
  }
}

export function setSmoother(s: ScrollSmoother | null) {
  current = s;
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    window.__scrollSmoother = s;
  }
  subscribers.forEach((cb) => cb(s));
}

export function getSmoother() {
  return current;
}

// Persistent subscription: cb fires immediately with the current smoother (or
// null), and again every time setSmoother() is called afterward -- including
// when the smoother is killed (cb(null)) and recreated (cb(newInstance)) across
// the 1024px breakpoint. Callers must re-register anything smoother-scoped
// (e.g. smoother.effects() targets) on every call, and tear down what they
// registered on the previous call first (see useParallax.ts).
export function onSmoother(cb: Cb) {
  cb(current);
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}
