import type { FooterPageTextSection } from '@/lib/content';
import { RichText } from '@/components/ui/RichText';

// mask_footerpagetext .text,h1{grid-column-end:span 12;grid-column-start:2}
const contentCls = 'legal-content col-start-2 col-span-12';

// layout-8's `main>div:first-child{margin-top:0;padding-top:45rem}` (mobile
// 25rem) is a DOM-position rule (first section on the page), unrelated to the
// space-before- scale every other section uses -- expressed here as an
// explicit prop from the page composing this component, since only the page
// knows which of its sections is first.
export function FooterPageText({ section, first }: { section: FooterPageTextSection; first?: boolean }) {
  const c = section.content;
  const cls = [
    section.appearance.layout,
    `space-before-${section.appearance.spaceBefore}`,
    'mask',
    'mask_footerpagetext',
    first ? 'pt-[45rem] max-lg:pt-[25rem]' : '',
  ].filter(Boolean).join(' ');
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className="grid-container">
        {c.title ? <RichText as="h1" className={contentCls} html={c.title} /> : null}
        {c.text ? <RichText className={contentCls} html={c.text} /> : null}
      </div>
    </div>
  );
}
