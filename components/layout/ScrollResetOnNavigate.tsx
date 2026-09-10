// SmoothScroll (this file's sibling) lives in the root layout and never
// unmounts across navigations -- only `children` swaps. Left alone, its
// ScrollSmoother instance keeps whatever scroll offset the previous page had,
// then re-clamps itself into the new (usually shorter) page's bounds using its
// own `smooth: 1.5` easing once the content resizes -- a visible glide back to
// the top instead of the instant landing a real page load gets. jumpToTop()
// (lib/links.ts) already does the right instant reset for both the smoother
// and the native-scroll mobile fallback; this just fires it on every route
// change, not only the same-page case AppLink already handles.
'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { jumpToTop } from '@/lib/links';

export function ScrollResetOnNavigate() {
  const pathname = usePathname();
  // Effects run on mount too, not just when a dependency actually changes,
  // so without this guard jumpToTop() also fires on the page's very first
  // load -- pointless (a fresh SSR load already starts at the top) and
  // actively harmful in dev: React re-runs every effect once, synchronously,
  // right after mount, and that replay sees the exact same `pathname` as the
  // first run, so a naive "skip the first call" flag still lets the *second*
  // (delayed) invocation through. That's the one that can land late enough
  // to stomp on scrolling the user (or a test) has already done in the
  // meantime. Tracking the last pathname we actually reset for, seeded from
  // the current one at render time rather than toggled inside the effect,
  // means both synthetic invocations compare pathname to itself and skip;
  // only a real navigation changes it and fires the reset.
  const lastPathname = useRef(pathname);
  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    jumpToTop();
  }, [pathname]);
  return null;
}
