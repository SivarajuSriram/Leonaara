// Port of: new SplitText(el, { type: 'words' }); gsap.from(words, { duration, autoAlpha: .2,
// stagger: .1, scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 50%', scrub: true } })
'use client';
import { useRef, type ElementType } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

type Props = { as?: ElementType; className?: string; html: string; duration?: number };

// The content model carries a literal "\r\n" after every <br> (line-break
// formatting from the source CMS export). Browsers already collapse that
// leading whitespace at the start of the new line, so it's visually inert —
// but it survives as its own whitespace-only text node, which the CMS's own
// renderer strips before it ever reaches word-splitting. Strip it here too,
// except when the whitespace sits between two consecutive <br> tags (a blank
// line), which the reference site's renderer leaves alone — so our DOM text
// nodes match the reference site exactly.
function stripBreakWhitespace(html: string) {
  return html.replace(/(<br\s*\/?>)\s+(?!<br)/gi, '$1');
}

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
  return <Tag ref={ref} className={className} dangerouslySetInnerHTML={{ __html: stripBreakWhitespace(html) }} />;
}
