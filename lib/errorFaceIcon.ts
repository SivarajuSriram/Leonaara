// Mouth/eye morph targets for the 404 page's sad-face icon (ErrorFaceIcon.tsx), extracted
// live from the reference site (a nonexistent route) via a Playwright session with
// navigator.webdriver spoofed to false (automated sessions otherwise get a compressed/accelerated version of this whole sequence,
// confirmed by comparing an unspoofed run's timings against a real screen recording of the
// live page). Polled the SVG's path `d` attributes every 60ms from page load; both morphs are
// real captured live states, not derived/guessed.
//
// Sequence, timed from page mount: mouth is a static frown for ~2.5s, then morphs to MOUTH_SMILE
// over ~500ms; ~650ms later the bottom eye alone morphs to EYES_WINK (a squash: 49.8x55.9 down to
// a ~21x74 vertical sliver) over ~130ms, then releases back to EYES_NORMAL over ~130ms. The top
// eye never moves -- EYES_WINK's first subpath (the top square) is identical to EYES_NORMAL's, only
// the second subpath (bottom square) differs.
export const MOUTH_FROWN =
  'M179.833,366L216,345.223C183.449,292.48,166.973,247.729,166.973,183s16.476-109.4804,49.027-162.2227L179.833,0c-36.972,47.548-62.289,107.083-62.289,183c0,75.517,25.317,135.452,62.289,183Z';

export const MOUTH_SMILE =
  'M117.545,345.223L153.712,366C196.127347,312.532194,216,247.32975,216,182.60075C216,117.87175,198.961303,58.937687,153.712,0L117.545,20.7773C142.234981,61.698763,166.571,107.083,166.571,183C166.571,258.517,142.807578,303.227288,117.545,345.223Z';

export const EYES_NORMAL =
  'M0,271.304v-55.939h49.8307v55.939h-49.8307ZM0,149.836v-55.9385h49.8307v55.9385h-49.8307Z';

export const EYES_WINK =
  'M0,271.304L0,215.365L49.8307,215.365L49.8307,271.304L0,271.304ZM0,149.836L0,75.2665L21.3739,75.2665L21.3739,149.836L0,149.836Z';
