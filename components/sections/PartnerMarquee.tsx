'use client';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, A11y, Keyboard, FreeMode } from 'swiper/modules';
import type { PartnerMarqueeSection, Partner } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { RichText } from '@/components/ui/RichText';
import { useGSAP } from '@/lib/gsap';
import { horizontalLoop, type LoopTimeline } from '@/lib/horizontalLoop';
import { AppLink } from '@/components/layout/AppLink';

// mask_partnermarquee .grid-container{background-color:#e4e0db (-> bg-canvas
// token);padding-bottom:21rem;padding-top:21rem} + mobile{padding-bottom:9rem;
// padding-top:9rem}
const gridCls = 'grid-container bg-canvas py-[21rem] max-lg:py-[9rem]';

// mask_partnermarquee .content{grid-column-end:span 7;grid-column-start:6} +
// mobile{grid-column-end:span 11;grid-column-start:2}
const contentCls = 'content col-start-6 col-span-7 max-lg:col-start-2 max-lg:col-span-11';

// mask_partnermarquee .title{margin-bottom:3rem} + mobile{margin-bottom:1.5rem}
const titleCls = 'title mb-[3rem] max-lg:mb-[1.5rem]';

// mask_partnermarquee .text{margin-left:9rem} + mobile{margin-left:5.8rem}
const textCls = 'text ml-[9rem] max-lg:ml-[5.8rem]';

// mask_partnermarquee .swiper-container{display:none;grid-column-end:span 14;
// grid-column-start:1;position:relative} — a hidden Swiper kept only for DOM
// parity (spec §9.9): still rendered, still not visible, matching the
// original's intent precisely.
const swiperContainerCls = 'swiper-container col-start-1 col-span-14 relative hidden';

// mask_partnermarquee .swiper-wrapper{margin-right:calc(var(--grid-gap)*-1)} +
// mobile{margin-left:calc((var(--grid-gap))/2.22);margin-right:0}. Swiper's
// React binding renders this wrapper div itself — there's no JSX element of
// ours to put a className on directly — but it reads a `wrapperClass` prop and
// merges it onto that div's own "swiper-wrapper" class (see
// node_modules/swiper/swiper-react.mjs: `wrapperClass(swiperParams.wrapperClass)`),
// so it works despite one stale core-options JSDoc note claiming the prop
// isn't supported in React.
const swiperWrapperCls = 'mr-[calc(var(--grid-gap)*-1)] max-lg:ml-[calc((var(--grid-gap))/2.22)] max-lg:mr-0';

// mask_partnermarquee .swiper-slide{padding-right:calc(var(--grid-gap))} +
// :first-child{margin-left:0;padding-right:calc(var(--grid-gap)) (same as the
// base rule, no new information)} + :last-child{padding-right:calc(var(--grid-gap))
// (again identical to the base rule)}. SwiperSlide's own className prop merges
// onto its internal "swiper-slide[-active...]" classes, so plain Tailwind
// first:/last: pseudo-class variants apply exactly like :first-child/:last-child
// would in hand-written CSS.
const swiperSlideCls = 'pr-[calc(var(--grid-gap))] first:ml-0';

// mask_partnermarquee .hide{display:none} is dead: no element in this
// component (or the Logo/AppLink/Picture children it renders) ever carries a
// "hide" class — confirmed via grep. Likely vestigial from the original
// template's Swiper navigation/pagination arrows, which this build never
// renders (only the Autoplay/A11y/Keyboard/FreeMode modules are wired up, no
// Navigation module).

// mask_partnermarquee .marquee-wrapper{display:flex;grid-column-end:span 14;
// grid-column-start:1;justify-content:space-between;margin-top:12rem;overflow:
// hidden;width:100vw} + mobile{margin-top:3rem}
const marqueeWrapperCls = 'marquee-wrapper flex col-start-1 col-span-14 justify-between mt-[12rem] overflow-hidden w-screen max-lg:mt-[3rem]';

// mask_partnermarquee .marquee-inner{display:flex;justify-content:space-evenly}
// (restated unchanged inside the mobile block)
const marqueeInnerCls = 'marquee-inner flex justify-evenly';

// mask_partnermarquee .marquee-item{margin-right:calc(var(--grid-gap)*5);
// height:35rem;width:35rem;mix-blend-mode:multiply} + mobile{margin-right:
// calc(var(--grid-gap)*3);height:10rem;width:20rem;mix-blend-mode:multiply
// (unchanged, not restated below)}.
//
// NOTE: the live PartnerMarquee.css (as of commit 6eca518, already merged
// before this task) gives .marquee-item a DEFINITE height/width here, not the
// original site's max-height/max-width — a deliberate fix for a circular
// sizing dependency that used to let wide-aspect logos overflow their box.
// Preserved exactly below (h-[35rem] w-[35rem], not max-h-/max-w-).
//
// mask_partnermarquee .marquee-item picture{align-items:center;display:flex;
// height:100%;justify-content:center} and .marquee-item img{height:100%;
// width:100%;object-fit:contain} — the other half of that same fix. Picture's
// own hardcoded <picture>/<img> classes ("relative block" / "block h-auto
// w-full [aspect-ratio:...]", see components/ui/Picture.tsx) can't be reached
// with a className prop for the <img> itself, and Logo (below) is shared with
// the hidden swiper-container above, so these are applied as descendant
// arbitrary-variant selectors scoped to .marquee-item only — matching the
// original CSS's exact selector scope — and they win on specificity
// (`.marquee-item img` beats a lone `.h-auto` class).
const marqueeItemCls = [
  'marquee-item mr-[calc(var(--grid-gap)*5)] h-[35rem] w-[35rem] mix-blend-multiply',
  'max-lg:mr-[calc(var(--grid-gap)*3)] max-lg:h-[10rem] max-lg:w-[20rem]',
  '[&_picture]:flex [&_picture]:h-full [&_picture]:items-center [&_picture]:justify-center',
  '[&_img]:h-full [&_img]:w-full [&_img]:object-contain',
].join(' ');

// mask_partnermarquee .marquee-teaser{overflow:hidden;position:relative}
// (restated unchanged inside the mobile block) is dead, same as .hide: no
// element in this component carries a "marquee-teaser" class — confirmed via
// grep.

// Port of the original ordering: 5 buckets filled round-robin, output ceil(n/5)*5*3 items cycling per bucket.
export function interleave<T>(items: T[]): T[] {
  if (!items.length) return [];
  const cols = 5;
  const total = Math.ceil(items.length / cols) * cols * 3;
  const buckets = new Map<number, T[]>();
  items.forEach((item, i) => { const k = i % cols; if (!buckets.has(k)) buckets.set(k, []); buckets.get(k)!.push(item); });
  const out: T[] = [];
  const counters = new Map<number, number>();
  for (let t = 0; t < total; t++) {
    const k = t % cols; const b = buckets.get(k) || [];
    if (b.length) { const c = counters.get(k) || 0; out.push(b[c % b.length]); counters.set(k, c + 1); }
  }
  return out;
}

function Logo({ p }: { p: Partner }) {
  // Marquee logo image: 180 desktop / 120 mobile height, from js_DRc2neIx.js
  const pic = <Picture image={p.img[0]} heightD={180} heightM={120} lazy={false} />;
  return p.link ? <AppLink href={p.link.href} target={p.link.target ?? undefined}>{pic}</AppLink> : pic;
}

export function PartnerMarquee({ section }: { section: PartnerMarqueeSection }) {
  const c = section.content;
  const wrapRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<LoopTimeline | null>(null);
  const items = interleave(c.partners);

  useGSAP(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    loopRef.current = horizontalLoop(wrap.querySelectorAll('.marquee-item'), {
      // Marquee scroll speed: 1 desktop / 0.8 mobile, from js_DRc2neIx.js
      speed: window.innerWidth < 1024 ? 0.8 : 1, snap: false, draggable: true, paused: false, repeat: -1, center: true,
    });
    return () => { loopRef.current?.kill(); loopRef.current = null; };
  }, { scope: wrapRef });

  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_partnermarquee']
    .filter(Boolean).join(' ');

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className={gridCls}>
        <div className={contentCls}>
          {c.title ? <SplitWords as="h2" className={titleCls} html={c.title} /> : null}
          {c.text ? <RichText className={textCls} html={c.text} /> : null}
        </div>
        <div className={swiperContainerCls}>
          <Swiper modules={[Autoplay, A11y, Keyboard, FreeMode]} spaceBetween={0} loop speed={650} grabCursor={false} slidesPerView={4} slidesPerGroup={1} a11y={{ enabled: true }} autoplay wrapperClass={swiperWrapperCls}>
            {c.partners.map((p) => <SwiperSlide key={p.uid} className={swiperSlideCls}><Logo p={p} /></SwiperSlide>)}
          </Swiper>
        </div>
        <div className={marqueeWrapperCls} ref={wrapRef} onMouseOver={() => loopRef.current?.pause()} onMouseLeave={() => loopRef.current?.resume()}>
          <div className={marqueeInnerCls}>
            {items.map((p, i) => <div className={marqueeItemCls} key={`${p.uid}-${i}`}><Logo p={p} /></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
