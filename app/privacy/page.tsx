import type { Metadata } from 'next';
import { privacy } from '@/content/en/privacy';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { FooterPageText } from '@/components/sections/FooterPageText';
import { IncludePage } from '@/components/sections/IncludePage';

export const metadata: Metadata = metadataFor(privacy);

export default function PrivacyPage() {
  // Was [first, include, last]: the trailing `last` section was an ADDITIVE+
  // (a hotel-marketing vendor eriro used) promotional/legal block, unrelated
  // to Leonaara and full of eriro-vendor links -- removed from the content
  // itself (content/en/privacy.ts) rather than rendered-then-hidden here, per
  // the user's "remove all external links that point to eriro" request.
  const [first, include] = privacy.columns.colPos0;
  if (first.type !== 'mask_footerpagetext') throw new Error('expected footerpagetext');
  if (include.type !== 'hanthaincludepage_includepage') throw new Error('expected includepage');
  return (
    <main>
      <BodyClass pageId={privacy.id} layout="layout-0" />
      <FooterPageText section={first} first />
      <IncludePage section={include} />
    </main>
  );
}
