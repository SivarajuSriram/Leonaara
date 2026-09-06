'use client';
import { useRef, useState } from 'react';
import type { AccordionsSection } from '@/lib/content';
import { RichText } from '@/components/ui/RichText';
import { SplitWords } from '@/components/ui/SplitWords';
import { BigLink } from '@/components/ui/BigLink';
import { gsap, useGSAP } from '@/lib/gsap';
import { ICON_VARIANTS, OPEN_ICON } from '@/lib/accordionIcons';

// mask_accordions .content{grid-column-end:span 4;grid-column-start:6} + mobile{grid-column-end:span 9;grid-column-start:4}
const contentCls = 'content col-start-6 col-span-4 max-lg:col-start-4 max-lg:col-span-9';
// .title{margin-bottom:3rem}+.title:last-child{margin-bottom:9rem} + mobile{.title{margin-bottom:1.5rem}, .title:last-child/.text{margin-bottom:4rem}}
const titleCls = 'title mb-[3rem] last:mb-[9rem] max-lg:mb-[1.5rem] max-lg:last:mb-[4rem]';
// .text{margin-bottom:12rem;transform:translate(9rem)} + mobile{margin-bottom:4rem;transform:translate(5.8rem)}
const textCls = 'text mb-[12rem] translate-x-[9rem] max-lg:mb-[4rem] max-lg:translate-x-[5.8rem]';
// .accordion-wrapper{grid-column-end:span 12;grid-column-start:2}
const wrapperCls = 'accordion-wrapper col-start-2 col-span-12';
// .accordion{margin-bottom:-2px;overflow:hidden}
const accordionCls = 'accordion -mb-[2px] overflow-hidden';
// .accordion-header{border-top:2px solid #e4e0db;cursor:pointer;display:flex;grid-column-end:span 12;
// grid-column-start:1;justify-content:space-between;justify-self:flex-end;max-width:66.66%;
// padding:3rem 0;width:100%} + mobile{align-items:center;flex-wrap:wrap;max-width:83.33%;padding:2rem 0}
const headerCls = 'accordion-header col-start-1 col-span-12 flex justify-between justify-self-end w-full cursor-pointer border-t-2 border-[#e4e0db] pt-[3rem] pb-[3rem] max-lg:items-center max-lg:flex-wrap max-lg:pt-[2rem] max-lg:pb-[2rem]';
// .accordion-header h4{transform:translate(9rem);transition:all .5s} + hover{transform:translate(7.5rem)}
// + .accordion.open h4{transform:translate(14.5rem)} + .accordion.open:hover h4{transform:translate(12.5rem)}
// (a DISTINCT rule from the hover-only shift, easy to miss -- verified against accordions.css:98-103)
// + mobile: h4/:hover h4/.open h4/.open:hover h4 all collapse to translate(0) (accordions.css:154,178)
// + mobile h4{margin-top:.5rem;width:100%}
// Driven by a plain className swap (not GSAP) so the existing CSS `transition-transform duration-500`
// handles the .5s animation AND real :hover still works on top of it -- GSAP inline styles would
// permanently override the CSS :hover pseudo-class the moment they touch `transform` at all.
function headerTitleCls(isOpen: boolean) {
  return [
    'transition-transform duration-500 max-lg:mt-[.5rem] max-lg:w-full max-lg:translate-x-0 max-lg:hover:translate-x-0',
    isOpen ? 'translate-x-[14.5rem] hover:translate-x-[12.5rem]' : 'translate-x-[9rem] hover:translate-x-[7.5rem]',
  ].join(' ');
}
const sideCls = 'accordion-side flex';
// .accordion-icon{height:2rem;margin-left:12rem;margin-right:.5rem;width:2rem} + mobile{height:1.2rem;margin-left:1rem;margin-right:0;width:1.2rem}
const iconCls = 'accordion-icon h-[2rem] w-[2rem] ml-[12rem] mr-[.5rem] max-lg:h-[1.2rem] max-lg:w-[1.2rem] max-lg:ml-[1rem] max-lg:mr-0';
// .accordion-body{grid-column-end:span 8;grid-column-start:5;height:0;justify-self:flex-end;overflow:hidden;
// width:100%} + mobile{grid-column-end:span 12;grid-column-start:1}
const bodyCls = 'accordion-body col-start-5 col-span-8 h-0 overflow-hidden justify-self-end w-full max-lg:col-start-1 max-lg:col-span-12';
// .accordion-content{display:grid;padding-bottom:12rem;grid-column-gap:var(--grid-gap);grid-template-columns:repeat(8,1fr)}
// + mobile{padding-bottom:4.5rem;grid-template-columns:repeat(12,1fr)}
const contentGridCls = 'accordion-content grid grid-cols-8 gap-x-(--grid-gap) pb-[12rem] max-lg:grid-cols-12 max-lg:pb-[4.5rem]';
// .accordion-text{grid-column-end:span 6;grid-column-start:1;transform:translate(9rem)}
// + mobile{grid-column-end:span 9;grid-column-start:3;transform:translate(0)}
// .accordion-text ul{margin-top:0} .accordion-text h4{margin-bottom:1.5rem} .accordion-text p{margin-bottom:2rem;min-height:4.5rem}
// .accordion-text :where(ul)+p{margin-top:0}
const accordionTextCls = 'accordion-text col-start-1 col-span-6 translate-x-[9rem] max-lg:col-start-3 max-lg:col-span-9 max-lg:translate-x-0 [&_ul]:mt-0 [&_h4]:mb-[1.5rem] [&_p]:mb-[2rem] [&_p]:min-h-[4.5rem]';
// a.ht-biglink{grid-column-end:span 6;grid-column-start:1;justify-self:flex-end;margin-top:12rem}
const biglinkCls = 'col-start-1 col-span-6 justify-self-end mt-[12rem]';
// .accordion-bottom-hr{border-bottom:2px solid #e4e0db;grid-column-end:span 12;grid-column-start:1;
// justify-self:flex-end;max-width:66.66%;width:100%} + mobile max-width:83.33%
const hrCls = 'accordion-bottom-hr col-start-1 col-span-12 justify-self-end w-full border-b-2 border-[#e4e0db]';

export function Accordions({ section }: { section: AccordionsSection }) {
  const c = section.content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const closedMaxWidth = window.innerWidth < 1024 ? '83.33%' : '66.66%';
    wrap.querySelectorAll<HTMLElement>('.accordion').forEach((el, i) => {
      const isOpen = i === openIndex;
      const body = el.querySelector<HTMLElement>('.accordion-body');
      const header = el.querySelector<HTMLElement>('.accordion-header');
      const hr = el.querySelector<HTMLElement>('.accordion-bottom-hr');
      const a1 = el.querySelector('.a1');
      const a2 = el.querySelector('.a2');
      const variant = ICON_VARIANTS[i % ICON_VARIANTS.length];
      gsap.to(body, { height: isOpen ? 'auto' : 0, duration: 0.5 });
      gsap.to(header, { maxWidth: isOpen ? '100%' : closedMaxWidth, paddingBottom: isOpen ? '4.5rem' : (window.innerWidth < 1024 ? '2rem' : '3rem'), duration: 0.5 });
      gsap.to(hr, { maxWidth: isOpen ? '100%' : closedMaxWidth, duration: 0.5 });
      gsap.to(a1, { duration: isOpen ? 0.2 : 0.3, morphSVG: isOpen ? OPEN_ICON.a1 : variant.a1 });
      gsap.to(a2, { duration: isOpen ? 0.2 : 0.3, morphSVG: isOpen ? OPEN_ICON.a2 : variant.a2 });
    });
  }, { dependencies: [openIndex], scope: wrapRef });

  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_accordions']
    .filter(Boolean).join(' ');

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className="grid-container">
        <div className={contentCls}>
          {c.title ? <SplitWords as="h4" className={titleCls} html={c.title} /> : null}
          {c.text ? <RichText className={textCls} html={c.text} /> : null}
        </div>
        <div className={wrapperCls} ref={wrapRef}>
          {c.accordion.map((item, i) => (
            <div className={`${accordionCls}${i === openIndex ? ' open' : ''}`} key={item.uid}>
              <div className={headerCls} onClick={() => setOpenIndex(i === openIndex ? null : i)}>
                <h4 className={headerTitleCls(i === openIndex)}>{item.title}</h4>
                <div className={sideCls}>
                  {item.info ? <span className="h4">{item.info}</span> : null}
                  <svg viewBox="0 0 20 20" fill="none" className={iconCls}>
                    <path className="a1" fill="#211D1D" d={ICON_VARIANTS[i % ICON_VARIANTS.length].a1} />
                    <path className="a2" fill="#211D1D" d={ICON_VARIANTS[i % ICON_VARIANTS.length].a2} />
                  </svg>
                </div>
              </div>
              <div className={bodyCls}>
                <div className={contentGridCls}>
                  <RichText className={accordionTextCls} html={item.text} />
                  {item.link !== '' ? <BigLink href={item.link.href} target={item.link.target ?? undefined} className={biglinkCls}>{item.linktext}</BigLink> : null}
                </div>
                <div className={hrCls} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
