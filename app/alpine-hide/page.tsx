// Real section order per Step 1's extraction script ORDER printout for alpine-hide
// (matches the plan's §9 guess exactly, verified against docs/reference/pages/en__alpine-hide.json):
// hero, imgtext, quote, img, imgtext, accordions, video, accordions, teaserslider
import type { Metadata } from 'next';
import { alpineHide } from '@/content/en/alpine-hide';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { ImgText } from '@/components/sections/ImgText';
import { Quote } from '@/components/sections/Quote';
import { Img } from '@/components/sections/Img';
import { Accordions } from '@/components/sections/Accordions';
import { Video } from '@/components/sections/Video';
import { TeaserSlider } from '@/components/sections/TeaserSlider';

export const metadata: Metadata = metadataFor(alpineHide);

export default function AlpineHidePage() {
  const [hero, imgtext1, quote, img, imgtext2, accordions1, video, accordions2, teaserslider] = alpineHide.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (imgtext1.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (quote.type !== 'mask_quote') throw new Error('expected quote');
  if (img.type !== 'mask_img') throw new Error('expected img');
  if (imgtext2.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (accordions1.type !== 'mask_accordions') throw new Error('expected accordions');
  if (video.type !== 'mask_video') throw new Error('expected video');
  if (accordions2.type !== 'mask_accordions') throw new Error('expected accordions');
  if (teaserslider.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
  return (
    <main>
      <BodyClass pageId={alpineHide.id} layout="layout-0" />
      <Hero section={hero} />
      <ImgText section={imgtext1} />
      <Quote section={quote} />
      <Img section={img} />
      <ImgText section={imgtext2} />
      <Accordions section={accordions1} />
      <Video section={video} />
      <Accordions section={accordions2} />
      <TeaserSlider section={teaserslider} />
    </main>
  );
}
