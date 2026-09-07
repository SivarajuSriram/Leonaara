// Real section order per Step 1's extraction script ORDER printout for voucher
// (verified against docs/reference/pages/en__voucher.json): hero, widget_voucher, img, teaserslider
import type { Metadata } from 'next';
import { voucher } from '@/content/en/voucher';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { VoucherWidget } from '@/components/sections/VoucherWidget';
import { Img } from '@/components/sections/Img';
import { TeaserSlider } from '@/components/sections/TeaserSlider';

export const metadata: Metadata = metadataFor(voucher);

export default function VoucherPage() {
  const [hero, widget, img, teaserslider] = voucher.columns.colPos0;
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  if (widget.type !== 'mask_widget_voucher') throw new Error('expected widget_voucher');
  if (img.type !== 'mask_img') throw new Error('expected img');
  if (teaserslider.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
  return (
    <main>
      <BodyClass pageId={voucher.id} layout="layout-0" />
      <Hero section={hero} />
      <VoucherWidget section={widget} />
      <Img section={img} />
      <TeaserSlider section={teaserslider} />
    </main>
  );
}
