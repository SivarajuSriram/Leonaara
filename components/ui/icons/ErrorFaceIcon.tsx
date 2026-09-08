// original: 404/error page glyph, inline <svg id="epztLE867ai1"> in mask_errorpage's
// .errorSvgWrapper — verified live via getComputedStyle, not the stale crawl's ":(" text
// guess. Two <path>s: a frown-bracket curve and a two-square "eyes" shape. Both paths carry
// a vestigial fill="#dcd7d2" attribute in the live markup, but a direct computed-style query
// confirms CSS overrides it to #211D1D (dark) — so, same as LogoIcon.tsx, we hardcode the
// real rendered color directly rather than the unused export-tool attribute value.
//
// A few seconds after mount, the live page morphs this frown into a smile and winks its
// bottom eye before redirecting — see lib/errorFaceIcon.ts for the captured morph targets
// and not-found.tsx for the GSAP timeline that drives them via the .mouth/.eyes classes
// below (same morphSVG technique as the accordion icons, lib/accordionIcons.ts).
import type { SVGProps } from 'react';
import { MOUTH_FROWN, EYES_NORMAL } from '@/lib/errorFaceIcon';

export function ErrorFaceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 216 366" {...props}>
      <path className="mouth" fill="#211D1D" transform="translate(.001 0)" d={MOUTH_FROWN} />
      <path className="eyes" fill="#211D1D" d={EYES_NORMAL} />
    </svg>
  );
}
