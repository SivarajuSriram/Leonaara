// The original site faded the page out/in on every navigation (a 0.6s
// opacity+blur tween); the user asked for that removed, so links here just
// navigate immediately — this only intercepts a click back to the current
// page, jumping straight to the top instead of pushing a no-op history entry.
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { isInternal, isCurrentPage, jumpToTop } from '@/lib/links';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode };

export function AppLink({ href, onClick, target, children, ...rest }: Props) {
  const pathname = usePathname();
  const internal = isInternal(href) && target !== '_blank';
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !internal || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (!isCurrentPage(href, pathname)) return; // a different route: let Link navigate normally
    e.preventDefault();
    jumpToTop();
  };
  if (!internal) {
    return (
      <a href={href} target={target} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
