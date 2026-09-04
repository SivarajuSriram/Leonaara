// Renders HTML straight from the content model; internal <a> clicks play the
// page-leave fade (lib/transition.ts) before navigating, like TransitionLink.
'use client';
import { useRouter } from 'next/navigation';
import type { ElementType, MouseEvent } from 'react';
import { isInternal, leavePage } from '@/lib/transition';

type Props = { html: string; className?: string; as?: ElementType };

export function RichText({ html, className, as: Tag = 'div' }: Props) {
  const router = useRouter();
  const onClick = async (e: MouseEvent<HTMLElement>) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const href = a.getAttribute('href') ?? '';
    if (!isInternal(href)) return;
    e.preventDefault();
    await leavePage();
    router.push(href);
  };
  return <Tag className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
