'use client';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller, EffectFade, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { TeaserSliderSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { Button } from '@/components/ui/Button';
import { ArrowSliderIcon } from '@/components/ui/icons';
import { useSwiperExternalNav } from '@/components/ui/useSwiperExternalNav';

// mask_teaserslider .swiper{width:100%} — applies to all four Swiper roots
// below via their merged "swiper" class (image-left, image-right, infotext,
// teaser-content). mask_teaserslider img{width:100%} (restated twice more,
// identically, elsewhere in the file) needs no class: Picture's own
// hardcoded imgClass already gives width:100% (h-auto w-full, see
// components/ui/Picture.tsx) — same value, already covered.
const swiperWCls = 'w-full';

// mask_teaserslider .teaser-wrapper{grid-column-end:span 12;grid-column-
// start:2;grid-template-rows:auto 1fr} + mobile{grid-template-rows:auto auto
// auto}
const teaserWrapperCls = 'teaser-wrapper grid-container-inner col-start-2 col-span-12 grid-rows-[auto_1fr] max-lg:grid-rows-[auto_auto_auto]';

// mask_teaserslider .image-left,.teaser-content{grid-column-start:1;grid-
// row-start:1} (shared base rule) + .image-left{grid-column-end:span 2;
// grid-row-end:span 1;margin-top:12rem} + mobile{grid-column-end:span 5;
// grid-column-start:3 (restated per the col-span/col-start hazard);grid-
// row-start:1 (unchanged — no row-span introduced at this breakpoint, so no
// hazard);margin-bottom:2rem;margin-top:0}
const imageLeftCls = `${swiperWCls} image-left col-start-1 row-start-1 col-span-2 row-span-1 mt-[12rem] max-lg:col-start-3 max-lg:col-span-5 max-lg:mb-[2rem] max-lg:mt-0`;

// mask_teaserslider .teaser-content{grid-column-end:span 12;grid-row-end:
// span 3;text-transform:uppercase} (plus the shared col-start-1/row-start-1
// above) + mobile{grid-column-end:span 12;grid-column-start:1 (both
// unchanged, not restated — no col-span variance at this breakpoint);grid-
// row-end:span 4;grid-row-start:1 (restated — mobile changes the row-span
// here, and Tailwind's row-span-N compiles to the `grid-row` shorthand
// exactly like col-span-N compiles to `grid-column` — verified against the
// compiled Tailwind output — so the start must be restated at the same
// max-lg scope or it resets to auto placement)}.
const teaserContentCls = `${swiperWCls} teaser-content col-start-1 row-start-1 col-span-12 row-span-3 uppercase max-lg:row-start-1 max-lg:row-span-4`;

// mask_teaserslider .teaser-content .swiper-slide{display:grid;grid-
// template-rows:1fr 1fr} + mobile{grid-template-rows:auto;grid-column-gap:
// var(--grid-gap);grid-template-columns:repeat(12,1fr)} (display:grid
// unchanged, not restated) + .swiper-slide:not(.swiper-slide-active){
// opacity:0!important}. The `display` utility needs `!` here: app/
// globals.css deliberately keeps swiper.css unlayered (see its own comment)
// so that component CSS can out-cascade Swiper's library defaults by
// ordinary specificity — but that also means an UNLAYERED swiper.css rule
// always beats a LAYERED Tailwind utility on the same property regardless of
// specificity (CSS Cascade Layers: layer precedence is checked before
// specificity). Confirmed via computed styles: without `!`, swiper.css's own
// `.swiper-slide{display:block}` won, leaving display stuck at "block" even
// though grid-template-rows (a property swiper.css never sets, so no layer
// conflict) applied correctly. `!important` beats layer+specificity outright,
// which is why grid-template-rows/-columns below don't need the same escape.
const teaserContentSlideCls = '[&_.swiper-slide]:grid! [&_.swiper-slide]:grid-rows-[1fr_1fr] max-lg:[&_.swiper-slide]:grid-rows-[auto] max-lg:[&_.swiper-slide]:gap-x-[var(--grid-gap)] max-lg:[&_.swiper-slide]:grid-cols-12 [&_.swiper-slide:not(.swiper-slide-active)]:opacity-0!';

const teaserContentSwiperCls = `${teaserContentCls} ${teaserContentSlideCls}`;

// mask_teaserslider .teaser-content .swiper-slide .teaser-content-inner{
// grid-row-end:span 1;grid-row-start:2;padding-right:55%;padding-top:4.5rem}
// + mobile{grid-column-end:span 10;grid-column-start:3;grid-row-end:span 1;
// grid-row-start:1 (restated together with row-span-1, both change at the
// same max-lg scope so no hazard);padding-right:0;padding-top:192%}
const teaserContentInnerCls = 'teaser-content-inner row-start-2 row-span-1 pr-[55%] pt-[4.5rem] max-lg:col-start-3 max-lg:col-span-10 max-lg:row-start-1 max-lg:row-span-1 max-lg:pr-0 max-lg:pt-[192%]';

// mask_teaserslider .teaser-content h2{margin-bottom:2rem} + mobile{font-
// size:3.5rem;letter-spacing:.05em;line-height:114%}
const teaserTitleCls = 'title mb-[2rem] max-lg:text-[3.5rem] max-lg:tracking-[.05em] max-lg:leading-[114%]';

// mask_teaserslider .image-right{grid-column-end:span 6;grid-column-start:7;
// grid-row-end:span 2;grid-row-start:1} + mobile{grid-row-end:span 1;grid-
// row-start:2 (restated together, no hazard)} + mobile (shared w/ .infotext)
// {grid-column-end:span 9;grid-column-start:4 (restated together)}
const imageRightCls = `${swiperWCls} image-right col-start-7 col-span-6 row-start-1 row-span-2 max-lg:col-start-4 max-lg:col-span-9 max-lg:row-start-2 max-lg:row-span-1`;

// mask_teaserslider .infotext{font-size:2rem;font-weight:300;letter-spacing:
// .08em;line-height:125%;text-transform:uppercase;grid-column-end:span 6}
// + a LATER unconditional rule (grid-column-end:span 4;grid-column-start:7)
// that entirely supersedes this same selector's earlier grid-column-end:
// span 6 (later wins, same specificity, no start was even set the first
// time) + another later unconditional rule shared with .navigation (grid-
// row-start:3;margin-top:1.5rem). Resolved desktop grid position: col-
// start:7,col-span:4,row-start:3. Mobile resolves across three separate
// blocks in source order — same kind of multi-block resolution as
// RoomSlider's .room-info: (1) font-size:1.3rem;letter-spacing:.05em;line-
// height:131%, (2, the final big mobile block, shared w/ .image-right)
// grid-column-end:span 9;grid-column-start:4, (3, also final block) grid-
// row-start:3 (unchanged);margin-top:.5rem (overrides the unconditional
// 1.5rem);text-align:right.
//
// This selector also matches the <p className="infotext"> rendered inside
// the swiper below (not just this Swiper root) — the grid/row utilities are
// inert there (it isn't a grid item, nested inside a swiper-slide) but kept
// on both elements for literal parity with the single original CSS rule
// that matches them both. width:100% (from .swiper) does NOT apply to that
// <p> though — it only has class "infotext", not "swiper" — so swiperWCls
// is added just to the Swiper root, separately from this shared constant.
const infotextSharedCls = 'infotext text-[2rem] font-light tracking-[.08em] leading-[125%] uppercase col-start-7 col-span-4 row-start-3 mt-[1.5rem] max-lg:text-[1.3rem] max-lg:tracking-[.05em] max-lg:leading-[131%] max-lg:col-start-4 max-lg:col-span-9 max-lg:mt-[0.5rem] max-lg:text-right';
const infotextSwiperCls = `${swiperWCls} ${infotextSharedCls}`;

// mask_teaserslider .infotext,.navigation{grid-row-start:3;margin-top:
// 1.5rem} (row-start/margin-top shared with infotext above) + .navigation{
// align-self:flex-end;display:flex;font-size:2rem;font-weight:300;grid-
// column-end:span 1;grid-column-start:12;justify-content:flex-end;letter-
// spacing:.08em;line-height:125%;text-transform:uppercase;z-index:15} +
// mobile (small block){font-size:1.3rem;letter-spacing:.05em;line-height:
// 131%} + mobile (final big block, later in source, wins any conflicts with
// the small block above): align-self:flex-start;display:block;grid-column-
// end:span 2;grid-column-start:1;grid-row-end:span 2;grid-row-start:1
// (overrides the shared rule's row-start:3, restated together with row-
// span-2 per the row-axis hazard);justify-self:center;margin-top:810%
// (overrides 1.5rem);z-index:5 (overrides 15). justify-content:flex-end is
// never overridden and stays set even though display:block makes it
// visually inert at mobile — kept for literal parity.
const navigationCls = 'navigation flex self-end justify-end col-start-12 col-span-1 row-start-3 mt-[1.5rem] text-[2rem] font-light tracking-[.08em] leading-[125%] uppercase z-[15] max-lg:block max-lg:self-start max-lg:justify-self-center max-lg:col-start-1 max-lg:col-span-2 max-lg:row-start-1 max-lg:row-span-2 max-lg:mt-[810%] max-lg:text-[1.3rem] max-lg:tracking-[.05em] max-lg:leading-[131%] max-lg:z-[5]';

// mask_teaserslider .navigation>div:not(.spacer):hover{opacity:.4} (also
// separately restated inside the mobile block as .next:hover,.prev:hover —
// same effect) — single-element hover, direct hover: variant, no group
// needed. + .navigation .next,.prev{cursor:pointer;transition:all .5s}
// (unconditional) + mobile ADDS width:fit-content (NOT present at desktop
// here, unlike RoomSlider's equivalent rule, which is unconditional there —
// this component shows PREV/NEXT as text at desktop with the svg hidden, so
// sizing/shape only matters once the svg becomes visible at mobile) + a
// mobile-only svg{height:1.7rem;width:4.5rem}, sized via [&_svg] since
// ArrowSliderIcon's own className would be replaced, not merged, same as
// RoomSlider/MenuButton + .navigation svg{display:none} (mobile: display:
// inline) + .navigation .swiper-button-disabled{opacity:.5} — Swiper
// toggles this class directly on the prevEl/nextEl element itself (this
// div), so it's targeted with a self-referential compound arbitrary variant
// ([&.foo]), not a descendant one.
const navArrowCls = 'cursor-pointer transition-all duration-500 hover:opacity-40 [&_svg]:hidden max-lg:[&_svg]:inline max-lg:w-fit max-lg:[&_svg]:h-[1.7rem] max-lg:[&_svg]:w-[4.5rem] [&.swiper-button-disabled]:opacity-50';

// mask_teaserslider .navigation .prev{margin-bottom:1rem} (mobile only) +
// .prev{transform:rotate(180deg)} — mobile-only here (unlike RoomSlider's
// unconditional equivalent) because the arrow svg is display:none on
// desktop for this component — PREV/NEXT text is shown instead there, so no
// rotate is needed until the svg becomes visible at mobile.
const navPrevCls = `prev swiper-button-lock ${navArrowCls} max-lg:mb-[1rem] max-lg:rotate-180`;
const navNextCls = `next swiper-button-lock ${navArrowCls}`;

// mask_teaserslider .navigation span{pointer-events:none} + mobile{display:
// none, shared with .spacer}
const navSpanCls = 'pointer-events-none max-lg:hidden';

// mask_teaserslider .navigation .spacer{margin:0 .8rem} + mobile{display:
// none, shared with span above}
const navSpacerCls = 'spacer mx-[.8rem] max-lg:hidden';

// "icons-left" nav variant: same stacked-arrow-icon treatment as
// RoomSlider's navigation (no PREV/NEXT text, icon visible at every
// breakpoint), just repositioned to the left column instead of
// TeaserSlider's own default right-aligned text nav. Opt-in via the
// `navVariant` prop rather than changing the shared default, so every other
// page still using TeaserSlider keeps its original nav untouched.
const iconsLeftNavigationCls = 'navigation self-end col-start-1 col-span-2 row-start-3 z-[15] max-lg:self-start max-lg:col-start-1 max-lg:col-span-2 max-lg:row-start-1 max-lg:row-span-2 max-lg:justify-self-center max-lg:mt-[810%] max-lg:z-[5]';
const iconsLeftArrowCls = 'cursor-pointer transition-all duration-500 w-fit hover:opacity-40 [&_svg]:h-[2.5rem] [&_svg]:w-[7rem] max-lg:[&_svg]:h-[1.7rem] max-lg:[&_svg]:w-[4.5rem] [&.swiper-button-disabled]:opacity-50';
const iconsLeftNextCls = `next swiper-button-lock ${iconsLeftArrowCls}`;
const iconsLeftPrevCls = `prev swiper-button-lock ${iconsLeftArrowCls} rotate-180`;

// Mirrors Teaserslider.vue: four Swipers, the text slider drives the other three.
export function TeaserSlider({ section, navVariant = 'default' }: { section: TeaserSliderSection; navVariant?: 'default' | 'icons-left' }) {
  const slides = section.content.teaserslides;
  const [left, setLeft] = useState<SwiperType | null>(null);
  const [right, setRight] = useState<SwiperType | null>(null);
  const [info, setInfo] = useState<SwiperType | null>(null);
  const { prevRef, nextRef, onSwiper: onNavSwiper } = useSwiperExternalNav();
  const multi = slides.length > 1;
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_teaserslider']
    .filter(Boolean).join(' ');

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className="grid-container">
        <div className={teaserWrapperCls}>
          <Swiper className={imageLeftCls} loop allowTouchMove={false} onSwiper={setLeft}>
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
          <Swiper className={imageRightCls} loop allowTouchMove={false} onSwiper={setRight}>
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
          <Swiper className={infotextSwiperCls} loop allowTouchMove={false} onSwiper={setInfo}>
            {slides.map((s) => (
              <SwiperSlide key={s.uid}>
                <p className={infotextSharedCls} dangerouslySetInnerHTML={{ __html: s.infotext }} />
              </SwiperSlide>
            ))}
          </Swiper>
          {left && right && info ? (
            <Swiper
              className={teaserContentSwiperCls}
              modules={[Navigation, Controller, EffectFade]}
              effect="fade"
              speed={1300} // Content fade transition: 1300ms, from js_kvOOAud5.js
              loop
              // prevEl/nextEl are assigned in onBeforeInit (an init-time callback, not render)
              // rather than read here, since reading a ref's .current during render is unsafe.
              // Both keys must be present (even as null) here: swiper/react's needsNavigation()
              // check only skips rendering its own default .swiper-button-prev/-next elements
              // when navigation.prevEl/nextEl are already defined at mount. `navigation={true}`
              // left them undefined, so Swiper injected its own default (blue chevron) buttons
              // alongside the custom .navigation arrows below. Do not simplify this back to `true`.
              navigation={{ prevEl: null, nextEl: null }}
              controller={{ control: [right, left, info] }}
              onSwiper={onNavSwiper}
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
                  <div className={teaserContentInnerCls}>
                    {s.title ? <h2 className={teaserTitleCls} dangerouslySetInnerHTML={{ __html: s.title }} /> : null}
                    {s.link ? (
                      <Button href={s.link.href} target={s.link.target ?? undefined}>
                        {s.linktext}
                      </Button>
                    ) : s.linktext ? (
                      // No link set -- e.g. "Coming Soon" -- so render the
                      // same button styling as a plain, unclickable label
                      // instead of Button's <AppLink>.
                      <span className="ht-button opacity-50 cursor-not-allowed" aria-disabled="true">
                        {s.linktext}
                      </span>
                    ) : null}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}
          {multi && navVariant === 'icons-left' ? (
            <div className={iconsLeftNavigationCls}>
              <div className={iconsLeftNextCls} ref={nextRef}><ArrowSliderIcon /></div>
              <div className={iconsLeftPrevCls} ref={prevRef}><ArrowSliderIcon /></div>
            </div>
          ) : null}
          {multi && navVariant === 'default' ? (
            <div className={navigationCls}>
              <div className={navPrevCls} ref={prevRef}>
                <ArrowSliderIcon />
                <span className={navSpanCls}>PREV</span>
              </div>
              <div className={navSpacerCls}>/</div>
              <div className={navNextCls} ref={nextRef}>
                <ArrowSliderIcon />
                <span className={navSpanCls}>NEXT</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
