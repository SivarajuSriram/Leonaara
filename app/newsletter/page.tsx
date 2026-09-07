// Real section order per Step 1's extraction script ORDER printout for newsletter
// (verified against docs/reference/pages/en__newsletter.json): hero, widget_newsletter, video, teaserslider
import type { Metadata } from 'next';
import { newsletter } from '@/content/en/newsletter';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { NewsletterWidget } from '@/components/sections/NewsletterWidget';
import { Video } from '@/components/sections/Video';
import { TeaserSlider } from '@/components/sections/TeaserSlider';

export const metadata: Metadata = metadataFor(newsletter);

export default function NewsletterPage() {
  const [hero, widget, video, teaserslider] = newsletter.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (widget.type !== 'mask_widget_newsletter') throw new Error('expected widget_newsletter');
  if (video.type !== 'mask_video') throw new Error('expected video');
  if (teaserslider.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
  return (
    <main>
      <BodyClass pageId={newsletter.id} layout="layout-0" />
      <Hero section={hero} />
      <NewsletterWidget section={widget} />
      <Video section={video} />
      <TeaserSlider section={teaserslider} />
    </main>
  );
}
