// Internal-link helpers shared by AppLink and RichText: whether an href points
// within this app, whether it's the page we're already on, and how the app
// scrolls back to the top for a link (footer/header logo, "home" nav entry)
// that should never navigate to itself.
import { getSmoother } from '@/lib/smoother';

export function isInternal(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

// A link to the page you're already on shouldn't push a duplicate history
// entry — it should just scroll back to the top instead.
export function isCurrentPage(href: string, pathname: string): boolean {
  const stripTrailingSlash = (path: string) => (path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path);
  const hrefPath = href.split(/[?#]/)[0];
  return stripTrailingSlash(hrefPath) === stripTrailingSlash(pathname);
}

// The user asked for this to be an instant jump, not an eased scroll: desktop
// uses the ScrollSmoother's non-smooth scrollTo (skips its tween entirely);
// mobile (no smoother below 1024px) falls back to the native instant scroll.
export function jumpToTop(): void {
  const smoother = getSmoother();
  if (smoother) smoother.scrollTo(0, false);
  else window.scrollTo({ top: 0, behavior: 'instant' });
}

// FilterShell (components/sections/FilterShell.tsx) updates the URL bar for
// its in-place suite/experience tab switches via a raw window.history.
// pushState() call, specifically to avoid triggering a real Next.js
// navigation (which would unmount and refetch a whole new page instead of
// just swapping which already-rendered suite body is visible). Next's App
// Router still intercepts that raw pushState globally to keep its own
// usePathname() in sync, though, which means ScrollResetOnNavigate.tsx's
// effect fires for it exactly as if a real navigation had happened -- its
// jumpToTop() then fires *after* FilterShell's own scroll-to-filter-bar
// animation has already started (confirmed via instrumented tracing: not a
// simultaneous race, a genuine later override), instantly snapping the page
// back to the literal top and cancelling FilterShell's own scroll entirely.
// This lets FilterShell explicitly opt its own pathname change out of that
// reset, since it already scrolls the page itself, correctly, immediately
// after: one-shot by design (consuming resets it), so it can never
// accidentally suppress a later *real* navigation's reset.
let suppressNextScrollResetFlag = false;
export function suppressNextScrollReset(): void {
  suppressNextScrollResetFlag = true;
}
export function consumeScrollResetSuppression(): boolean {
  if (!suppressNextScrollResetFlag) return false;
  suppressNextScrollResetFlag = false;
  return true;
}
