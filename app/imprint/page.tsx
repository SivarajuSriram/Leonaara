import type { Metadata } from 'next';
import { imprint } from '@/content/en/imprint';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { FooterPageText } from '@/components/sections/FooterPageText';

export const metadata: Metadata = metadataFor(imprint);

export default function ImprintPage() {
  const section = imprint.columns.colPos0[0];
  if (section.type !== 'mask_footerpagetext') throw new Error('expected footerpagetext');
  return (
    <main>
      <BodyClass pageId={imprint.id} layout="layout-0" />
      <FooterPageText section={section} first />
    </main>
  );
}
