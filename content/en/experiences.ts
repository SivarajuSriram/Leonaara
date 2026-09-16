import type { PageContent } from '@/lib/content';
import { experiencesHero, experiencesFilter } from '@/content/en/experiencesShared';

export const experiences: PageContent = {
  id: 60,
  slug: '/experiences/',
  backendLayout: 'defaultLayout',
  meta: {
    title: 'Experience untouched mountain worlds – Leonaara experiences',
    description: 'Experience eriro amidst untouched nature. Immerse yourself in the archaic mountain experiences in the Tyrolean Alps that bring you back to the origin.',
    ogTitle: 'Experiences',
    ogDescription: 'Experience eriro amidst untouched nature. Immerse yourself in the archaic mountain experiences in the Tyrolean Alps that bring you back to the origin.',
    ogImage: null,
    twitterTitle: 'Experiences',
    twitterDescription: 'Experience eriro amidst untouched nature. Immerse yourself in the archaic mountain experiences in the Tyrolean Alps that bring you back to the origin.',
    twitterImage: null,
    twitterCard: 'summary',
    robots: { noIndex: false, noFollow: false },
  },
  columns: {
    colPos0: [
      experiencesHero,
      experiencesFilter,
      {
        id: 565, type: 'mask_teaserslider', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
        content: {
          teaserslides: [
            { uid: "424", title: "Mountain pleasures", imgleft: [{ src: "/images/eriro-alpine-hide-ehrwald-berggenuss-01.jpg", width: 1200, height: 1400, mime: "image/jpeg", title: null, alt: "Artful gourmet dish on stone plate at eriro Alpine Hide – edible alpine flowers, herbs and golden chips as homage to alpine terroir cuisine", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: "/images/eriro-alpine-hide-ehrwald-berggenuss-02.jpg", width: 1500, height: 1660, mime: "image/jpeg", title: null, alt: "Golden broth being poured from ceramic pitcher over mushrooms and elderflowers – intimate gourmet ritual in handcrafted bowl at eriro Alpine Hide", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], infotext: "Weather on a plate in its many forms", linktext: "Flavour of mountain origins", link: { href: "/culinary/", target: null, class: null, title: null, linkText: "t3://page?uid=61", additionalAttributes: [] } },
            { uid: "425", title: "Step back to the origins", imgleft: [{ src: "/images/eriro-alpine-hide-ehrwald-rueckkehr-ursprung-01.jpg", width: 1200, height: 1400, mime: "image/jpeg", title: null, alt: "Wooden balcony of eriro Alpine Hide in warm evening light with view of rugged rock summits and dense conifer forest – pure alpine majesty", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: "/images/eriro-alpine-hide-ehrwald-rueckkehr-ursprung-02.jpg", width: 1500, height: 1660, mime: "image/jpeg", title: null, alt: "Light-flooded living area with massive wooden table, telescope and panoramic view of green alpine forests – quiet luxury moments at eriro Alpine Hide", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], infotext: "Touch what time has left untouched", linktext: "To the Alpine Hide", link: { href: "/origin/", target: null, class: null, title: null, linkText: "t3://page?uid=86", additionalAttributes: [] } },
            { uid: "428", title: "Nature as a habitat", imgleft: [{ src: "/images/eriro-alpine-hide-ehrwald-natur-lebensraum-01.jpg", width: 1200, height: 1400, mime: "image/jpeg", title: null, alt: "Cozy moment in wool socks with coffee cup and photo book at natural stone fireplace – comforting sanctuary at eriro Alpine Hide", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: "/images/eriro-alpine-hide-ehrwald-natur-lebensraum-02.jpg", width: 1500, height: 1660, mime: "image/jpeg", title: null, alt: "Handcrafted wool patchwork wall with chess set in sunlit living area – alpine craftsmanship meets design at eriro Alpine Hide", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], infotext: "At one with nature and the mountain", linktext: "Structure and shelter: the suites", link: { href: "/projects/", target: null, class: null, title: null, linkText: "t3://page?uid=44", additionalAttributes: [] } },
          ],
        },
      },
    ],
  },
};
