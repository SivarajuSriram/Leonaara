import type { Metadata } from 'next';
import { ananthaMeadows } from '@/content/en/ananthameadows';
import { suitesHero } from '@/content/en/suitesShared';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { RoomDetail } from '@/components/sections/RoomDetail';
import { ImgSlider } from '@/components/sections/ImgSlider';
import { List } from '@/components/sections/List';
import { Img } from '@/components/sections/Img';
import { RoomCta } from '@/components/sections/RoomCta';
import { TeaserSlider } from '@/components/sections/TeaserSlider';

export const metadata: Metadata = metadataFor(ananthaMeadows);

export default function AnanthaMeadowsPage() {
  const [roomdetail, imgslider, list, img, roomcta, teaserslider] = ananthaMeadows.columns.colPos0;
  if (roomdetail.type !== 'mask_roomdetail') throw new Error('expected roomdetail');
  if (imgslider.type !== 'mask_imgslider') throw new Error('expected imgslider');
  if (list.type !== 'mask_list') throw new Error('expected list');
  if (img.type !== 'mask_img') throw new Error('expected img');
  if (roomcta.type !== 'mask_roomcta') throw new Error('expected roomcta');
  if (teaserslider.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
  return (
    <main>
      <BodyClass pageId={ananthaMeadows.id} layout="layout-0" />
      {/* See kadamba/page.tsx for why this Hero is needed even without the
          KADAMBA/ANANTHA MEADOWS category tabs. */}
      <Hero section={suitesHero} />
      <RoomDetail section={roomdetail} />
      <ImgSlider section={imgslider} />
      <List section={list} />
      <Img section={img} />
      <RoomCta section={roomcta} />
      <TeaserSlider section={teaserslider} />
    </main>
  );
}
