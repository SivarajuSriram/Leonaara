'use client';
// Port of Video.vue: load the video once it first intersects the viewport,
// play while it's visible, pause when it isn't.
import { useEffect, useRef } from 'react';
import type { VideoRef, VideoSection } from '@/lib/content';
import { useIsWinter } from '@/lib/season';
import './Video.css';

function Player({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    let loaded = false;
    v.addEventListener('play', () => v.classList.add('js-video-playing'), { once: true });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.intersectionRatio > 0) {
          if (!loaded) {
            v.load();
            loaded = true;
          }
          void v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video preload="metadata" playsInline loop muted ref={ref}>
      <source src={src} type="video/mp4" />
    </video>
  );
}

export function Video({ section }: { section: VideoSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const list: VideoRef[] = !winter && c.videosummer.length ? c.videosummer : c.video;
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_video', 'grid-container']
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      {list.map((v, i) => (
        <div key={i}>
          <Player src={v.src} />
        </div>
      ))}
    </div>
  );
}
