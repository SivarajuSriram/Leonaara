// A tiny pub/sub for one piece of imperative cross-component state: whether
// the header should show its scrolled-state background because the page's
// pinned filter bar (FilterShell) is currently hovered while pinned. Same
// shape as lib/smoother.ts's onSmoother/setSmoother -- Header.tsx owns its
// own local hover state from real mouse events on itself, and ORs it with
// this externally-forced flag, rather than FilterShell reaching into
// Header's own React state directly.
type Cb = (v: boolean) => void;

let current = false;
const subscribers = new Set<Cb>();

export function setHeaderForceHover(v: boolean) {
  current = v;
  subscribers.forEach((cb) => cb(v));
}

export function onHeaderForceHover(cb: Cb) {
  cb(current);
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}
