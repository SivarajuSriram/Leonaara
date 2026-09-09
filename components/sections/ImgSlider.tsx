'use client';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Keyboard, Navigation } from 'swiper/modules';
import type { ImgSliderSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { ArrowSliderIcon } from '@/components/ui/icons';

// imgslider.css: .swiper-container{grid-column-end:span 14;grid-column-start:1;position:relative}
const containerCls = 'swiper-container col-start-1 col-span-14 relative';
// .swiper-wrapper{height:60rem;margin-left:calc((-1*var(--grid-gap))/2);
// margin-right:calc((-1*var(--grid-gap))/2)} + mobile{height:30rem;
// margin-left:calc(var(--grid-gap)/2.22);margin-right:0}
const wrapperCls = 'h-[60rem] mx-[calc((-1*var(--grid-gap))/2)] max-lg:h-[30rem] max-lg:ml-[calc(var(--grid-gap)/2.22)] max-lg:mr-0';
// .swiper-slide{flex-shrink:1;padding-right:var(--grid-gap);width:auto}
// (first-child/last-child restate the same padding-right -- no distinct value)
const slideCls = 'shrink w-auto pr-[var(--grid-gap)]';
// img,picture{height:100%;width:auto} + mobile{max-width:100vw}
const slideImgCls = '[&_img]:h-full [&_img]:w-auto max-lg:[&_img]:max-w-[100vw]';
// .navigation{align-self:flex-end;grid-column-end:span 2;grid-column-start:9;
// justify-self:center;margin-top:3rem;z-index:5}
const navigationCls = 'navigation self-end justify-self-center col-start-9 col-span-2 mt-[3rem] z-[5]';
// .navigation .next,.prev{cursor:pointer;transition:all .5s;width:fit-content}
// + svg{height:2.5rem;width:7rem} + :hover{opacity:.4} + .prev{transform:rotate(180deg)}
const navArrowCls = 'cursor-pointer transition-all duration-500 w-fit hover:opacity-40 [&_svg]:h-[2.5rem] [&_svg]:w-[7rem]';
const navNextCls = `next ${navArrowCls}`;
const navPrevCls = `prev ${navArrowCls} rotate-180`;

export function ImgSlider({ section }: { section: ImgSliderSection }) {
  const images = section.content.images;
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_imgslider', 'grid-container', slideImgCls]
    .filter(Boolean).join(' ');

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <Swiper
        className={containerCls}
        wrapperClass={wrapperCls}
        modules={[FreeMode, Navigation, Keyboard]}
        freeMode={{ momentum: true, momentumRatio: 0.09, momentumBounce: false, sticky: true }}
        centeredSlides={typeof window !== 'undefined' && window.innerWidth < 1024}
        loop
        speed={650}
        slidesPerView="auto"
        keyboard
        grabCursor
        navigation={{ prevEl: null, nextEl: null }}
        onBeforeInit={(s) => {
          const nav = s.params.navigation;
          if (nav && typeof nav === 'object') { nav.prevEl = prevRef.current; nav.nextEl = nextRef.current; }
        }}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i} className={slideCls}>
            <Picture image={img} widthD={1024} heightD={600} lazy={i > 0} />
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 ? (
        <div className={navigationCls}>
          <div className={navNextCls} ref={nextRef}><ArrowSliderIcon /></div>
          <div className={navPrevCls} ref={prevRef}><ArrowSliderIcon /></div>
        </div>
      ) : null}
    </div>
  );
}
