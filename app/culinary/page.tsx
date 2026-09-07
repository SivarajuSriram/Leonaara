// Real section order per Step 1's extraction script ORDER printout for culinary
// (verified against docs/reference/pages/en__culinary.json):
// hero, imgtext, img, imgtext, img, teaserslider
import type { Metadata } from 'next';
import { culinary } from '@/content/en/culinary';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { ImgText } from '@/components/sections/ImgText';
import { Img } from '@/components/sections/Img';
import { TeaserSlider } from '@/components/sections/TeaserSlider';

export const metadata: Metadata = metadataFor(culinary);

export default function CulinaryPage() {
  const [hero, imgtext1, img1, imgtext2, img2, teaserslider] = culinary.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (imgtext1.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (img1.type !== 'mask_img') throw new Error('expected img');
  if (imgtext2.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (img2.type !== 'mask_img') throw new Error('expected img');
  if (teaserslider.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
  return (
    <main>
      <BodyClass pageId={culinary.id} layout="layout-0" />
      <Hero section={hero} />
      <ImgText section={imgtext1} />
      <Img section={img1} />
      <ImgText section={imgtext2} />
      <Img section={img2} />
      <TeaserSlider section={teaserslider} />
    </main>
  );
}
