import type { Metadata } from 'next';
import { press } from '@/content/en/press';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { Accordions } from '@/components/sections/Accordions';
import { GallerySlider } from '@/components/sections/GallerySlider';

export const metadata: Metadata = metadataFor(press);

export default function PressPage() {
  const [hero, accordions, galleryslider] = press.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (accordions.type !== 'mask_accordions') throw new Error('expected accordions');
  if (galleryslider.type !== 'mask_galleryslider') throw new Error('expected galleryslider');
  return (
    <main>
      <BodyClass pageId={press.id} layout="layout-0" />
      <Hero section={hero} />
      <Accordions section={accordions} />
      <GallerySlider section={galleryslider} />
    </main>
  );
}
