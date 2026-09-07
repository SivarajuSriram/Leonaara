// Real section order per Step 1's extraction script ORDER printout for gallery
// (verified against docs/reference/pages/en__gallery.json): hero, gallery (34 images)
import type { Metadata } from 'next';
import { gallery } from '@/content/en/gallery';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { Gallery } from '@/components/sections/Gallery';

export const metadata: Metadata = metadataFor(gallery);

export default function GalleryPage() {
  const [hero, gal] = gallery.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (gal.type !== 'mask_gallery') throw new Error('expected gallery');
  return (
    <main>
      <BodyClass pageId={gallery.id} layout="layout-0" />
      <Hero section={hero} />
      <Gallery section={gal} />
    </main>
  );
}
