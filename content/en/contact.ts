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
    title: 'Contact & Arrival - Leonaara',
    description: 'Get in touch with Leonaara.',
    ogTitle: 'Contact & Arrival',
    ogDescription: 'Get in touch with Leonaara.',
    ogImage: null,
    twitterTitle: 'Contact & Arrival',
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
          herolayout: 'subpage', title: 'GET IN TOUCH', titleh2: 'Contact &<br>\r\nArrival', titleimg: '',
          text: '<p>Have a question about a project, or want to arrange a visit? Reach out below and our team will get back to you.</p>',
          img: [{ src: '/images/eriro-ehrwald-alpine-hide-luxus-natur-01.jpg', width: 1200, height: 950, mime: 'image/jpeg', title: null, alt: '', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }],
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
        content: { img: [{ src: '/images/eriro-ehrwald-alpine-hide-luxus-natur-02.jpg', width: 1200, height: 950, mime: 'image/jpeg', title: null, alt: '', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgsummer: [] },
      },
      { id: 9204, type: 'mask_maps', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { title: '' } },
      {
        id: 9205, type: 'mask_hero', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
        content: {
          herolayout: 'only-text', title: '', titleh2: '<span style=\'font-size:0.4em;\'>WE’D LOVE TO HEAR FROM YOU</span><br>\r\nLet’s Connect', titleimg: '',
          text: '<p>Your ideal lifestyle begins with a conversation. Reach out to us for project details, pricing, and personalized assistance.</p>',
          img: [], sideimg: [], imgsummer: [], sideimgsummer: [],
        },
      },
      { id: 9206, type: 'powermail_pi1', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { title: '', text: '' } },
    ],
  },
};
