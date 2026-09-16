import type { Metadata } from 'next';
import {
  hero, originsText, originsVideo, roomSlider, roomNatureText, spaText,  home,
} from '@/content/en/home';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { ImgText } from '@/components/sections/ImgText';
import { Video } from '@/components/sections/Video';
import { RoomSlider } from '@/components/sections/RoomSlider';


export const metadata: Metadata = metadataFor(home);

export default function HomePage() {
  return (
    <main>
      <BodyClass pageId={home.id} layout="layout-0" />
      <Hero section={hero} />
      <ImgText section={originsText} leafSide="right" />
      <Video section={originsVideo} />
      <RoomSlider section={roomSlider} />
      <ImgText section={roomNatureText} leafSide="left" />
      <ImgText section={spaText} leafSide="right" />
    </main>
  );
}
