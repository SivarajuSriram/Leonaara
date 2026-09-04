'use client';
import { useRef, type CSSProperties } from 'react';
import type { ImageRef } from '@/lib/content';
import { buildSources, aspectRatios, extractParam, imgUrl, type SizePreset } from '@/lib/images';
import { gsap, useGSAP } from '@/lib/gsap';
import './Picture.css';

// Mirrors the original Img.vue: a <picture> with six webp sources (3 desktop, 3 mobile),
// a dark overlay that fades out once the image has loaded (original: 0.5s power1.out).

type Props = SizePreset & { image: ImageRef; lazy?: boolean; className?: string };

export function Picture({ image, widthD, heightD, widthM, heightM, lazy = true, className }: Props) {
  const preset: SizePreset = { widthD, heightD, widthM, heightM };
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [arD, arM] = aspectRatios(image, preset);
  const isSvg = image.mime === 'image/svg+xml';
  const sources = isSvg ? [] : buildSources(image, preset);

  // Fade the dark overlay out once the image has loaded (original: 0.5s power1.out).
  // A cached image can already be complete before React attaches a listener, so check `complete` first.
  useGSAP(() => {
    const img = imgRef.current;
    const overlay = overlayRef.current;
    if (!img || !overlay) return;
    const fadeOverlay = () => gsap.to(overlay, { opacity: 0, duration: 0.5, ease: 'power1.out' });
    if (img.complete) fadeOverlay();
    else img.addEventListener('load', fadeOverlay, { once: true });
    return () => img.removeEventListener('load', fadeOverlay);
  }, { dependencies: [image.src] });

  const style = { '--ar-d': String(arD), '--ar-m': String(arM) } as CSSProperties;
  return (
    <picture className={className ? `picture ${className}` : 'picture'} style={style}>
      {sources.map((s, i) => (
        <source
          key={i}
          type="image/webp"
          media={s.media}
          srcSet={imgUrl(image.src, { w: s.width, h: s.height, extract: extractParam(image, i < 3 ? 'default' : 'mobile') })}
        />
      ))}
      <img
        ref={imgRef}
        src={isSvg ? image.src : imgUrl(image.src, { w: widthD, h: heightD })}
        alt={image.alt ?? ''}
        title={image.title ?? undefined}
        loading={lazy ? 'lazy' : undefined}
      />
      <div className="overlay" ref={overlayRef} />
    </picture>
  );
}
