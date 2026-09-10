// components/ui/useSwiperExternalNav.ts
// Swiper-react's documented onBeforeInit-based pattern for wiring external
// prev/next elements (nav buttons rendered as JSX siblings, not Swiper's own
// injected DOM) is unreliable in practice: onBeforeInit can fire before
// React has committed refs on those sibling elements, silently leaving
// swiper.navigation.prevEl/nextEl null and the buttons permanently inert --
// confirmed across all 4 of this project's sliders that used it (RoomSlider,
// TeaserSlider, ImgSlider, RoomDetail), not just one. Re-wiring navigation
// once the swiper instance actually exists (via onSwiper, not a plain mount
// effect) is the fix: a plain effect fires once on this hook's own mount,
// which is too early for sliders whose nav-carrying Swiper mounts
// conditionally later (TeaserSlider/RoomSlider only render their 4th/3rd
// Swiper once earlier sibling Swipers have each already called their own
// onSwiper) -- that swiper instance wouldn't exist yet at hook-mount time.
// Doing the wiring inside onSwiper itself, deferred by one tick so any
// same-render-pass sibling ref (RoomDetail/ImgSlider, where the nav divs
// mount in the very same pass as the swiper) is guaranteed committed too,
// covers both mount shapes with one implementation.
'use client';
import { useRef } from 'react';
import type { Swiper as SwiperClass } from 'swiper/types';

export function useSwiperExternalNav() {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const onSwiper = (swiper: SwiperClass) => {
    setTimeout(() => {
      if (swiper.destroyed || !prevRef.current || !nextRef.current) return;
      const nav = swiper.params.navigation;
      if (nav && typeof nav === 'object') {
        nav.prevEl = prevRef.current;
        nav.nextEl = nextRef.current;
      }
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }, 0);
  };

  return { prevRef, nextRef, onSwiper };
}
