import type { ListSection } from '@/lib/content';
import { RichText } from '@/components/ui/RichText';
import { SplitWords } from '@/components/ui/SplitWords';

// mask_list .content{grid-column-end:span 4;grid-column-start:9} + mobile{grid-column-end:span 9;grid-column-start:3}
const contentCls = 'content col-start-9 col-span-4 max-lg:col-start-3 max-lg:col-span-9';
// .content .title{margin-bottom:3rem} + mobile{margin-bottom:1.5rem}
const titleCls = 'title mb-[3rem] max-lg:mb-[1.5rem]';
// .content .text{margin-bottom:12rem;transform:translate(9rem)} + mobile{margin-bottom:4rem;transform:translate(5.8rem)}
// (mobile also: .content .text,.content .title:last-child{margin-bottom:4rem} -- covered since text is always last here)
const textCls = 'text mb-[12rem] translate-x-[9rem] max-lg:mb-[4rem] max-lg:translate-x-[5.8rem]';
// .list-wrapper{grid-column-end:span 12;grid-column-start:2}
const wrapperCls = 'list-wrapper col-start-2 col-span-12';
// .list-item{border-top:2px solid #e4e0db;padding-top:3rem} + :not(:last-child){padding-bottom:12rem} (mobile: 4.5rem)
const itemClsBase = 'list-item grid grid-cols-12 gap-x-(--grid-gap) border-t-2 border-[#e4e0db] pt-[3rem]';
const itemClsNonLast = '[&:not(:last-child)]:pb-[12rem] max-lg:[&:not(:last-child)]:pb-[4.5rem]';
const itemClsLast = 'last:pb-0';
// .list-title (h4 style){font-size:2rem;font-weight:300;grid-column-end:span 3;grid-column-start:2;
// letter-spacing:.08em;line-height:125%;text-transform:uppercase} + mobile{font-size:1.3rem;grid-column-end:span 12;
// grid-column-start:2;letter-spacing:.05em;line-height:131%}
const titleItemCls = 'list-title col-start-2 col-span-3 text-[2rem] font-light tracking-[.08em] leading-[125%] uppercase max-lg:col-span-12 max-lg:text-[1.3rem] max-lg:tracking-[.05em] max-lg:leading-[131%]';
// .list-text{grid-column-end:span 5;grid-column-start:5;transform:translate(9rem)} + mobile{grid-column-end:span 10;
// grid-column-start:4;margin-top:2rem;transform:translate(0)}
const textItemCls = 'list-text col-start-5 col-span-5 translate-x-[9rem] max-lg:col-start-4 max-lg:col-span-10 max-lg:mt-[2rem] max-lg:translate-x-0';

export function List({ section }: { section: ListSection }) {
  const c = section.content;
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_list']
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className="grid-container">
        <div className={contentCls}>
          {c.title ? <SplitWords as="h4" className={titleCls} html={c.title} /> : null}
          {c.text ? <RichText className={textCls} html={c.text} /> : null}
        </div>
        <div className={wrapperCls}>
          {c.listitems.map((item, index, arr) => {
            const isLast = index === arr.length - 1;
            const itemClasses = [itemClsBase, isLast ? itemClsLast : itemClsNonLast].filter(Boolean).join(' ');
            return (
              <div className={itemClasses} key={item.uid}>
                <h4 className={titleItemCls}>{item.title}</h4>
                <RichText className={textItemCls} html={item.text} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
