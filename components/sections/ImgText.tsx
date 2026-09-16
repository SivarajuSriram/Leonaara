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

// The decorative flourish itself: deliberately oversized (per the user's
// repeated "even bigger" requests) and allowed to bleed off the left/right
// edge of the viewport -- body has overflow-x:hidden globally (app/globals.css),
// so that never causes a horizontal scrollbar, same trick the footer tree
// relies on. Rendered as ITS OWN ROW after the whole `grid-container` (not
// inside .content, and not absolutely positioned against any column's
// height): two earlier attempts both anchored it to .content -- first
// absolutely against the column's stretched height (which varies with
// viewport width and sometimes put the leaf directly over the text), then
// in-flow after the text within that same narrow 4-column strip (which read
// as centered, since .content is itself a centered middle column, and could
// still collide with .image-right when text was short). A separate row below
// everything sidesteps both problems: nothing else occupies this row.
//
// Two leaves per section, opposite sides, same size (per the user's
// explicit "all of the same size" -- an earlier version made the second one
// smaller, reading as a lesser echo of the first rather than a matched
// pair), spaced apart with a generous top margin so the diagonal distance
// between them is clearly visible rather than the two nearly overlapping.
// Negative bottom margin on the outer row pulls the next section back up so
// this doesn't just add its full height to the page ("too much space
// after" feedback) despite the wider gap between the two leaves themselves.
const leafDecorOuterCls = 'grid-container mt-[1.5rem] mb-[-4rem] max-lg:mt-[1rem] max-lg:mb-[-2rem]';
const leafDecorImgCls = 'block w-[68rem] max-w-none h-auto opacity-80 max-lg:w-[38rem]';

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

// leafSide: which side the primary leaf opens on (the secondary one always
// takes the opposite side). Required, passed explicitly by each page from a
// simple alternating sequence -- CMS section ids aren't sequential (about.ts
// has imgtext ids 287, 290, 292, 295: two of those share the same parity
// back to back), so deriving the alternation from `id % 2` silently broke
// and repeated the same side twice in a row. Explicit per-call-site values
// guarantee a real right/left/right/left zigzag down each page instead.
export function ImgText({ section, leafSide }: { section: ImgTextSection; leafSide: 'left' | 'right' }) {
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
      <div className={leafDecorOuterCls}>
        <div className={`col-start-1 col-span-14 flex pointer-events-none ${leafOnLeft ? 'justify-start' : 'justify-end'}`} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- purely decorative, not real content */}
          <img
            src="/images/decor/leaf-branch.png"
            alt=""
            className={`${leafDecorImgCls} ${leafOnLeft ? 'scale-x-[-1]' : ''}`}
          />
        </div>
        <div
          className={`col-start-1 col-span-14 flex pointer-events-none mt-[6rem] max-lg:mt-[3rem] ${leafOnLeft ? 'justify-end' : 'justify-start'}`}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- purely decorative, not real content */}
          <img
            src="/images/decor/leaf-branch.png"
            alt=""
            className={`${leafDecorImgCls} ${leafOnLeft ? '' : 'scale-x-[-1]'}`}
          />
        </div>
      </div>
    </div>
  );
}
