'use client';
import { useRef } from 'react';
import type { BreakSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { useParallax } from '@/components/ui/useParallax';
import { useIsWinter } from '@/lib/season';

// mask_break .break-wrapper{background-color:#e4e0db (-> bg-canvas token);
// padding-bottom:30rem} + mobile{padding-bottom:4.5rem}
const wrapperCls = 'break-wrapper grid-container bg-canvas pb-[30rem] max-lg:pb-[4.5rem]';

// mask_break .image-left{grid-column-end:span 4;grid-column-start:2;margin-top:
// -12rem} + mobile{grid-column-end:span 8;grid-column-start:2 (unchanged);
// grid-row-start:1;margin-top:-6rem}. NOTE: `max-lg:col-start-2` is restated
// explicitly even though the value doesn't change — Tailwind's compiled
// stylesheet groups all col-span-N utilities before all col-start-N utilities
// within each variant scope, but a variant-scoped col-span rule (e.g.
// max-lg:col-span-8) still sits AFTER the base (unprefixed) col-start-2 rule
// in the final stylesheet, so at <=1023px it would silently win the cascade
// for grid-column-start (col-span's `grid-column:span 8/span 8` shorthand
// sets grid-column-start too) and fall back to auto-placement if col-start-2
// weren't re-asserted at the same max-lg scope.
const imageLeftCls = 'image-left col-start-2 col-span-4 mt-[-12rem] max-lg:col-start-2 max-lg:col-span-8 max-lg:row-start-1 max-lg:mt-[-6rem]';

// mask_break .image-right{align-self:flex-end;grid-column-end:span 3;
// grid-column-start:12;grid-row-start:2;margin-bottom:-7rem} + mobile{
// grid-column-end:span 7;grid-column-start:8;grid-row-start:3;margin-bottom:0}
const imageRightCls = 'image-right self-end col-start-12 col-span-3 row-start-2 mb-[-7rem] max-lg:col-start-8 max-lg:col-span-7 max-lg:row-start-3 max-lg:mb-0';

// mask_break .title{font-size:12rem;font-weight:300;grid-column-end:span 6;
// grid-column-start:5;grid-row-start:2;letter-spacing:0;line-height:100%;
// margin-top:-9rem;text-align:center;text-transform:uppercase}. Mobile: the
// file has two separate, non-nested `@media (max-width:1023px)` blocks that
// both target `.mask_break .title` (lines 32-38 and 68-77 of the original
// Break.css) — same selector, same specificity, so the later block in source
// order wins for every property it sets. That later block (font-size:4.2rem;
// grid-column-end:span 12;grid-column-start:2;grid-row-start:2 (unchanged);
// letter-spacing:.05em;line-height:98%;margin-bottom:6rem;margin-top:6rem) is
// what actually renders; the earlier block's font-size:6.7rem/letter-spacing:0/
// line-height:88% never take effect and are correctly dropped here.
const titleCls = 'title text-center uppercase text-[12rem] font-light tracking-normal leading-none col-start-5 col-span-6 row-start-2 mt-[-9rem] max-lg:text-[4.2rem] max-lg:col-start-2 max-lg:col-span-12 max-lg:tracking-[.05em] max-lg:leading-[98%] max-lg:mt-[6rem] max-lg:mb-[6rem]';

// mask_break .text{margin-left:9rem} and .linkdetail{margin-top:4.5rem}
// (restated unchanged in the mobile block) are dead: no `.text` or
// `.linkdetail` element exists in this component's markup today (confirmed
// via `grep -n "linkdetail\|className=\"text\"" components/sections/Break.tsx`
// returning nothing) — same dead-rule situation already established for
// Quote.tsx/ImgText.tsx's own unused CSS.

// mask_break img{height:auto;width:100%} needs no class here: every <img> in
// this component renders through Picture, whose own imgClass already carries
// h-auto w-full (components/ui/Picture.tsx) — same values, already covered.

export function Break({ section }: { section: BreakSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const left = !winter && c.imgleftsummer.length ? c.imgleftsummer : c.imgleft;
  const right = !winter && c.imgrightsummer.length ? c.imgrightsummer : c.imgright;
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  useParallax(leftRef, 1.2); // original: smoother.effects(picture-left, { speed: 1.2 })
  useParallax(rightRef, 1.5); // original: smoother.effects(picture-right, { speed: 1.5 })
  // mask_break{margin-top:12rem} + mobile{margin-top:9rem} — this sits on the
  // outer .mask_break element itself, not on .break-wrapper (a different
  // selector one level down), so it's appended to `cls` rather than to
  // wrapperCls.
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_break', 'mt-[12rem]', 'max-lg:mt-[9rem]']
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className={wrapperCls}>
        {left.map((img, i) => (
          <div className={imageLeftCls} key={i} ref={i === 0 ? leftRef : undefined}>
            {/* original: widthD 570, heightD 510, widthM 223, heightM 180 */}
            <Picture image={img} widthD={570} heightD={510} widthM={223} heightM={180} />
          </div>
        ))}
        {c.title ? <SplitWords as="h2" className={titleCls} html={c.title} duration={0.2} /> : null}
        {right.map((img, i) => (
          <div className={imageRightCls} key={i} ref={i === 0 ? rightRef : undefined}>
            {/* original: widthD 352, heightD 280, widthM 175, heightM 139 */}
            <Picture image={img} widthD={352} heightD={280} widthM={175} heightM={139} />
          </div>
        ))}
      </div>
    </div>
  );
}
