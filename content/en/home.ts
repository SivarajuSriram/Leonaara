import type {
  PageContent, HeroSection, ImgTextSection, VideoSection,
  RoomSliderSection, ImgSection, BreakSection, TeaserSliderSection, PartnerMarqueeSection,
} from '@/lib/content';

export const hero: HeroSection = {
  id: 74,
  type: 'mask_hero',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    herolayout: 'default',
    title: '',
    titleh2: 'Bringing<br>\r\nPurpose<br>\r\nto Existence',
    titleimg: 'ROOTED TO THE ELEMENTS OF NATURE ',
    text: '<p>und wir werden uns um den Rest kümmern<br>Ich bin ein kleiner Blindtext. Und zwar schon so lange ich denken kann. Es war nicht leicht zu verstehen, was es bedeutet, ein blinder Text zu sein: Man macht keinen Sinn. Wirklich keinen Sinn. Man wird zusammen hangsloseingeschoben und rumgedreht und wir werden uns um den Rest kümmern. Ich bin ein kleiner.</p>',
    img: [
      {
        src: '/images/AlexMoling_Eriro_Winter-first-6.jpg', width: 3000, height: 2001, mime: 'image/jpeg', title: null,
        alt: 'The eriro Alpine Hide as exclusive wooden chalet architecture before imposing rock wall in snow-covered winter landscape – alpine luxury retreat at alpenglow',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    sideimg: [
      {
        src: '/images/eriro-ehrwald-oesterreich-alpine-hide-08.jpg', width: 1200, height: 1600, mime: 'image/jpeg', title: null,
        alt: 'Tyrolean felt boots with leather straps and Vibram sole in deep snow, traditional mountain boots leaving tracks at eriro Ehrwald',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgsummer: [
      {
        src: '/images/unikateur_Bilder/AlexMoling_Eriro_Exterior.jpg', width: 3000, height: 2001, mime: 'image/jpeg', title: null,
        alt: 'eriro Alpine Hide – exclusive wooden lodge amid flowering alpine meadow before imposing Wetterstein rock wall in golden evening light, pure alpine architecture',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    sideimgsummer: [
      {
        src: '/images/unikateur_Bilder/eriro_alpinehide_lichtungfrau.jpg', width: 2560, height: 1708, mime: 'image/jpeg', title: null,
        alt: 'Woman in black dress standing on sunlit forest clearing at Ehrwald – Wetterstein summits and spruce forests at eriro Alpine Hide',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
  },
};

export const originsText: ImgTextSection = {
  id: 75,
  type: 'mask_imgtext',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    title: 'The Birth of <br>\r\nLeonaara<br>\r\n',
    text: '<p>Before there were structures, there were elements.<br/> Earth, water, air, light, and space have shaped existence for millennia. At Leonaara, we draw from these timeless forces to create environments that feel balanced, natural, and deeply connected to the way people want to live. Earth grounds us. Water brings calm. Air creates openness. Light brings life. Space allows us to breathe. These elements inspire how we think about architecture, from the way buildings meet the landscape to the way light moves through a home. Every detail is considered to create a sense of harmony between nature, design, and everyday living.</p>\n<p><a href="/projects/" class="linkdetail">Explore Projects</a></p>',
    imgleft: [
      {
        src: '/images/eriro-ehrwald-alpine-hide-luxus-natur-01.jpg', width: 1200, height: 950, mime: 'image/jpeg', title: null,
        alt: 'Snow-covered Wetterstein north face with rugged limestone ridges and ice fields beneath gray winter sky, telephoto perspective at Ehrwald',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgright: [
      {
        src: '/images/AlexMoling_Eriro_Winter-first-13.jpg', width: 3000, height: 2001, mime: 'image/jpeg', title: null,
        alt: 'eriro Alpine Hide – Meditative relaxation lounger with natural stone and wooden lattice before framed panoramic view of snow-covered alpine summit and winter landscape',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgleftsummer: [
      {
        src: '/images/unikateur_Bilder/eriro_alpinehide_bergseemann.jpg', width: 2560, height: 1708, mime: 'image/jpeg', title: null,
        alt: 'Meditation at crystal-clear Seebensee: Man practicing mindfulness before mirroring Zugspitze limestone wall at eriro Alpine Hide retreat',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgrightsummer: [
      {
        src: '/images/Hendrik_Stüwe/Pool_Shooting_2605_09_neu.jpg', width: 2800, height: 1867, mime: 'image/jpeg', title: null,
        alt: '',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
  },
};

export const originsVideo: VideoSection = {
  id: 77,
  type: 'mask_video',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    video: [],
    videosummer: [],
  },
};

export const roomSlider: RoomSliderSection = {
  id: 123,
  type: 'mask_roomslider',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    rooms: [
      {
        uid: '3',
        pid: '84',
        title: 'Kadamba',
        description: '<p>22 Acres | 800 Sq. Yds. | 81 Estates | G & G+1 Farm Villas</p>',
        minprice: '',
        people: '',
        size: '',
        previewimage: [
          {
            src: '/images/Suiten/kadamba/AlexMoling_Eriro_Rooms-1.jpg', width: 8190, height: 5463, mime: 'image/jpeg', title: null,
            alt: 'Living area of boum Suite: reclaimed wood ceiling, sculptural tree trunk daybed and linen sofa before panorama window with view of Wetterstein summits',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/kadamba/AlexMoling_Eriro_Rooms-9.jpg', width: 8192, height: 5464, mime: 'image/jpeg', title: null,
            alt: 'boum eriro Suite: reclaimed wood ceiling, stone lights and wool headboard framing double bed with white linen bedding and cashmere blanket on plank floor',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/kadamba/AlexMoling_Eriro_Rooms-12.jpg', width: 2048, height: 1366, mime: 'image/jpeg', title: null,
            alt: 'Bathroom of boum Suite with lime plaster walls, driftwood faucet, backlit mirror, reclaimed wood beam ceiling and glass rain shower',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/kadamba/AlexMoling_Eriro_Rooms-5.jpg', width: 2001, height: 3000, mime: 'image/jpeg', title: null,
            alt: 'Stylish interior of eriro Alpine Hide – sculptural designer light beneath reclaimed wood ceiling, linen fabrics and mountain panorama through window, warm sanctuary',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/kadamba/AlexMoling_Eriro_Rooms-16.jpg', width: 8192, height: 5464, mime: 'image/jpeg', title: null,
            alt: 'Private balcony lounge of boum Suite with upholstered daybed and wide view across green alpine meadows to summit silhouettes of Wetterstein',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        images: [
          {
            src: '/images/eriro-alpine-hide-ehrwald-luxus-suite-boum-02.jpg', width: 1200, height: 1400, mime: 'image/jpeg', title: null,
            alt: 'Mindful touch of rough tree bark in alpine forest – sensual nature connection and slowing down at eriro Alpine Hide retreat in Alps',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
      },
      {
        uid: '4',
        pid: '85',
        title: 'Anantha Meadows',
        description: '',
        minprice: 'from 925,- € / night per person / All-In',
        people: 'for 2 persons',
        size: 'approx. 872 sq ft',
        previewimage: [
          {
            src: '/images/Suiten/ananthameadows/AlexMoling_Eriro_Rooms-43.jpg', width: 7568, height: 5048, mime: 'image/jpeg', title: null,
            alt: 'Eriro Suite living area with reclaimed wood ceiling, textured wool wall, sheepskin armchair before panorama window with terrace and view of conifer forests and mountain summits',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/ananthameadows/AlexMoling_Eriro_Rooms-44.jpg', width: 8183, height: 5458, mime: 'image/jpeg', title: null,
            alt: 'Eriro Suite seating area with white linen cushions, wooden table and pendant light before artful patchwork wool wall beneath rustic reclaimed wood beam ceiling',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/ananthameadows/AlexMoling_Eriro_Rooms-51.jpg', width: 8186, height: 5460, mime: 'image/jpeg', title: null,
            alt: 'Wisa Suite: reclaimed wood ceiling, natural stone wall and hand-woven dividers framing bed with white linen – sanctuary in honest materiality',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/ananthameadows/AlexMoling_Eriro_Rooms-55.jpg', width: 8190, height: 5463, mime: 'image/jpeg', title: null,
            alt: 'Bathroom of Wisa Suite: hand-plastered vanity, driftwood faucet, backlit mirror, reclaimed wood ceiling – purist elegance meets craftsmanship',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/ananthameadows/AlexMoling_Eriro_Rooms-57.jpg', width: 8192, height: 5464, mime: 'image/jpeg', title: null,
            alt: 'Cashmere blanket on wooden terrace of Wisa Suite at eriro with open view of Wetterstein massif, spruce forests and rock summits – alpine sanctuary',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/ananthameadows/AlexMoling_Eriro_Rooms-77.jpg', width: 8192, height: 5464, mime: 'image/jpeg', title: null,
            alt: 'Winter suite with wooden floor, desk, fur armchair and floor-to-ceiling window with panoramic view of snow-covered Zugspitze mountain range',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        images: [
          {
            src: '/images/eriro-alpine-hide-ehrwald-luxus-suite-wisa-02.jpg', width: 1200, height: 1400, mime: 'image/jpeg', title: null,
            alt: 'Couple resting closely embraced in sunlit alpine meadow near eriro Alpine Hide – carefree togetherness dressed in linen and golden light',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/unikateur_Bilder/Winter/eriro_alpinehide_fußstapfen.jpg', width: 2560, height: 3838, mime: 'image/jpeg', title: null,
            alt: 'Deep footprints in powder snow at Wetterstein – snow-covered boots breaking trail through winter silence around eriro resort',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
      },
    ],
  },
};

export const roomNatureText: ImgTextSection = {
  id: 120,
  type: 'mask_imgtext',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    title: 'The Leonaara<br>\r\nPhilosophy',
    text: '<p>Driven by an uncompromising commitment to trust, quality, and lasting value, every creation is guided by four foundational promises: placing Human First by designing around the lives each space is meant to hold, embracing Nature Always not as an afterthought but as the living blueprint for how environments breathe and connect, curating Quiet Luxury where intentional simplicity elevates the subtle rhythms of everyday life, and ensuring everything is Built Forever to cradle the stories, memories, and generations that follow.</p>\n<p><a href="/projects" class="linkdetail">Explore Projects</a></p>',
    imgleft: [
      {
        src: '/images/eriro-ehrwald-alpine-hide-luxus-natur-02.jpg', width: 1200, height: 950, mime: 'image/jpeg', title: null,
        alt: 'Matte black rainfall shower with golden light beam beneath recycled spruce rafters, spa ritual room at eriro Alpine Hide',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgright: [
      {
        src: '/images/eriro-ehrwald-spa-alpinehide-suite-02.jpg', width: 1500, height: 1350, mime: 'image/jpeg', title: null,
        alt: 'Cathedral suite at eriro with centuries-old spruce beams, bed with fur blanket, glass fireplace and integrated bath with matte black faucet beneath reclaimed wood ceiling',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgleftsummer: [],
    imgrightsummer: [],
  },
}; // "Nature infuses the room"

export const spaText: ImgTextSection = {
  id: 710,
  type: 'mask_imgtext',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    title: 'Our Foundations',
    text: '<p>Rooted in the belief that a strong foundation is the cornerstone of every enduring structure, Leonaara builds for the future by valuing quality over speed, design over crowding, and complete honesty at every step. Guided by a philosophy that places people at the center of each home, every space is conceived to breathe with natural light, abundant greenery, and effortless openness, while unobtrusive smart technology simplifies daily living without added complexity. By purposefully developing fewer, higher-caliber residences that honor the land, employing precision design, and choosing durable materials without compromise, we create enduring sanctuaries engineered for lasting comfort, genuine security, and generational value. </p>\n<p>&nbsp;</p>\n<p><a href="/about/" class="linkdetail">MEET THE FOUNDERS</a></p>',
    imgleft: [
      {
        src: '/images/Hendrik_Stüwe/Pool_Shooting_2605_11.jpg', width: 2800, height: 1868, mime: 'image/jpeg', title: null,
        alt: '',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgright: [
      {
        src: '/images/Hendrik_Stüwe/Pool_Shooting_2605_01_neu.jpg', width: 1867, height: 2800, mime: 'image/jpeg', title: null,
        alt: '',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgleftsummer: [
      {
        src: '/images/Hendrik_Stüwe/Pool_Shooting_2605_11.jpg', width: 2800, height: 1868, mime: 'image/jpeg', title: null,
        alt: '',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgrightsummer: [
      {
        src: '/images/Hendrik_Stüwe/Pool_Shooting_2605_01_neu.jpg', width: 1867, height: 2800, mime: 'image/jpeg', title: null,
        alt: '',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
  },
}; // "The sound of nature echoes on skin"


export const home: PageContent = {
  id: 1,
  slug: '/',
  backendLayout: 'defaultLayout',
  meta: {
    title: 'Leonaara - Experience alpine originality',
    description: 'Leonaara designs fewer, higher-caliber residences inspired by the forces that shape life: earth, water, air, light and space. Explore Kadamba and Anantha Meadows.',
    ogTitle: 'Leonaara',
    ogDescription: 'Leonaara designs fewer, higher-caliber residences inspired by the forces that shape life: earth, water, air, light and space. Explore Kadamba and Anantha Meadows.',
    ogImage: {
      src: '/images/2c0a3fac2ab04ecb63b3c016f3214849.jpg', width: 4096, height: 2732, mime: 'image/jpeg', title: null,
      alt: 'Young woman in black dress standing contemplatively on alpine meadow framed by spruce forest and Zugspitze Wetterstein limestone in golden evening light',
      crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
    },
    twitterTitle: 'Leonaara',
    twitterDescription: 'Leonaara designs fewer, higher-caliber residences inspired by the forces that shape life: earth, water, air, light and space. Explore Kadamba and Anantha Meadows.',
    twitterImage: null,
    twitterCard: 'summary',
    robots: { noIndex: false, noFollow: false },
  },
  columns: {
    colPos0: [
      hero, originsText, originsVideo, roomSlider, roomNatureText, spaText
    ], 
  },
};
