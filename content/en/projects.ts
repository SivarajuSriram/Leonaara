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
        { uid: '8401', title: 'Kadamba', imgleft: [{ src: "/images/Suiten/kadamba/AlexMoling_Eriro_Rooms-1.jpg", width: 8190, height: 5463, mime: "image/jpeg", title: null, alt: "Living area of boum Suite: reclaimed wood ceiling, sculptural tree trunk daybed and linen sofa before panorama window with view of Wetterstein summits", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: "/images/Suiten/kadamba/AlexMoling_Eriro_Rooms-9.jpg", width: 8192, height: 5464, mime: "image/jpeg", title: null, alt: "boum eriro Suite: reclaimed wood ceiling, stone lights and wool headboard framing double bed with white linen bedding and cashmere blanket on plank floor", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], infotext: '22 Acres | 800 Sq. Yds. | 81 Estates | G & G+1 Farm Villas', linktext: 'Explore', link: { href: '/projects/kadamba/', target: null, class: null, title: null, linkText: 'Kadamba', additionalAttributes: [] } },
        { uid: '8501', title: 'Anantha Meadows', imgleft: [{ src: "/images/Suiten/ananthameadows/AlexMoling_Eriro_Rooms-43.jpg", width: 7568, height: 5048, mime: "image/jpeg", title: null, alt: "Eriro Suite living area with reclaimed wood ceiling, textured wool wall, sheepskin armchair before panorama window with terrace and view of conifer forests and mountain summits", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: "/images/Suiten/ananthameadows/AlexMoling_Eriro_Rooms-44.jpg", width: 8183, height: 5458, mime: "image/jpeg", title: null, alt: "Eriro Suite seating area with white linen cushions, wooden table and pendant light before artful patchwork wool wall beneath rustic reclaimed wood beam ceiling", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], infotext: 'Just a placeholder for now.', linktext: 'Coming Soon', link: '' },
      ] } },
    ],
  },
};
