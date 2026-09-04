'use client';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller, EffectFade, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { RoomSliderSection } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { Button } from '@/components/ui/Button';
import { ArrowSliderIcon } from '@/components/ui/icons';
import { site } from '@/content/site';
import './RoomSlider.css';

// Mirrors Roomslider.vue: three Swipers. The content slider drives the two image sliders (Controller module).
export function RoomSlider({ section }: { section: RoomSliderSection }) {
  const rooms = section.content.rooms;
  const [left, setLeft] = useState<SwiperType | null>(null);
  const [right, setRight] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const suiteHref = (title: string) => `/suites/${title}/`;

  return (
    <Mask type="roomslider" uid={section.id} appearance={section.appearance} className="grid-container">
      <div className="grid-container-inner">
        <Swiper className="room-image-left" loop allowTouchMove={false} onSwiper={setLeft}>
          {rooms.map((r) => (
            <SwiperSlide key={r.uid} className="roomslide">
              {/* Left image slider: 719x864 desktop / 252x300 mobile */}
              <Picture image={r.previewimage[0]} widthD={719} heightD={864} widthM={252} heightM={300} />
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper className="room-image-right" loop allowTouchMove={false} speed={700} onSwiper={setRight}>
          {rooms.map((r) => (
            <SwiperSlide key={r.uid} className="roomslide">
              {/* Right image slider: 273x317 desktop / 136x180 mobile, speed 700ms */}
              <Picture image={r.images[0]} widthD={273} heightD={317} widthM={136} heightM={180} />
            </SwiperSlide>
          ))}
        </Swiper>
        {left && right ? (
          <Swiper
            className="room-content"
            modules={[Navigation, Controller, EffectFade]}
            effect="fade"
            speed={1300} // Content fade transition: 1300ms, from js_Buj7d3j6.js
            loop
            // prevEl/nextEl are assigned in onBeforeInit (an init-time callback, not render)
            // rather than read here, since reading a ref's .current during render is unsafe.
            // Both keys must be present (even as null) here: swiper/react's needsNavigation()
            // check only skips rendering its own default .swiper-button-prev/-next elements
            // when navigation.prevEl/nextEl are already defined at mount. `navigation={true}`
            // left them undefined, so Swiper injected its own default (blue chevron) buttons
            // alongside the custom .navigation arrows below. Do not simplify this back to `true`.
            navigation={{ prevEl: null, nextEl: null }}
            controller={{ control: [right, left] }}
            onBeforeInit={(s) => {
              const nav = s.params.navigation;
              if (nav && typeof nav === 'object') { nav.prevEl = prevRef.current; nav.nextEl = nextRef.current; }
            }}
          >
            {rooms.map((r) => (
              <SwiperSlide key={r.uid} className="roomslide">
                <div className="grid-container-inner">
                  <h2>{r.title}</h2>
                  <div className="room-info">
                    <span className="room-info-price">{r.minprice}</span>
                    <span className="room-info-size">{r.size}</span>
                    <span className="room-info-spacer" />
                    <span className="room-info-people">{r.people}</span>
                  </div>
                  <div className="room-button">
                    <Button href={suiteHref(r.title)}>{site.t.visitSuite}</Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}
        {rooms.length > 1 ? (
          <div className="navigation">
            <div className="next swiper-button-lock" ref={nextRef}><ArrowSliderIcon /></div>
            <div className="prev swiper-button-lock" ref={prevRef}><ArrowSliderIcon /></div>
          </div>
        ) : null}
      </div>
    </Mask>
  );
}
