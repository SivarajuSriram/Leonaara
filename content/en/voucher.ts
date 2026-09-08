import type { PageContent } from '@/lib/content';

export const voucher: PageContent = {
  id: 73,
  slug: '/voucher/',
  backendLayout: 'defaultLayout',
  meta: {
    title: 'Gifts that create memories: eriro vouchers',
    description: 'A gift full of nature and experiences at the foot of the majestic Zugspitze. Give a gift voucher for an eriro stay.',
    ogTitle: 'Voucher',
    ogDescription: 'A gift full of nature and experiences at the foot of the majestic Zugspitze. Give a gift voucher for an eriro stay.',
    ogImage: null,
    twitterTitle: 'Voucher',
    twitterDescription: 'A gift full of nature and experiences at the foot of the majestic Zugspitze. Give a gift voucher for an eriro stay.',
    twitterImage: null,
    twitterCard: 'summary',
    robots: { noIndex: false, noFollow: false },
  },
  columns: {
    colPos0: [
      { id: 176, type: 'mask_hero', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { herolayout: 'only-text', title: 'A voucher for <br>\r\ncountless beautiful memories ', titleh2: 'Nature<br>\r\nas a gift', titleimg: '', text: '<p>The archaic nature of the Alps at the foot of the Zugspitze mountain peak invites you to leave everyday life behind and surrender to the pulse of nature: Day and night, summer and winter, sun and snow – all determine all life at 1,550 metres. With the gift of a voucher for a stay at eriro, you are giving the gift of mountain experiences that challenge – and touch – all the senses in their authenticity and intensity: Experiences that will become inspiring memories.</p>', img: [], sideimg: [], imgsummer: [], sideimgsummer: [] } },
      { id: 492, type: 'mask_widget_voucher', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: {} },
      { id: 187, type: 'mask_img', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: { img: [{ src: '/images/unikateur_Bilder/eriro_alpinehide_rinde.jpg', width: 2560, height: 1708, mime: 'image/jpeg', title: null, alt: 'Woman hiding her face behind rough tree bark in Wetterstein sunlight – playful wildness and golden jewelry at eriro Alpine Hide', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgsummer: [] } },
      {
        id: 206,
        type: 'mask_teaserslider',
        appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
        content: {
          teaserslides: [
            { uid: '39', title: 'Ochi Kema', imgleft: [{ src: '/images/unikateur_Bilder/eriro_alpinehide_rückentropfen.jpg', width: 2560, height: 1707, mime: 'image/jpeg', title: null, alt: 'Water droplets and goosebumps on sun-tanned shoulder after bathing – braided hair with grass blade, sensual eriro mountain lake experience', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: '/images/Hendrik_Stüwe/_R8A5800.jpg', width: 2800, height: 1868, mime: 'image/jpeg', title: null, alt: '', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], infotext: 'Basking in nature and stillness', linktext: 'Profound revitalisation in the mountain spa', link: { href: '/spa/', target: null, class: null, title: null, linkText: 't3://page?uid=108', additionalAttributes: [] } },
            { uid: '40', title: 'Mountain pleasures', imgleft: [{ src: '/images/eriro-alpine-hide-ehrwald-berggenuss-01.jpg', width: 1200, height: 1400, mime: 'image/jpeg', title: null, alt: 'Artful gourmet dish on stone plate at eriro Alpine Hide – edible alpine flowers, herbs and golden chips as homage to alpine terroir cuisine', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: '/images/eriro-alpine-hide-ehrwald-berggenuss-02.jpg', width: 1500, height: 1660, mime: 'image/jpeg', title: null, alt: 'Golden broth being poured from ceramic pitcher over mushrooms and elderflowers – intimate gourmet ritual in handcrafted bowl at eriro Alpine Hide', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], infotext: 'Weather on a plate in its many forms', linktext: 'Flavour of mountain origins', link: { href: '/culinary/', target: null, class: null, title: null, linkText: 't3://page?uid=61', additionalAttributes: [] } },
            { uid: '42', title: 'Touch the untouched', imgleft: [{ src: '/images/eriro-alpine-hide-ehrwald-unerlebtes-erleben-01.jpg', width: 1200, height: 1400, mime: 'image/jpeg', title: null, alt: 'Strong hands holding soft, natural sheep\'s wool – authentic craftsmanship and alpine materiality as soul of eriro Alpine Hide', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: '/images/eriro-alpine-hide-ehrwald-unerlebtes-erleben-02.jpg', width: 1500, height: 1660, mime: 'image/jpeg', title: null, alt: 'Couple hand in hand in sunlit mountain forest with golden lens flare – romantic togetherness around eriro Alpine Hide', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], infotext: 'Purely Alpine', linktext: 'Nature and culture experiences of the mountain', link: { href: '/experiences/', target: null, class: null, title: null, linkText: 't3://page?uid=60', additionalAttributes: [] } },
          ],
        },
      },
    ],
  },
};
