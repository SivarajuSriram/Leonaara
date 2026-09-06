import type { Metadata } from 'next';
import { privacy } from '@/content/en/privacy';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { FooterPageText } from '@/components/sections/FooterPageText';
import { IncludePage } from '@/components/sections/IncludePage';

export const metadata: Metadata = metadataFor(privacy);

export default function PrivacyPage() {
  const [first, include, last] = privacy.columns.colPos0;
  if (first.type !== 'mask_footerpagetext') throw new Error('expected footerpagetext');
  if (include.type !== 'hanthaincludepage_includepage') throw new Error('expected includepage');
  if (last.type !== 'mask_footerpagetext') throw new Error('expected footerpagetext');
  return (
    <main>
      <BodyClass pageId={privacy.id} layout="layout-0" />
      <FooterPageText section={first} first />
      <IncludePage section={include} />
      <FooterPageText section={last} />
    </main>
  );
}
