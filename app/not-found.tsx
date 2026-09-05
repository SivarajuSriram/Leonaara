// original error page: logo, "something went wrong", 5s loading bar after 1s, then redirect home
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogoIcon } from '@/components/ui/icons';
import { site } from '@/content/site';

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
// Reuses the shared `grid-container` class (styles/base.css) for the identical
// 14-column shape instead of restating grid-template-columns, overriding only
// its two custom properties locally via Tailwind arbitrary-property utilities.
// w-full (-> the original's width:100%) matters here specifically because
// .mask_errorpage is a flex container (justify-content:center) — a flex item
// defaults to content width, not full width, without it.
// --grid-gap-fluid/--grid-margin-fluid are dropped: dead custom properties,
// set here but never read by any rule in this file or anywhere else in the repo
// (confirmed via grep) — vestigial from the original template.
const gridCls = 'grid-container-error grid-container w-full [--grid-gap:8rem] [--grid-margin:0rem] max-lg:[--grid-gap:1rem] max-lg:[--grid-margin:3rem]';

// mask_errorpage .errorSvgWrapper{display:flex;grid-column-end:7;grid-column-
// start:4;justify-content:flex-end;transform:translateY(-50%) translate(-2rem)}
// + mobile{grid-column-end:14;grid-column-start:11;transform:none}.
// .errorSvgWrapper svg{width:21.5rem} is applied as a descendant arbitrary
// variant targeting the bare <svg> LogoIcon renders, matching Logo.tsx's
// precedent for the exact same icon. .errorSvgWrapper svg path{fill:#211d1d}
// is dropped: LogoIcon already hardcodes fill="#211D1D" on every <path>
// (components/ui/icons/LogoIcon.tsx) — identical color, so removing this
// redundant CSS rule changes nothing.
const svgWrapperCls = 'errorSvgWrapper flex justify-end col-start-4 col-span-3 -translate-y-1/2 translate-x-[-2rem] max-lg:col-start-11 max-lg:col-span-3 max-lg:translate-y-0 max-lg:translate-x-0 [&_svg]:w-[21.5rem]';

// mask_errorpage .errorTextWrapper{grid-column-end:13;grid-column-start:7} +
// mobile{grid-column-end:14;grid-column-start:2}
const textWrapperCls = 'errorTextWrapper col-start-7 col-span-6 max-lg:col-start-2 max-lg:col-span-12';

// mask_errorpage .errorTitle{color:#211d1d;font-size:6.7rem;font-weight:300
// (dead — immediately overridden by the next declaration, same selector);
// font-weight:500;letter-spacing:0;line-height:88%;text-transform:uppercase} +
// mobile{font-size:3.5rem (dead, overridden 1 line down);font-size:3rem;
// letter-spacing:.05em;line-height:114%} — last declaration for a given
// property wins per normal CSS cascade order, same handling as Hero.tsx's
// duplicate-property rules.
const titleCls = 'errorTitle text-ink text-[6.7rem] font-medium tracking-normal leading-[88%] uppercase max-lg:text-[3rem] max-lg:tracking-[.05em] max-lg:leading-[114%]';

// mask_errorpage .errorText{color:#211d1d;font-size:2.5rem;font-weight:300;
// letter-spacing:0;line-height:148%;margin-top:5rem} + TWO separate mobile
// blocks in source order (with .errorText a's own desktop rule sitting between
// them): the first sets font-size:1.6rem;letter-spacing:0 (dead, overridden 2
// lines down);letter-spacing:.1em;line-height:156% (dead);line-height:144%;
// the second (later in the file, so it wins any ties) restates font-size:
// 1.6rem and adds margin-top:2rem. Net mobile result: font-size:1.6rem;
// letter-spacing:.1em;line-height:144%;margin-top:2rem.
const textCls = 'errorText text-ink text-[2.5rem] font-light tracking-normal leading-[148%] mt-[5rem] max-lg:text-[1.6rem] max-lg:tracking-[.1em] max-lg:leading-[144%] max-lg:mt-[2rem]';

// mask_errorpage .errorText a{color:#211d1d;text-decoration:underline} —
// applied directly below since the <a> is a real JSX element here, not
// innerHTML.
const linkCls = 'text-ink underline';

// mask_errorpage .loadingBar{grid-column-end:span 14;grid-column-start:1;
// height:.2rem;margin-top:11rem;position:relative} + mobile{margin-top:4rem}
const loadingBarCls = 'loadingBar relative col-start-1 col-span-14 h-[.2rem] mt-[11rem] max-lg:mt-[4rem]';

// mask_errorpage .loadingBar .innerLoader{position:absolute;top:0;left:0;
// height:100%;width:100%;background-color:#211d1d;transform:translate(-100%);
// animation-name:loader-6701ef9f;animation-duration:5s;animation-delay:1s;
// animation-fill-mode:forwards}.
//
// Keyframes-vs-JS determination: this file's only useEffect (below) sets a
// single setTimeout for the redirect and never touches .innerLoader's style or
// width per frame — the fill animation is genuinely CSS-driven, via the named
// keyframe `loader-6701ef9f`. That keyframe (0%{transform:translate(-100%)}
// to{transform:translate(0)}) is a real Protocol escape-hatch case — a
// @keyframes block can't be expressed as a Tailwind utility — but it needs no
// new residual CSS file here: it already exists, untouched by this sweep, at
// styles/base.css:438-445, which styles/globals.css:28 imports globally
// (`@import "./base.css" layer(base)`) regardless of this file's existence.
// Tailwind's arbitrary `animate-[...]` utility below just references that
// existing global keyframe by name.
//
// -translate-x-full restates the keyframe's own 0% value as this element's
// static base transform: animation-fill-mode:forwards only paints the
// keyframe's *end* state outside the animation's active interval, not its
// start, so without this the bar would flash at translateX(0) (full width,
// unfilled-looking) for the first second (the animation-delay) before
// snapping to hidden when the animation actually begins.
const innerLoaderCls = 'innerLoader absolute left-0 top-0 h-full w-full bg-ink -translate-x-full animate-[loader-6701ef9f_5s_1s_forwards]';

export default function NotFound() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push(site.pageLinks.home), 6000); // 1s delay + 5s bar
    return () => clearTimeout(t);
  }, [router]);
  return (
    <main>
      <div className={wrapperCls}>
        <div className={gridCls}>
          <div className={svgWrapperCls}><LogoIcon /></div>
          <div className={textWrapperCls}>
            <h1 className={titleCls}>something went wrong</h1>
            <p className={textCls}>You will be redirected shortly. Click here to access the <a href={site.pageLinks.home} className={linkCls}>homepage</a>.</p>
          </div>
          <div className={loadingBarCls}><div className={innerLoaderCls} /></div>
        </div>
      </div>
    </main>
  );
}
