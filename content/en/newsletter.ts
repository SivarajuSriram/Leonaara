import type { PageContent } from '@/lib/content';

export const newsletter: PageContent = {
  id: 103,
  slug: '/newsletter/',
  backendLayout: 'defaultLayout',
  meta: {
    title: 'Inspiring stories directly to your inbox',
    description: 'Discover the pristine beauty of nature. Sign up for the eriro newsletter and find out more about the Alpine Hide at 1,550 m above sea level.',
    ogTitle: 'Newsletter',
    ogDescription: 'Discover the pristine beauty of nature. Sign up for the eriro newsletter and find out more about the Alpine Hide at 1,550 m above sea level.',
    ogImage: null,
    twitterTitle: 'Newsletter',
    twitterDescription: 'Discover the pristine beauty of nature. Sign up for the eriro newsletter and find out more about the Alpine Hide at 1,550 m above sea level.',
    twitterImage: null,
    twitterCard: 'summary',
    robots: { noIndex: true, noFollow: false },
  },
  columns: {
    colPos0: [
      { id: 177, type: 'mask_hero', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { herolayout: 'only-text', title: 'We\'d love to keep you up to date', titleh2: 'Stay<br>\r\nin the know', titleimg: '', text: '<p>The power of mountain nature that has evolved over millions of years: In the smallest Alpine hideaway at 1,550 metres, the experience of the Tyrolean Alps’ archaic origins is instantly tangible: The fine life on the Alpine pasture against a pristine mountain backdrop, the preciousness of every single moment, savoured with all the senses. Sign up for our newsletter. We\'ll share our stories of the mountain and keep you informed.&nbsp;</p>', img: [], sideimg: [], imgsummer: [], sideimgsummer: [] } },
      { id: 302, type: 'mask_widget_newsletter', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: {} },
      { id: 188, type: 'mask_video', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { video: [{ src: '/videos/eriro_alpinehide_nebel.mp4', mime: 'video/mp4' }], videosummer: [] } },
      {
        id: 207,
        type: 'mask_teaserslider',
        appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
        content: {
          teaserslides: [
            { uid: '45', title: 'Ochi Kema', imgleft: [{ src: '/images/unikateur_Bilder/eriro_alpinehide_rückentropfen.jpg', width: 2560, height: 1707, mime: 'image/jpeg', title: null, alt: 'Water droplets and goosebumps on sun-tanned shoulder after bathing – braided hair with grass blade, sensual eriro mountain lake experience', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: '/images/eriro-alpine-hide-ehrwald-ochi-kema-01.jpg', width: 1500, height: 1660, mime: 'image/jpeg', title: null, alt: 'Quiet plunge pool of natural stone and reclaimed wood with mountain panorama in golden light – private spa luxury at eriro Alpine Hide', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], infotext: 'Basking in nature and stillness', linktext: 'Profound revitalisation in the mountain spa', link: { href: '/about/', target: null, class: null, title: null, linkText: 't3://page?uid=108', additionalAttributes: [] } },
            { uid: '47', title: 'Step back to the origins', imgleft: [{ src: '/images/eriro-alpine-hide-ehrwald-rueckkehr-ursprung-01.jpg', width: 1200, height: 1400, mime: 'image/jpeg', title: null, alt: 'Wooden balcony of eriro Alpine Hide in warm evening light with view of rugged rock summits and dense conifer forest – pure alpine majesty', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: '/images/eriro-alpine-hide-ehrwald-rueckkehr-ursprung-02.jpg', width: 1500, height: 1660, mime: 'image/jpeg', title: null, alt: 'Light-flooded living area with massive wooden table, telescope and panoramic view of green alpine forests – quiet luxury moments at eriro Alpine Hide', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], infotext: 'Touch what time has left untouched', linktext: 'Hosts at eriro', link: { href: '/origin/', target: null, class: null, title: null, linkText: 't3://page?uid=86', additionalAttributes: [] } },
            { uid: '50', title: 'Nature as a habitat', imgleft: [{ src: '/images/eriro-alpine-hide-ehrwald-natur-lebensraum-01.jpg', width: 1200, height: 1400, mime: 'image/jpeg', title: null, alt: 'Cozy moment in wool socks with coffee cup and photo book at natural stone fireplace – comforting sanctuary at eriro Alpine Hide', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: '/images/eriro-alpine-hide-ehrwald-natur-lebensraum-02.jpg', width: 1500, height: 1660, mime: 'image/jpeg', title: null, alt: 'Handcrafted wool patchwork wall with chess set in sunlit living area – alpine craftsmanship meets design at eriro Alpine Hide', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], infotext: 'At one with nature and the mountain', linktext: 'Structure and shelter: the suites', link: { href: '/projects/', target: null, class: null, title: null, linkText: 't3://page?uid=44', additionalAttributes: [] } },
          ],
        },
      },
    ],
  },
};
