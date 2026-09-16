import type { Metadata } from 'next';
import { projects } from '@/content/en/projects';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { TeaserSlider } from '@/components/sections/TeaserSlider';

export const metadata: Metadata = metadataFor(projects);

export default function ProjectsPage() {
  const [hero, teaserslider] = projects.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (teaserslider.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
  return (
    <main>
      <BodyClass pageId={projects.id} layout="layout-0" />
      <Hero section={hero} />
      <TeaserSlider section={teaserslider} navVariant="icons-left" />
    </main>
  );
}
