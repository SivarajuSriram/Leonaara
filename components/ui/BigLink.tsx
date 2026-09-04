// The original `.ht-biglink` link, navigating through AppLink.
import type { ReactNode } from 'react';
import { AppLink } from '@/components/layout/AppLink';

type Props = { href: string; className?: string; target?: string; rel?: string; children: ReactNode };

export function BigLink({ href, className, target, rel, children }: Props) {
  return (
    <AppLink href={href} target={target} rel={rel} className={className ? `ht-biglink ${className}` : 'ht-biglink'}>
      {children}
    </AppLink>
  );
}
