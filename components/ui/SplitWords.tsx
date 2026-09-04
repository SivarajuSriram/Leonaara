// Port of: new SplitText(el, { type: 'words' }); gsap.from(words, { duration, autoAlpha: .2,
// stagger: .1, scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 50%', scrub: true } })
'use client';
import { useRef, type ElementType } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

type Props = { as?: ElementType; className?: string; html: string; duration?: number };

export function SplitWords({ as: Tag = 'h2', className, html, duration = 0.4 }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const split = SplitText.create(el, { type: 'words' });
      gsap.from(split.words, {
        duration,
        autoAlpha: 0.2,
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 50%', scrub: true },
      });
      return () => split.revert();
    },
    { dependencies: [html] },
  );
  return <Tag ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
