'use client';
import { useRef } from 'react';
import type { GallerySliderSection, ImageRef } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { useGSAP } from '@/lib/gsap';
import { horizontalLoop, type LoopTimeline } from '@/lib/horizontalLoop';
import { interleave } from '@/components/sections/PartnerMarquee';

// mask_galleryslider .marquee-wrapper{display:flex;grid-column-end:span 14;grid-column-start:1;
// justify-content:space-between;overflow:hidden}
const wrapperCls = 'marquee-wrapper flex col-start-1 col-span-14 justify-between overflow-hidden';
// .marquee-inner{display:flex;justify-content:space-evenly;width:auto}
const innerCls = 'marquee-inner flex justify-evenly w-auto';
// .marquee-item:nth-child(4n+1){margin-left:8rem;width:27.3rem} (mobile 5n+1: margin-left:6rem;width:13.6rem)
// .marquee-item:nth-child(4n+2){margin-left:2.5rem;margin-top:21rem;width:41rem} (mobile 5n+2: margin-left:1.1rem;margin-top:9rem;width:19.1rem)
// .marquee-item:nth-child(4n+3){margin-left:2.5rem;margin-top:16rem;width:27.3rem} (mobile 5n+3: margin-left:6rem;width:9rem)
// .marquee-item:nth-child(4n+4){margin-left:16.5rem;width:41rem} (mobile 5n+4: margin-left:1rem;margin-top:7.5rem;width:13.6rem)
// each item also: padding-right:calc(var(--grid-gap))
// NOTE: desktop cycles every 4, mobile cycles every 5 -- two independent index cycles, not derivable
// from one shared modulo. Computed per breakpoint via separate class strings below.
const ITEM_DESKTOP = [
  'ml-[8rem] w-[27.3rem]',
  'ml-[2.5rem] mt-[21rem] w-[41rem]',
  'ml-[2.5rem] mt-[16rem] w-[27.3rem]',
  'ml-[16.5rem] w-[41rem]',
];
const ITEM_MOBILE = [
  'max-lg:ml-[6rem] max-lg:w-[13.6rem]',
  'max-lg:ml-[1.1rem] max-lg:mt-[9rem] max-lg:w-[19.1rem]',
  'max-lg:ml-[6rem] max-lg:w-[9rem]',
  'max-lg:ml-[1rem] max-lg:mt-[7.5rem] max-lg:w-[13.6rem]',
  'max-lg:ml-[3.8rem] max-lg:mt-[3rem] max-lg:w-[19rem]',
];
function itemCls(i: number) {
  return [
    'marquee-item pr-(--grid-gap)',
    ITEM_DESKTOP[i % 4],
    ITEM_MOBILE[i % 5],
  ].join(' ');
}

function Slide({ img, i }: { img: ImageRef; i: number }) {
  // original: image sizes alternate 273x317 (4n+1/4n+3) and 421x421 (4n+2/4n+4) (spec §9.10)
  const isWide = i % 4 === 1 || i % 4 === 3;
  return (
    <div className={itemCls(i)}>
      <Picture image={img} widthD={isWide ? 421 : 273} heightD={isWide ? 421 : 317} lazy />
    </div>
  );
}

export function GallerySlider({ section }: { section: GallerySliderSection }) {
  const c = section.content;
  const wrapRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<LoopTimeline | null>(null);
  const items = interleave(c.images);

  useGSAP(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    // original: speed .5 desktop / .3 mobile, draggable:false (spec §9.10) -- unlike
    // PartnerMarquee's speed:1/.8 draggable:true, this marquee is display-only.
    loopRef.current = horizontalLoop(wrap.querySelectorAll('.marquee-item'), {
      speed: window.innerWidth < 1024 ? 0.3 : 0.5, snap: false, draggable: false, paused: false, repeat: -1, center: true,
    });
    return () => { loopRef.current?.kill(); loopRef.current = null; };
  }, { scope: wrapRef });

  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_galleryslider', 'grid-container']
    .filter(Boolean).join(' ');

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className={wrapperCls} ref={wrapRef}>
        <div className={innerCls}>
          {items.map((img, i) => <Slide img={img} i={i} key={`${img.src}-${i}`} />)}
        </div>
      </div>
    </div>
  );
}
