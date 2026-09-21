// New page per the user's explicit request: an NRI Corner explaining
// eligibility, documentation, POA, repatriation and taxation for
// Non-Resident Indians buying at Leonaara. Built entirely from existing
// sections (Hero/ImgText/Accordions), same as every other page.
import type { Metadata } from 'next';
import { nri } from '@/content/en/nri';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { ImgText } from '@/components/sections/ImgText';
import { Accordions } from '@/components/sections/Accordions';

export const metadata: Metadata = metadataFor(nri);

export default function NriPage() {
  const [hero, imgtext, accordions] = nri.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (imgtext.type !== 'mask_imgtext') throw new Error('expected imgtext');
  if (accordions.type !== 'mask_accordions') throw new Error('expected accordions');
  return (
    <main>
      <BodyClass pageId={nri.id} layout="layout-0" />
      <Hero section={hero} />
      {/* insetLeft: the hero image bled flush to the browser's left edge --
          per the user's explicit "too far into the left edge, move it right
          a bit" request. */}
      <ImgText section={imgtext} wideTitle insetLeft />
      <Accordions section={accordions} />
    </main>
  );
}
