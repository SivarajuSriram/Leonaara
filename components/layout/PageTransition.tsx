// Wraps page content in the #page-transition element the original site fades
// in on every route change (see lib/transition.ts for the actual tween).
'use client';
import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { PAGE_ID, enterPage } from '@/lib/transition';

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    enterPage();
  }, [pathname]);
  return <div id={PAGE_ID}>{children}</div>;
}
