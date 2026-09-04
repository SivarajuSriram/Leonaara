'use client';
import { useRef } from 'react';
import type { ImgTextSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { RichText } from '@/components/ui/RichText';
import { useParallax } from '@/components/ui/useParallax';
import { useIsWinter } from '@/lib/season';
import './ImgText.css';

export function ImgText({ section }: { section: ImgTextSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const left = !winter && c.imgleftsummer.length ? c.imgleftsummer : c.imgleft;
  const right = !winter && c.imgrightsummer.length ? c.imgrightsummer : c.imgright;
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  useParallax(leftRef, 1.5); // original: smoother.effects(picture-left, { speed: 1.5 })
  useParallax(rightRef, 1.05); // original: smoother.effects(picture-right, { speed: 1.05 })
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_imgtext']
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className="grid-container">
        {left.map((img, i) => (
          <div className="image-left" key={i} ref={i === 0 ? leftRef : undefined}>
            {/* original: widthD 501, heightD 390, widthM 117, heightM 105 */}
            <Picture image={img} widthD={501} heightD={390} widthM={117} heightM={105} />
          </div>
        ))}
        {right.map((img, i) => (
          <div className="image-right" key={i} ref={i === 0 ? rightRef : undefined}>
            {/* original: widthD 570, heightD 510, widthM 223, heightM 180 */}
            <Picture image={img} widthD={570} heightD={510} widthM={223} heightM={180} />
          </div>
        ))}
        <div className="content">
          {c.title ? <SplitWords as="h2" className="title" html={c.title} /> : null}
          {c.text ? <RichText className="text" html={c.text} /> : null}
        </div>
      </div>
    </div>
  );
}
