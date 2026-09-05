'use client';
import { useRef } from 'react';
import type { QuoteSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { useParallax } from '@/components/ui/useParallax';

// mask_quote .image{grid-column-end:span 2;grid-column-start:2} + mobile{
// grid-column-end:span 5;grid-column-start:4}
const imageCls = 'image col-start-2 col-span-2 max-lg:col-start-4 max-lg:col-span-5';

// mask_quote .quote-wrapper{grid-column-end:span 6;grid-column-start:6;
// margin-top:19.5rem;transform:translate(9rem)} + mobile{grid-column-end:span 12;
// grid-column-start:2;margin-top:4.5rem;transform:translate(0)}
const quoteWrapperCls = 'quote-wrapper col-start-6 col-span-6 mt-[19.5rem] translate-x-[9rem] max-lg:col-start-2 max-lg:col-span-12 max-lg:mt-[4.5rem] max-lg:translate-x-0';

// mask_quote .quote-wrapper .quote{font-size:7rem;font-weight:300;letter-spacing:
// .04em;line-height:97%} + mobile{font-size:3.7rem;letter-spacing:.04em (unchanged,
// not restated below);line-height:119%}
const quoteCls = 'quote text-[7rem] font-light tracking-[.04em] leading-[97%] max-lg:text-[3.7rem] max-lg:leading-[119%]';

// mask_quote .quote-wrapper .autor{font-size:2rem;font-weight:400;letter-spacing:
// .08em;line-height:125%;margin-top:2rem;text-transform:uppercase} + mobile{
// font-size:1.7rem;letter-spacing:.08em (unchanged);line-height:94%} + the
// trailing mobile block's own .autor{margin-left:5.8rem;margin-top:2rem
// (unchanged, restated to the same value)}
const autorCls = 'autor text-[2rem] font-normal tracking-[.08em] leading-[125%] mt-[2rem] uppercase max-lg:text-[1.7rem] max-lg:leading-[94%] max-lg:ml-[5.8rem]';

// mask_quote img{height:auto;width:100%} needs no class here: the <img> renders
// through Picture, whose own imgClass already carries h-auto w-full
// (components/ui/Picture.tsx) — same values, already covered.

export function Quote({ section }: { section: QuoteSection }) {
  const c = section.content;
  const imgRef = useRef<HTMLDivElement>(null);
  useParallax(imgRef, 1.6); // original: smoother.effects(picture, { speed: 1.6 })
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_quote']
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className="grid-container">
        {c.img.map((img, i) => (
          <div className={imageCls} key={i} ref={i === 0 ? imgRef : undefined}>
            {/* original: widthD 274, heightD 330, widthM 360, heightM 520 */}
            <Picture image={img} widthD={274} heightD={330} widthM={360} heightM={520} />
          </div>
        ))}
        <div className={quoteWrapperCls}>
          <SplitWords as="div" className={quoteCls} html={c.quote} />
          <div className={autorCls}>{c.autor}</div>
        </div>
      </div>
    </div>
  );
}
