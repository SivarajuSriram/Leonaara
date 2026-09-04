// components/layout/useScrolledBody.ts
// Original rule: add `scrolled` when scrolling down from a non-zero position; remove it only back at the top.
'use client';
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

export function useScrolledBody() {
  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (lastY > 0 && y > lastY) {
        if (y) document.body.classList.add('scrolled');
      } else if (!y) {
        document.body.classList.remove('scrolled');
      }
      lastY = y;
    };
    // The original refreshes ScrollTrigger whenever the body changes height.
    const observer = new ResizeObserver(() => { if (window.scrollY) ScrollTrigger.refresh(); });
    observer.observe(document.body);
    window.addEventListener('scroll', onScroll);
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);
}
