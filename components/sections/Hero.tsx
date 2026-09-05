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
  // wins, so subpage's 61.1rem (not 50rem) is what actually applies; mobile
  // (max-width:1023px) always uses 22.5rem regardless of layout except
  // hero-subpage (24.4rem) and hero-only-text (24.4rem, "scpae-before-" typo
  // in the original never matched anything — dead rule, correctly omitted here).
  const paddingTop =
    layout === 'default' ? 'pt-[43rem] max-lg:pt-[22.5rem]'
    : layout === 'subpage' ? 'pt-[61.1rem] max-lg:pt-[24.4rem]'
    : 'max-lg:pt-[24.4rem]'; // only-text has no explicit desktop padding-top rule in Hero.css

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

  const titleCls = onlyText
    ? '[grid-column:1/span_3] max-lg:[grid-column:1/span_12] max-lg:mt-[6rem]'
    // hero-subpage's mobile .title rule (Hero.css, .mask_hero.hero-subpage
    // .title inside the max-width:1023px block) sets `padding:4rem 0 0`,
    // which — appearing after the shared :not(.hero-only-text) .title rule
    // at the same specificity — wins and drops padding-top from 12rem to
    // 4rem for subpage only; hero-default keeps the shared rule's 12rem.
    : `flex items-end h-fit pb-[14rem] [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 origin-center [grid-column:1/span_1] max-lg:[grid-column:12/span_1] max-lg:h-fit max-lg:pb-0 max-lg:pt-[${layout === 'subpage' ? '4' : '12'}rem]`;

  const titleimgCls = '[grid-column:9/span_5] pt-[6rem] max-lg:[grid-column:8/span_6] max-lg:[grid-row-start:2] max-lg:pt-[1.5rem]';

  // .mask_hero .titleh2 (Hero.css, inside the max-width:1023px block) sets
  // font-size:6.5rem/font-weight:300/letter-spacing:0/line-height:88% with no
  // layout qualifier on its selector, so it applies to every hero layout
  // (unless a layout-specific rule redeclares those same four properties,
  // which none of the subpage/only-text ones do) — carried into all three
  // branches below as max-lg:text-[6.5rem] max-lg:font-light
  // max-lg:tracking-normal max-lg:leading-[88%].
  const titleh2Cls =
    layout === 'default'
      ? 'self-center [grid-column:2/span_4] [grid-row-start:1] max-lg:self-end max-lg:text-[6.5rem] max-lg:font-light max-lg:[grid-column:2/span_10] max-lg:tracking-normal max-lg:leading-[88%] max-lg:mb-[calc(92%+2rem)]'
      : layout === 'subpage'
      ? '[grid-column:2/span_4] [grid-row-start:2] mt-[-18rem] max-lg:self-end max-lg:[grid-column:2/span_10] max-lg:row-[2/span_1] max-lg:text-[6.5rem] max-lg:font-light max-lg:tracking-normal max-lg:leading-[88%] max-lg:mb-[calc(92%+2rem)] max-lg:mt-[9rem]'
      : 'self-center [grid-column:2/span_4] [grid-row-start:1] max-lg:self-center max-lg:[grid-column:2/span_12] max-lg:text-[6.5rem] max-lg:font-light max-lg:tracking-normal max-lg:leading-[88%]';

  const imageSmallCls =
    layout === 'default'
      ? '[grid-column:3/span_2] [grid-row-start:2] mt-[-3.5rem] max-lg:[grid-column:4/span_5] max-lg:[grid-row-start:3] max-lg:mt-[4.5rem]'
      : '[grid-column:3/span_2] [grid-row-start:1] mt-[-6rem] max-lg:[grid-column:4/span_6] max-lg:row-[1/span_1] max-lg:mb-0 max-lg:mt-[4.5rem]';

  const textCls = '[grid-column:1/span_4] ml-[9rem] mt-[3rem] max-lg:[grid-column:1/span_12] max-lg:ml-[5.8rem] max-lg:mt-[1.5rem]';

  // .image-big's mobile align-self:flex-end (Hero.css, .mask_hero.hero-subpage
  // .image-big inside the max-width:1023px block) is subpage-only; hero-default's
  // mobile .image-big has no align-self override (defaults to stretch).
  const imageBigCls = `[grid-column:2/span_7] max-lg:[grid-column:1/span_12]${layout === 'subpage' ? ' max-lg:self-end' : ''}`;

  return (
    <div className={`${cls} ${paddingTop}`} {...{ uid: `c${section.id}` }}>
      <div className="grid-container">
        <div className={imageWrapperCls}>
          {c.title ? <h1 className={titleCls} dangerouslySetInnerHTML={{ __html: c.title }} /> : null}
          {c.text && onlyText ? <RichText className={textCls} html={c.text} /> : null}
          {!onlyText && big.map((img, i) => (
            <div className={imageBigCls} key={i} ref={i === 0 ? bigRef : undefined}>
              <Picture image={img} widthD={1014} heightD={780} widthM={340} heightM={260} lazy={false} />
            </div>
          ))}
        </div>
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
