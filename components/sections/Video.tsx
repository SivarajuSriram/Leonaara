'use client';
// Port of Video.vue: load the video once it first intersects the viewport,
// play while it's visible, pause when it isn't.
import { useEffect, useRef } from 'react';
import type { VideoRef, VideoSection } from '@/lib/content';
import { useIsWinter } from '@/lib/season';

// mask_video video{aspect-ratio:16/9;grid-column-end:span 12;grid-column-start:2;
// width:100%} + mobile{aspect-ratio:16/10;object-fit:cover} (the -o-object-fit
// vendor prefix has no modern equivalent to carry over)
const videoCls = 'aspect-[16/9] col-start-2 col-span-12 w-full max-lg:aspect-[16/10] max-lg:object-cover';

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
    <video className={videoCls} preload="metadata" playsInline loop muted ref={ref}>
      <source src={src} type="video/mp4" />
    </video>
  );
}

export function Video({ section }: { section: VideoSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const list: VideoRef[] = !winter && c.videosummer.length ? c.videosummer : c.video;
  // A section with no video (e.g. About page's trailing mask_video, id 300 in
  // content/en/about.ts) used to still render this div with its layout's
  // space-before- padding (19rem desktop) applied to nothing -- a large
  // blank gap before whatever follows, with no video to show for it.
  if (list.length === 0) return null;
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
