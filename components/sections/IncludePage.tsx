import type { IncludePageSection } from '@/lib/content';
import { RichText } from '@/components/ui/RichText';

// The original's actual rendered class for this TYPO3 plugin type is the
// shortened `mask_hanthainclude`, not the full `hanthaincludepage_includepage`
// type string (confirmed in docs/reference/css-clean/footerpagetext.css) --
// kept verbatim for selector fidelity even though it doesn't match the type name.
// mask_hanthainclude{padding-top:0} + >.t3-ce-rte{grid-column-end:span 12;
// grid-column-start:2;text-align:left}
const contentCls = 't3-ce-rte legal-content col-start-2 col-span-12 text-left';

export function IncludePage({ section }: { section: IncludePageSection }) {
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_hanthainclude', 'pt-0']
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className="grid-container">
        <RichText className={contentCls} html={section.content.html} />
      </div>
    </div>
  );
}
