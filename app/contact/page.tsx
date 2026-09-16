// Cloned from eriro.at's /en/contact-and-arrival/ page design:
// hero, directions accordion, image, map, hero, contact form.
// The directions accordion + map are placeholders (no real Leonaara
// address yet), and the contact form is visual-only (no backend to submit
// to yet) -- both per the user's explicit choice when this page was built.
import type { Metadata } from 'next';
import { contact } from '@/content/en/contact';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { Img } from '@/components/sections/Img';

export const metadata: Metadata = metadataFor(contact);

export default function ContactPage() {
  const [hero1, accordions, img] = contact.columns.colPos0;
  if (hero1.type !== 'mask_hero') throw new Error('expected hero');
  if (accordions.type !== 'mask_accordions') throw new Error('expected accordions');
  if (img.type !== 'mask_img') throw new Error('expected img');
  return (
    <main>
      <BodyClass pageId={contact.id} layout="layout-0" />
      <Hero section={hero1} />
      <Img section={img} />
    </main>
  );
}
