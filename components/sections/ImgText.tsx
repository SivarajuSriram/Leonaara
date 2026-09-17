'use client';
import { useRef } from 'react';
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

// wide variant: opted into by exactly one call site (the NRI page's "Return
// to your roots, on your terms" title, per the user's explicit request to
// widen this column so the exact, unmodified wording wraps to 2 lines)
// rather than changing contentCls itself, which every other ImgText
// instance on the site (home page's origins/room-nature/spa text, About
// page's four founder bios) also relies on. Measured against the live page:
// "RETURN TO YOUR ROOTS," needs ~1015px at the site's title size. The NRI
// content (nri.ts) keeps its single image on the left (imgleft) and drops
// imgright for this section, per the user's "move the big image to the
// left, keep the text on the right" request -- content starts at col 6
// (same as the normal, non-wide layout, right after .image-left) and spans
// 9 columns instead of 4, all the way to the grid's right edge (col 14,
// where .image-right would otherwise start), giving ample width with no
// font-size change.
const contentWideCls = 'content col-start-6 col-span-9 max-lg:col-start-2 max-lg:col-span-11 max-lg:mt-[4.5rem]';

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
// mt-[-14rem]: pulled up so the leaf mass (concentrated in the top ~70% of
// the source artwork, per its own empty bottom margin) overlaps the bottom
// of the previous section instead of trailing below it -- the "explore
// projects" button ends up reading between leaf clusters, tips of leaves
// brushing the paragraph above, per the user's explicit "subtle overlay,
// not a full cover" request. Paints on top of that section automatically
// (no z-index needed): later siblings in normal flow stack above earlier
// ones. pointer-events-none on the image wrapper (see the render method)
// keeps the overlap from blocking clicks on the button underneath.
const leafDecorOuterCls = 'grid-container mt-[-26rem] mb-[-4rem] max-lg:mt-[1rem] max-lg:mb-[-2rem]';
// w-full h-auto: sizing lives on the wrapper below (w-[98%] ml-auto), not
// here, so this box exactly matches the image's own rendered box -- the
// falling leaves are positioned by percentages against that same wrapper
// (see the render method), and if the image were the shrunk element while
// the wrapper stayed full-width, every leaf's left/top % would land
// against the WRONG (wider) box and drift off the actual foliage.
const leafDecorImgCls = 'block w-full h-auto opacity-80';

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
// wideTitle: opts this instance into contentWideCls above -- see its comment.
export function ImgText({ section, leafSide, leaf = false, wideTitle = false }: { section: ImgTextSection; leafSide?: 'left' | 'right'; leaf?: boolean; wideTitle?: boolean }) {
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
        <div className={wideTitle ? contentWideCls : contentCls}>
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
              {/* w-[98%] ml-auto: 2% shrink, flush right (per an earlier
                  request). */}
              <div className={`relative w-[98%] ml-auto ${leafOnLeft ? 'scale-x-[-1]' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- purely decorative, not real content */}
                <img src="/images/decor/leaf-branch.png" alt="" className={leafDecorImgCls} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
