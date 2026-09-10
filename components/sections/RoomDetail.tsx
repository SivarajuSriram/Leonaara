'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard, Navigation } from 'swiper/modules';
import type { RoomDetailSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { RichText } from '@/components/ui/RichText';
import { SplitWords } from '@/components/ui/SplitWords';
import { ArrowSliderIcon } from '@/components/ui/icons';
import { useSwiperExternalNav } from '@/components/ui/useSwiperExternalNav';

// roomdetail.css: .room-image-left{grid-column-end:span 6;grid-column-start:2}
// + mobile{grid-column-end:span 9;grid-column-start:2}
const roomImageLeftCls = 'room-image-left w-full col-start-2 col-span-6 max-lg:col-start-2 max-lg:col-span-9';
// .navigation{grid-column-end:span 2;grid-column-start:9;justify-self:flex-start;
// margin-top:12rem;z-index:5} + mobile{grid-column-end:span 3;grid-column-start:11;margin-top:4rem}
const navigationCls = 'navigation self-start justify-self-start col-start-9 col-span-2 mt-[12rem] z-[5] max-lg:col-start-11 max-lg:col-span-3 max-lg:mt-[4rem]';
// .navigation .next,.prev{cursor:pointer;transition:all .5s;width:fit-content}
// + svg{height:2.5rem;width:7rem} + :hover{opacity:.4} + .prev{transform:rotate(180deg)}
const navArrowCls = 'cursor-pointer transition-all duration-500 w-fit hover:opacity-40 [&_svg]:h-[2.5rem] [&_svg]:w-[7rem]';
const navNextCls = `next ${navArrowCls}`;
const navPrevCls = `prev ${navArrowCls} rotate-180`;
// .room-image-right{grid-column-end:span 2;grid-column-start:12;margin-top:12rem}
// + mobile{grid-column-end:span 5;grid-column-start:9;margin-top:4.5rem}
const roomImageRightCls = 'room-image-right col-start-12 col-span-2 mt-[12rem] max-lg:col-start-9 max-lg:col-span-5 max-lg:mt-[4.5rem]';
// .room-content{grid-column-end:span 4;grid-column-start:9;margin-top:-6rem}
// + mobile{grid-column-end:span 12;grid-column-start:2;margin-top:0}
const roomContentCls = 'room-content col-start-9 col-span-4 -mt-[6rem] max-lg:col-start-2 max-lg:col-span-12 max-lg:mt-0';
// h1.h2 -- no component-specific size override exists in roomdetail.css, so
// this genuinely uses the shared global `.h2,h2` typography rule (10rem
// desktop / 4.2rem mobile, app/globals.css), unlike RoomSlider's own h2
// which DOES have a component override (6.7rem) -- confirmed by absence.
// .room-icons{display:flex;margin-left:0;margin-top:6rem} + picture{margin-right:4.5rem}
// + picture:last-child{margin-right:0} + img{height:9rem;width:9rem} + mobile{
// margin-bottom:.5rem;margin-left:5.8rem;margin-top:3rem} + mobile picture{margin-right:1.5rem}
// + mobile img{height:6rem;width:6rem}
const roomIconsCls = 'room-icons flex ml-0 mt-[6rem] max-lg:mb-[.5rem] max-lg:ml-[5.8rem] max-lg:mt-[3rem]';
const roomIconPictureCls = (isLast: boolean) => `${isLast ? '' : 'mr-[4.5rem] max-lg:mr-[1.5rem]'} [&_img]:h-[9rem] [&_img]:w-[9rem] max-lg:[&_img]:h-[6rem] max-lg:[&_img]:w-[6rem]`;
// .room-info{flex-wrap:wrap;font-size:2rem;font-weight:300;grid-column-end:span 5;
// grid-column-start:3;letter-spacing:.08em;line-height:125%;margin-top:6rem;
// text-align:left;text-transform:uppercase} + mobile{font-size:1.3rem;letter-spacing:
// .05em;line-height:131%;justify-content:flex-start;margin-top:2rem;text-align:left}
const roomInfoCls = 'room-info flex flex-wrap text-left col-start-3 col-span-5 font-light text-[2rem] tracking-[.08em] leading-[125%] uppercase mt-[6rem] max-lg:justify-start max-lg:text-[1.3rem] max-lg:tracking-[.05em] max-lg:leading-[131%] max-lg:mt-[2rem]';
// .room-info .room-info-spacer{background-color:#211d1d;display:inline-block;
// height:2px;margin:0 1rem;width:3rem} (later declarations in the source
// restate height:1px;margin:0 .5rem -- source-order wins, so those are the
// values that actually apply, not the earlier 2px/1rem ones)
const roomInfoSpacerCls = 'inline-block bg-ink h-[1px] w-[3rem] mx-[.5rem]';
// .room-description{margin-left:9rem;margin-top:3rem} + mobile{margin-left:5.8rem;margin-top:1.5rem}
const roomDescriptionCls = 'room-description ml-[9rem] mt-[3rem] max-lg:ml-[5.8rem] max-lg:mt-[1.5rem]';

export function RoomDetail({ section }: { section: RoomDetailSection }) {
  const { room, icons } = section.content;
  const { prevRef, nextRef, onSwiper } = useSwiperExternalNav();
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_roomdetail', 'grid-container']
    .filter(Boolean).join(' ');

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <Swiper
        className={roomImageLeftCls}
        modules={[Navigation, Keyboard, A11y]}
        spaceBetween={0}
        loop
        speed={650}
        slidesPerView={1}
        keyboard={{ enabled: true }}
        breakpoints={{ 1024: { centeredSlides: false } }}
        a11y
        grabCursor
        navigation={{ prevEl: null, nextEl: null }}
        onSwiper={onSwiper}
        onBeforeInit={(s) => {
          const nav = s.params.navigation;
          if (nav && typeof nav === 'object') { nav.prevEl = prevRef.current; nav.nextEl = nextRef.current; }
        }}
      >
        {room.previewimage.map((img, i) => (
          <SwiperSlide key={i}>
            {/* Left gallery: 866x856 desktop / 360x520 mobile (spec §9.16) */}
            <Picture image={img} widthD={866} heightD={856} widthM={360} heightM={520} />
          </SwiperSlide>
        ))}
      </Swiper>
      {room.previewimage.length > 1 ? (
        <div className={navigationCls}>
          <div className={navNextCls} ref={nextRef}><ArrowSliderIcon /></div>
          <div className={navPrevCls} ref={prevRef}><ArrowSliderIcon /></div>
        </div>
      ) : null}
      {room.images[0] ? (
        <div className={roomImageRightCls}>
          {/* mobile size: 360x520 (ratio 0.6923077, matches live measurement
              to 7 decimal places) -- confirmed via the original's literal
              widthM/heightM props, not RoomSlider's own (different)
              .room-image-right convention. */}
          <Picture image={room.images[0]} widthD={273} heightD={317} widthM={360} heightM={520} />
        </div>
      ) : null}
      {/* .room-info is a direct grid child of .mask_roomdetail (sibling of
          .room-content), matching the original's grid-child order:
          room-image-left, navigation, room-image-right, room-info,
          room-content. .room-icons nests inside .room-info (as its last
          child) rather than inside .room-content -- this also restores
          .room-info-spacer:nth-last-child(2) to a working selector: with
          room-icons last, the 2nd-from-last child is room-info-price (not a
          spacer), so the CSS rule simply doesn't match and both spacers
          render normally, same as live. */}
      <div className={roomInfoCls}>
        <span className="room-info-size">{room.size}</span>
        <span className={roomInfoSpacerCls} />
        <span className="room-info-people">{room.people}</span>
        <span className={roomInfoSpacerCls} />
        <span className="room-info-price w-full">{room.minprice}</span>
        <div className={roomIconsCls}>
          {icons.map((icon, i) => (
            <Picture key={i} image={icon} widthD={120} heightD={120} widthM={120} heightM={120} className={roomIconPictureCls(i === icons.length - 1)} />
          ))}
        </div>
      </div>
      <div className={roomContentCls}>
        <SplitWords as="h1" className="h2" html={room.title} />
        <RichText className={roomDescriptionCls} html={room.description} />
      </div>
    </div>
  );
}
