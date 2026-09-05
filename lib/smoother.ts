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

export function setSmoother(s: ScrollSmoother | null) {
  current = s;
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
