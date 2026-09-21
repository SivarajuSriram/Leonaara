import type { NewsletterWidgetSection } from '@/lib/content';

// mask_widget_newsletter .aa-newsletter-widget{grid-column-end:span 6;grid-column-start:6}
// (spec §9.20: not loaded, user decision -- literal empty div at the original id, no script injected.)
const widgetCls = 'aa-newsletter-widget col-start-6 col-span-6';

export function NewsletterWidget({ section }: { section: NewsletterWidgetSection }) {
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_widget_newsletter', 'grid-container']
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className={widgetCls}>
        <div id="additive-newsletter-664458cf61093" />
      </div>
    </div>
  );
}
