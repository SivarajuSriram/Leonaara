'use client';
import type { ReactNode } from 'react';
import { site } from '@/content/site';
import { AppLink } from '@/components/layout/AppLink';

// Gates a floor-plan image: the image is blurred so its detail can't be read, and a
// "Download Floor Plan" button sits in the middle of it. Mobile/tablet (<1024px) and
// touch devices (no hover) always show the button; desktop shows it only while the
// image is hovered. The button links to the Contact page for now -- there is no
// download/lead-capture backend yet.
//
// The button lives in an overlay wrapper instead of carrying absolute positioning
// itself: a.ht-button (globals.css, unlayered) sets position:relative, which would beat
// an `absolute` utility class on the anchor.
export function GatedPlan({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`group/plan relative ${className}`}>
      <div className="h-full [&_img]:scale-110 [&_img]:blur-[1.2rem]">{children}</div>
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/plan:opacity-100 max-lg:opacity-100 [@media(hover:none)]:opacity-100">
        <AppLink href={site.pageLinks.contact} className="ht-button pointer-events-auto bg-canvas text-ink no-underline whitespace-nowrap">
          Download Floor Plan
        </AppLink>
      </div>
    </div>
  );
}
