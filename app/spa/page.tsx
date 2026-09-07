// Real section order per Step 1's extraction script ORDER printout for spa
// (matches the plan's §9 guess exactly, verified against docs/reference/pages/en__spa.json):
// hero, imgtext, accordions, video, break, imgtext, accordions, imgtext, accordions, img, imgtext, video, teaserslider
import type { Metadata } from 'next';
import { spa } from '@/content/en/spa';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { ImgText } from '@/components/sections/ImgText';
import { Accordions } from '@/components/sections/Accordions';
import { Video } from '@/components/sections/Video';
import { Break } from '@/components/sections/Break';
import { Img } from '@/components/sections/Img';
import { TeaserSlider } from '@/components/sections/TeaserSlider';

export const metadata: Metadata = metadataFor(spa);

export default function SpaPage() {
  const [
    hero,
    imgtext1,
    accordions1,
    video1,
    brk,
    imgtext2,
    accordions2,
    imgtext3,
    accordions3,
    img,
    imgtext4,
    video2,
    teaserslider,
  ] = spa.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (imgtext1.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (accordions1.type !== 'mask_accordions') throw new Error('expected accordions');
  if (video1.type !== 'mask_video') throw new Error('expected video');
  if (brk.type !== 'mask_break') throw new Error('expected break');
  if (imgtext2.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (accordions2.type !== 'mask_accordions') throw new Error('expected accordions');
  if (imgtext3.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (accordions3.type !== 'mask_accordions') throw new Error('expected accordions');
  if (img.type !== 'mask_img') throw new Error('expected img');
  if (imgtext4.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (video2.type !== 'mask_video') throw new Error('expected video');
  if (teaserslider.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
  return (
    <main>
      <BodyClass pageId={spa.id} layout="layout-0" />
      <Hero section={hero} />
      <ImgText section={imgtext1} />
      <Accordions section={accordions1} />
      <Video section={video1} />
      <Break section={brk} />
      <ImgText section={imgtext2} />
      <Accordions section={accordions2} />
      <ImgText section={imgtext3} />
      <Accordions section={accordions3} />
      <Img section={img} />
      <ImgText section={imgtext4} />
      <Video section={video2} />
      <TeaserSlider section={teaserslider} />
    </main>
  );
}
