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
// max-lg:ml-[2rem] added: at mobile, col-start-1 sits flush against the true
// browser edge (--grid-margin is 0 there, so column 1 carries no margin the
// way it does on desktop) -- this image-left had no breathing room on its
// left side at all. Per the user's explicit "move those small images on the
// left side to the right a bit so they have some space on the left" request.
// Desktop: lg:ml-[1.5vw] lg:w-full -- nudges the image 1.5% of the screen width in from the
// browser's left edge (it used to touch it), per the user's request. Explicit width:100%
// keeps the image the same size instead of letting the margin shrink it. Mobile keeps its
// own ml-[2rem] below.
const imageLeftCls = 'image-left col-start-1 col-span-4 lg:ml-[1.5vw] lg:w-full row-start-2 row-span-2 mt-[-22.5rem] max-lg:col-start-1 max-lg:col-span-5 max-lg:mt-[-5.5rem] max-lg:ml-[2rem]';

// insetLeft variant: same as imageLeftCls, just one column further in (col-start-2,
// not col-start-1) -- column 1 is the page margin gutter (var(--grid-margin), 5.5rem
// on desktop), so col-start-1 lets the image bleed flush to the browser edge. Opted
// into by the NRI page's hero image at the user's explicit "too far into the left
// edge, move it right a bit" request.
// Mobile block (col-span-12/row-start-2/row-span-1/mt-[4rem]/w-[70%]/mx-auto)
// replaces the old max-lg:col-start-1 max-lg:col-span-5 max-lg:mt-[-5.5rem]:
// the NRI ImgText this variant is used on (app/nri/page.tsx) carries only a
// single left image (no image-right), and that -5.5rem pull-up -- tuned for
// sections with a right image to balance against -- instead dragged this lone
// small image UP into the paragraph text directly above it, landing mid-text
// (confirmed via mobile screenshot: the image sat overlapping the last few
// lines of the "Because distance should never..." paragraph). Per the user's
// explicit "fix the NRI page's image alignment" report. Same stacked-below,
// centered treatment as imageLeftEvenCls below (About's founders), just at a
// slightly wider 70% since this is a single hero-scale image, not a bio photo.
const imageLeftInsetCls = 'image-left col-start-2 col-span-4 row-start-2 row-span-2 mt-[-22.5rem] max-lg:col-start-1 max-lg:col-span-12 max-lg:row-start-2 max-lg:row-span-1 max-lg:mt-[4rem] max-lg:w-[70%] max-lg:mx-auto';

// evenSpacing variant: drops the -22.5rem pull-up AND moves onto the same
// grid row as image-right/content (row-start-1, was row-start-2) so a
// left-image section and a right-image section align identically against
// the title -- per the user's explicit "image alignments should be
// perfectly matched" follow-up. That negative margin + row offset were
// tuned for sections that carry BOTH an image-left and an image-right
// (every mask_imgtext instance on the site except About's 4 founder bios,
// which the user split into one alternating image per person); with only
// one image per section the old values instead ate into the PRECEDING
// section's own trailing space (confirmed against the user's report: big
// gap 1->2, ~none 2->3, big again 3->4) and left the image sitting one row
// lower than a same-section image-right would. Same row + no pull/push
// fixes both: consistent gaps and matched vertical position.
// col-start-2 (was col-start-1): the grid's own column 1 is the page margin
// gutter (var(--grid-margin), 5.5rem on desktop), not a same-width content
// track like columns 2-13 -- so col-start-1/span-4 (margin + 3 content
// tracks) rendered narrower than image-right's col-start-10/span-4 (4 pure
// content tracks), even with equal aspect ratios and equal "widthD" props.
// Starting one column later gives image-left 4 pure content tracks too,
// which is what actually makes all 4 founder photos the same box size (per
// the user's explicit request) -- confirmed by measuring both at 565x440.
// Mobile is unaffected: --grid-margin is 0 there, so col-start-1 and
// col-start-2 are already the same width.
// max-lg:col-span-12/row-start-2/row-span-1/mt-[3rem]/w-[75%]/mx-auto added:
// per the user's explicit "use a normal layout on mobile -- text first, then
// the image below it, centered, good size" request. Previously this sat
// side-by-side with the text at mobile (same row-start-1 as content, just
// col-start-1 vs content's col-start-2), which the user found cramped/
// unconventional for a bio card. Now pinned to row 2 (below content, which
// stays on row 1 -- see contentEvenCls below), full-width column but the
// image itself narrowed to 75% and centered within it via mx-auto, rather
// than stretching edge-to-edge. max-md:w-[92%]: on phones (<768px) the photo is enlarged to 92%
// per the user's "increase the size of these four images on mobile" request; tablet stays at 75%.
const imageLeftEvenCls = 'image-left col-start-2 col-span-4 row-start-1 row-span-2 max-lg:col-start-2 max-lg:col-span-12 max-lg:row-start-2 max-lg:row-span-1 max-lg:mt-[3rem] max-lg:w-[75%] max-md:w-[92%] max-lg:mx-auto';

// mask_imgtext .image-right{grid-column-start:10;margin-bottom:7.5rem} + shared
// (with .content) grid-column-end:span 4 + mobile{grid-column-end:span 8;
// grid-column-start:6;margin-bottom:0}
const imageRightCls = 'image-right col-start-10 col-span-4 mb-[7.5rem] max-lg:col-start-6 max-lg:col-span-8 max-lg:mb-0';

// evenSpacing variant: drops the 7.5rem trailing margin and pins to the same
// row-start-1 row-span-2 as imageLeftEvenCls -- see its comment above. Mobile
// stacking (col-span-12/row-start-2/etc.) mirrors imageLeftEvenCls's mobile
// block exactly -- left and right must render identically once alternating
// sides no longer matters at mobile (both stack the same way below the text).
const imageRightEvenCls = 'image-right col-start-10 col-span-4 row-start-1 row-span-2 max-lg:col-start-2 max-lg:col-span-12 max-lg:row-start-2 max-lg:row-span-1 max-lg:mt-[3rem] max-lg:w-[75%] max-md:w-[92%] max-lg:mx-auto';

// mask_imgtext .content{grid-column-start:6} + shared grid-column-end:span 4 +
// mobile{grid-column-end:span 11;grid-column-start:2;margin-top:4.5rem}
const contentCls = 'content col-start-6 col-span-4 max-lg:col-start-2 max-lg:col-span-11 max-lg:mt-[4.5rem]';

// evenSpacing variant: full-width (col-span-12, not 11) and pinned to
// row-start-1 (explicit, was implicit) so it renders ABOVE the now row-2
// image (see imageLeftEvenCls/imageRightEvenCls above) instead of beside
// it -- the user's "founder info first, then their photo below" mobile
// layout. mt dropped to 2rem (was 4.5rem, sized to clear a side-by-side
// image that no longer shares this row).
// Mobile/tablet: col-start-2 (was 1) + max-lg:text-center + px-[2rem], per the
// user's "align everything in the center" request for the About page -- col 1
// is the zero-width margin track at mobile, so col-start-1/span-12 ended one
// column short of the right edge and sat off-center; cols 2-13 are symmetric.
const contentEvenCls = 'content col-start-6 col-span-4 max-lg:col-start-2 max-lg:col-span-12 max-lg:row-start-1 max-lg:mt-[2rem] max-lg:text-center max-lg:px-[2rem]';

// evenSpacing variant of textCls: same desktop margin, but no mobile left
// indent (max-lg:ml-0) so the centered text is centered on the page, not on
// a box shifted right by 5.8rem.
const textEvenCls = 'text ml-[9rem] max-lg:ml-0 [&_a.linkdetail]:mt-[4.5rem]';

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
// max-lg:row-start-1 added: explicit now that imageLeftInsetCls (the only
// image variant paired with wideTitle, on NRI) claims row-start-2 at mobile
// -- keeps this content block pinned above the image regardless of grid
// auto-placement, same reasoning as contentEvenCls above.
const contentWideCls = 'content col-start-6 col-span-9 max-lg:col-start-2 max-lg:col-span-11 max-lg:row-start-1 max-lg:mt-[4.5rem]';

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
// evenSpacing: opts this instance into imageLeftEvenCls/imageRightEvenCls above
// -- only About's 4 founder bios (single alternating image per section) should
// pass this; every other call site keeps the default dual-image spacing.
// insetLeft: opts image-left into imageLeftInsetCls above (one column in from the
// page edge) -- only the NRI page's hero image uses this today.
export function ImgText({ section, leafSide, leaf = false, wideTitle = false, evenSpacing = false, insetLeft = false }: { section: ImgTextSection; leafSide?: 'left' | 'right'; leaf?: boolean; wideTitle?: boolean; evenSpacing?: boolean; insetLeft?: boolean }) {
  const c = section.content;
  const winter = useIsWinter();
  const left = !winter && c.imgleftsummer.length ? c.imgleftsummer : c.imgleft;
  const right = !winter && c.imgrightsummer.length ? c.imgrightsummer : c.imgright;
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  // Both sides drift in the same direction at the same gentle 1.2 (was left 1.5 / right 1.05; the
  // right side at 1.05 looked still, and 1.5 / 0.7 read too strong) -- per the user's "both of
  // those images on both sides to be moving... slowly" request.
  useParallax(leftRef, 1.2);
  useParallax(rightRef, 1.2);
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_imgtext']
    .filter(Boolean).join(' ');
  const leafOnLeft = leafSide === 'left';
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className="grid-container">
        {left.map((img, i) => (
          <div className={evenSpacing ? imageLeftEvenCls : insetLeft ? imageLeftInsetCls : imageLeftCls} key={i} ref={i === 0 ? leftRef : undefined}>
            {/* original: widthD 501, heightD 390, widthM 117, heightM 105 */}
            <Picture image={img} widthD={501} heightD={390} widthM={117} heightM={105} />
          </div>
        ))}
        {right.map((img, i) => (
          <div className={evenSpacing ? imageRightEvenCls : imageRightCls} key={i} ref={i === 0 ? rightRef : undefined}>
            {/* evenSpacing: same widthD/heightD as image-left above (was 570x510) --
                image-left and image-right sit in equal-width columns (col-span-4 each),
                so matching the aspect ratio too is what actually makes the 4 founder
                photos render at the same box size, per the user's explicit request. The
                non-evenSpacing (dual-image) call sites keep the original 570x510. */}
            <Picture image={img} widthD={evenSpacing ? 501 : 570} heightD={evenSpacing ? 390 : 510} widthM={evenSpacing ? 117 : 223} heightM={evenSpacing ? 105 : 180} />
          </div>
        ))}
        <div className={evenSpacing ? contentEvenCls : wideTitle ? contentWideCls : contentCls}>
          {c.title ? <SplitWords as="h2" className={titleCls} html={c.title} /> : null}
          {c.text ? <RichText className={evenSpacing ? textEvenCls : textCls} html={c.text} /> : null}
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
