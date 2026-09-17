import type { PageContent } from '@/lib/content';

// Cloned from eriro.at's /en/contact-and-arrival/ page design (hero,
// directions accordion, map, second hero, contact form) at the user's
// request. Per the user's own call: the directions accordion and map are
// left as placeholders (no real Leonaara address/location yet), and the
// contact form is visual-only (no backend to submit to yet).
export const contact: PageContent = {
  id: 9200,
  slug: '/contact/',
  backendLayout: 'defaultLayout',
  meta: {
    title: 'Contact - Leonaara',
    description: 'Get in touch with Leonaara.',
    ogTitle: 'Contact',
    ogDescription: 'Get in touch with Leonaara.',
    ogImage: null,
    twitterTitle: 'Contact',
    twitterDescription: 'Get in touch with Leonaara.',
    twitterImage: null,
    twitterCard: 'summary',
    robots: { noIndex: false, noFollow: false },
  },
  columns: {
    colPos0: [
      {
        id: 9201, type: 'mask_hero', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
        content: {
          herolayout: 'subpage', title: 'GET IN TOUCH', titleh2: 'Contact ', titleimg: '',
          text: '<p>Have a question about a project, or want to arrange a visit? Reach out below and our team will get back to you.</p>',
          img: [{ src: '/images/leonaara-about-courtyard.jpg', width: 3200, height: 1793, mime: 'image/jpeg', title: null, alt: 'Sunlit courtyard with an open wooden shutter window on a whitewashed wall, framed by tree branches and a rustic outdoor dining table', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }],
          sideimg: [], imgsummer: [], sideimgsummer: [],
        },
      },
      {
        id: 9202, type: 'mask_accordions', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
        content: {
          title: 'Getting there', text: '',
          accordion: [
            { uid: '9202-1', title: 'Location', info: '', text: '<p>Placeholder — add directions to the site once an address is confirmed.</p>', linktext: '', link: '' },
            { uid: '9202-2', title: 'By car', info: '', text: '<p>Placeholder — add driving directions here.</p>', linktext: '', link: '' },
            { uid: '9202-3', title: 'By public transport', info: '', text: '<p>Placeholder — add public transport directions here.</p>', linktext: '', link: '' },
          ],
        },
      },
      {
        id: 9203, type: 'mask_img', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
        content: { img: [{ src: '/images/leonaara-about-courtyard.jpg', width: 3200, height: 1793, mime: 'image/jpeg', title: null, alt: 'Sunlit courtyard with an open wooden shutter window on a whitewashed wall, framed by tree branches and a rustic outdoor dining table', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgsummer: [] },
      },
    ],
  },
};
