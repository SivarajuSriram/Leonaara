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

export const metadata: Metadata = metadataFor(contact);

export default function ContactPage() {
  // `img` (the second full-bleed shutter-window photo, previously rendered
  // right after the hero) is destructured and type-checked but no longer
  // rendered -- removed per the user's explicit "remove the second
  // full-bleed image on this page" request. The hero's own background photo
  // is the page's only full-bleed image now. Kept in the destructuring so
  // this array's positions stay in sync with contact.columns.colPos0 (same
  // approach as About's removed mask_img -- see app/about/page.tsx).
  const [hero1, accordions, img] = contact.columns.colPos0;
  if (hero1.type !== 'mask_hero') throw new Error('expected hero');
  if (accordions.type !== 'mask_accordions') throw new Error('expected accordions');
  if (img.type !== 'mask_img') throw new Error('expected img');
  return (
    <main>
      <BodyClass pageId={contact.id} layout="layout-0" />
      <Hero section={hero1} />
    </main>
  );
}
