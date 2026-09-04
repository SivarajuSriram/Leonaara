// The original `.ht-button` link, navigating through TransitionLink.
import type { ReactNode } from 'react';
import { TransitionLink } from '@/components/layout/TransitionLink';

type Props = { href: string; className?: string; target?: string; rel?: string; children: ReactNode };

export function Button({ href, className, target, rel, children }: Props) {
  return (
    <TransitionLink href={href} target={target} rel={rel} className={className ? `ht-button ${className}` : 'ht-button'}>
      {children}
    </TransitionLink>
  );
}
