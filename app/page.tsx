import type { Metadata } from 'next';
import {
  hero, originsText, originsVideo, pressQuote, roomSlider, roomNatureText, spaText,
  spaImage, timelessBreak, mountainText, mountainImage, culinaryText, culinaryImage,
  teaserSlider, partnerMarquee, home,
} from '@/content/en/home';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { ImgText } from '@/components/sections/ImgText';
import { Video } from '@/components/sections/Video';
import { Quote } from '@/components/sections/Quote';
import { RoomSlider } from '@/components/sections/RoomSlider';
import { Img } from '@/components/sections/Img';
import { Break } from '@/components/sections/Break';
import { TeaserSlider } from '@/components/sections/TeaserSlider';
import { PartnerMarquee } from '@/components/sections/PartnerMarquee';

export const metadata: Metadata = metadataFor(home);

export default function HomePage() {
  return (
    <main>
      <BodyClass pageId={home.id} layout="layout-0" />
      <Hero section={hero} />
      <ImgText section={originsText} />
      <Video section={originsVideo} />
      <Quote section={pressQuote} />
      <RoomSlider section={roomSlider} />
      <ImgText section={roomNatureText} />
      <ImgText section={spaText} />
      <Img section={spaImage} />
      <Break section={timelessBreak} />
      <ImgText section={mountainText} />
      <Img section={mountainImage} />
      <ImgText section={culinaryText} />
      <Img section={culinaryImage} />
      <TeaserSlider section={teaserSlider} />
      <PartnerMarquee section={partnerMarquee} />
    </main>
  );
}
