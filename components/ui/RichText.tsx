// Renders HTML straight from the content model. Internal <a> clicks navigate
// via the router (no full page reload); a click back to the current page
// jumps to the top instead, same as AppLink.
'use client';
import { useRouter, usePathname } from 'next/navigation';
import type { ElementType, MouseEvent } from 'react';
import { isInternal, isCurrentPage, jumpToTop } from '@/lib/links';

type Props = { html: string; className?: string; as?: ElementType };

export function RichText({ html, className, as: Tag = 'div' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const onClick = (e: MouseEvent<HTMLElement>) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const href = a.getAttribute('href') ?? '';
    if (!isInternal(href)) return;
    e.preventDefault();
    if (isCurrentPage(href, pathname)) {
      jumpToTop();
      return;
    }
    router.push(href);
  };
  return <Tag className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
