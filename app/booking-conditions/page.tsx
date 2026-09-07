import type { Metadata } from 'next';
import { bookingConditions } from '@/content/en/booking-conditions';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { Accordions } from '@/components/sections/Accordions';
import { GallerySlider } from '@/components/sections/GallerySlider';

export const metadata: Metadata = metadataFor(bookingConditions);

export default function BookingConditionsPage() {
  const [hero, accordions, galleryslider] = bookingConditions.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (accordions.type !== 'mask_accordions') throw new Error('expected accordions');
  if (galleryslider.type !== 'mask_galleryslider') throw new Error('expected galleryslider');
  return (
    <main>
      <BodyClass pageId={bookingConditions.id} layout="layout-0" />
      <Hero section={hero} />
      <Accordions section={accordions} />
      <GallerySlider section={galleryslider} />
    </main>
  );
}
