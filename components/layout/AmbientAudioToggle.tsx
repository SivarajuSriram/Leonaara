'use client';
// Small opt-in toggle for a looping nature-ambience track. Paused/muted by
// default -- nothing plays until the visitor clicks the button themselves
// (browsers block autoplaying sound anyway, but this is deliberate too: an
// unsolicited soundtrack reads as intrusive). No file is wired up yet -- see
// the NEEDS-AUDIO-FILE note on the <audio> src below.
import { useRef, useState } from 'react';

const btnCls =
  'fixed bottom-[2rem] right-[2rem] z-[999] flex h-[4.4rem] w-[4.4rem] items-center justify-center rounded-full border border-ink/25 bg-canvas/90 text-ink shadow-[0_0.2rem_0.8rem_rgba(0,0,0,0.12)] backdrop-blur-[0.8rem] transition-colors hover:bg-canvas max-lg:bottom-[1.6rem] max-lg:right-[1.6rem]';

function SpeakerOnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.8rem] w-[1.8rem] fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M17 9.5a4 4 0 0 1 0 5" />
      <path d="M19.5 7a7.5 7.5 0 0 1 0 10" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.8rem] w-[1.8rem] fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="m17 10 4 4M21 10l-4 4" />
    </svg>
  );
}

export function AmbientAudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <>
      {/* NEEDS-AUDIO-FILE: no track exists in the project yet -- drop a
          royalty-free/licensed nature-ambience loop (birds, wind, forest)
          at public/audio/nature-ambience.mp3 for this to actually play. */}
      <audio ref={audioRef} src="/audio/nature-ambience.mp3" loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        className={btnCls}
        aria-pressed={playing}
        aria-label={playing ? 'Mute nature ambience' : 'Play nature ambience'}
      >
        {playing ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </button>
    </>
  );
}
