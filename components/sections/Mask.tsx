// Reproduces the original section wrapper: `{layout} space-before-{spaceBefore} mask mask_{type}`
// classes plus a `uid="c{uid}"` attribute the original markup carries on every section.
import type { ElementType, ReactNode } from 'react';
import type { Appearance } from '@/lib/content';

type Props = { type: string; uid: number; appearance: Appearance; className?: string; as?: ElementType; children?: ReactNode };

export function Mask({ type, uid, appearance, className, as: Tag = 'div', children }: Props) {
  const cls = [`${appearance.layout}`, `space-before-${appearance.spaceBefore}`, 'mask', `mask_${type}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <Tag className={cls} {...{ uid: `c${uid}` }}>
      {children}
    </Tag>
  );
}
