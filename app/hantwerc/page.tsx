import type { Metadata } from 'next';
import { hantwerc } from '@/content/en/hantwerc';
import { experiencesHero, experiencesFilter } from '@/content/en/experiencesShared';
import { leiba } from '@/content/en/leiba';
import { sela } from '@/content/en/sela';
import { herchomen } from '@/content/en/herchomen';
import { sneo } from '@/content/en/sneo';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { FilterShell } from '@/components/sections/FilterShell';
import { LeibaBody, SelaBody, HerchomenBody, HantwercBody, SneoBody } from '@/components/sections/ExperienceSubpages';

export const metadata: Metadata = metadataFor(hantwerc);

const subpages = [leiba, sela, herchomen, hantwerc, sneo];
const items = experiencesFilter.content.pages.map((p) => ({ uid: p.uid, title: p.title, href: p.href }));
const nodes = [<LeibaBody key="leiba" />, <SelaBody key="sela" />, <HerchomenBody key="herchomen" />, <HantwercBody key="hantwerc" />, <SneoBody key="sneo" />];
const metaByIndex = subpages.map((p) => ({ title: p.meta.title, description: p.meta.description }));

export default function HantwercPage() {
  const [, pagefilter] = hantwerc.columns.colPos0;
  if (pagefilter.type !== 'mask_pagefilter') throw new Error('expected pagefilter');
  return (
    <main>
      <BodyClass pageId={hantwerc.id} layout="layout-0" />
      <Hero section={experiencesHero} />
      <FilterShell id={pagefilter.id} appearance={pagefilter.appearance} variant="pagefilter" items={items} nodes={nodes} activeIndex={3} metaByIndex={metaByIndex} />
    </main>
  );
}
