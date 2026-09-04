'use client';
import type { ImgSection } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { useIsWinter } from '@/lib/season';
import './Img.css';

export function Img({ section }: { section: ImgSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const imgs = !winter && c.imgsummer.length ? c.imgsummer : c.img;
  return (
    <Mask type="img" uid={section.id} appearance={section.appearance} className="grid-container">
      {imgs.map((img, i) => (
        <div className="image" key={i}>
          {/* original: widthD 1920, heightD 1080, widthM 360, heightM 300 */}
          <Picture image={img} widthD={1920} heightD={1080} widthM={360} heightM={300} />
        </div>
      ))}
    </Mask>
  );
}
