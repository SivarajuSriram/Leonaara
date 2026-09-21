// Real section order per Step 1's extraction script ORDER printout for spa
// (matches the plan's §9 guess exactly, verified against docs/reference/pages/en__spa.json) —
// reused here as the About page's layout, per the user's request. The 3
// FAQ-style accordion sections (Pools, Sauna, Relaxation and sound room),
// the closing teaserslider, and the "Nature on the skin" break section were
// all removed at the user's request, so this page's section list is Spa's
// original minus those 5. The first video (a leftover swimming
// clip, id 304 in content/en/about.ts) was removed at the user's later
// explicit request; the trailing one (video2, id 300) has always had an
// empty video array and already renders nothing (see Video.tsx), so it's
// left in place as an inert placeholder rather than restructuring the
// column array over a no-op.
// hero, imgtext, imgtext, imgtext, img, imgtext, video
// The fullbleed courtyard photo (mask_img, formerly rendered between the 3rd
// and 4th founder) was removed per the user's explicit request -- `img` is
// still destructured (and type-checked below) so this array's positions
// stay in sync with about.columns.colPos0, it's just no longer rendered.
import type { Metadata } from 'next';
import { about } from '@/content/en/about';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { ImgText } from '@/components/sections/ImgText';
import { Video } from '@/components/sections/Video';

export const metadata: Metadata = metadataFor(about);

export default function AboutPage() {
  const [
    hero,
    imgtext1,
    imgtext2,
    imgtext3,
    img,
    imgtext4,
    video2,
  ] = about.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (imgtext1.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (imgtext2.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (imgtext3.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (img.type !== 'mask_img') throw new Error('expected img');
  if (imgtext4.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (video2.type !== 'mask_video') throw new Error('expected video');
  return (
    <main>
      <BodyClass pageId={about.id} layout="layout-0" />
      <Hero section={hero} centerText />
      {/* evenSpacing: these 4 founder bios each carry a single alternating
          image (see about.ts) rather than the dual left+right image every
          other ImgText instance on the site uses -- see ImgText.tsx's
          imageLeftEvenCls/imageRightEvenCls comment for why the default
          spacing/row values don't work for a single-image layout. */}
      <ImgText section={imgtext1} evenSpacing />
      <ImgText section={imgtext2} evenSpacing />
      <ImgText section={imgtext3} evenSpacing />
      <ImgText section={imgtext4} evenSpacing />
      <Video section={video2} />
    </main>
  );
}
