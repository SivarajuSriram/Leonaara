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
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { jumpToTop } from '@/lib/links';

export function ScrollResetOnNavigate() {
  const pathname = usePathname();
  useEffect(() => {
    jumpToTop();
  }, [pathname]);
  return null;
}
