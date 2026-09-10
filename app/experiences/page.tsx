import type { Metadata } from 'next';
import { experiences } from '@/content/en/experiences';
import { experiencesFilter } from '@/content/en/experiencesShared';
import { leiba } from '@/content/en/leiba';
import { sela } from '@/content/en/sela';
import { herchomen } from '@/content/en/herchomen';
import { hantwerc } from '@/content/en/hantwerc';
import { sneo } from '@/content/en/sneo';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { TeaserSlider } from '@/components/sections/TeaserSlider';
import { FilterShell } from '@/components/sections/FilterShell';
import { LeibaBody, SelaBody, HerchomenBody, HantwercBody, SneoBody } from '@/components/sections/ExperienceSubpages';

export const metadata: Metadata = metadataFor(experiences);

const subpages = [leiba, sela, herchomen, hantwerc, sneo];
const items = experiencesFilter.content.pages.map((p) => ({ uid: p.uid, title: p.title, href: p.href }));
const nodes = [<LeibaBody key="leiba" />, <SelaBody key="sela" />, <HerchomenBody key="herchomen" />, <HantwercBody key="hantwerc" />, <SneoBody key="sneo" />];
const metaByIndex = subpages.map((p) => ({ title: p.meta.title, description: p.meta.description }));

export default function ExperiencesPage() {
  const [hero, pagefilter, teaserslider] = experiences.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (pagefilter.type !== 'mask_pagefilter') throw new Error('expected pagefilter');
  if (teaserslider.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
  return (
    <main>
      <BodyClass pageId={experiences.id} layout="layout-0" />
      <Hero section={hero} />
      {/* The original always ends up calling its full selection handler on
          mount, which on this hub selects pages[0] (leiba) as the default
          active item -- this is the actual live-site default, not
          accidental. We deliberately do NOT replicate the original's
          mount-time history.pushState to /en/leiba/ or its 0.2s auto-scroll
          tween, since those are side effects of a dead conditional in the
          original's own code (a harmless original bug), not intended
          behavior worth cloning. (spec §19.3 to eventually record.) */}
      <FilterShell id={pagefilter.id} appearance={pagefilter.appearance} variant="pagefilter" items={items} nodes={nodes} activeIndex={0} metaByIndex={metaByIndex} />
      <TeaserSlider section={teaserslider} />
    </main>
  );
}
