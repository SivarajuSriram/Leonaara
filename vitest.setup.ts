import '@testing-library/jest-dom/vitest';

// jsdom has no matchMedia implementation; GSAP's ScrollTrigger calls it at
// module-registration time (lib/gsap.ts), which any component that imports
// GSAP directly or via useGSAP pulls in transitively.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;
}
