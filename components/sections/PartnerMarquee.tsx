'use client';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, A11y, Keyboard, FreeMode } from 'swiper/modules';
import type { PartnerMarqueeSection, Partner } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { RichText } from '@/components/ui/RichText';
import { useGSAP } from '@/lib/gsap';
import { horizontalLoop, type LoopTimeline } from '@/lib/horizontalLoop';
import { TransitionLink } from '@/components/layout/TransitionLink';
import './PartnerMarquee.css';

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
  return p.link ? <TransitionLink href={p.link.href} target={p.link.target ?? undefined}>{pic}</TransitionLink> : pic;
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

  return (
    <Mask type="partnermarquee" uid={section.id} appearance={section.appearance}>
      <div className="grid-container">
        <div className="content">
          {c.title ? <SplitWords as="h2" className="title" html={c.title} /> : null}
          {c.text ? <RichText className="text" html={c.text} /> : null}
        </div>
        <div className="swiper-container">
          <Swiper modules={[Autoplay, A11y, Keyboard, FreeMode]} spaceBetween={0} loop speed={650} grabCursor={false} slidesPerView={4} slidesPerGroup={1} a11y={{ enabled: true }} autoplay>
            {c.partners.map((p) => <SwiperSlide key={p.uid}><Logo p={p} /></SwiperSlide>)}
          </Swiper>
        </div>
        <div className="marquee-wrapper" ref={wrapRef} onMouseOver={() => loopRef.current?.pause()} onMouseLeave={() => loopRef.current?.resume()}>
          <div className="marquee-inner">
            {items.map((p, i) => <div className="marquee-item" key={`${p.uid}-${i}`}><Logo p={p} /></div>)}
          </div>
        </div>
      </div>
    </Mask>
  );
}
