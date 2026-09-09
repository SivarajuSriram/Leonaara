import type { PageContent } from '@/lib/content';
import { experiencesHero, experiencesFilter } from '@/content/en/experiencesShared';

export const sela: PageContent = {
  id: 98,
  slug: '/sela/',
  backendLayout: '11',
  meta: {
    title: "sela in the eriro - feel nature with all your senses", description: "sela in the eriro - hike barefoot across alpine pastures, feel snowflakes on your skin & experience the true rhythm of nature ", ogTitle: "SELA", ogDescription: "sela in the eriro - hike barefoot across alpine pastures, feel snowflakes on your skin & experience the true rhythm of nature ", ogImage: null,
    twitterTitle: "SELA", twitterDescription: "sela in the eriro - hike barefoot across alpine pastures, feel snowflakes on your skin & experience the true rhythm of nature ", twitterImage: null, twitterCard: 'summary',
    robots: { noIndex: false, noFollow: false },
  },
  columns: {
    colPos0: [experiencesHero, experiencesFilter],
    colPos5: [
  { id: 223, type: 'mask_hero', appearance: { layout: "default", frameClass: "default", spaceBefore: "", spaceAfter: "" }, content: { herolayout: "subpage", title: "Nature and senses", titleh2: "Breathtakingly beautiful", titleimg: "", text: "", img: [{ src: "/images/eriro-alpine-hide-oesterreich-ehrwald-luxus-04.jpg", width: 1920, height: 1480, mime: "image/jpeg", title: null, alt: "Alpine meadow with spruce, rustic wooden fence and eriro Alpine Hide before Wetterstein massif summits in golden evening light at Ehrwald", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], sideimg: [{ src: "/images/eriro-ehrwald-oesterreich-alpine-hide-03.jpg", width: 1200, height: 1600, mime: "image/jpeg", title: null, alt: "Portrait close-up of man with closed eyes and full beard, small hoop earrings, meditative calm in warm side light at eriro Alpine Hide", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgsummer: [], sideimgsummer: [] } },
  { id: 224, type: 'mask_imgtext', appearance: { layout: "default", frameClass: "default", spaceBefore: "", spaceAfter: "" }, content: { title: "Sela", text: "<p>The mountain awakens the senses: surrounded by Alpine pastures and forests, the beauty of nature and the mountain peaks captivate and capture our entire being. At the root of all existence, we can once again feel time in its true rhythm. The mind finds peace and becomes aware of the value of simplicity. Each experience, as it is savoured with all the senses, touches the heart and becomes a deeply lived memory: A barefoot walk over soft moss and dewy meadows in the mountain summer, or the sensation of snow as tiny flakes fall to rest on your face.</p>", imgleft: [{ src: "/images/unikateur_Bilder/eriro_alpinehide_moos.jpg", width: 2560, height: 3838, mime: "image/jpeg", title: null, alt: "Naked foot on soft moss and forest herbs in sunlight at Ehrwald – mindful grounding and nature connection at eriro Alpine Hide", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: "/images/unikateur_Bilder/eriro_alpinehide_lichtungfrau.jpg", width: 2560, height: 1708, mime: "image/jpeg", title: null, alt: "Woman in black dress standing on sunlit forest clearing at Ehrwald – Wetterstein summits and spruce forests at eriro Alpine Hide", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgleftsummer: [], imgrightsummer: [] } },
  { id: 256, type: 'mask_video', appearance: { layout: "default", frameClass: "default", spaceBefore: "", spaceAfter: "" }, content: { video: [{ src: "/videos/eriro_alpinehide_barfuß.mp4", mime: "video/mp4" }], videosummer: [] } },
    ],
  },
};
