'use client';
import type { ImgSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { useIsWinter } from '@/lib/season';

// mask_img .image{grid-column-end:span 14;grid-column-start:1} — spans all 14
// grid-container tracks (both margin columns included), unchanged at mobile,
// so a single arbitrary shorthand (span 14 has no default Tailwind col-span
// utility, which tops out at 12) rather than splitting into col-start-1 +
// an arbitrary col-span.
const imageCls = 'image [grid-column:1/span_14]';

// mask_img img{height:auto;width:100%} needs no class here: the <img> renders
// through Picture, whose own imgClass already carries h-auto w-full
// (components/ui/Picture.tsx) — same values, already covered.

export function Img({ section }: { section: ImgSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const imgs = !winter && c.imgsummer.length ? c.imgsummer : c.img;
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_img', 'grid-container']
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      {imgs.map((img, i) => (
        <div className={imageCls} key={i}>
          {/* original: widthD 1920, heightD 1080, widthM 360, heightM 300 */}
          <Picture image={img} widthD={1920} heightD={1080} widthM={360} heightM={300} />
        </div>
      ))}
    </div>
  );
}
