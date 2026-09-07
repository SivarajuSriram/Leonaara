'use client';
import { useRef, useEffect } from 'react';
import type { GallerySection, ImageRef } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { onSmoother } from '@/lib/smoother';
import type { ScrollTrigger } from '@/lib/gsap';

// mask_Gallery .grid-container>div:nth-child(8n+k) -- verbatim from docs/reference/css-clean/gallery.css,
// computed per index instead of relying on a real nth-child selector (spec §18.2: no new CSS escape hatch).
// Desktop classes:
const POS_DESKTOP = [
  'col-start-1 col-span-5 mr-[8rem] mt-[12rem]',
  'col-start-8 col-span-6',
  'col-start-11 col-span-2 ml-[5rem] mr-[5rem] mt-[12rem]',
  'col-start-12 col-span-3 ml-[8rem]',
  'col-start-2 col-span-5 -mt-[26.5rem]',
  'col-start-9 col-span-2 self-end',
  'col-start-10 col-span-4 mt-[15rem]',
  'col-start-1 col-span-4 -mt-[15.5rem]',
];
// Mobile classes (max-lg:):
const POS_MOBILE = [
  'max-lg:col-start-2 max-lg:col-span-8 max-lg:mr-0 max-lg:mt-0',
  'max-lg:col-start-5 max-lg:col-span-9 max-lg:mt-[2rem]',
  'max-lg:col-start-4 max-lg:col-span-4 max-lg:ml-0 max-lg:mr-[1.7rem] max-lg:mt-[6rem]',
  'max-lg:col-start-9 max-lg:col-span-6 max-lg:ml-[1rem] max-lg:mt-[17rem]',
  'max-lg:col-start-2 max-lg:col-span-5 max-lg:-mt-[13.5rem]',
  'max-lg:col-start-2 max-lg:col-span-9 max-lg:self-start max-lg:mt-[2rem]',
  'max-lg:col-start-6 max-lg:col-span-8 max-lg:mt-[6rem]',
  'max-lg:col-start-1 max-lg:col-span-5 max-lg:mb-[6rem] max-lg:-mt-[5.8rem]',
];
// image sizes per position (spec §9.11); parallax speeds per position (spec §9.11)
const SIZES = [
  { w: 570, h: 510 }, { w: 867, h: 960 }, { w: 150, h: 150 }, { w: 273, h: 317 },
  { w: 719, h: 864 }, { w: 273, h: 317 }, { w: 570, h: 510 }, { w: 501, h: 390 },
];
const SPEEDS = [1.3, 1.1, 1.1, 1.3, 1.7, 1.2, 1.2, 1.1];

function itemCls(i: number) {
  return [POS_DESKTOP[i % 8], POS_MOBILE[i % 8]].join(' ');
}

export function Gallery({ section }: { section: GallerySection }) {
  const c = section.content;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let triggers: ScrollTrigger[] = [];
    const clear = () => { triggers.forEach((t) => t.kill()); triggers = []; };
    // Same persistent-subscription contract every onSmoother caller follows (lib/smoother.ts):
    // fires immediately and again on every ScrollSmoother kill/recreate across the 1024px breakpoint.
    const off = onSmoother((s) => {
      clear();
      if (!s || !containerRef.current || window.innerWidth < 1024) return;
      const pictures = containerRef.current.querySelectorAll('picture');
      pictures.forEach((pic, i) => {
        triggers.push(...(s.effects(pic, { speed: SPEEDS[i % SPEEDS.length] }) as ScrollTrigger[]));
      });
    });
    return () => { off(); clear(); };
  }, [c.images.length]);

  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_Gallery']
    .filter(Boolean).join(' ');

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className="grid-container" ref={containerRef}>
        {c.images.map((img: ImageRef, i: number) => (
          <div className={itemCls(i)} key={`${img.src}-${i}`}>
            <Picture image={img} widthD={SIZES[i % 8].w} heightD={SIZES[i % 8].h} />
          </div>
        ))}
      </div>
    </div>
  );
}
