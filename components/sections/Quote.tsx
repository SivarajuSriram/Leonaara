'use client';
import { useRef } from 'react';
import type { QuoteSection } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { useParallax } from '@/components/ui/useParallax';
import './Quote.css';

export function Quote({ section }: { section: QuoteSection }) {
  const c = section.content;
  const imgRef = useRef<HTMLDivElement>(null);
  useParallax(imgRef, 1.6); // original: smoother.effects(picture, { speed: 1.6 })
  return (
    <Mask type="quote" uid={section.id} appearance={section.appearance}>
      <div className="grid-container">
        {c.img.map((img, i) => (
          <div className="image" key={i} ref={i === 0 ? imgRef : undefined}>
            {/* original: widthD 274, heightD 330, widthM 360, heightM 520 */}
            <Picture image={img} widthD={274} heightD={330} widthM={360} heightM={520} />
          </div>
        ))}
        <div className="quote-wrapper">
          <SplitWords as="div" className="quote" html={c.quote} />
          <div className="autor">{c.autor}</div>
        </div>
      </div>
    </Mask>
  );
}
