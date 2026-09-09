import type { PageContent } from '@/lib/content';
import { experiencesHero, experiencesFilter } from '@/content/en/experiencesShared';

export const hantwerc: PageContent = {
  id: 99,
  slug: '/hantwerc/',
  backendLayout: '11',
  meta: {
    title: "hantwerc in the eriro - art & crafts from the Alps", description: "Experience creativity in the hantwerc studio - traditional handicraft techniques with natural materials from the Alps. Create works of art that reflect nature.", ogTitle: "HANTWERC", ogDescription: "Experience creativity in the hantwerc studio - traditional handicraft techniques with natural materials from the Alps. Create works of art that reflect nature.", ogImage: null,
    twitterTitle: "HANTWERC", twitterDescription: "Experience creativity in the hantwerc studio - traditional handicraft techniques with natural materials from the Alps. Create works of art that reflect nature.", twitterImage: null, twitterCard: 'summary',
    robots: { noIndex: false, noFollow: false },
  },
  columns: {
    colPos0: [experiencesHero, experiencesFilter],
    colPos5: [
  { id: 227, type: 'mask_hero', appearance: { layout: "default", frameClass: "default", spaceBefore: "", spaceAfter: "" }, content: { herolayout: "subpage", title: "Atelier by the mountain", titleh2: "Art in<br>\r\nthe Alps", titleimg: "", text: "", img: [{ src: "/images/unikateur_Bilder/eriro_alpinehide_stein.jpg", width: 2560, height: 3838, mime: "image/jpeg", title: null, alt: "Hands holding rough Wetterstein limestone rock with crystalline surface and moss traces – geological force of Zugspitze tangibly close at eriro retreat", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], sideimg: [{ src: "/images/eriro-ehrwald-oesterreich-alpine-hide-05.jpg", width: 1200, height: 1600, mime: "image/jpeg", title: null, alt: "Hand-forged carving knives with turned handles and fresh wood carving piece on dark live-edge bench, craft tradition at eriro", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgsummer: [], sideimgsummer: [] } },
  { id: 228, type: 'mask_imgtext', appearance: { layout: "default", frameClass: "default", spaceBefore: "", spaceAfter: "" }, content: { title: "Hantwerc", text: "<p>eriro creates mountain experiences that stimulate mind, body, and creativity equally. The primary materials of the Alps – wood, stone, grass, soil – have been the foundation for art and handcrafts in the Alpine region for thousands of years. Try your hand at traditional crafting techniques in the <i>hantwerc-Atelier </i>– or craft barn – and create an original piece of work from natural materials.</p>", imgleft: [{ src: "/images/unikateur_Bilder/eriro_alpinehide_schuh.jpg", width: 2560, height: 3838, mime: "image/jpeg", title: null, alt: "Patinated brown nubuck hiking boot with nickeled eyelets on weathered wood – robust craftsmanship for Wetterstein tours at eriro resort", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: "/images/eriro-ehrwald-spa-alpinehide-suite-08.jpg", width: 1500, height: 1350, mime: "image/jpeg", title: null, alt: "Woodcraft workshop at eriro with live-edge table, turned three-legged stools, hanging linen aprons beneath recycled reclaimed wood roof structure", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgleftsummer: [], imgrightsummer: [] } },
  { id: 257, type: 'mask_img', appearance: { layout: "default", frameClass: "default", spaceBefore: "", spaceAfter: "" }, content: { img: [{ src: "/images/Eriro_Restaurant_ehrwalder-alm_oesterreich_handwerk-01.jpg", width: 2560, height: 1440, mime: "image/jpeg", title: null, alt: "Craftsman carving fresh wooden spoon from maple with curved knife over linen apron, traditional woodcraft at eriro Alpine Hide", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgsummer: [] } },
    ],
  },
};
