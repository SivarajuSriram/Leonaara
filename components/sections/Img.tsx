'use client';
import type { ImgSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { useIsWinter } from '@/lib/season';
import './Img.css';

export function Img({ section }: { section: ImgSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const imgs = !winter && c.imgsummer.length ? c.imgsummer : c.img;
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_img', 'grid-container']
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      {imgs.map((img, i) => (
        <div className="image" key={i}>
          {/* original: widthD 1920, heightD 1080, widthM 360, heightM 300 */}
          <Picture image={img} widthD={1920} heightD={1080} widthM={360} heightM={300} />
        </div>
      ))}
    </div>
  );
}
