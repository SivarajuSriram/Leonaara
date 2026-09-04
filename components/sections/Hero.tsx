'use client';
import { useRef } from 'react';
import type { HeroSection } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { RichText } from '@/components/ui/RichText';
import { useParallax } from '@/components/ui/useParallax';
import { useIsWinter } from '@/lib/season';
import './Hero.css';

// Mirrors the original Hero.vue. Three layouts share one markup: default (home), subpage, only-text.
export function Hero({ section }: { section: HeroSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const onlyText = c.herolayout === 'only-text';
  const big = !winter && c.imgsummer.length ? c.imgsummer : c.img;
  const small = !winter && c.sideimgsummer.length ? c.sideimgsummer : c.sideimg;
  const bigRef = useRef<HTMLDivElement>(null);
  const smallRef = useRef<HTMLDivElement>(null);
  useParallax(bigRef, 1.15); // original: smoother.effects(picture[0], { speed: 1.15 })
  useParallax(smallRef, 1.5); // original: smoother.effects(picture[1], { speed: 1.5 })

  return (
    <Mask type="hero" uid={section.id} appearance={section.appearance} className={`hero-${c.herolayout}`}>
      <div className="grid-container">
        <div className="image-wrapper">
          {c.title ? <h1 className="title" dangerouslySetInnerHTML={{ __html: c.title }} /> : null}
          {c.text && onlyText ? <RichText className="text" html={c.text} /> : null}
          {!onlyText && big.map((img, i) => (
            <div className="image-big" key={i} ref={i === 0 ? bigRef : undefined}>
              <Picture image={img} widthD={1014} heightD={780} widthM={340} heightM={260} lazy={false} />
            </div>
          ))}
        </div>
        {c.titleimg && c.herolayout === 'default' ? <p className="titleimg h1" dangerouslySetInnerHTML={{ __html: c.titleimg }} /> : null}
        {c.titleh2 ? <SplitWords as="h2" className="titleh2" html={c.titleh2} /> : null}
        {!onlyText && small.map((img, i) => (
          <div className="image-small" key={i} ref={i === 0 ? smallRef : undefined}>
            <Picture image={img} widthD={272} heightD={360} widthM={136} heightM={180} lazy={false} />
          </div>
        ))}
      </div>
    </Mask>
  );
}
