'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ImageRef } from '@/lib/content';
import { staticSrc } from '@/lib/images';
import { ArrowSliderIcon } from '@/components/ui/icons';

// Full-screen image viewer for carousel/gallery sections -- opt-in, added at
// the user's request for the Kadamba gallery carousel (ImgSlider.tsx). Not
// part of the original reference extraction.
//
// Rendered via a portal to document.body: ImgSlider (like every section)
// lives inside SmoothScroll's ScrollSmoother wrapper, which applies its own
// `transform` for the smooth-scroll effect. A `position:fixed` descendant of
// a transformed ancestor is positioned relative to THAT ancestor, not the
// viewport (a CSS containing-block rule, not a bug in this component) -- so
// without the portal the "full-screen" overlay only partially, faintly
// covered the page instead of pinning over everything. NewsletterPopup
// avoids this the same way, just structurally: it's mounted as a layout.tsx
// sibling after </SmoothScroll> instead of inside it.
type Props = {
  images: ImageRef[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
};

export function Lightbox({ images, index, onClose, onNavigate }: Props) {
  const open = index !== null;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate(((index as number) + 1) % images.length);
      if (e.key === 'ArrowLeft') onNavigate(((index as number) - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, index, images.length, onClose, onNavigate]);

  if (!open || !mounted) return null;
  const img = images[index as number];

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/95 p-[4rem] max-lg:p-[2rem]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-[2.4rem] right-[2.4rem] z-10 appearance-none border-0 bg-transparent p-0 cursor-pointer text-[3rem] leading-none text-white transition-opacity duration-300 hover:opacity-60 max-lg:top-[1.6rem] max-lg:right-[1.6rem]"
      >
        &times;
      </button>
      {images.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => { e.stopPropagation(); onNavigate((((index as number) - 1) % images.length + images.length) % images.length); }}
            className="absolute left-[2.4rem] appearance-none border-0 bg-transparent p-0 cursor-pointer text-white transition-opacity duration-300 hover:opacity-60 rotate-180 [&_svg]:h-[2.5rem] [&_svg]:w-[7rem] max-lg:left-[1rem] max-lg:[&_svg]:h-[1.8rem] max-lg:[&_svg]:w-[5rem]"
          >
            <ArrowSliderIcon />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => { e.stopPropagation(); onNavigate(((index as number) + 1) % images.length); }}
            className="absolute right-[2.4rem] appearance-none border-0 bg-transparent p-0 cursor-pointer text-white transition-opacity duration-300 hover:opacity-60 [&_svg]:h-[2.5rem] [&_svg]:w-[7rem] max-lg:right-[1rem] max-lg:[&_svg]:h-[1.8rem] max-lg:[&_svg]:w-[5rem]"
          >
            <ArrowSliderIcon />
          </button>
        </>
      ) : null}
      {/* bg-canvas: matters for images with real transparency (e.g. the
          Kadamba master plan PNG, keyed to alpha so it sits cleanly on the
          page's own canvas-colored background in normal view) -- without it,
          this dialog's dark bg-ink/95 backdrop showed through those
          transparent pixels instead, so the same image looked wrong here
          specifically. Opaque photos are unaffected either way. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- a one-off full-size view, not a layout image needing next/image's responsive machinery */}
      <img
        src={staticSrc(img, 'default')}
        alt={img.alt ?? ''}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] rounded-[0.8rem] bg-canvas object-contain"
      />
    </div>,
    document.body,
  );
}
