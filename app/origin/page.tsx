// Real section order per Step 1's extraction script ORDER printout for origin
// (matches the plan's §9 guess exactly, verified against docs/reference/pages/en__origin.json):
// hero, imgtext, video, accordions, img, imgtext, teaserslider
import type { Metadata } from 'next';
import { origin } from '@/content/en/origin';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { ImgText } from '@/components/sections/ImgText';
import { Video } from '@/components/sections/Video';
import { Accordions } from '@/components/sections/Accordions';
import { Img } from '@/components/sections/Img';
import { TeaserSlider } from '@/components/sections/TeaserSlider';

export const metadata: Metadata = metadataFor(origin);

export default function OriginPage() {
  const [hero, imgtext1, video, accordions, img, imgtext2, teaserslider] = origin.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (imgtext1.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (video.type !== 'mask_video') throw new Error('expected video');
  if (accordions.type !== 'mask_accordions') throw new Error('expected accordions');
  if (img.type !== 'mask_img') throw new Error('expected img');
  if (imgtext2.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (teaserslider.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
  return (
    <main>
      <BodyClass pageId={origin.id} layout="layout-0" />
      <Hero section={hero} />
      <ImgText section={imgtext1} />
      <Video section={video} />
      <Accordions section={accordions} />
      <Img section={img} />
      <ImgText section={imgtext2} />
      <TeaserSlider section={teaserslider} />
    </main>
  );
}
