'use client';
import { useState } from 'react';
import type { Appearance, ImageRef } from '@/lib/content';
import { ImgSlider } from '@/components/sections/ImgSlider';

export type PlanCategory = { label: string; images: ImageRef[] };

// Bordered-box tab, matching the site's existing CTA-button convention
// (a.linkdetail in globals.css -- "EXPLORE PROJECTS", "MEET THE FOUNDERS":
// 2px border, uppercase, letter-spaced) rather than inventing a new tab
// style -- the active tab fills solid ink/canvas the way a pressed toggle
// reads, inactive ones keep the plain bordered-box look and darken their
// border on hover.
function tabCls(active: boolean) {
  return [
    'cursor-pointer text-[1.4rem] tracking-[.08em] uppercase whitespace-nowrap',
    'border-2 px-[2rem] py-[1rem] transition-colors duration-300',
    active ? 'border-ink bg-ink text-canvas' : 'border-beige text-ink/70 hover:border-ink hover:text-ink',
  ].join(' ');
}

// Replaces the single decorative "boum.jpg" image that used to sit here
// (a leftover eriro tree-bark photo) with the actual master plan and floor
// plans fetched from the live kadamba.leonaara.com reference site, split into
// tabs by category. Each tab reuses ImgSlider -- the same swipeable carousel
// already used higher up on this page -- rather than a bespoke gallery, per
// the user's explicit "same slider that is used above" request.
export function PlansTabs({ id, appearance, title, categories }: { id: number; appearance: Appearance; title: string; categories: PlanCategory[] }) {
  const [active, setActive] = useState(0);
  const headerCls = [appearance.layout, `space-before-${appearance.spaceBefore}`, 'mask', 'grid-container'].filter(Boolean).join(' ');

  return (
    <>
      <div className={headerCls} {...{ uid: `c${id}` }}>
        <h2 className="h2 col-start-2 col-span-12 mb-[3rem] text-center max-lg:col-start-1 max-lg:col-span-14">{title}</h2>
        <div className="col-start-2 col-span-12 flex justify-center gap-[1.5rem] max-lg:col-start-1 max-lg:col-span-14 max-lg:overflow-x-auto">
          {categories.map((c, i) => (
            <button key={c.label} type="button" className={tabCls(i === active)} onClick={() => setActive(i)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>
      {/* alwaysCentered: per the user's explicit request, every plan here
          (whether it's the master plan's single image or a floor-plan
          category's several) sits centered in the viewport -- not just the
          single-image case, which would center anyway as the only slide.
          key={active}: without it, React treats this as the same ImgSlider
          instance across tab switches (same component type, same position
          in the tree) and never remounts the underlying Swiper -- so
          switching tabs left Swiper sitting on whatever slide index it was
          last scrolled to instead of resetting to the first slide, per the
          user's "should be starting with the first one" report. Keying on
          the active index forces a full remount (a fresh Swiper instance)
          on every switch. */}
      <ImgSlider
        key={active}
        section={{
          id: id * 100 + active,
          type: 'mask_imgslider',
          appearance: { ...appearance, spaceBefore: 'small' },
          content: { images: categories[active].images },
        }}
        alwaysCentered
        loop={false}
      />
    </>
  );
}
