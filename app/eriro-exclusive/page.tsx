import type { Metadata } from 'next';
import { eriroExclusive } from '@/content/en/eriro-exclusive';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { ImgText } from '@/components/sections/ImgText';
import { List } from '@/components/sections/List';
import { GallerySlider } from '@/components/sections/GallerySlider';

export const metadata: Metadata = metadataFor(eriroExclusive);

export default function EriroExclusivePage() {
  const [hero, imgtext, list, galleryslider] = eriroExclusive.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (imgtext.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (list.type !== 'mask_list') throw new Error('expected list');
  if (galleryslider.type !== 'mask_galleryslider') throw new Error('expected galleryslider');
  return (
    <main>
      <BodyClass pageId={eriroExclusive.id} layout="layout-0" />
      <Hero section={hero} />
      <ImgText section={imgtext} />
      <List section={list} />
      <GallerySlider section={galleryslider} />
    </main>
  );
}
