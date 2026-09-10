import type { PageContent } from '@/lib/content';
import { experiencesHero, experiencesFilter } from '@/content/en/experiencesShared';

export const herchomen: PageContent = {
  id: 115,
  slug: '/herchomen/',
  backendLayout: '11',
  meta: {
    title: "herchomen - Stories and knowledge of the Alps", description: "Experience old knowledge anew - herchomen combines traditional myths, herbalism and life in the mountains for generations.", ogTitle: "HERCHOMEN", ogDescription: "Experience old knowledge anew - herchomen combines traditional myths, herbalism and life in the mountains for generations.", ogImage: null,
    twitterTitle: "HERCHOMEN", twitterDescription: "Experience old knowledge anew - herchomen combines traditional myths, herbalism and life in the mountains for generations.", twitterImage: null, twitterCard: 'summary',
    robots: { noIndex: false, noFollow: false },
  },
  columns: {
    colPos0: [experiencesHero, experiencesFilter],
    colPos5: [
  { id: 261, type: 'mask_hero', appearance: { layout: "default", frameClass: "default", spaceBefore: "", spaceAfter: "" }, content: { herolayout: "subpage", title: "Ancient traditions", titleh2: "Culture by the mountains", titleimg: "", text: "", img: [{ src: "/images/eriro-alpine-hide-oesterreich-ehrwald-luxus-05.jpg", width: 1920, height: 1480, mime: "image/jpeg", title: null, alt: "Hand in wool sweater with leather bracelet and ring splitting spruce wood with rusted axe on tree stump, split logs in background", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], sideimg: [{ src: "/images/eriro-ehrwald-oesterreich-alpine-hide-04.jpg", width: 1200, height: 1600, mime: "image/jpeg", title: null, alt: "Alpine farmer in loden wool coat with Nordic pattern gloves and knit cap before snow-covered Ehrwald winter landscape, eriro Alpine Hide", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgsummer: [], sideimgsummer: [] } },
  { id: 265, type: 'mask_imgtext', appearance: { layout: "default", frameClass: "default", spaceBefore: "", spaceAfter: "" }, content: { title: "Herchomen", text: "<p>On cold winter days in the mountain,&nbsp;families passed time together in the <i>Stube</i>, the typical parlour of Tyrolean homes heated with a single tile stove. The elders would tell stories from earlier times. The legends and myths of the Alps came to life out of animated narratives that stemmed from some element of truth. An intimate knowledge of the mountains has been passed down through the generations, knowhow for living through summer and winter, the experiences of parents and grandparents have created infinite possibilities to learn: medicinal herbs, edible mushrooms and plants, the challenges and dangers of snow and ice, and much more.</p>", imgleft: [{ src: "/images/unikateur_Bilder/Winter/eriro_alpinehide_scheitel2.jpg", width: 2560, height: 3838, mime: "image/jpeg", title: null, alt: "Strong hand gripping freshly split spruce logs with visible annual rings before cream linen shirt – honest craftsmanship in mountain winter", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: "/images/eriro-ehrwald-spa-alpinehide-suite-07.jpg", width: 1500, height: 1350, mime: "image/jpeg", title: null, alt: "Ehrwald alpine farmer with white beard holding young mountain sheep in arms, weathered hands, dark barn background, traditional alpine farming near eriro", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgleftsummer: [], imgrightsummer: [] } },
    ],
  },
};
