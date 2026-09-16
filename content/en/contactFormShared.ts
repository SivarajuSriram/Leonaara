import type { HeroSection } from '@/lib/content';

// The "WE'D LOVE TO HEAR FROM YOU / Let's Connect" heading + intro copy that
// sits above the contact form everywhere the form appears: on the contact
// page's own content (contact.ts) and above the site-wide ContactForm
// mounted once in the root layout (see app/layout.tsx) for every other page.
export const contactFormHero: HeroSection = {
  id: 9205,
  type: 'mask_hero',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    herolayout: 'only-text', title: '', titleh2: '<span style=\'font-size:0.3em;\'>WE’D LOVE TO HEAR FROM YOU</span><br>\r\n<span style=\'font-size:0.75em;\'>Let’s Connect</span>', titleimg: '',
    text: '<p>Your ideal lifestyle begins with a conversation. Reach out to us for project details, pricing, and personalized assistance.</p>',
    img: [], sideimg: [], imgsummer: [], sideimgsummer: [],
  },
};
