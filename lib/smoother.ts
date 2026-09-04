// A tiny pub/sub for the page's single ScrollSmoother instance: components that
// need it (e.g. useParallax) subscribe with onSmoother instead of importing
// SmoothScroll directly, so they work whether the smoother already exists or
// is still being created (or torn down on mobile, where it never exists).
import type { ScrollSmoother } from 'gsap/ScrollSmoother';

type Cb = (s: ScrollSmoother) => void;

let current: ScrollSmoother | null = null;
const queue: Cb[] = [];

export function setSmoother(s: ScrollSmoother | null) {
  current = s;
  if (s) queue.splice(0).forEach((cb) => cb(s));
}

export function getSmoother() {
  return current;
}

export function onSmoother(cb: Cb) {
  if (current) {
    cb(current);
    return () => {};
  }
  queue.push(cb);
  return () => {
    const i = queue.indexOf(cb);
    if (i >= 0) queue.splice(i, 1);
  };
}
