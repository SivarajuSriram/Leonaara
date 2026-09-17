'use client';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, FreeMode, Keyboard, Navigation } from 'swiper/modules';
import type { ImgSliderSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { ArrowSliderIcon } from '@/components/ui/icons';
import { useSwiperExternalNav } from '@/components/ui/useSwiperExternalNav';
import { Lightbox } from '@/components/ui/Lightbox';

// imgslider.css: .swiper-container{grid-column-end:span 14;grid-column-start:1;position:relative}
const containerCls = 'swiper-container w-full col-start-1 col-span-14 relative';
// .swiper-wrapper{height:60rem;margin-left:calc((-1*var(--grid-gap))/2);
// margin-right:calc((-1*var(--grid-gap))/2)} + mobile{height:30rem;
// margin-left:calc(var(--grid-gap)/2.22);margin-right:0}
// `!` required on every one of these: swiper.css is imported unlayered
// (app/globals.css), and an unlayered normal declaration beats ANY layered
// declaration regardless of specificity -- `.swiper-free-mode>.swiper-wrapper
// {margin:0 auto}` (swiper.css) would otherwise beat the mx-[...] utility.
const wrapperCls = 'h-[60rem]! mx-[calc((-1*var(--grid-gap))/2)]! max-lg:h-[30rem]! max-lg:ml-[calc(var(--grid-gap)/2.22)]! max-lg:mr-0!';
// .swiper-slide{flex-shrink:1;padding-right:var(--grid-gap);width:auto}
// (first-child/last-child restate the same padding-right -- no distinct value)
// `!` required: swiper.css's own `.swiper-slide{flex-shrink:0;width:100%}`
// is unlayered and beats these Tailwind utilities without it.
const slideCls = 'shrink! w-auto! pr-[var(--grid-gap)]';
// img,picture{height:100%;width:auto} + mobile{max-width:100vw} -- applies to
// BOTH the picture wrapper and the img inside it in the original.
const slideImgCls = '[&_img]:h-full [&_img]:w-auto max-lg:[&_img]:max-w-[100vw]';
const slidePictureCls = 'h-full! w-auto! max-lg:max-w-[100vw]!';
// .navigation{align-self:flex-end;grid-column-end:span 2;grid-column-start:9;
// justify-self:center;margin-top:3rem;z-index:5}
const navigationCls = 'navigation self-end justify-self-center col-start-9 col-span-2 mt-[3rem] z-[5]';
// .navigation .next,.prev{cursor:pointer;transition:all .5s;width:fit-content}
// + svg{height:2.5rem;width:7rem} + :hover{opacity:.4} + .prev{transform:rotate(180deg)}
const navArrowCls = 'cursor-pointer transition-all duration-500 w-fit hover:opacity-40 [&_svg]:h-[2.5rem] [&_svg]:w-[7rem]';
const navNextCls = `next ${navArrowCls}`;
const navPrevCls = `prev ${navArrowCls} rotate-180`;
// Added at the user's request: click any gallery slide to open it full-
// screen (Lightbox.tsx), with its own prev/next -- not part of the original
// reference extraction.
const clickableSlideCls = 'cursor-pointer';

// alwaysCentered: keeps centeredSlides on at every breakpoint (the original
// only centers below 1024px, per the `breakpoints` override below) -- opted
// into by PlansTabs.tsx so a single master-plan image sits centered in the
// viewport rather than pinned to the left edge like the room-photo carousels
// this same component renders elsewhere, without changing THEIR behavior.
// loop: Swiper's infinite-loop mode (duplicates slides so prev/next never
// hit an end) -- on by default (matches the original room-photo carousels),
// but PlansTabs.tsx opts out per the user's explicit "no need of infinite
// loop for the floorplans" request, since a 1-4 image technical plan gallery
// reads oddly cycling back to itself the way a large photo set doesn't.
export function ImgSlider({ section, alwaysCentered = false, loop = true }: { section: ImgSliderSection; alwaysCentered?: boolean; loop?: boolean }) {
  const images = section.content.images;
  const { prevRef, nextRef, onSwiper } = useSwiperExternalNav();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_imgslider', 'grid-container', slideImgCls]
    .filter(Boolean).join(' ');

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <Swiper
        className={containerCls}
        wrapperClass={wrapperCls}
        modules={[FreeMode, Navigation, Keyboard, A11y, Autoplay]}
        freeMode={{ momentum: true, momentumRatio: 0.09, momentumBounce: false, sticky: true }}
        centeredSlides
        breakpoints={alwaysCentered ? undefined : { 1024: { centeredSlides: false } }}
        spaceBetween={0}
        slidesPerGroup={1}
        // The original (Imgslider.vue) also passes `variable-width: true`, a
        // Swiper option that no longer exists in this project's installed
        // Swiper (14.2.0) -- absent from both its TS types and its runtime
        // (grepped the whole package: zero occurrences), so it's not merely
        // untyped, it's actually gone from the library. `slidesPerView="auto"`
        // below is Swiper's modern replacement for the same variable-width-
        // slide behavior and is already present, so this is a faithful
        // fidelity gap, not a functional regression.
        loop={loop}
        speed={650}
        slidesPerView="auto"
        keyboard
        a11y
        grabCursor
        navigation={{ prevEl: null, nextEl: null }}
        onSwiper={onSwiper}
        onBeforeInit={(s) => {
          const nav = s.params.navigation;
          if (nav && typeof nav === 'object') { nav.prevEl = prevRef.current; nav.nextEl = nextRef.current; }
        }}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i} className={slideCls} onClick={() => setLightboxIndex(i)}>
            <Picture image={img} heightD={600} heightM={300} lazy={i > 0} className={`${slidePictureCls} ${clickableSlideCls}`} />
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 ? (
        <div className={navigationCls}>
          <div className={navNextCls} ref={nextRef}><ArrowSliderIcon /></div>
          <div className={navPrevCls} ref={prevRef}><ArrowSliderIcon /></div>
        </div>
      ) : null}
      <Lightbox images={images} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
    </div>
  );
}
