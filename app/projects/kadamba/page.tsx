import type { Metadata } from 'next';
import { kadamba, kadambaPlans } from '@/content/en/kadamba';
import { suitesHero } from '@/content/en/suitesShared';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { RoomDetail } from '@/components/sections/RoomDetail';
import { ImgSlider } from '@/components/sections/ImgSlider';
import { List } from '@/components/sections/List';
import { PlansTabs } from '@/components/sections/PlansTabs';
import { Maps } from '@/components/sections/Maps';

export const metadata: Metadata = metadataFor(kadamba);

export default function KadambaPage() {
  const [roomdetail, imgslider, list, maps] = kadamba.columns.colPos0;
  if (roomdetail.type !== 'mask_roomdetail') throw new Error('expected roomdetail');
  if (imgslider.type !== 'mask_imgslider') throw new Error('expected imgslider');
  if (list.type !== 'mask_list') throw new Error('expected list');
  if (maps.type !== 'mask_maps') throw new Error('expected maps');
  return (
    <main>
      <BodyClass pageId={kadamba.id} layout="layout-0" />
      {/* The fixed site logo (Logo.tsx) overlays and scroll-fades against
          whichever Hero sits at the top of the page -- without one here it
          just sat stuck on top of the room photo below. Reusing suitesHero
          (no suitesRooms tab-switcher) restores that top hero without
          bringing back the KADAMBA/ANANTHA MEADOWS category tabs. */}
      <Hero section={suitesHero} />
      <RoomDetail section={roomdetail} />
      <ImgSlider section={imgslider} />
      <List section={list} />
      <PlansTabs id={218} appearance={{ layout: 'default', frameClass: 'default', spaceBefore: 'large', spaceAfter: '' }} title="Floor Plans" categories={kadambaPlans} />
      <Maps section={maps} />
    </main>
  );
}
