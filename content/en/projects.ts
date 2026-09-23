import type { PageContent } from '@/lib/content';

export const projects: PageContent = {
  id: 8500,
  slug: '/projects/',
  backendLayout: 'defaultLayout',
  meta: {
    title: 'Leonaara - Our Projects',
    description: 'Explore Leonaara’s projects: Kadamba and Anantha Meadows.',
    ogTitle: 'Projects',
    ogDescription: 'Explore Leonaara’s projects: Kadamba and Anantha Meadows.',
    ogImage: null,
    twitterTitle: 'Projects',
    twitterDescription: 'Explore Leonaara’s projects: Kadamba and Anantha Meadows.',
    twitterImage: null,
    twitterCard: 'summary',
    robots: { noIndex: false, noFollow: false },
  },
  columns: {
    colPos0: [
      { id: 8510, type: 'mask_hero', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { herolayout: 'only-text', title: '', titleh2: 'Our <br>\r\nProjects', titleimg: '', text: '<p>Every Leonaara project is inspired by the forces that shape life: earth, water, air, light and space. Explore what we are building.</p>', img: [], sideimg: [], imgsummer: [], sideimgsummer: [] } },
      { id: 8511, type: 'mask_teaserslider', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { teaserslides: [
        { uid: '8401', title: 'Kadamba', imgleft: [{ src: "/images/leonaara-kadamba-villa-2.jpg", width: 2400, height: 1350, mime: "image/jpeg", title: null, alt: "Kadamba villa exterior surrounded by mature trees, with a lush landscaped entrance and covered carport", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: "/images/leonaara-kadamba-villa-1.jpg", width: 1926, height: 817, mime: "image/jpeg", title: null, alt: "Kadamba villa exterior at dusk with warm architectural lighting, wood-clad gable roof, stone accent wall and covered carport", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], infotext: '22 Acres | 800 Sq. Yds. | 81 Estates | G & G+1 Estates', description: '<p>Inspired by Dolce Far Niente, the art of unhurried living, Kadamba is built on the belief that a home should enrich everyday life.  Rooted in nature’s finest luxuries: sunlight, fresh air, open space, and silence, Kadamba invites you to slow down, breathe deeply, and reconnect with what matters most.</p><p>Spread across 22 lush acres, Kadamba offers an exclusive low-density sanctuary designed for maximum privacy, tranquility, and room to breathe.</p>', linktext: 'Explore', link: { href: '/projects/kadamba/', target: null, class: null, title: null, linkText: 'Kadamba', additionalAttributes: [] } },
        { uid: '8501', title: 'Anantha Meadows', imgleft: [{ src: "/images/leonaara-anantha-meadow.jpg", width: 1642, height: 2000, mime: "image/jpeg", title: null, alt: "Sunlit green hillside meadow with scattered trees rising toward a ridge under a wide blue sky", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: "/images/leonaara-anantha-meadow.jpg", width: 1642, height: 2000, mime: "image/jpeg", title: null, alt: "Sunlit green hillside meadow with scattered trees rising toward a ridge under a wide blue sky", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], infotext: '', linktext: 'Coming Soon', link: '' },
      ] } },
    ],
  },
};
