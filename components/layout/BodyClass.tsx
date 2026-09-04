'use client';
import { useEffect } from 'react';

// The original body carries `pid-{pageId} layout-{layout}`; `scrolled` is managed separately by the header.
export function BodyClass({ pageId, layout }: { pageId: number; layout: string }) {
  useEffect(() => {
    const body = document.body;
    Array.from(body.classList).filter((c) => c.startsWith('pid-') || c.startsWith('layout-')).forEach((c) => body.classList.remove(c));
    body.classList.add(`pid-${pageId}`, `layout-${layout}`);
  }, [pageId, layout]);
  return null;
}
