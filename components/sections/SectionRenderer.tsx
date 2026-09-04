import { Fragment } from 'react';
import type { Section } from '@/lib/content';
import { Hero } from './Hero';
import { ImgText } from './ImgText';
import { Img } from './Img';
import { Video } from './Video';
import { Quote } from './Quote';
import { Break } from './Break';
import { RoomSlider } from './RoomSlider';
import { TeaserSlider } from './TeaserSlider';
import { PartnerMarquee } from './PartnerMarquee';

const warned = new Set<string>();

// One case per original TYPO3 content type. Later phases add cases here.
function renderSection(section: Section) {
  switch (section.type) {
    case 'mask_hero': return <Hero section={section} />;
    case 'mask_imgtext': return <ImgText section={section} />;
    case 'mask_img': return <Img section={section} />;
    case 'mask_video': return <Video section={section} />;
    case 'mask_quote': return <Quote section={section} />;
    case 'mask_break': return <Break section={section} />;
    case 'mask_roomslider': return <RoomSlider section={section} />;
    case 'mask_teaserslider': return <TeaserSlider section={section} />;
    case 'mask_partnermarquee': return <PartnerMarquee section={section} />;
    default:
      if (process.env.NODE_ENV !== 'production' && !warned.has(section.type)) {
        warned.add(section.type);
        console.warn(`SectionRenderer: no component for "${section.type}" yet`);
      }
      return null;
  }
}

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return <>{sections.map((section) => <Fragment key={section.id}>{renderSection(section)}</Fragment>)}</>;
}
