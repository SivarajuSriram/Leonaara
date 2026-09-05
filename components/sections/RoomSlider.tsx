'use client';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller, EffectFade, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { RoomSliderSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { Button } from '@/components/ui/Button';
import { ArrowSliderIcon } from '@/components/ui/icons';
import { site } from '@/content/site';

// mask_roomslider .grid-container-inner{grid-column-end:span 12;grid-column-
// start:2} is a plain descendant selector, so it applies to BOTH .grid-
// container-inner elements in this component: the outer one directly below
// and the one nested inside each room-content slide.
const gridInnerCls = 'grid-container-inner col-start-2 col-span-12';

// mask_roomslider>.grid-container-inner{grid-template-rows:auto auto auto}
// (mobile only) uses a direct-child combinator, so it only matches the outer
// grid-container-inner (immediately under the mask_roomslider div) — not the
// nested one inside each room-content slide.
const outerGridInnerCls = `${gridInnerCls} max-lg:grid-rows-[auto_auto_auto]`;

// mask_roomslider .swiper{width:100%} applies to all three Swiper roots
// below via their merged "swiper" class (see roomImageLeftCls etc.).
// mask_roomslider img{height:100%} is a broad descendant selector covering
// every <img> here. Picture's own hardcoded imgClass already gives width:
// 100% (h-auto w-full, see components/ui/Picture.tsx), matching this file's
// separate width:100% rule exactly (no override needed for width), but its
// height:auto differs from height:100% and can't be reached via Picture's
// className prop (which only merges onto the <picture> wrapper, not the
// <img> itself) — applied here as a descendant arbitrary variant scoped to
// the whole mask, same technique as PartnerMarquee's [&_img] override.
const maskImgOverrideCls = '[&_img]:h-full';

// mask_roomdetail{padding-top:0} (restated unchanged in the mobile block) is
// dead in this component: RoomSlider.tsx never renders a `mask_roomdetail`
// class (that section type has no component yet — see lib/content.ts) —
// this file's CSS was evidently bundled from the original site's shared
// "room" stylesheet alongside room-detail-page rules.

// mask_roomslider .room-image-left{grid-column-end:span 6;grid-column-start:
// 1;grid-row-start:1} + mobile{grid-column-end:span 9;grid-column-start:1
// (unchanged, restated per the col-span/col-start hazard);grid-row-start:2}
const roomImageLeftCls = 'room-image-left w-full col-start-1 col-span-6 row-start-1 max-lg:col-start-1 max-lg:col-span-9 max-lg:row-start-2';

// mask_roomslider .room-image-right{align-self:flex-end;grid-column-end:
// span 2;grid-column-start:11;grid-row-start:1;pointer-events:none;z-index:
// -1} + mobile{align-self:flex-start;grid-column-end:span 5;grid-column-
// start:7;grid-row-start:1 (unchanged — no row-span at this breakpoint, so
// no hazard);margin-bottom:2rem}. The z-index utility needs `!`: swiper.css
// is deliberately unlayered (see styles/globals.css's own comment) and sets
// `.swiper{position:relative;z-index:1}` on every Swiper root — including
// this one — so an UNLAYERED swiper.css z-index:1 always beats a LAYERED
// Tailwind z-[-1] utility regardless of specificity (CSS Cascade Layers:
// layer precedence is checked before specificity). Confirmed via computed
// styles: without `!`, z-index stayed "1" (swiper.css's value), which put
// this image at the SAME stacking level as room-content instead of behind
// it, making it visibly show through room-content's transparent areas at
// mobile — a real regression, not just a mobile-only cosmetic issue (the
// wrong z-index applies at every breakpoint; mobile's layout just happens
// to make the resulting overlap large enough to be visible).
const roomImageRightCls = 'room-image-right w-full self-end col-start-11 col-span-2 row-start-1 pointer-events-none z-[-1]! max-lg:self-start max-lg:col-start-7 max-lg:col-span-5 max-lg:mb-[2rem]';

// mask_roomslider .room-content{grid-column-end:span 12;grid-column-start:1;
// grid-row-start:1} + mobile{grid-column-end:span 12;grid-column-start:1
// (unchanged, not restated — no col-span added at this breakpoint);grid-row-
// end:span 3;grid-row-start:1 (restated here because mobile DOES add a row-
// span, and Tailwind's row-span-N compiles to the `grid-row` shorthand —
// same start-resetting hazard as col-span/col-start, verified against the
// compiled Tailwind output for the row axis too). Also: .room-content
// .swiper-slide:not(.swiper-slide-active){opacity:0!important}.
const roomContentCls = 'room-content w-full col-start-1 col-span-12 row-start-1 max-lg:row-start-1 max-lg:row-span-3 [&_.swiper-slide:not(.swiper-slide-active)]:opacity-0!';

// mask_roomslider .room-content .swiper-wrapper{padding-top:147%} (mobile
// only) — Swiper's wrapperClass prop merges onto its internal .swiper-
// wrapper div, same mechanism as PartnerMarquee.tsx's swiperWrapperCls.
const roomContentWrapperCls = 'max-lg:pt-[147%]';

// mask_roomslider .room-content h2{font-size:6.7rem;font-weight:300;grid-
// column-end:span 3;grid-column-start:8;letter-spacing:0;line-height:88%;
// padding-top:12rem;text-transform:uppercase} + mobile{font-size:3.5rem;
// letter-spacing:.05em;line-height:114%} (first block) + {padding-top:2rem}
// and {grid-column-end:span 10;grid-column-start:3} (shared with room-info/
// room-button below, second block, same media query — applies together
// with the first block since the two set disjoint properties).
const roomTitleCls = 'text-[6.7rem] font-light tracking-normal leading-[88%] pt-[12rem] uppercase col-start-8 col-span-3 max-lg:text-[3.5rem] max-lg:tracking-[.05em] max-lg:leading-[114%] max-lg:pt-[2rem] max-lg:col-start-3 max-lg:col-span-10';

// mask_roomslider .room-content .room-button,.room-info{grid-column-end:
// span 3;grid-column-start:8} + mobile (shared with h2 above){grid-column-
// end:span 10;grid-column-start:3}
const roomGridColCls = 'col-start-8 col-span-3 max-lg:col-start-3 max-lg:col-span-10';

// mask_roomslider .room-button{margin-top:9rem} + mobile{margin-top:3rem}
const roomButtonCls = `room-button ${roomGridColCls} mt-[9rem] max-lg:mt-[3rem]`;

// mask_roomslider .room-info{align-items:center;display:flex;flex-wrap:
// wrap;font-size:2rem;font-weight:300;letter-spacing:.05em;line-height:150%;
// margin-top:4rem}. Mobile has THREE separate rules touching .room-info
// across the file (two `@media (max-width:1023px)` blocks, plus an oddly
// doubled `@media (max-width:1023px) and (max-width:1023px)` block that is
// functionally the same condition and comes last in source order): (1)
// font-size:1.3rem;letter-spacing:.05em;line-height:131%, (2) font-size:
// 2rem;font-weight:300;letter-spacing:.05em;line-height:150%;margin-top:
// 2rem, (3) font-size:1.3rem;letter-spacing:.05em;line-height:131% again.
// Same specificity + same effective media condition, so source order
// decides: (3) is last and wins for font-size/letter-spacing/line-height,
// but margin-top:2rem (only set once, in (2)) is never overridden and still
// applies. Resolved mobile value: font-size:1.3rem;letter-spacing:.05em;
// line-height:131%;margin-top:2rem (font-weight/align-items/display/flex-
// wrap carry over from the desktop rule untouched by any mobile block).
const roomInfoCls = `room-info ${roomGridColCls} flex flex-wrap items-center font-light text-[2rem] tracking-[.05em] leading-[150%] mt-[4rem] max-lg:text-[1.3rem] max-lg:tracking-[.05em] max-lg:leading-[131%] max-lg:mt-[2rem]`;

// mask_roomslider .room-info .room-info-price{width:100%}
const roomInfoPriceCls = 'room-info-price w-full';

// mask_roomslider .room-info .room-info-spacer{background-color:#211d1d;
// display:inline-block;height:2px;margin:0 1rem;width:3rem} + mobile{
// height:1px;width:2rem}
const roomInfoSpacerCls = 'room-info-spacer inline-block bg-ink h-[2px] w-[3rem] mx-[1rem] max-lg:h-[1px] max-lg:w-[2rem]';

// mask_roomslider .room-icons{...}, .room-icons picture{...}, .room-icons
// picture:last-child{...} and .room-description{margin-left:9rem;margin-
// top:3rem} are all dead: no element in this component carries "room-icons"
// or "room-description" (confirmed via grep) — same bundled-shared-
// stylesheet situation as .mask_roomdetail above.

// mask_roomslider .navigation{align-self:flex-end;grid-column-end:span 2;
// grid-column-start:8;grid-row-start:1;z-index:5} + mobile{align-self:flex-
// start;grid-column-end:span 2;grid-column-start:11;grid-row-end:span 3;
// grid-row-start:1 (restated — mobile adds a row-span here, same hazard as
// room-content above);justify-self:center;margin-top:810%;z-index:5
// (unchanged, not restated)}
const navigationCls = 'navigation self-end col-start-8 col-span-2 row-start-1 z-[5] max-lg:self-start max-lg:col-start-11 max-lg:col-span-2 max-lg:row-start-1 max-lg:row-span-3 max-lg:justify-self-center max-lg:mt-[810%]';

// mask_roomslider .navigation .next,.prev{cursor:pointer;transition:all
// .5s;width:fit-content} — unconditional, applies at both breakpoints
// (unlike TeaserSlider's equivalent rule, which is mobile-only there, see
// TeaserSlider.tsx) + svg{height:2.5rem;width:7rem} (mobile: height:1.7rem;
// width:4.5rem), sized via an [&_svg] descendant variant since
// ArrowSliderIcon renders a bare <svg className="filled">, and passing a
// className prop here would replace (not merge with) that class — same
// technique as components/layout/MenuButton.tsx. + :hover{opacity:.4} is a
// single-element hover (opacity on the hovered element itself, not a
// sibling), so a direct hover: variant suffices, no group needed.
const navArrowCls = 'cursor-pointer transition-all duration-500 w-fit hover:opacity-40 [&_svg]:h-[2.5rem] [&_svg]:w-[7rem] max-lg:[&_svg]:h-[1.7rem] max-lg:[&_svg]:w-[4.5rem]';

// mask_roomslider .navigation .prev{transform:rotate(180deg)} — unconditional
// here (unlike TeaserSlider's mobile-only equivalent).
const navNextCls = `next swiper-button-lock ${navArrowCls}`;
const navPrevCls = `prev swiper-button-lock ${navArrowCls} rotate-180`;

// Mirrors Roomslider.vue: three Swipers. The content slider drives the two image sliders (Controller module).
export function RoomSlider({ section }: { section: RoomSliderSection }) {
  const rooms = section.content.rooms;
  const [left, setLeft] = useState<SwiperType | null>(null);
  const [right, setRight] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const suiteHref = (title: string) => `/suites/${title}/`;
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_roomslider', 'grid-container', maskImgOverrideCls]
    .filter(Boolean).join(' ');

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className={outerGridInnerCls}>
        <Swiper className={roomImageLeftCls} loop allowTouchMove={false} onSwiper={setLeft}>
          {rooms.map((r) => (
            <SwiperSlide key={r.uid} className="roomslide">
              {/* Left image slider: 719x864 desktop / 252x300 mobile */}
              <Picture image={r.previewimage[0]} widthD={719} heightD={864} widthM={252} heightM={300} />
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper className={roomImageRightCls} loop allowTouchMove={false} speed={700} onSwiper={setRight}>
          {rooms.map((r) => (
            <SwiperSlide key={r.uid} className="roomslide">
              {/* Right image slider: 273x317 desktop / 136x180 mobile, speed 700ms */}
              <Picture image={r.images[0]} widthD={273} heightD={317} widthM={136} heightM={180} />
            </SwiperSlide>
          ))}
        </Swiper>
        {left && right ? (
          <Swiper
            className={roomContentCls}
            wrapperClass={roomContentWrapperCls}
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
                <div className={gridInnerCls}>
                  <h2 className={roomTitleCls}>{r.title}</h2>
                  <div className={roomInfoCls}>
                    <span className={roomInfoPriceCls}>{r.minprice}</span>
                    <span className="room-info-size">{r.size}</span>
                    <span className={roomInfoSpacerCls} />
                    <span className="room-info-people">{r.people}</span>
                  </div>
                  <div className={roomButtonCls}>
                    <Button href={suiteHref(r.title)}>{site.t.visitSuite}</Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}
        {rooms.length > 1 ? (
          <div className={navigationCls}>
            <div className={navNextCls} ref={nextRef}><ArrowSliderIcon /></div>
            <div className={navPrevCls} ref={prevRef}><ArrowSliderIcon /></div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
