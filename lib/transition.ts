// The original .page-enter/.page-leave transition: 0.6s, opacity 0, blur 1rem, translateY 2rem.
'use client';
import { gsap } from '@/lib/gsap';

export const PAGE_ID = 'page-transition';

export function isInternal(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

export function leavePage(): Promise<void> {
  const el = document.getElementById(PAGE_ID);
  if (!el) return Promise.resolve();
  return new Promise((resolve) => {
    gsap.to(el, { opacity: 0, filter: 'blur(1rem)', y: '2rem', duration: 0.6, ease: 'none', onComplete: resolve });
  });
}

export function enterPage(): void {
  const el = document.getElementById(PAGE_ID);
  if (!el) return;
  gsap.fromTo(
    el,
    { opacity: 0, filter: 'blur(1rem)', y: '2rem' },
    { opacity: 1, filter: 'blur(0rem)', y: 0, duration: 0.6, ease: 'none', clearProps: 'filter,transform' },
  );
}
