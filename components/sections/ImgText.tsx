'use client';
import { useRef } from 'react';
import type { CSSProperties } from 'react';
import type { ImgTextSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { RichText } from '@/components/ui/RichText';
import { useParallax } from '@/components/ui/useParallax';
import { useIsWinter } from '@/lib/season';

// mask_imgtext .image-left{grid-column-end:span 4;grid-column-start:1;grid-row-end:
// span 2;grid-row-start:2;margin-top:-22.5rem} + mobile{grid-column-end:span 5;
// grid-column-start:1 (unchanged, not restated below);margin-top:-5.5rem}
const imageLeftCls = 'image-left col-start-1 col-span-4 row-start-2 row-span-2 mt-[-22.5rem] max-lg:col-start-1 max-lg:col-span-5 max-lg:mt-[-5.5rem]';

// mask_imgtext .image-right{grid-column-start:10;margin-bottom:7.5rem} + shared
// (with .content) grid-column-end:span 4 + mobile{grid-column-end:span 8;
// grid-column-start:6;margin-bottom:0}
const imageRightCls = 'image-right col-start-10 col-span-4 mb-[7.5rem] max-lg:col-start-6 max-lg:col-span-8 max-lg:mb-0';

// mask_imgtext .content{grid-column-start:6} + shared grid-column-end:span 4 +
// mobile{grid-column-end:span 11;grid-column-start:2;margin-top:4.5rem}
const contentCls = 'content col-start-6 col-span-4 max-lg:col-start-2 max-lg:col-span-11 max-lg:mt-[4.5rem]';

// The decorative flourish itself: rendered as ITS OWN ROW after the whole
// `grid-container` (not inside .content, and not absolutely positioned
// against any column's height): two earlier attempts both anchored it to
// .content -- first absolutely against the column's stretched height (which
// varies with viewport width and sometimes put the leaf directly over the
// text), then in-flow after the text within that same narrow 4-column strip
// (which read as centered, since .content is itself a centered middle
// column, and could still collide with .image-right when text was short). A
// separate row below everything sidesteps both problems: nothing else
// occupies this row.
//
// Just one leaf-branch flourish for the whole site (replaced an earlier
// every-section arrangement -- per the user's request for a single full-
// width image rather than one per ImgText instance), opted into via `leaf`
// on exactly one call site. Negative bottom margin on the outer row pulls
// the next section back up so this doesn't just add its full height to the
// page ("too much space after" feedback).
const leafDecorOuterCls = 'grid-container mt-[1.5rem] mb-[-4rem] max-lg:mt-[1rem] max-lg:mb-[-2rem]';
// w-full h-auto: sizing lives on the wrapper below (w-[98%] ml-auto), not
// here, so this box exactly matches the image's own rendered box -- the
// falling leaves are positioned by percentages against that same wrapper
// (see the render method), and if the image were the shrunk element while
// the wrapper stayed full-width, every leaf's left/top % would land
// against the WRONG (wider) box and drift off the actual foliage.
const leafDecorImgCls = 'block w-full h-auto opacity-80';

// Leaf-color palette sampled directly from public/images/decor/leaf-branch.png
// (scanned for opaque, non-brown/green-or-teal pixels, bucketed and ranked by
// frequency) -- this artwork's foliage runs sage-green to pale eucalyptus,
// noticeably cooler/greyer than the footer birch tree's palette, so it gets
// its own set rather than reusing LEAF_COLORS from Footer.tsx.
const BRANCH_LEAF_COLORS = ['#6c906c', '#789c6c', '#84a878', '#90b490', '#a8c090', '#c0d8b4'] as const;

// Falling leaves drifting out of the single site-wide leaf-branch image,
// reusing the exact same wind-gust keyframe as the footer's birch tree
// (.leaf-fall in globals.css: two alternating sideways gusts before the
// leaf finally drops and fades, not a straight vertical fall) so both
// flourishes read as the same weather. left/top are picked off the actual
// foliage clusters in the CURRENT leaf-branch.png (as % of the image's own
// box, sampled via a fine-grained foliage-density scan of the live source
// PNG -- re-sampled after the artwork itself was swapped out, since the
// coordinates from the OLD image no longer lined up with real leaf mass
// and leaves were visibly detaching from blank canvas above the branch
// instead of the branch itself), so leaves visibly detach from real leaf
// mass instead of empty canvas. Sizes are loosely matched to this artwork's
// own leaves (measured individual, non-merged leaf blobs in leaf-branch.png
// at roughly 9-12% of the image's own height) but dialed back well below
// that literal size -- a first pass at the full measured size (~9-13rem)
// read as oversized/cartoonish blown up that big; this scaled-down range
// still reads bigger than an earlier footer-leaf-scale guess (~1.8-2.7rem,
// too small -- "unrelated flecks") without dominating the real foliage.
const BRANCH_FALLING_LEAVES = [
  { left: '4%', top: '32%', size: '5.8rem', duration: '10.5s', delay: '0.5s', sway: '4.2rem', spin: 1, fall: '40rem', color: BRANCH_LEAF_COLORS[0] },
  { left: '14%', top: '62%', size: '5.1rem', duration: '9s', delay: '3.2s', sway: '-4.6rem', spin: -1, fall: '36rem', color: BRANCH_LEAF_COLORS[3] },
  { left: '31%', top: '72%', size: '6.6rem', duration: '12s', delay: '6s', sway: '5rem', spin: 1, fall: '44rem', color: BRANCH_LEAF_COLORS[5] },
  { left: '34%', top: '32%', size: '4.8rem', duration: '10s', delay: '1.6s', sway: '-3.8rem', spin: -1, fall: '34rem', color: BRANCH_LEAF_COLORS[1] },
  { left: '44%', top: '38%', size: '6.2rem', duration: '13s', delay: '7.2s', sway: '4.4rem', spin: 1, fall: '42rem', color: BRANCH_LEAF_COLORS[4] },
  { left: '59%', top: '32%', size: '4.6rem', duration: '8.5s', delay: '4.4s', sway: '-4rem', spin: -1, fall: '32rem', color: BRANCH_LEAF_COLORS[2] },
  { left: '66%', top: '48%', size: '5.6rem', duration: '11.5s', delay: '2.4s', sway: '3.6rem', spin: 1, fall: '38rem', color: BRANCH_LEAF_COLORS[5] },
  { left: '81%', top: '52%', size: '5.1rem', duration: '9.5s', delay: '5.6s', sway: '-3.2rem', spin: -1, fall: '34rem', color: BRANCH_LEAF_COLORS[0] },
  { left: '94%', top: '28%', size: '4.8rem', duration: '10.8s', delay: '8s', sway: '4rem', spin: 1, fall: '36rem', color: BRANCH_LEAF_COLORS[3] },
] as const;

function FallingBranchLeaf({ leaf }: { leaf: (typeof BRANCH_FALLING_LEAVES)[number] }) {
  const style = {
    left: leaf.left,
    top: leaf.top,
    width: `calc(${leaf.size} * 0.55)`,
    height: leaf.size,
    '--leaf-duration': leaf.duration,
    '--leaf-delay': leaf.delay,
    '--leaf-sway': leaf.sway,
    '--leaf-spin': leaf.spin,
    '--leaf-fall': leaf.fall,
    '--leaf-opacity': 0.85,
  } as CSSProperties;
  return (
    // Narrow, pointed almond/eucalyptus leaf (traced off the actual leaves in
    // leaf-branch.png) -- much narrower than the footer birch leaf's broad
    // rounded shape, matching this artwork's slender foliage instead.
    <svg viewBox="0 0 12 24" preserveAspectRatio="none" className="leaf-fall absolute" style={{ ...style, fill: leaf.color }} aria-hidden="true">
      <path d="M6 1C9 5 11 11 10 16C9.2 20 7.5 23 6 23.5C4.5 23 2.8 20 2 16C1 11 3 5 6 1Z" />
      <path d="M6 2.5V22" stroke="#2f3f28" strokeOpacity="0.3" strokeWidth="0.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// mask_imgtext .title{margin-bottom:3rem} + mobile{margin-bottom:1.5rem}
const titleCls = 'title mb-[3rem] max-lg:mb-[1.5rem]';

// mask_imgtext .text{margin-left:9rem} + mobile{margin-left:5.8rem}, plus
// mask_imgtext .linkdetail{margin-top:4.5rem} (identical at mobile, never
// restated with a different value) — .linkdetail is not dead: it's the "TO
// THE ..." anchor RichText injects as raw HTML from the CMS text field (see
// content/en/home.ts, `class="linkdetail"`), so it can't carry its own
// className and is targeted here as a descendant of .text instead, same
// approach as Footer.tsx's RichText-injected anchors.
const textCls = 'text ml-[9rem] max-lg:ml-[5.8rem] [&_a.linkdetail]:mt-[4.5rem]';

// mask_imgtext img{height:auto;width:100%} needs no class here: every <img> in
// this component renders through Picture, whose own imgClass already carries
// h-auto w-full (components/ui/Picture.tsx) — same values, already covered.

// leaf: opts this instance into rendering the single site-wide leaf-branch
// flourish (see leafDecorOuterCls above) -- exactly one call site across the
// whole site should pass this. leafSide picks which way it opens and is
// only meaningful when leaf is true.
export function ImgText({ section, leafSide, leaf = false }: { section: ImgTextSection; leafSide?: 'left' | 'right'; leaf?: boolean }) {
  const c = section.content;
  const winter = useIsWinter();
  const left = !winter && c.imgleftsummer.length ? c.imgleftsummer : c.imgleft;
  const right = !winter && c.imgrightsummer.length ? c.imgrightsummer : c.imgright;
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  useParallax(leftRef, 1.5); // original: smoother.effects(picture-left, { speed: 1.5 })
  useParallax(rightRef, 1.05); // original: smoother.effects(picture-right, { speed: 1.05 })
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_imgtext']
    .filter(Boolean).join(' ');
  const leafOnLeft = leafSide === 'left';
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className="grid-container">
        {left.map((img, i) => (
          <div className={imageLeftCls} key={i} ref={i === 0 ? leftRef : undefined}>
            {/* original: widthD 501, heightD 390, widthM 117, heightM 105 */}
            <Picture image={img} widthD={501} heightD={390} widthM={117} heightM={105} />
          </div>
        ))}
        {right.map((img, i) => (
          <div className={imageRightCls} key={i} ref={i === 0 ? rightRef : undefined}>
            {/* original: widthD 570, heightD 510, widthM 223, heightM 180 */}
            <Picture image={img} widthD={570} heightD={510} widthM={223} heightM={180} />
          </div>
        ))}
        <div className={contentCls}>
          {c.title ? <SplitWords as="h2" className={titleCls} html={c.title} /> : null}
          {c.text ? <RichText className={textCls} html={c.text} /> : null}
        </div>
      </div>
      {leaf ? (
        <div className={leafDecorOuterCls}>
          {/* No horizontal shift on this wrapper: the image is w-full
              inside a col-span-14 (edge-to-edge) container, so it already
              butts flush against the right edge of the screen -- per the
              user's "connect to the border on the right" request. (An
              earlier version nudged this left to dodge a crop artifact in
              the OLD leaf-branch.png; the current artwork doesn't have
              that problem, so the shift just left an unwanted gap on the
              right and has been dropped.) The inner wrapper below carries
              the scaleX(-1) flip so the image AND its falling leaves
              mirror together. */}
          <div className="col-start-1 col-span-14 pointer-events-none" aria-hidden="true">
            {/* branch-sway (globals.css): a slow, tiny rotate around the
                trunk (right edge, where the branch is anchored) so the
                whole illustration reads as gently moving in a breeze, not
                just the detached falling leaves. Its own wrapper, separate
                from the mirror/shrink div below: a CSS animation sets the
                WHOLE `transform` property each frame, so combining it with
                that div's static scale-x-[-1] utility on the same element
                would silently drop the flip (animation always wins) --
                nesting keeps the two transforms on different elements so
                neither overwrites the other. */}
            <div className="branch-sway">
              {/* w-[98%] ml-auto (2% shrink, flush right) lives on THIS
                  box, not the img -- so it's also the box the falling
                  leaves' left/top percentages resolve against, keeping
                  them aligned to the actual (shrunk) image instead of the
                  full-width column it sits in. */}
              <div className={`relative w-[98%] ml-auto ${leafOnLeft ? 'scale-x-[-1]' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- purely decorative, not real content */}
                <img src="/images/decor/leaf-branch.png" alt="" className={leafDecorImgCls} />
                {BRANCH_FALLING_LEAVES.map((l, i) => <FallingBranchLeaf key={i} leaf={l} />)}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
