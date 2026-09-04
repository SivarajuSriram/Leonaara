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
