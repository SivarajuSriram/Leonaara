'use client';
import { useState } from 'react';
import type { Appearance, ImageRef } from '@/lib/content';
import { ImgSlider } from '@/components/sections/ImgSlider';
import { Picture } from '@/components/ui/Picture';
import { GatedPlan } from '@/components/ui/GatedPlan';
import { Lightbox } from '@/components/ui/Lightbox';

// gated: the category's plans are blurred behind a "Download Floor Plan" button (GatedPlan.tsx).
export type PlanCategory = { label: string; images: ImageRef[]; gated?: boolean };

// Bordered-box tab, matching the site's existing CTA-button convention
// (a.linkdetail in globals.css -- "EXPLORE PROJECTS", "MEET THE FOUNDERS":
// 2px border, uppercase, letter-spaced) rather than inventing a new tab
// style -- the active tab fills solid ink/canvas the way a pressed toggle
// reads, inactive ones keep the plain bordered-box look and darken their
// border on hover.
// "800 Sq.Yds · 4320 Sq.ft" reads on one line on desktop and as two stacked lines in a
// mobile/tablet segment; labels without a " · " (Site Plan) stay a single line.
function TabLabel({ label }: { label: string }) {
  const [first, second] = label.split(' · ');
  if (!second) return <>{label}</>;
  return (
    <>
      <span className="max-lg:block">{first}</span>
      <span className="max-lg:hidden"> · </span>
      <span className="max-lg:block">{second}</span>
    </>
  );
}

function tabCls(active: boolean) {
  return [
    'cursor-pointer text-[1.4rem] tracking-[.08em] uppercase whitespace-nowrap',
    'border-2 px-[2rem] py-[1rem] transition-colors duration-300',
    // Mobile/tablet: the tabs share one row as equal-width segments (label split onto two
    // lines by TabLabel below) instead of stacking one per row.
    'max-lg:flex-1 max-lg:px-[.6rem] max-lg:text-[1.2rem] max-lg:tracking-[.05em] max-lg:leading-[125%] max-lg:text-center',
    active ? 'border-ink bg-ink text-canvas' : 'border-beige text-ink/70 hover:border-ink hover:text-ink',
  ].join(' ');
}

// Replaces the single decorative "boum.jpg" image that used to sit here
// (a leftover tree-bark photo) with the actual master plan and floor
// plans fetched from the live kadamba.leonaara.com reference site, split into
// tabs by category. Each tab reuses ImgSlider -- the same swipeable carousel
// already used higher up on this page -- rather than a bespoke gallery, per
// the user's explicit "same slider that is used above" request.
export function PlansTabs({ id, appearance, title, categories }: { id: number; appearance: Appearance; title: string; categories: PlanCategory[] }) {
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const headerCls = [appearance.layout, `space-before-${appearance.spaceBefore}`, 'mask', 'grid-container'].filter(Boolean).join(' ');

  return (
    <>
      <div className={headerCls} {...{ uid: `c${id}` }}>
        <h2 className="h2 col-start-2 col-span-12 mb-[3rem] text-center max-lg:col-start-1 max-lg:col-span-14">{title}</h2>
        {/* max-lg:justify-start (was justify-center at every width): centering a
            row that overflows its container starts the scroll position with
            content already cut off on BOTH sides, which reads as "the tabs
            aren't there" rather than "scroll to see more" -- per the user's
            explicit "the tabs are not visible" report. Left-aligning at mobile
            means the first tab is always fully visible on load, and the cut-off
            edge of the next one is the natural invitation to scroll right.
            max-lg:pb-[.5rem] makes room for the browser's own scrollbar so it
            doesn't sit flush against the tab row. */}
        {/* Mobile/tablet: tabs wrap onto extra rows and stay centered instead of
            scrolling sideways (max-lg:flex-wrap + justify-center, no overflow-x-auto),
            per the user's "I do not want that horizontal scrollbar" request. */}
        <div className="col-start-2 col-span-12 flex justify-center gap-[1.5rem] max-lg:col-start-1 max-lg:col-span-14 max-lg:gap-[.6rem] max-lg:px-[1.6rem]">
          {categories.map((c, i) => (
            <button key={c.label} type="button" className={tabCls(i === active)} onClick={() => setActive(i)}>
              <TabLabel label={c.label} />
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
      {/* Mobile/tablet (<1024px): no carousel and no arrows -- the selected tab's plans
          stack full-width as a plain list, each one visible as you scroll, per the user's
          request. Gated plans show their blurred image + centered "Download Floor Plan"
          button; the ungated Site Plan opens the full-screen Lightbox on tap. Desktop keeps
          the ImgSlider below unchanged. Two renders of the same images (one hidden per
          breakpoint) rather than a JS media query, so there is no hydration mismatch. */}
      <div className="grid-container space-before-small lg:hidden">
        {categories[active].images.map((img, i) => (
          <div key={`${active}-${i}`} className="col-start-2 col-span-12 mb-[2rem]">
            {categories[active].gated ? (
              <GatedPlan><Picture image={img} lazy={i > 0} /></GatedPlan>
            ) : (
              <button
                type="button"
                aria-label={`View ${img.alt ?? 'plan'} full screen`}
                onClick={() => setLightboxIndex(i)}
                className="block w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left"
              >
                <Picture image={img} lazy={i > 0} />
              </button>
            )}
          </div>
        ))}
      </div>
      <Lightbox images={categories[active].images} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      <div className="max-lg:hidden">
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
        gated={categories[active].gated}
      />
      </div>
    </>
  );
}
