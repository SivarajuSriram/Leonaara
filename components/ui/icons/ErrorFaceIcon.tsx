// original: 404/error page glyph, inline <svg id="epztLE867ai1"> in mask_errorpage's
// .errorSvgWrapper — verified live via getComputedStyle, not the stale crawl's ":(" text
// guess. Two <path>s: a frown-bracket curve and a two-square "eyes" shape. Both paths carry
// a vestigial fill="#dcd7d2" attribute in the live markup, but a direct computed-style query
// confirms CSS overrides it to #211D1D (dark) — so, same as LogoIcon.tsx, we hardcode the
// real rendered color directly rather than the unused export-tool attribute value.
import type { SVGProps } from 'react';

export function ErrorFaceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 216 366" {...props}>
      <path fill="#211D1D" transform="translate(.001 0)" d="M179.833,366L216,345.223C183.449,292.48,166.973,247.729,166.973,183s16.476-109.4804,49.027-162.2227L179.833,0c-36.972,47.548-62.289,107.083-62.289,183c0,75.517,25.317,135.452,62.289,183Z" />
      <path fill="#211D1D" d="M0,271.304v-55.939h49.8307v55.939h-49.8307ZM0,149.836v-55.9385h49.8307v55.9385h-49.8307Z" />
    </svg>
  );
}
