import type { PageContent } from '@/lib/content';
import { experiencesHero, experiencesFilter } from '@/content/en/experiencesShared';

export const sneo: PageContent = {
  id: 100,
  slug: '/sneo/',
  backendLayout: '11',
  meta: {
    title: "sneo in the Leonaara - direct access to slopes and snowshoe hikes", description: "sneo in the eriro: enjoy direct access to ski slopes and ski lifts or discover the untouched winter landscape on a snowshoe hike", ogTitle: "SNEO", ogDescription: "sneo in the eriro: enjoy direct access to ski slopes and ski lifts or discover the untouched winter landscape on a snowshoe hike", ogImage: null,
    twitterTitle: "SNEO", twitterDescription: "sneo in the eriro: enjoy direct access to ski slopes and ski lifts or discover the untouched winter landscape on a snowshoe hike", twitterImage: null, twitterCard: 'summary',
    robots: { noIndex: false, noFollow: false },
  },
  columns: {
    colPos0: [experiencesHero, experiencesFilter],
    colPos5: [
  { id: 231, type: 'mask_hero', appearance: { layout: "default", frameClass: "default", spaceBefore: "", spaceAfter: "" }, content: { herolayout: "subpage", title: "Winter experiences", titleh2: "The many moods<br>\r\nof snow", titleimg: "", text: "", img: [{ src: "/images/eriro-alpine-hide-oesterreich-ehrwald-luxus-06.jpg", width: 1920, height: 1480, mime: "image/jpeg", title: null, alt: "Guest in cream wool coat with fringed reversible scarf pulling wooden sled through deep snow, Wetterstein fog panorama at eriro Ehrwald", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], sideimg: [{ src: "/images/eriro-ehrwald-oesterreich-alpine-hide-06.jpg", width: 1200, height: 1600, mime: "image/jpeg", title: null, alt: "Snow-covered Wetterstein limestone summit with dark rock walls and steep snow fields beneath hazy winter sky at Ehrwald", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgsummer: [], sideimgsummer: [] } },
  { id: 232, type: 'mask_imgtext', appearance: { layout: "default", frameClass: "default", spaceBefore: "", spaceAfter: "" }, content: { title: "Sneo", text: "<p>Be the first on the deserted piste in the morning, let your gaze sink into the quiet expanse of the Alpine winter landscape at blue hour. Ski-in and Ski-out: eriro sits at the edge of the Ehrwalder Almen ski area and offers direct access to the slopes and lifts throughout the season.&nbsp;</p>\n<p>The mountain winter is quiet and peaceful on snowshoe hikes through a landscape often covered in deep snow, with stunning views of mountain peaks and frozen mountain lakes as your unwavering companions. Part of the winter experience is also learning vital knowledge about the many aspects of snow: as enchanting as the pasture and mountain landscapes of the winter months are, we are nonetheless small and vulnerable against the forces of nature.</p>", imgleft: [{ src: "/images/DR1A1272.jpg", width: 2560, height: 3838, mime: "image/jpeg", title: null, alt: "Ski pole in powder snow beside wooden edge – crystalline snow grains and patinated metal telling of eriro winter days in the Zugspitze region", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgright: [{ src: "/images/eriro-ehrwald-spa-alpinehide-suite-03.jpg", width: 1500, height: 1350, mime: "image/jpeg", title: null, alt: "Mountaineer in brown jacket on boulder gazing up at snow-covered Wetterstein north face, mountain pine foreground at eriro Ehrwald", crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }], imgleftsummer: [], imgrightsummer: [] } },
  { id: 548, type: 'mask_video', appearance: { layout: "default", frameClass: "default", spaceBefore: "", spaceAfter: "" }, content: { video: [{ src: "/videos/Eriro_Video_Winter.mp4", mime: "video/mp4" }], videosummer: [] } },
    ],
  },
};
