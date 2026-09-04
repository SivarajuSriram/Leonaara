// An <a>/<Link> that plays the page-leave fade (lib/transition.ts) before
// navigating to an internal route, matching the original site's link behaviour.
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { isInternal, leavePage } from '@/lib/transition';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode };

export function TransitionLink({ href, onClick, target, children, ...rest }: Props) {
  const router = useRouter();
  const internal = isInternal(href) && target !== '_blank';
  const handle = async (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !internal || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    await leavePage();
    router.push(href);
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
