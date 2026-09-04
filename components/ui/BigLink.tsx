// The original `.ht-biglink` link, navigating through TransitionLink.
import type { ReactNode } from 'react';
import { TransitionLink } from '@/components/layout/TransitionLink';

type Props = { href: string; className?: string; target?: string; rel?: string; children: ReactNode };

export function BigLink({ href, className, target, rel, children }: Props) {
  return (
    <TransitionLink href={href} target={target} rel={rel} className={className ? `ht-biglink ${className}` : 'ht-biglink'}>
      {children}
    </TransitionLink>
  );
}
