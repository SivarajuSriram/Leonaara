// Rebuilt 2026-09-08 from a fresh live extraction (getComputedStyle/outerHTML reads against
// https://www.eriro.at, not the stale initial crawl this file was originally built from).
// That stale crawl had it wrong in three ways: (1) the glyph is a hand-drawn "sad face" SVG,
// not the site LogoIcon; (2) the title is TWO lines — "Ooops!" then "something went wrong" —
// the first line was missing entirely; (3) the real error page renders with NO header/nav/
// footer at all (confirmed: document.querySelector('header'|'footer') both return null on
// the live page). Next.js's root not-found.tsx always renders inside the shared RootLayout
// (app/layout.tsx renders <Header>/<Footer> unconditionally around {children}), so there's no
// layout-level way to exclude them for just this page without a broader routing refactor —
// the useEffect below hides them directly as the minimal-blast-radius equivalent.
'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorFaceIcon } from '@/components/ui/icons';
import { site } from '@/content/site';
import { gsap } from '@/lib/gsap';
import { MOUTH_SMILE, EYES_NORMAL, EYES_WINK } from '@/lib/errorFaceIcon';

// mask_errorpage{align-items:center;display:flex;height:100vh;justify-content:
// center;padding-top:12rem} + mobile{padding-top:0}. grid-column-end:span 14;
// grid-column-start:1 on this same rule is dropped: <main> is never a grid
// container anywhere in this app (no ancestor sets display:grid), so
// grid-column-* placement has no effect here — same as every other converted
// mask_X wrapper (Break.css's .mask_break, Video.css's .mask_video, etc. never
// carried a grid-column rule on their own outer element either).
const wrapperCls = 'default mask mask_errorpage flex items-center justify-center h-screen pt-[12rem] max-lg:pt-0';

// mask_errorpage .grid-container-error{display:grid;width:100%;grid-column-gap:
// var(--grid-gap);grid-template-columns:var(--grid-margin) 1fr(x12) var(--grid-margin);
// --grid-gap:8rem;--grid-margin:0rem} + mobile{--grid-gap:1rem;--grid-margin:3rem}.
// Reuses the shared `grid-container` class (app/globals.css) for the identical
// 14-column shape instead of restating grid-template-columns, overriding only
// its two custom properties locally via Tailwind arbitrary-property utilities.
// w-full (-> the original's width:100%) matters here specifically because
// .mask_errorpage is a flex container (justify-content:center) — a flex item
// defaults to content width, not full width, without it. Column-gap and both
// tiers match the live extraction exactly: 80px@1920/60px@1440 (fluid, no
// separate tier needed) and 10.83px@390 (= 1rem * this breakpoint's ~10.83px
// root font-size, confirmed against measured values below).
const gridCls = 'grid-container-error grid-container w-full [--grid-gap:8rem] [--grid-margin:0rem] max-lg:[--grid-gap:1rem] max-lg:[--grid-margin:3rem]';

// Live grid placement: .errorSvgWrapper{display:flex;justify-content:flex-end;grid-column:4/7}
// at 1920 and 1440, grid-column:11/14 at 390 (mobile: glyph moves to a narrow top-right slot).
// No transform on this element in the live computed styles — the stale crawl's
// translateY(-50%) translate(-2rem) is gone: the wrapper's own height (364.3px @1920) exactly
// equals the grid row's height (also 364.3px), so no vertical compensation is needed.
// svg width: fixed 21.5rem (=215px @1920, matches measured) down to the lg breakpoint; on
// mobile the wrapper and the svg have the SAME measured width (67.7px), i.e. the svg just
// fills its narrow grid column there rather than holding a fixed rem size — hence w-full only
// under max-lg.
const svgWrapperCls = 'errorSvgWrapper flex justify-end col-start-4 col-span-3 max-lg:col-start-11 max-lg:col-span-3 [&_svg]:w-[21.5rem] max-lg:[&_svg]:w-full';

// mask_errorpage .errorTextWrapper{grid-column-end:13;grid-column-start:7} +
// mobile{grid-column-end:14;grid-column-start:2}
const textWrapperCls = 'errorTextWrapper col-start-7 col-span-6 max-lg:col-start-2 max-lg:col-span-12';

// Live: font-size 67px@1920 (=6.7rem), font-weight 500, line-height 58.96px (88% of 67),
// text-transform:uppercase, letter-spacing normal — matches the stale crawl's desktop values.
// Mobile corrects the stale crawl's font-size: measured is 32.5px (=3.25rem, not the old
// 3rem), letter-spacing 1.625px = exactly .05em of 32.5px, line-height 37.05px = 114% of
// 32.5px. The literal DOM text is "Ooops!" (title case) — text-transform:uppercase is what
// renders it as "OOOPS!" on screen, so the JSX below keeps the literal casing.
const titleCls = 'errorTitle text-ink text-[6.7rem] font-medium tracking-normal leading-[88%] uppercase max-lg:text-[3.25rem] max-lg:tracking-[.05em] max-lg:leading-[114%]';

// Live: font-size 25px@1920 (=2.5rem), font-weight 300, letter-spacing normal, line-height
// 37px (148% of 25), margin-top 50px (=5rem). Mobile: font-size 17.33px (=1.6rem at this
// breakpoint's ~10.83px root font-size), letter-spacing 1.733px (=.1em of 17.33px),
// line-height 24.96px (144% of 17.33), margin-top 21.67px (=2rem at the same ~10.83px root)
// — all of which match the pre-existing mobile values here exactly once the tiered root
// font-size is accounted for, so nothing to change there.
const textCls = 'errorText text-ink text-[2.5rem] font-light tracking-normal leading-[148%] mt-[5rem] max-lg:text-[1.6rem] max-lg:tracking-[.1em] max-lg:leading-[144%] max-lg:mt-[2rem]';

// mask_errorpage .errorText a{color:#211d1d;display:inline-block;text-decoration:underline}
const linkCls = 'inline-block text-ink underline';

// mask_errorpage .loadingBar{grid-column-end:span 14;grid-column-start:1;
// height:.2rem;margin-top:11rem;position:relative} + mobile{margin-top:4rem}
const loadingBarCls = 'loadingBar relative col-start-1 col-span-14 h-[.2rem] mt-[11rem] max-lg:mt-[4rem]';

// mask_errorpage .loadingBar .innerLoader{position:absolute;top:0;left:0;
// height:100%;width:100%;background-color:#211d1d;transform:translate(-100%);
// animation-name:loader-6701ef9f;animation-duration:5s;animation-delay:1s;
// animation-fill-mode:forwards}. Pulled directly from the live stylesheet and byte-identical
// to the keyframe already committed at app/globals.css:475-480 — no change needed there.
// The static base state restates the keyframe's own 0% value (animation-fill-mode:forwards
// only paints the keyframe's *end* state outside the animation's active interval, not its
// start, so without this the bar would flash at translateX(0), full width, for the first
// second before snapping to hidden when the animation begins) — but it MUST be set via the
// `transform` property specifically, not Tailwind's `-translate-x-full` utility. That utility
// writes the separate CSS `translate` property, and `translate`/`transform` compose
// independently (CSS Transforms Level 2) rather than one overriding the other: with
// `-translate-x-full` the element sits at a permanent translate:-100% that the transform
// animation then stacks on top of instead of replacing, so the bar never becomes visible at
// any point in the sequence (confirmed: computed `translate` stayed -100% and never got
// touched by the animation, which only ever writes `transform`). An arbitrary-property
// utility targeting `transform` directly avoids the second property entirely.
const innerLoaderCls = 'innerLoader absolute left-0 top-0 h-full w-full bg-ink [transform:translateX(-100%)] animate-[loader-6701ef9f_5s_1s_forwards]';

export default function NotFound() {
  const router = useRouter();
  const svgWrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Live timing captured via a Playwright session with navigator.webdriver spoofed to
    // false (automated sessions otherwise get a compressed/accelerated version of this
    // whole sequence) — see lib/errorFaceIcon.ts. Frown is static for ~2.5s, morphs to a
    // smile over ~0.5s, then ~0.17s later the bottom eye alone winks (squash to a sliver
    // over ~0.13s, release over ~0.15s) — well before the 9s redirect below.
    const wrap = svgWrapRef.current;
    const mouth = wrap?.querySelector('.mouth');
    const eyes = wrap?.querySelector('.eyes');
    if (!mouth || !eyes) return;
    const tl = gsap.timeline({ delay: 2.5 });
    tl.to(mouth, { duration: 0.5, morphSVG: MOUTH_SMILE })
      .to(eyes, { duration: 0.13, morphSVG: EYES_WINK }, '+=0.17')
      .to(eyes, { duration: 0.15, morphSVG: EYES_NORMAL });
    return () => {
      tl.kill();
    };
  }, []);
  useEffect(() => {
    // The live page has no header/nav/footer (confirmed via a direct DOM query, not a
    // screenshot guess) — see the file-top comment for why this is done from here rather
    // than in the shared layout.
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    return () => {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);
  useEffect(() => {
    // Deliberate deviation from the live site by user request: the live page holds for a
    // further ~3s after the loading bar visually finishes filling before redirecting
    // (measured live redirect ~9.07s total: 1s animation-delay + 5s bar fill + that hold).
    // Here the redirect fires the instant the bar completes instead, matching the bar's own
    // 1s delay + 5s duration with no extra wait.
    const t = setTimeout(() => router.push(site.pageLinks.home), 6000);
    return () => clearTimeout(t);
  }, [router]);
  return (
    <main>
      <div className={wrapperCls}>
        <div className={gridCls}>
          <div className={svgWrapperCls} ref={svgWrapRef}><ErrorFaceIcon /></div>
          <div className={textWrapperCls}>
            <div className={titleCls}>
              Ooops!
              <br />
              something went wrong
              <br />
            </div>
            <div className={textCls}>
              <span>You will be redirected shortly. <br /></span> Click here to access the <a href={site.pageLinks.home} className={linkCls}>homepage</a>.
            </div>
          </div>
          <div className={loadingBarCls}><div className={innerLoaderCls} /></div>
        </div>
      </div>
    </main>
  );
}
