'use client';
import { useRef, type CSSProperties } from 'react';
import { getImageProps } from 'next/image';
import type { ImageRef } from '@/lib/content';
import { staticSrc, aspectRatios, renderSize, type SizePreset } from '@/lib/images';
import { gsap, useGSAP } from '@/lib/gsap';

type Props = SizePreset & { image: ImageRef; lazy?: boolean; className?: string };

export function Picture({ image, widthD, heightD, widthM, heightM, lazy = true, className }: Props) {
  const preset: SizePreset = { widthD, heightD, widthM, heightM };
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isSvg = image.mime === 'image/svg+xml';
  const [arD, arM] = aspectRatios(image, preset);

  // Fade the dark overlay out once the image has loaded (original: 0.5s power1.out).
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
  const wrapperClass = ['relative block', className].filter(Boolean).join(' ');
  const imgClass = 'block h-auto w-full [aspect-ratio:var(--ar-d)] max-lg:[aspect-ratio:var(--ar-m)]';
  const overlayClass = 'pointer-events-none absolute inset-0 top-0 left-0 z-[5] h-full w-full bg-ink';

  if (isSvg) {
    return (
      <picture className={wrapperClass} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src={image.src} alt={image.alt ?? ''} title={image.title ?? undefined} loading={lazy ? 'lazy' : undefined} className={imgClass} />
        <div className={overlayClass} ref={overlayRef} />
      </picture>
    );
  }

  const common = { alt: image.alt ?? '', sizes: '100vw', quality: 80 };
  const d = renderSize(image, preset, 'default');
  const m = renderSize(image, preset, 'mobile');
  const { props: mobileProps } = getImageProps({ ...common, src: staticSrc(image, 'mobile'), width: m.width, height: m.height });
  const { props: desktopProps } = getImageProps({ ...common, src: staticSrc(image, 'default'), width: d.width, height: d.height });

  return (
    <picture className={wrapperClass} style={style}>
      <source media="(max-width: 1023px)" srcSet={mobileProps.srcSet} />
      {/* eslint-disable-next-line @next/next/no-img-element -- getImageProps' own art-direction pattern requires a plain <img>, next/image's <Image> can't sit inside a <picture> */}
      <img
        {...desktopProps}
        ref={imgRef}
        title={image.title ?? undefined}
        loading={lazy ? 'lazy' : undefined}
        className={imgClass}
      />
      <div className={overlayClass} ref={overlayRef} />
    </picture>
  );
}
