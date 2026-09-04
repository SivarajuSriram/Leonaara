'use client';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller, EffectFade, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { TeaserSliderSection } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { Button } from '@/components/ui/Button';
import { ArrowSliderIcon } from '@/components/ui/icons';
import './TeaserSlider.css';

// Mirrors Teaserslider.vue: four Swipers, the text slider drives the other three.
export function TeaserSlider({ section }: { section: TeaserSliderSection }) {
  const slides = section.content.teaserslides;
  const [left, setLeft] = useState<SwiperType | null>(null);
  const [right, setRight] = useState<SwiperType | null>(null);
  const [info, setInfo] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const multi = slides.length > 1;

  return (
    <Mask type="teaserslider" uid={section.id} appearance={section.appearance}>
      <div className="grid-container">
        <div className="teaser-wrapper grid-container-inner">
          <Swiper className="image-left" loop allowTouchMove={false} onSwiper={setLeft}>
            {slides.map((s) => (
              <SwiperSlide key={s.uid}>
                {s.imgleft.map((img, i) => (
                  <div key={i}>
                    {/* Left image slider: 277x330 desktop / 136x180 mobile, from js_kvOOAud5.js */}
                    <Picture image={img} widthD={277} heightD={330} widthM={136} heightM={180} />
                  </div>
                ))}
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper className="image-right" loop allowTouchMove={false} onSwiper={setRight}>
            {slides.map((s) => (
              <SwiperSlide key={s.uid}>
                {s.imgright.map((img, i) => (
                  <div key={i}>
                    {/* Right image slider: 876x960 desktop / 252x300 mobile, from js_kvOOAud5.js */}
                    <Picture image={img} widthD={876} heightD={960} widthM={252} heightM={300} />
                  </div>
                ))}
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper className="infotext" loop allowTouchMove={false} onSwiper={setInfo}>
            {slides.map((s) => (
              <SwiperSlide key={s.uid}>
                <p className="infotext" dangerouslySetInnerHTML={{ __html: s.infotext }} />
              </SwiperSlide>
            ))}
          </Swiper>
          {left && right && info ? (
            <Swiper
              className="teaser-content"
              modules={[Navigation, Controller, EffectFade]}
              effect="fade"
              speed={1300} // Content fade transition: 1300ms, from js_kvOOAud5.js
              loop
              // prevEl/nextEl are assigned in onBeforeInit (an init-time callback, not render)
              // rather than read here, since reading a ref's .current during render is unsafe.
              navigation={true}
              controller={{ control: [right, left, info] }}
              onBeforeInit={(s) => {
                const nav = s.params.navigation;
                if (nav && typeof nav === 'object') {
                  nav.prevEl = prevRef.current;
                  nav.nextEl = nextRef.current;
                }
              }}
            >
              {slides.map((s) => (
                <SwiperSlide key={s.uid}>
                  <div className="teaser-content-inner">
                    {s.title ? <h2 className="title" dangerouslySetInnerHTML={{ __html: s.title }} /> : null}
                    {s.link ? (
                      <Button href={s.link.href} target={s.link.target ?? undefined}>
                        {s.linktext}
                      </Button>
                    ) : null}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}
          {multi ? (
            <div className="navigation">
              <div className="prev swiper-button-lock" ref={prevRef}>
                <ArrowSliderIcon />
                <span>PREV</span>
              </div>
              <div className="spacer">/</div>
              <div className="next swiper-button-lock" ref={nextRef}>
                <ArrowSliderIcon />
                <span>NEXT</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Mask>
  );
}
