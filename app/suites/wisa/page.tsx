import type { Metadata } from 'next';
import { boum } from '@/content/en/boum';
import { suitesHero, suitesRooms } from '@/content/en/suitesShared';
import { wisa } from '@/content/en/wisa';
import { felisa } from '@/content/en/felisa';
import { himil } from '@/content/en/himil';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { FilterShell } from '@/components/sections/FilterShell';
import { BoumBody, WisaBody, FelisaBody, HimilBody } from '@/components/sections/SuiteContents';

export const metadata: Metadata = metadataFor(wisa);

const suites = [boum, wisa, felisa, himil];
const items = suitesRooms.content.rooms.map((r) => ({ uid: r.uid, title: r.title, href: r.slug }));
const nodes = [<BoumBody key="boum" />, <WisaBody key="wisa" />, <FelisaBody key="felisa" />, <HimilBody key="himil" />];
const metaByIndex = suites.map((p) => ({ title: p.meta.title, description: p.meta.description }));

export default function WisaPage() {
  const [, rooms] = wisa.columns.colPos0;
  if (rooms.type !== 'mask_rooms') throw new Error('expected rooms');
  return (
    <main>
      <BodyClass pageId={wisa.id} layout="layout-0" />
      <Hero section={suitesHero} />
      <FilterShell id={rooms.id} appearance={rooms.appearance} variant="rooms" items={items} nodes={nodes} activeIndex={1} metaByIndex={metaByIndex} />
    </main>
  );
}
