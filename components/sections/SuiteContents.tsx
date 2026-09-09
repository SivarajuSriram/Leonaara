import { RoomDetail } from '@/components/sections/RoomDetail';
import { ImgSlider } from '@/components/sections/ImgSlider';
import { List } from '@/components/sections/List';
import { Img } from '@/components/sections/Img';
import { RoomCta } from '@/components/sections/RoomCta';
import { TeaserSlider } from '@/components/sections/TeaserSlider';
import { boum } from '@/content/en/boum';
import { wisa } from '@/content/en/wisa';
import { felisa } from '@/content/en/felisa';
import { himil } from '@/content/en/himil';
import type { PageContent } from '@/lib/content';

// All 4 suites share the exact same 6-section-type colPos5 shape (confirmed
// during extraction), so a single internal SuiteBody helper is reused by the
// 4 exported wrappers below -- unlike ExperienceSubpages.tsx, where each
// subpage's colPos5 shape genuinely differs and needs 5 separate bodies.
function SuiteBody({ page }: { page: PageContent }) {
  const [roomdetail, imgslider, list, img, roomcta, teaserslider] = page.columns.colPos5!;
  if (roomdetail.type !== 'mask_roomdetail') throw new Error('expected roomdetail');
  if (imgslider.type !== 'mask_imgslider') throw new Error('expected imgslider');
  if (list.type !== 'mask_list') throw new Error('expected list');
  if (img.type !== 'mask_img') throw new Error('expected img');
  if (roomcta.type !== 'mask_roomcta') throw new Error('expected roomcta');
  if (teaserslider.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
  return (
    <>
      <RoomDetail section={roomdetail} />
      <ImgSlider section={imgslider} />
      <List section={list} />
      <Img section={img} />
      <RoomCta section={roomcta} />
      <TeaserSlider section={teaserslider} />
    </>
  );
}

export function BoumBody() { return <SuiteBody page={boum} />; }
export function WisaBody() { return <SuiteBody page={wisa} />; }
export function FelisaBody() { return <SuiteBody page={felisa} />; }
export function HimilBody() { return <SuiteBody page={himil} />; }
