'use client';
import { useRef } from 'react';
import type { HeroSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { RichText } from '@/components/ui/RichText';
import { useParallax } from '@/components/ui/useParallax';
import { useIsWinter } from '@/lib/season';

export function Hero({ section }: { section: HeroSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const onlyText = c.herolayout === 'only-text';
  const layout = c.herolayout;
  const big = !winter && c.imgsummer.length ? c.imgsummer : c.img;
  const small = !winter && c.sideimgsummer.length ? c.sideimgsummer : c.sideimg;
  const bigRef = useRef<HTMLDivElement>(null);
  const smallRef = useRef<HTMLDivElement>(null);
  useParallax(bigRef, 1.15);
  useParallax(smallRef, 1.5);

  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_hero', `hero-${layout}`]
    .filter(Boolean).join(' ');

  // padding-top: rule 1 (.space-before-.), overridden per layout by rules 46/61
  // (hero-subpage) below it in source order — CSS cascade means the LAST rule
  // wins, so subpage's 61.1rem (not 50rem) is what actually applies. only-text
  // has no `.mask_hero.hero-only-text.space-before-` override at all (desktop
  // or mobile) — the one mobile rule that looks like it should be one,
  // `.mask_hero.hero-only-text.scpae-before-{padding-top:24.4rem}`, has a typo
  // ("scpae-before-") that never matches any real class name, so it's dead CSS
  // and the live site's only-text hero actually just falls through to the
  // shared base rule at both widths: 43rem desktop / 22.5rem mobile, same as
  // hero-default (confirmed against both docs/reference/css-clean/hero.css and
  // the raw docs/reference/css/css_Hero.DSP0mrCX.css, which agree). hero-subpage
  // mobile genuinely is 24.4rem via its own untypo'd override.
  const paddingTop =
    layout === 'default' ? 'pt-[43rem] max-lg:pt-[22.5rem]'
    : layout === 'subpage' ? 'pt-[61.1rem] max-lg:pt-[24.4rem]'
    : 'pt-[43rem] max-lg:pt-[22.5rem]'; // only-text: dead typo'd override, falls through to the shared base rule

  const imageWrapperCls = [
    onlyText
      ? 'grid h-fit [grid-column:9/span_4] [grid-row-start:1] gap-x-[var(--grid-gap)] grid-cols-4 max-lg:[grid-column:2/span_12] max-lg:[grid-row-start:2] max-lg:grid-cols-12'
      : 'grid [grid-column:6/span_8] [grid-row-start:1] gap-x-[var(--grid-gap)] grid-cols-8 max-lg:[grid-column:2/span_12] max-lg:[grid-row-start:1] max-lg:grid-cols-12',
    // hero-subpage's mobile .image-wrapper rule (Hero.css, inside the
    // max-width:1023px block) additionally sets grid-row-end:span 3 on top
    // of the shared :not(.hero-only-text) rule above; hero-default has no
    // such override, so this is subpage-only.
    layout === 'subpage' ? 'max-lg:[grid-row-end:span_3]' : '',
  ].filter(Boolean).join(' ');

  // Tailwind v4's scanner only picks up literal class strings, so the two
  // pt- values below must be two complete literal strings, not one string
  // built by interpolating the value into a shared template (which would
  // leave whichever branch's exact resulting string doesn't appear
  // elsewhere in the codebase uncompiled) -- same rule paddingTop above
  // already follows.
  const titleCls = onlyText
    ? '[grid-column:1/span_3] max-lg:[grid-column:1/span_12] max-lg:mt-[6rem]'
    // hero-subpage's mobile .title rule (Hero.css, .mask_hero.hero-subpage
    // .title inside the max-width:1023px block) sets `padding:4rem 0 0`,
    // which — appearing after the shared :not(.hero-only-text) .title rule
    // at the same specificity — wins and drops padding-top from 12rem to
    // 4rem for subpage only; hero-default keeps the shared rule's 12rem.
    : layout === 'subpage'
    ? 'flex items-end h-fit pb-[14rem] [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 origin-center [grid-column:1/span_1] max-lg:[grid-column:12/span_1] max-lg:h-fit max-lg:pb-0 max-lg:pt-[4rem]'
    : 'flex items-end h-fit pb-[14rem] [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 origin-center [grid-column:1/span_1] max-lg:[grid-column:12/span_1] max-lg:h-fit max-lg:pb-0 max-lg:pt-[12rem]';

  // max-lg:[grid-row-start:3] (was 2): bumped down one row to make room for
  // titleh2Cls's own row -- see that comment below for the mobile overlap
  // this and imageSmallCls's row were both shifted to fix.
  const titleimgCls = '[grid-column:9/span_5] pt-[6rem] max-lg:[grid-column:8/span_6] max-lg:[grid-row-start:3] max-lg:pt-[1.5rem]';

  // .mask_hero .titleh2 (Hero.css, inside the max-width:1023px block) sets
  // font-size:6.5rem/font-weight:300/letter-spacing:0/line-height:88% with no
  // layout qualifier on its selector, so it applies to every hero layout
  // (unless a layout-specific rule redeclares those same four properties,
  // which none of the subpage/only-text ones do) — carried into all three
  // branches below as max-lg:text-[6.5rem] max-lg:font-light
  // max-lg:tracking-normal max-lg:leading-[88%].
  //
  // default branch's mobile row: explicitly bumped to row 2 (max-lg:
  // [grid-row-start:2], replacing an inherited, unprefixed [grid-row-start:1]
  // that put it in the SAME row as imageWrapperCls's hero image below --
  // self-end plus a huge width-based margin-bottom (max-lg:mb-[calc(92%+2rem)])
  // was standing in for a real second row, nudging the title up to
  // approximately overlay just the top sliver of the image. That only held
  // together for a short one-line title; Leonaara's actual heading here
  // ("Bringing Purpose to Existence") wraps onto 4 lines at this width, so
  // the same trick buried most of the image under close-to-illegible
  // overlapping text instead. subpage's branch already sidesteps the same
  // problem correctly (max-lg:row-[2/span_1], its own row below the image),
  // so default now follows that same working pattern instead of the fragile
  // overlap hack, at the cost of no longer matching the original short-title
  // reference pixel-for-pixel at this breakpoint.
  const titleh2Cls =
    layout === 'default'
      ? // Two-value tablet/mobile split, not a single max-lg override: this
        // project's :root font-size is vw-relative in different bands
        // (2.7778vw below 768px, 1.502vw at 768-1023px, 0.5208vw at
        // >=1024px -- see globals.css), so the SAME rem value renders very
        // differently sized per band. max-lg:text-[6.5rem] (the eriro.at
        // reference's mobile size, restored here) covers the 768-1023px
        // tablet band, where it renders comfortably (widest line measured
        // 344px inside a 632px column at 800px, still a clean 3 lines) --
        // 6.5rem was only ever too big at narrower widths. max-md:text-
        // [4.5rem] then overrides it below 768px (Tailwind v4 orders max-md
        // after max-lg so the narrower breakpoint wins there), which is the
        // largest size confirmed (via mobile-iframe screenshot) to keep all
        // 3 <br>-separated segments ("Bringing" / "Purpose" / "to Existence")
        // each on a single visual line within the 10-column mobile grid slot
        // at 390px -- 6.5rem wrapped "to Existence" onto its own extra line
        // ("to" / "Existence") at that width.
        'self-center [grid-column:2/span_4] [grid-row-start:1] max-lg:self-start max-lg:text-[6.5rem] max-md:text-[4.5rem] max-lg:font-light max-lg:[grid-column:2/span_10] max-lg:[grid-row-start:2] max-lg:tracking-normal max-lg:leading-[88%] max-lg:mt-[3rem]'
      : layout === 'subpage'
      ? '[grid-column:2/span_4] [grid-row-start:2] mt-[-18rem] max-lg:self-end max-lg:[grid-column:2/span_10] max-lg:row-[2/span_1] max-lg:text-[6.5rem] max-lg:font-light max-lg:tracking-normal max-lg:leading-[88%] max-lg:mb-[calc(92%+2rem)] max-lg:mt-[9rem]'
      : 'self-center [grid-column:2/span_4] [grid-row-start:1] max-lg:self-center max-lg:[grid-column:2/span_12] max-lg:text-[6.5rem] max-lg:font-light max-lg:tracking-normal max-lg:leading-[88%]';

  // max-lg:[grid-row-start:4] (was 3): bumped down one row, same reason as
  // titleimgCls above.
  // w-[101.5%] (default layout only): the small accent image, sized 1.5%
  // wider than its grid cell per the user's explicit request -- Picture's
  // own img is h-auto w-full, so it just scales proportionally to whatever
  // width this wrapper resolves to.
  const imageSmallCls =
    layout === 'default'
      ? 'w-[101.5%] [grid-column:3/span_2] [grid-row-start:2] mt-[-3.5rem] max-lg:[grid-column:4/span_5] max-lg:[grid-row-start:4] max-lg:mt-[4.5rem]'
      : '[grid-column:3/span_2] [grid-row-start:1] mt-[-6rem] max-lg:[grid-column:4/span_6] max-lg:row-[1/span_1] max-lg:mb-0 max-lg:mt-[4.5rem]';

  // Only-text pages that also use titleh2 (Projects, the shared contact-form
  // hero) already put that heading in this same left slot (titleh2Cls below,
  // [grid-column:2/span_4] [grid-row-start:1]) -- rendering text there too
  // would collide with it. Pages with no titleh2 (About) have that slot free,
  // so text can sit there instead, sharing the image's row on the left the
  // way the image sits on the right (per the user's explicit "same row"
  // request). hasHeading picks between the two rendering paths below.
  const hasHeading = Boolean(c.titleh2);

  const textCls = '[grid-column:1/span_4] ml-[9rem] mt-[3rem] max-lg:[grid-column:1/span_12] max-lg:ml-[5.8rem] max-lg:mt-[1.5rem]';
  // Sibling-of-imageWrapperCls path (no titleh2): needs its own row-start to
  // land level with the image -- nested, it inherited row 1 implicitly from
  // imageWrapperCls itself; as a sibling in the outer grid it needs it stated.
  const textClsLeft = `${textCls} [grid-row-start:1]`;
  // Nested-in-imageWrapperCls path (titleh2 present): grid-column:1/span_4 is
  // relative to imageWrapperCls's own 4-column subgrid (which sits at
  // columns 9-12 of the page grid for only-text), so this lands on the
  // right, below the heading -- the site's original, unmodified behavior.
  const textClsNested = textCls;

  // .image-big's mobile align-self:flex-end (Hero.css, .mask_hero.hero-subpage
  // .image-big inside the max-width:1023px block) is subpage-only; hero-default's
  // mobile .image-big has no align-self override (defaults to stretch).
  const imageBigCls = `[grid-column:2/span_7] max-lg:[grid-column:1/span_12]${layout === 'subpage' ? ' max-lg:self-end' : ''}`;

  return (
    <div className={`${cls} ${paddingTop}`} {...{ uid: `c${section.id}` }}>
      <div className="grid-container">
        <div className={imageWrapperCls}>
          {c.title ? <h1 className={titleCls} dangerouslySetInnerHTML={{ __html: c.title }} /> : null}
          {c.text && onlyText && hasHeading ? <RichText className={textClsNested} html={c.text} /> : null}
          {!onlyText && big.map((img, i) => (
            <div className={imageBigCls} key={i} ref={i === 0 ? bigRef : undefined}>
              <Picture image={img} widthD={1014} heightD={780} widthM={340} heightM={260} lazy={false} />
            </div>
          ))}
        </div>
        {/* Sibling of imageWrapperCls, not nested inside it -- see textClsLeft's
            own comment for why nesting put this in the wrong column. */}
        {c.text && onlyText && !hasHeading ? <RichText className={textClsLeft} html={c.text} /> : null}
        {c.titleimg && layout === 'default' ? <p className={`h1 ${titleimgCls}`} dangerouslySetInnerHTML={{ __html: c.titleimg }} /> : null}
        {c.titleh2 ? <SplitWords as="h2" className={titleh2Cls} html={c.titleh2} /> : null}
        {!onlyText && small.map((img, i) => (
          <div className={imageSmallCls} key={i} ref={i === 0 ? smallRef : undefined}>
            <Picture image={img} widthD={272} heightD={360} widthM={136} heightM={180} lazy={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
