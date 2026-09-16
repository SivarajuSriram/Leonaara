// Real section order per Step 1's extraction script ORDER printout for spa
// (matches the plan's §9 guess exactly, verified against docs/reference/pages/en__spa.json) —
// reused here as the About page's layout, per the user's request. The 3
// FAQ-style accordion sections (Pools, Sauna, Relaxation and sound room),
// the closing teaserslider, and the "Nature on the skin" break section were
// all removed at the user's request, so this page's section list is Spa's
// original minus those 5.
// hero, imgtext, video, imgtext, imgtext, img, imgtext, video
import type { Metadata } from 'next';
import { about } from '@/content/en/about';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { ImgText } from '@/components/sections/ImgText';
import { Video } from '@/components/sections/Video';
import { Img } from '@/components/sections/Img';

export const metadata: Metadata = metadataFor(about);

export default function AboutPage() {
  const [
    hero,
    imgtext1,
    video1,
    imgtext2,
    imgtext3,
    img,
    imgtext4,
    video2,
  ] = about.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (imgtext1.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (video1.type !== 'mask_video') throw new Error('expected video');
  if (imgtext2.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (imgtext3.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (img.type !== 'mask_img') throw new Error('expected img');
  if (imgtext4.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (video2.type !== 'mask_video') throw new Error('expected video');
  return (
    <main>
      <BodyClass pageId={about.id} layout="layout-0" />
      <Hero section={hero} />
      <ImgText section={imgtext1} leafSide="right" />
      <Video section={video1} />
      <ImgText section={imgtext2} leafSide="left" />
      <ImgText section={imgtext3} leafSide="right" />
      <Img section={img} />
      <ImgText section={imgtext4} leafSide="left" />
      <Video section={video2} />
    </main>
  );
}
