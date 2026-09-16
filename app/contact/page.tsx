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
import { Accordions } from '@/components/sections/Accordions';
import { Img } from '@/components/sections/Img';
import { Maps } from '@/components/sections/Maps';
import { ContactForm } from '@/components/sections/ContactForm';

export const metadata: Metadata = metadataFor(contact);

export default function ContactPage() {
  const [hero1, accordions, img, maps, hero2, form] = contact.columns.colPos0;
  if (hero1.type !== 'mask_hero') throw new Error('expected hero');
  if (accordions.type !== 'mask_accordions') throw new Error('expected accordions');
  if (img.type !== 'mask_img') throw new Error('expected img');
  if (maps.type !== 'mask_maps') throw new Error('expected maps');
  if (hero2.type !== 'mask_hero') throw new Error('expected hero');
  if (form.type !== 'powermail_pi1') throw new Error('expected form');
  return (
    <main>
      <BodyClass pageId={contact.id} layout="layout-0" />
      <Hero section={hero1} />
      <Accordions section={accordions} />
      <Img section={img} />
      <Maps section={maps} />
      <Hero section={hero2} />
      <ContactForm section={form} />
    </main>
  );
}
