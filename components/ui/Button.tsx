// The original `.ht-button` link, navigating through AppLink.
import type { ReactNode } from 'react';
import { AppLink } from '@/components/layout/AppLink';

type Props = { href: string; className?: string; target?: string; rel?: string; children: ReactNode };

export function Button({ href, className, target, rel, children }: Props) {
  return (
    <AppLink href={href} target={target} rel={rel} className={className ? `ht-button ${className}` : 'ht-button'}>
      {children}
    </AppLink>
  );
}
