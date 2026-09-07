import type { VoucherWidgetSection } from '@/lib/content';

// mask_widget_voucher .aa-voucher-widget{grid-column-end:span 12;grid-column-start:2}
// (spec §9.20: not loaded, user decision -- literal empty div at the original id, no script injected.)
const widgetCls = 'aa-voucher-widget col-start-2 col-span-12';

export function VoucherWidget({ section }: { section: VoucherWidgetSection }) {
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_widget_voucher', 'grid-container']
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className={widgetCls}>
        <div id="internetseite" />
      </div>
    </div>
  );
}
