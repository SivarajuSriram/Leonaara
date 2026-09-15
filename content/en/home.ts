import type {
  PageContent, HeroSection, ImgTextSection, VideoSection, QuoteSection,
  RoomSliderSection, ImgSection, BreakSection, TeaserSliderSection, PartnerMarqueeSection,
} from '@/lib/content';

export const hero: HeroSection = {
  id: 74,
  type: 'mask_hero',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    herolayout: 'default',
    title: 'the Zugspitze peak rises dramatically<br>\r\nover Alpine pastures<br>\r\n',
    titleh2: 'Rooted <br>\r\nin its <br>\r\norigins',
    titleimg: 'The first steps in fresh powder snow,<br>\r\nthe head touches the sky',
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
    title: 'Travel back <br>\r\nto the beginnings <br>\r\nof everything',
    text: '<p>Become one: with origins, with nature, with yourself. A sense of infinite freedom unfolds when in the luxurious company of time as it stands still. <i>Welcome</i> to eriro, created with a mere nine suites with the intention of establishing the smallest Alpine hideaway in the Alps, located at an elevation of 1,550 metres, in Ehrwald/Tyrol. Archaic and pristine, the untamed nature of the mountain draws the eye to the essentials and fulfills the innately human desire for simplicity and authenticity.</p>\n<p><a href="/alpine-hide/" class="linkdetail">TO THE ALPINE HIDE</a></p>',
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

export const pressQuote: QuoteSection = {
  id: 582,
  type: 'mask_quote',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    quote: '<p>eriro – One of the "World’s Greatest Places 2025"</p>',
    autor: 'TIME',
    img: [],
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
        title: 'boum',
        description: '<p>As humans, we have always had a special connection to the forest. Trees, shrubs and mosses govern the harmonious cycle of nature in a silent exchange: from the flowering and radiance of summer to the warm tones of autumn and finally the white silence of winter, after which all life begins anew. The 5 boum suites are south-west facing, in the direction of the mighty, unspoiled forests of the Alps.&nbsp;</p>',
        minprice: 'from 775,- € / night per person / All-In',
        people: 'for 2 persons',
        size: 'approx. 688 sq ft',
        previewimage: [
          {
            src: '/images/Suiten/boum/AlexMoling_Eriro_Rooms-1.jpg', width: 8190, height: 5463, mime: 'image/jpeg', title: null,
            alt: 'Living area of boum Suite: reclaimed wood ceiling, sculptural tree trunk daybed and linen sofa before panorama window with view of Wetterstein summits',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/boum/AlexMoling_Eriro_Rooms-9.jpg', width: 8192, height: 5464, mime: 'image/jpeg', title: null,
            alt: 'boum eriro Suite: reclaimed wood ceiling, stone lights and wool headboard framing double bed with white linen bedding and cashmere blanket on plank floor',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/boum/AlexMoling_Eriro_Rooms-12.jpg', width: 2048, height: 1366, mime: 'image/jpeg', title: null,
            alt: 'Bathroom of boum Suite with lime plaster walls, driftwood faucet, backlit mirror, reclaimed wood beam ceiling and glass rain shower',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/boum/AlexMoling_Eriro_Rooms-5.jpg', width: 2001, height: 3000, mime: 'image/jpeg', title: null,
            alt: 'Stylish interior of eriro Alpine Hide – sculptural designer light beneath reclaimed wood ceiling, linen fabrics and mountain panorama through window, warm sanctuary',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/boum/AlexMoling_Eriro_Rooms-16.jpg', width: 8192, height: 5464, mime: 'image/jpeg', title: null,
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
        title: 'wisa',
        description: '<p>The view through the floor-to-ceiling glass windows evokes a freeing sense of endlessness, as the green of the vast Alpine meadows meets the jagged horizon carved out by mountains under a bright blue sky. Walk barefoot in your pyjamas through the still dew-covered grass, the scent of early blooming Alpine herbs fills the air: the wisa suites are located on the ground floor and feature a south-west facing terrace and direct access to the garden and to the Ehrwalder Alpine meadow.</p>',
        minprice: 'from 925,- € / night per person / All-In',
        people: 'for 2 persons',
        size: 'approx. 872 sq ft',
        previewimage: [
          {
            src: '/images/Suiten/wisa/AlexMoling_Eriro_Rooms-43.jpg', width: 7568, height: 5048, mime: 'image/jpeg', title: null,
            alt: 'Eriro Suite living area with reclaimed wood ceiling, textured wool wall, sheepskin armchair before panorama window with terrace and view of conifer forests and mountain summits',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/wisa/AlexMoling_Eriro_Rooms-44.jpg', width: 8183, height: 5458, mime: 'image/jpeg', title: null,
            alt: 'Eriro Suite seating area with white linen cushions, wooden table and pendant light before artful patchwork wool wall beneath rustic reclaimed wood beam ceiling',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/wisa/AlexMoling_Eriro_Rooms-51.jpg', width: 8186, height: 5460, mime: 'image/jpeg', title: null,
            alt: 'Wisa Suite: reclaimed wood ceiling, natural stone wall and hand-woven dividers framing bed with white linen – sanctuary in honest materiality',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/wisa/AlexMoling_Eriro_Rooms-55.jpg', width: 8190, height: 5463, mime: 'image/jpeg', title: null,
            alt: 'Bathroom of Wisa Suite: hand-plastered vanity, driftwood faucet, backlit mirror, reclaimed wood ceiling – purist elegance meets craftsmanship',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/wisa/AlexMoling_Eriro_Rooms-57.jpg', width: 8192, height: 5464, mime: 'image/jpeg', title: null,
            alt: 'Cashmere blanket on wooden terrace of Wisa Suite at eriro with open view of Wetterstein massif, spruce forests and rock summits – alpine sanctuary',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/wisa/AlexMoling_Eriro_Rooms-77.jpg', width: 8192, height: 5464, mime: 'image/jpeg', title: null,
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
      {
        uid: '5',
        pid: '93',
        title: 'felisa',
        description: '<p>For millions of years, the Zugspitze peak has majestically towered in the sky. Its rocks, which for ages have weathered the elements – wind and weather, snow and sun – awaken a profound sense of awe within us for the magnificence of nature and the mountain. The connection to this power of the mountain’s eternal force can be felt with an exceptional intensity through the floor-to-ceiling windows of the felisa suite located on the first floor, both during the day and on starlit nights: with a west-facing orientation, the suite’s glass walls face directly out towards the Zugspitze.&nbsp;</p>',
        minprice: 'from 1.075,- € / night per person / All-In',
        people: 'for 2-4 persons ',
        size: 'approx. 1065 sq ft',
        previewimage: [
          {
            src: '/images/eriro-alpine-hide-ehrwald-luxus-suite-felisa-01.jpg', width: 1500, height: 1800, mime: 'image/jpeg', title: null,
            alt: 'Sunlit lounge corner at eriro Alpine Hide with handcrafted bouclé wall paneling, chess set on wooden table and inviting upholstered sofa in natural tones',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/felisa/AlexMoling_Eriro_Rooms-20.jpg', width: 8186, height: 5460, mime: 'image/jpeg', title: null,
            alt: 'Glass-front fireplace with slate base and cream corner bench before panorama window to spruce forests and Wetterstein mountains, Marshall speaker at eriro Alpine Hide',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/felisa/AlexMoling_Eriro_Rooms-31.jpg', width: 8192, height: 5464, mime: 'image/jpeg', title: null,
            alt: 'King bed with white hotel bedding on spruce platform, raw stone objects as wall art, golden straw headboard paneling at eriro Ehrwald beneath patinated beam ceiling',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/felisa/AlexMoling_Eriro_Rooms-35.jpg', width: 2001, height: 3000, mime: 'image/jpeg', title: null,
            alt: 'Handcrafted vanity in bathroom of eriro Alpine Hide – fine care products, bronze faucet and wooden lattice panels in warm lighting mood',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/felisa/AlexMoling_Eriro_Rooms-40.jpg', width: 8192, height: 5464, mime: 'image/jpeg', title: null,
            alt: 'Larch wood balcony of eriro with woven bench, wool cushion and direct Zugspitze view across alpine meadows to rugged Wetterstein walls in atmospheric haze',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        images: [
          {
            src: '/images/eriro-alpine-hide-ehrwald-luxus-suite-felisa-02.jpg', width: 1200, height: 1400, mime: 'image/jpeg', title: null,
            alt: 'Hand holding rough alpine limestone with moss at breaking edge – elemental materiality and mindful nature experience at eriro Alpine Hide retreat',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
      },
      {
        uid: '6',
        pid: '94',
        title: 'himil',
        description: '<p>Far away from the lights of the valley, nature reveals itself in all of its splendour. Incoming summer storms, thick clouds of snow, or a starry night sky that is nowhere else as vivid as it is on the mountain, giving the naked eye a universe of constellations and planets to savour. With floor-to-ceiling glass windows that face southwest, the loft suite’s view from the top floor stretches beyond the horizon. Mountain peaks, forest and Alpine meadows seem to penetrate deep into the room, creating a play of light and atmosphere that fall perfectly into rhythm with the shifts between day and night.</p>',
        minprice: 'from 1.475,- € / night per person / All-In',
        people: 'for 4 persons',
        size: 'approx. 2293 sq ft',
        previewimage: [
          {
            src: '/images/Suiten/himil/AlexMoling_Eriro_Rooms-67.jpg', width: 8156, height: 5440, mime: 'image/jpeg', title: null,
            alt: 'Studio suite at eriro with slate fireplace plate, patinated barn boards, cream linen lounge and hanging limestone sculptures at Ehrwald',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/himil/AlexMoling_Eriro_Rooms-61.jpg', width: 5969, height: 5461, mime: 'image/jpeg', title: null,
            alt: 'Cream daybed beneath honey-colored spruce rafters with woven furniture on balcony, Zugspitze view over spruce forest and alpine meadows at eriro Alpine Hide Ehrwald',
            crop: { default: { x: 0.07, y: 0, width: 0.729, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/himil/AlexMoling_Eriro_Rooms-62.jpg', width: 8145, height: 5433, mime: 'image/jpeg', title: null,
            alt: 'Designed-through eriro suite with colonnade of spruce trunks, full-glass pivot doors to balcony and view of Wetterstein conifer forests',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/himil/AlexMoling_Eriro_Rooms-59.jpg', width: 8190, height: 5463, mime: 'image/jpeg', title: null,
            alt: 'Loft suite at eriro with white bed on stone platform beneath recycled beams, round logs, glass room dividers and raw stone lamps at Ehrwald',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/Suiten/himil/AlexMoling_Eriro_Rooms-74.jpg', width: 8164, height: 5445, mime: 'image/jpeg', title: null,
            alt: 'Open sleeping platform with white linens beneath larch wood roof, horizontal balcony slats framing Wetterstein Mountains panorama above spruce forests at eriro',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        images: [
          {
            src: '/images/eriro-alpine-hide-ehrwald-luxus-suite-himil-02.jpg', width: 1200, height: 1400, mime: 'image/jpeg', title: null,
            alt: 'Silhouette at telescope at sunset over alpine summits – quiet evening rituals and awestruck nature observation at eriro Alpine Hide luxury retreat',
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
    title: 'Nature infuses<br>\r\nthe room',
    text: '<p>Stone, wood sourced from our own forests, and other natural Alpine materials from the area bring together eriro’s 9 suites, the rooms give a feeling of timeless luxury paired with authentic Alpine experience. Restrained in design and with an equal feel of cosiness, the suites provide a sense of structure and shelter. Nature, in its archaic splendour, floods into the room through floor-to-ceiling windows and lends to the interior with a play of light and colour.</p>\n<p><a href="/suites/boum/" class="linkdetail">TO THE SUITES</a></p>',
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
    title: 'The sound of nature echoes on skin',
    text: '<p>Here, the mountain’s contrasts meet: cool air and warm water, retreat and vastness. The saunas restore what the wind and altitude demand. Between them lies water, the primal element of life. Clear. Timeless. The spa is a return. To closeness, touch, and revitalising energy. Nature continues its work here, in water, warmth and wide-open space. From the sheltered interior, the spa opens out to the new alpine meadow infinity pool, where water, landscape and mountains become one.</p>\n<p>&nbsp;</p>\n<p><a href="/spa/">DISCOVER THE SPA</a></p>',
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

export const spaImage: ImgSection = {
  id: 712,
  type: 'mask_img',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    img: [
      {
        src: '/images/Hendrik_Stüwe/Pool_Shooting_2605_10.jpg', width: 2800, height: 1868, mime: 'image/jpeg', title: null,
        alt: '',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgsummer: [],
  },
};

export const timelessBreak: BreakSection = {
  id: 76,
  type: 'mask_break',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    title: 'Touch what time<br>\r\nhas left untouched.<br>\r\n<br>\r\nExperience <br>\r\nthe unexperienced.',
    imgleft: [
      {
        src: '/images/eriro-ehrwald-alpine-hide-luxus-natur-11.jpg', width: 1500, height: 1250, mime: 'image/jpeg', title: null,
        alt: 'Woman with flowing wool scarf in snow-covered alpine landscape – winter freedom and natural elegance at eriro Alpine Hide experience',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgleftsummer: [
      {
        src: '/images/unikateur_Bilder/eriro_alpinehide_frosch.jpg', width: 2560, height: 3838, mime: 'image/jpeg', title: null,
        alt: 'Tiny young toad sitting on gently opened palm in sunlight – golden bracelet, alpine nature discovery during eriro summer retreat',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgright: [
      {
        src: '/images/eriro-ehrwald-alpine-hide-luxus-natur-03.jpg', width: 1200, height: 950, mime: 'image/jpeg', title: null,
        alt: 'Hand holding birch log with beetle traces over campfire with sparks flying, stacked wood logs, snow background in eriro winter forest',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgrightsummer: [],
  },
};

export const mountainText: ImgTextSection = {
  id: 111,
  type: 'mask_imgtext',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    title: 'The natural <br>\r\npower of the <br>\r\nmountain',
    text: '<p>Blissful and mellow as a summery lazing about in the Alpine meadows, wild and powerful as a sudden thunderstorm, the many moods of mountain nature hone our senses to the essential. In the seclusion of the Alps, we once again become one with nature. Time-transcending mountain experiences and rituals remind us of the value of ‘the little things in life’ and anchor themselves as lasting memories - and all these special moments are part of our all-in service, ready to be discovered and enjoyed.</p>\n<p><a href="/experiences/" class="linkdetail">TO THE EXPERIENCES</a></p>',
    imgleft: [
      {
        src: '/images/eriro-ehrwald-alpine-hide-luxus-natur-04.jpg', width: 1200, height: 950, mime: 'image/jpeg', title: null,
        alt: 'Hand-knit Norwegian pattern gloves gripping antique wooden ski pole in snow – alpine winter experience at eriro Alpine Hide Ehrwald',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgright: [
      {
        src: '/images/eriro-ehrwald-spa-alpinehide-suite-03.jpg', width: 1500, height: 1350, mime: 'image/jpeg', title: null,
        alt: 'Mountaineer in brown jacket on boulder gazing up at snow-covered Wetterstein north face, mountain pine foreground at eriro Ehrwald',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgleftsummer: [
      {
        src: '/images/DR1A6575.jpg', width: 2560, height: 1708, mime: 'image/jpeg', title: null,
        alt: 'eriro Alpine Hide – Dramatic alpine landscape with cloud-draped rock walls in golden evening light, wild mountain wilderness and dark conifer silhouettes',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgrightsummer: [
      {
        src: '/images/unikateur_Bilder/eriro_alpinehide_massivmann.jpg', width: 2560, height: 1708, mime: 'image/jpeg', title: null,
        alt: 'Person in yellow wool sweater before mighty Wetterstein rock wall at Ehrwald – alpine awe and vastness in scree field near eriro Alpine Hide',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
  },
}; // "The natural power of the mountain"

export const mountainImage: ImgSection = {
  id: 119,
  type: 'mask_img',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    img: [
      {
        src: '/images/Suiten/himil/AlexMoling_Eriro_Winter-first-5.jpg', width: 3000, height: 2000, mime: 'image/jpeg', title: null,
        alt: 'eriro Alpine Hide – Aerial view of exclusive wooden chalet nestled in pristine snow-covered alpine valley surrounded by summits and conifer forests',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgsummer: [
      {
        src: '/images/unikateur_Bilder/eriro_alpinehide_lichtungfrau.jpg', width: 2560, height: 1708, mime: 'image/jpeg', title: null,
        alt: 'Woman in black dress standing on sunlit forest clearing at Ehrwald – Wetterstein summits and spruce forests at eriro Alpine Hide',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
  },
};

export const culinaryText: ImgTextSection = {
  id: 112,
  type: 'mask_imgtext',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    title: 'The flavour <br>\r\nof mountain <br>\r\norigins ',
    text: '<p>A real fuir heats the stove, seasons and ever-changing weather conditions of the mountain are plated before you. Coarse and powerful like the rock of the mountain, or mild and delicate like a gentle summer\'s day, the dishes reflect the pulsating moods of mountain nature. Fresh local ingredients and traditional Tyrolean recipes inspire the kitchen’s creative cuisine of origins which can be discovered anew each day as part of the all-inclusive experience. Served on wood, stone or in the form of a nest, each dish is a culinary work of art.&nbsp;</p>',
    imgleft: [
      {
        src: '/images/eriro-ehrwald-alpinehide-kulinarik-04.jpg', width: 1200, height: 950, mime: 'image/jpeg', title: null,
        alt: 'Smoked lamb rack on alpine spruce branches with rising smoke – culinary experience at eriro Alpine Hide near Zugspitze',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgright: [
      {
        src: '/images/eriro-ehrwald-alpinehide-kulinarik-01.jpg', width: 1500, height: 1350, mime: 'image/jpeg', title: null,
        alt: 'Nordic-alpine cuisine at eriro: Transparent cucumber consommé with elderflowers, nettle, dill and chervil in white bowl on weathered reclaimed wood',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgleftsummer: [],
    imgrightsummer: [],
  },
}; // "The flavour of mountain origins"

export const culinaryImage: ImgSection = {
  id: 551,
  type: 'mask_img',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    img: [
      {
        src: '/images/eriro-alpine-hide-oesterreich-ehrwald-luxus-12.jpg', width: 2560, height: 1440, mime: 'image/jpeg', title: null,
        alt: 'Carved tree trunk table at eriro with branch root feet, hand-thrown bowl, dried flower vase on wool felt rug before bamboo lattice',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgsummer: [],
  },
};

export const teaserSlider: TeaserSliderSection = {
  id: 78,
  type: 'mask_teaserslider',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    teaserslides: [
      {
        uid: '1',
        title: 'Bask in stillness',
        imgleft: [
          {
            src: '/images/efbeebba62dc9d46c61edb9fb05fef06.jpg', width: 2403, height: 2867, mime: 'image/jpeg', title: null,
            alt: 'Woman\'s hands meditatively cupping crystal-clear mountain spring water from Wetterstein stream with droplets and fine gold jewelry',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        imgright: [
          {
            src: '/images/Best-Of_Alex_Moling/AlexMoling_Eriro_Wellness-9.jpg', width: 7564, height: 5045, mime: 'image/jpeg', title: null,
            alt: 'Infinity pool at eriro with overflow edge toward sunset over Wetterstein and Mieminger ranges, mirroring water surface beneath dark wood ceiling',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        infotext: 'Origins of the Alpine region',
        linktext: 'Path to regeneration',
        link: { href: '/spa/', target: null, class: null, title: null, linkText: 't3://page?uid=108', additionalAttributes: [] },
      },
    ],
  },
};

export const partnerMarquee: PartnerMarqueeSection = {
  id: 611,
  type: 'mask_partnermarquee',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: {
    title: ' Recommended by',
    text: '',
    partners: [
      {
        uid: '87',
        img: [
          {
            src: '/images/Logos/bilanz.png', width: 3750, height: 2084, mime: 'image/png', title: null,
            alt: 'Logo BILANZ in red serif font – Swiss business magazine reporting on eriro Alpine Hide luxury hotel in Ehrwald, Tyrol',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '38',
        img: [
          {
            src: '/images/Logos/ad.png', width: 456, height: 500, mime: 'image/png', title: null,
            alt: 'Logo AD Architectural Digest in black font – press report about eriro Alpine Hide design hotel in Ehrwald, Tyrol',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '39',
        img: [
          {
            src: '/images/Logos/condé_nast.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Condé Nast Traveler in elegant sans-serif – media partner of eriro Alpine Hide luxury hotel in Ehrwald, Zugspitze',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '40',
        img: [
          {
            src: '/images/Logos/elle.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo ELLE in distinctive capital letter serif font – media mention of eriro Alpine Hide design hotel at Zugspitze',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '41',
        img: [
          {
            src: '/images/Logos/fallstaff.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Falstaff in elegant black serif font – culinary and lifestyle media partner of eriro Alpine Hide in Tyrol',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '42',
        img: [
          {
            src: '/images/Logos/financial_times.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Financial Times in classic serif font – British business newspaper reporting on eriro Alpine Hide in Tyrol',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '43',
        img: [
          {
            src: '/images/Logos/forbes.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Forbes in classic bold serif font – business magazine reporting on eriro Alpine Hide luxury hotel in Ehrwald',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '44',
        img: [
          {
            src: '/images/Logos/harpers_bazaar.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Harper\'s Bazaar in elegant serif font with high-contrast stroke weights – international press feature of eriro Alpine Hide',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '45',
        img: [
          {
            src: '/images/Logos/monocle.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Monocle in black font – international media feature about eriro Alpine Hide luxury hideaway near Zugspitze',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '46',
        img: [
          {
            src: '/images/Logos/national_geopgraphic.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo National Geographic in yellow-black frame – international press coverage of eriro Alpine Hide luxury hotel in Ehrwald',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '47',
        img: [
          {
            src: '/images/Logos/robb_report.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Robb Report in classic serif font – American luxury lifestyle magazine about eriro Alpine Hide in Ehrwald',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '49',
        img: [
          {
            src: '/images/Logos/telegraph.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo The Telegraph in Gothic script – international press mention of eriro Alpine Hide boutique hotel in Ehrwald at Zugspitze',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '50',
        img: [
          {
            src: '/images/Logos/the_times.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo The Times with royal coat of arms between lion and unicorn – British newspaper reporting on eriro Alpine Hide',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '52',
        img: [
          {
            src: '/images/Logos/wallpaper.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Wallpaper* magazine in black font – design and architecture press partner of eriro Alpine Hide retreat in Ehrwald',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '21',
        img: [
          {
            src: '/images/Logos/ad.png', width: 456, height: 500, mime: 'image/png', title: null,
            alt: 'Logo AD Architectural Digest in black font – press report about eriro Alpine Hide design hotel in Ehrwald, Tyrol',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '22',
        img: [
          {
            src: '/images/Logos/condé_nast.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Condé Nast Traveler in elegant sans-serif – media partner of eriro Alpine Hide luxury hotel in Ehrwald, Zugspitze',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '23',
        img: [
          {
            src: '/images/Logos/elle.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo ELLE in distinctive capital letter serif font – media mention of eriro Alpine Hide design hotel at Zugspitze',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '24',
        img: [
          {
            src: '/images/Logos/fallstaff.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Falstaff in elegant black serif font – culinary and lifestyle media partner of eriro Alpine Hide in Tyrol',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '25',
        img: [
          {
            src: '/images/Logos/financial_times.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Financial Times in classic serif font – British business newspaper reporting on eriro Alpine Hide in Tyrol',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '26',
        img: [
          {
            src: '/images/Logos/forbes.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Forbes in classic bold serif font – business magazine reporting on eriro Alpine Hide luxury hotel in Ehrwald',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '27',
        img: [
          {
            src: '/images/Logos/harpers_bazaar.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Harper\'s Bazaar in elegant serif font with high-contrast stroke weights – international press feature of eriro Alpine Hide',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '28',
        img: [
          {
            src: '/images/Logos/monocle.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Monocle in black font – international media feature about eriro Alpine Hide luxury hideaway near Zugspitze',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '29',
        img: [
          {
            src: '/images/Logos/national_geopgraphic.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo National Geographic in yellow-black frame – international press coverage of eriro Alpine Hide luxury hotel in Ehrwald',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '30',
        img: [
          {
            src: '/images/Logos/robb_report.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Robb Report in classic serif font – American luxury lifestyle magazine about eriro Alpine Hide in Ehrwald',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '32',
        img: [
          {
            src: '/images/Logos/telegraph.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo The Telegraph in Gothic script – international press mention of eriro Alpine Hide boutique hotel in Ehrwald at Zugspitze',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '33',
        img: [
          {
            src: '/images/Logos/the_times.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo The Times with royal coat of arms between lion and unicorn – British newspaper reporting on eriro Alpine Hide',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '35',
        img: [
          {
            src: '/images/Logos/wallpaper.png', width: 900, height: 500, mime: 'image/png', title: null,
            alt: 'Logo Wallpaper* magazine in black font – design and architecture press partner of eriro Alpine Hide retreat in Ehrwald',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
      {
        uid: '88',
        img: [
          {
            src: '/images/Logos/michelin_guide_second.png', width: 3750, height: 2084, mime: 'image/png', title: null,
            alt: 'Logo Michelin Guide in red with blossom symbol and heart – gastronomic distinction for eriro Alpine Hide at Zugspitze',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        link: '',
      },
    ],
  },
}; // "Recommended by"

export const home: PageContent = {
  id: 1,
  slug: '/',
  backendLayout: 'defaultLayout',
  meta: {
    title: 'Leonaara - Experience alpine originality',
    description: 'Experience the power of nature that has dominated the mountain for millions of years: with just 9 suites, the smallest luxury hideaway is located at 1,550m in the middle of the alpine region of the Tyrolean Alps.',
    ogTitle: 'eriro Alpine Hide',
    ogDescription: 'Experience the power of nature that has dominated the mountain for millions of years: with just 9 suites, the smallest luxury hideaway is located at 1,550m in the middle of the alpine region of the Tyrolean Alps.',
    ogImage: {
      src: '/images/2c0a3fac2ab04ecb63b3c016f3214849.jpg', width: 4096, height: 2732, mime: 'image/jpeg', title: null,
      alt: 'Young woman in black dress standing contemplatively on alpine meadow framed by spruce forest and Zugspitze Wetterstein limestone in golden evening light',
      crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
    },
    twitterTitle: 'Home',
    twitterDescription: 'Experience the power of nature that has dominated the mountain for millions of years: with just 9 suites, the smallest luxury hideaway is located at 1,550m in the middle of the alpine region of the Tyrolean Alps.',
    twitterImage: null,
    twitterCard: 'summary',
    robots: { noIndex: false, noFollow: false },
  },
  columns: {
    colPos0: [
      hero, originsText, originsVideo, pressQuote, roomSlider, roomNatureText, spaText,
      spaImage, timelessBreak, mountainText, mountainImage, culinaryText, culinaryImage,
      teaserSlider, partnerMarquee,
    ],
  },
};
