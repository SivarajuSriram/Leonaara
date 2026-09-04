import type { Metadata } from 'next';
import { home } from '@/content/en/home';
import { metadataFor } from '@/lib/pages';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { BodyClass } from '@/components/layout/BodyClass';

export const metadata: Metadata = metadataFor(home);

export default function HomePage() {
  return (
    <main>
      <BodyClass pageId={home.id} layout="layout-0" />
      <SectionRenderer sections={home.columns.colPos0} />
    </main>
  );
}
