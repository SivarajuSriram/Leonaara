import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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

// notFound()'s own return type is `never`, so calling it directly as the
// first statement in the page component below would make TypeScript treat
// every line after it as unreachable -- and, in unreachable code, the
// `if (x.type !== 'mask_...') throw` guards further down stop narrowing
// `roomdetail`/`imgslider`/etc. from the broad `Section` union to their
// specific types, breaking every `section={...}` prop below (confirmed:
// removing the notFound() call makes those errors disappear). Wrapping the
// call in a `void`-returning function sidesteps that: from the page
// component's perspective this returns void, not never, so the rest of the
// function stays normally reachable and normally type-checked, while the
// notFound() call inside still fires (and still throws) at runtime.
function force404(): void {
  notFound();
}

export default function AnanthaMeadowsPage() {
  // Anantha Meadows isn't ready to be public yet -- per the user's explicit
  // "make totally unaccessible" request, this route 404s for ANY visitor
  // regardless of how they got here (typed URL, bookmark, search engine,
  // stale link), not just ones navigating through the site's own nav (that
  // half is handled separately in MenuPanel.tsx, which no longer links to
  // this page at all). The page content below is left in place rather than
  // deleted, so re-enabling it later is a one-line revert (drop this call).
  force404();
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
