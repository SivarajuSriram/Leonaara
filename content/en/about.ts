import type { PageContent } from '@/lib/content';

export const about: PageContent = {
  id: 9058,
  slug: '/about/',
  backendLayout: 'defaultLayout',
  meta: {
    title: 'About Leonaara - Our Founders & Philosophy',
    description: 'Meet the founders behind Leonaara, Ravikanth Reddy Busam, Rajashekhar Reddy, Avinash Reddy and Srinivas Reddy, and the philosophy of trust, quality and lasting value guiding every project.',
    ogTitle: 'About Leonaara',
    ogDescription: 'Meet the founders behind Leonaara, Ravikanth Reddy Busam, Rajashekhar Reddy, Avinash Reddy and Srinivas Reddy, and the philosophy of trust, quality and lasting value guiding every project.',
    ogImage: null,
    twitterTitle: 'About Leonaara',
    twitterDescription: 'Meet the founders behind Leonaara, Ravikanth Reddy Busam, Rajashekhar Reddy, Avinash Reddy and Srinivas Reddy, and the philosophy of trust, quality and lasting value guiding every project.',
    twitterImage: null,
    twitterCard: 'summary',
    robots: { noIndex: false, noFollow: false },
  },
  columns: {
    colPos0: [
      // text: placeholder lorem ipsum per the user's request, filling the
      // hero's left column (Hero.tsx's onlyText textCls, grid-column:1/span_4)
      // -- the mountain photo visible to the right at this scroll position
      // belongs to the next section down (id 287's imgright), not this hero,
      // so no image/layout change was needed here.
      { id: 235, type: 'mask_hero', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { herolayout: 'only-text', title: '', titleh2: '', titleimg: '', text: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Leonaara sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>', img: [], sideimg: [], imgsummer: [], sideimgsummer: [] } },
      // 1 of 4 founders -- one image per person, alternating sides (left, right, left, right)
      // per the user's explicit request (was: the same courtyard photo duplicated into both
      // imgleft and imgright on every founder).
      { id: 287, type: 'mask_imgtext', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { title: '<i>Ravikanth Reddy Busam</i>', text: '<p><b>(Founder & CEO)</b></p><p>Some build structures. A rare few build belief. Ravikanth Reddy Busam belongs to the latter. With 25+ years across finance, technology, and real estate, his journey has been guided by one belief, lasting value is built on integrity.<br/>From founding a global technology venture in 2008 to shaping 1M+ sq. ft. of development, serving 560+ homeowners, and creating ₹1000+ crores in value, his work reflects discipline, precision, and trust.</p>', imgleft: [{ src: '/images/leonaara-founder-ravikanth-reddy-busam.webp', width: 3512, height: 2732, mime: 'image/webp', title: null, alt: 'Portrait of Ravikanth Reddy Busam, Founder & CEO of Leonaara, smiling in glasses and a navy polo against a grey wall', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [], imgleftsummer: [{ src: '/images/leonaara-founder-ravikanth-reddy-busam.webp', width: 3512, height: 2732, mime: 'image/webp', title: null, alt: 'Portrait of Ravikanth Reddy Busam, Founder & CEO of Leonaara, smiling in glasses and a navy polo against a grey wall', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgrightsummer: [] } },
      // 2 of 4
      { id: 290, type: 'mask_imgtext', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { title: '<i>Rajashekhar Reddy</i>', text: '<p><b>(Executive Director - Engineering)</b></p><p>With a strong foundation in engineering and execution, Rajashekhar Reddy brings strategic expertise and technical excellence to Leonaara as Executive Director (Engineering).</p>', imgleft: [], imgright: [{ src: '/images/leonaara-founder-rajashekhar-reddy.webp', width: 3512, height: 2732, mime: 'image/webp', title: null, alt: 'Portrait of Rajashekhar Reddy, Executive Director (Engineering) at Leonaara, smiling in profile in a pink polo shirt beneath bamboo leaves', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgleftsummer: [], imgrightsummer: [{ src: '/images/leonaara-founder-rajashekhar-reddy.webp', width: 3512, height: 2732, mime: 'image/webp', title: null, alt: 'Portrait of Rajashekhar Reddy, Executive Director (Engineering) at Leonaara, smiling in profile in a pink polo shirt beneath bamboo leaves', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }] } },
      // 3 of 4
      { id: 292, type: 'mask_imgtext', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { title: '<i>Avinash Reddy</i>', text: '<p><b>(Executive Director – Strategy & Customer Relations)</b></p><p>As Executive Director (Strategy & Customer Relations), Avinash Reddy brings a strong focus on strategic growth, customer experience, and long-term relationships.&nbsp;</p>\n<p>With a vision centered on trust and excellence, he ensures every interaction reflects Leonaara’s commitment to transparency, thoughtful service, and creating meaningful experiences for homeowners.</p>', imgleft: [{ src: '/images/leonaara-founder-avinash-reddy.webp', width: 3512, height: 2732, mime: 'image/webp', title: null, alt: 'Portrait of Avinash Reddy, Executive Director (Strategy & Customer Relations) at Leonaara, smiling in a dark blazer and blue patterned shirt', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [], imgleftsummer: [{ src: '/images/leonaara-founder-avinash-reddy.webp', width: 3512, height: 2732, mime: 'image/webp', title: null, alt: 'Portrait of Avinash Reddy, Executive Director (Strategy & Customer Relations) at Leonaara, smiling in a dark blazer and blue patterned shirt', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgrightsummer: [] } },
      // mask_img (id 546, the fullbleed courtyard photo) removed from app/about/page.tsx's
      // render at the user's explicit request; the content entry itself is left in place
      // (about.columns.colPos0's positions still need to line up with page.tsx's destructuring).
      { id: 546, type: 'mask_img', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { img: [{ src: '/images/leonaara-about-courtyard.jpg', width: 3200, height: 1793, mime: 'image/jpeg', title: null, alt: 'Sunlit courtyard with an open wooden shutter window on a whitewashed wall, framed by tree branches and a rustic outdoor dining table', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgsummer: [] } },
      // 4 of 4
      { id: 295, type: 'mask_imgtext', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { title: '<i>Srinivas Reddy</i>', text: '<p><b>(Executive Director – Projects & Liaisoning)</b></p><p>Srinivas Reddy leads Projects & Liaisoning at Leonaara with a focus on seamless execution, strategic coordination, and timely delivery. </p><p>His expertise ensures every project moves forward with precision, compliance, and excellence.</p>', imgleft: [], imgright: [{ src: '/images/leonaara-founder-srinivas-reddy.webp', width: 3512, height: 2732, mime: 'image/webp', title: null, alt: 'Portrait of Srinivas Reddy, Executive Director (Projects & Liaisoning) at Leonaara, smiling in a white shirt against a textured wall', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgleftsummer: [], imgrightsummer: [] } },
      { id: 300, type: 'mask_video', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { video: [], videosummer: [] } },
    ],
  },
};
