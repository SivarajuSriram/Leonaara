'use client';
import { useRef } from 'react';
import type { BreakSection } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { useParallax } from '@/components/ui/useParallax';
import { useIsWinter } from '@/lib/season';
import './Break.css';

export function Break({ section }: { section: BreakSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const left = !winter && c.imgleftsummer.length ? c.imgleftsummer : c.imgleft;
  const right = !winter && c.imgrightsummer.length ? c.imgrightsummer : c.imgright;
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  useParallax(leftRef, 1.2); // original: smoother.effects(picture-left, { speed: 1.2 })
  useParallax(rightRef, 1.5); // original: smoother.effects(picture-right, { speed: 1.5 })
  return (
    <Mask type="break" uid={section.id} appearance={section.appearance}>
      <div className="break-wrapper grid-container">
        {left.map((img, i) => (
          <div className="image-left" key={i} ref={i === 0 ? leftRef : undefined}>
            {/* original: widthD 570, heightD 510, widthM 223, heightM 180 */}
            <Picture image={img} widthD={570} heightD={510} widthM={223} heightM={180} />
          </div>
        ))}
        {c.title ? <SplitWords as="h2" className="title" html={c.title} duration={0.2} /> : null}
        {right.map((img, i) => (
          <div className="image-right" key={i} ref={i === 0 ? rightRef : undefined}>
            {/* original: widthD 352, heightD 280, widthM 175, heightM 139 */}
            <Picture image={img} widthD={352} heightD={280} widthM={175} heightM={139} />
          </div>
        ))}
      </div>
    </Mask>
  );
}
