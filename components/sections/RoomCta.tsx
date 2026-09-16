import type { RoomCtaSection } from '@/lib/content';
import { BigLink } from '@/components/ui/BigLink';
import { site } from '@/content/site';

// roomcta.css: .buttons-wrapper{grid-column-end:span 5;grid-column-start:9}
// + mobile{grid-column-end:span 8;grid-column-start:6}
const wrapperCls = 'buttons-wrapper col-start-9 col-span-5 max-lg:col-start-6 max-lg:col-span-8';
// .ht-biglink{display:block;margin-bottom:2rem;width:fit-content} + :last-child{margin-bottom:0}
const linkCls = 'block w-fit mb-[2rem] last:mb-0';

export function RoomCta({ section }: { section: RoomCtaSection }) {
  const { room } = section.content;
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_roomcta', 'grid-container']
    .filter(Boolean).join(' ');

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className={wrapperCls}>
        <BigLink className={linkCls} href={`${site.pageLinks.request}?room=${room.asacode}`}>{site.t.request}</BigLink>
        {/* site.bookingLink (a hotel booking-engine URL) no longer exists --
            there's no live booking system for a real-estate project, so this
            now points at Contact instead of a dead/nonexistent link. */}
        <BigLink className={linkCls} href={`${site.pageLinks.contact}?room=${room.bookingcode}`}>{site.t.book}</BigLink>
      </div>
    </div>
  );
}
