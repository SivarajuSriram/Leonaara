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
    // First <br> dropped (was a conditional max-md:hidden one, mobile-only) so "Bringing
    // Purpose" joins onto one line at every width -- per the user's explicit "two lines"
    // request, extended from mobile-only to desktop too. 2 lines total: "Bringing Purpose" /
    // "to Existence".
    titleh2: 'Bringing Purpose<br>\r\nto Existence',
    titleimg: 'ROOTED TO THE ELEMENTS OF NATURE ',
    text: '<p>und wir werden uns um den Rest kümmern<br>Ich bin ein kleiner Blindtext. Und zwar schon so lange ich denken kann. Es war nicht leicht zu verstehen, was es bedeutet, ein blinder Text zu sein: Man macht keinen Sinn. Wirklich keinen Sinn. Man wird zusammen hangsloseingeschoben und rumgedreht und wir werden uns um den Rest kümmern. Ich bin ein kleiner.</p>',
    img: [
      {
        src: '/images/leonaara-hero-mountain-road.jpg', width: 3200, height: 1600, mime: 'image/jpeg', title: null,
        alt: 'Gravel road cutting through a green alpine meadow toward a dark, storm-lit mountain ridge under a brooding sky',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    sideimg: [
      {
        src: '/images/leonaara-windswept-grass.jpg', width: 3199, height: 1791, mime: 'image/jpeg', title: null,
        alt: 'Close-up of tall feathery reed grass plumes bending in the wind against a soft blue mountain backdrop',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgsummer: [
      {
        src: '/images/leonaara-hero-mountain-road.jpg', width: 3200, height: 1600, mime: 'image/jpeg', title: null,
        alt: 'Gravel road cutting through a green alpine meadow toward a dark, storm-lit mountain ridge under a brooding sky',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    sideimgsummer: [
      {
        src: '/images/leonaara-windswept-grass.jpg', width: 3199, height: 1791, mime: 'image/jpeg', title: null,
        alt: 'Close-up of tall feathery reed grass plumes bending in the wind against a soft blue mountain backdrop',
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
        src: '/images/leonaara-tree-embrace.jpg', width: 3200, height: 1800, mime: 'image/jpeg', title: null,
        alt: 'Bare arms wrapped around a tree trunk in a sunlit forest, hands clasped in a gentle embrace',
        // Non-identity crop, left-anchored (x:0) on both variants: the source
        // photo's hug is left-of-center (~31% across, measured against the
        // full 7396px width), and object-fit:cover's default center-crop at
        // this display slot's much narrower aspect ratio (501:390 desktop,
        // 117:105 mobile) trimmed enough off both sides that the hug read as
        // pushed toward the left edge of the frame. Anchoring the crop
        // window's left edge at the image's own left edge (rather than
        // centering it) is the rightward shift the user asked for -- pulling
        // the window as far left as it'll go without cropping the arms
        // themselves lands the hug close to centered (~43% desktop, ~49%
        // mobile) instead of ~23%. Width fractions are targetAspectRatio /
        // sourceAspectRatio (source is 7396/4160 = 1.778): 0.72 for desktop
        // (501/390 / 1.778), 0.62 for mobile (117/105 / 1.778). Regenerate
        // the actual cropped files with `npx tsx scripts/gen-image-crops.ts`
        // after editing this.
        crop: { default: { x: 0, y: 0, width: 0.72, height: 1 }, mobile: { x: 0, y: 0, width: 0.62, height: 1 } },
      },
    ],
    imgright: [
      {
        src: '/images/leonaara-forest-fireflies.jpg', width: 3200, height: 1786, mime: 'image/jpeg', title: null,
        alt: 'Fireflies glowing along a moss-covered forest path at night, beneath a crescent moon and starlit sky',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgleftsummer: [
      {
        src: '/images/leonaara-tree-embrace.jpg', width: 3200, height: 1800, mime: 'image/jpeg', title: null,
        alt: 'Bare arms wrapped around a tree trunk in a sunlit forest, hands clasped in a gentle embrace',
        // Non-identity crop, left-anchored (x:0) on both variants: the source
        // photo's hug is left-of-center (~31% across, measured against the
        // full 7396px width), and object-fit:cover's default center-crop at
        // this display slot's much narrower aspect ratio (501:390 desktop,
        // 117:105 mobile) trimmed enough off both sides that the hug read as
        // pushed toward the left edge of the frame. Anchoring the crop
        // window's left edge at the image's own left edge (rather than
        // centering it) is the rightward shift the user asked for -- pulling
        // the window as far left as it'll go without cropping the arms
        // themselves lands the hug close to centered (~43% desktop, ~49%
        // mobile) instead of ~23%. Width fractions are targetAspectRatio /
        // sourceAspectRatio (source is 7396/4160 = 1.778): 0.72 for desktop
        // (501/390 / 1.778), 0.62 for mobile (117/105 / 1.778). Regenerate
        // the actual cropped files with `npx tsx scripts/gen-image-crops.ts`
        // after editing this.
        crop: { default: { x: 0, y: 0, width: 0.72, height: 1 }, mobile: { x: 0, y: 0, width: 0.62, height: 1 } },
      },
    ],
    imgrightsummer: [
      {
        src: '/images/leonaara-forest-fireflies.jpg', width: 3200, height: 1786, mime: 'image/jpeg', title: null,
        alt: 'Fireflies glowing along a moss-covered forest path at night, beneath a crescent moon and starlit sky',
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
        description: '<p><strong>22 Acres | 800 Sq. Yds. | 81 Estates | G & G+1 Estates</strong></p><p>Inspired by Dolce Far Niente, the art of unhurried living, Kadamba is built on the belief that a home should enrich everyday life.  Rooted in nature’s finest luxuries: sunlight, fresh air, open space, and silence, Kadamba invites you to slow down, breathe deeply, and reconnect with what matters most.</p><p>Spread across 22 lush acres, Kadamba offers an exclusive low-density sanctuary designed for maximum privacy, tranquility, and room to breathe.</p>',
        minprice: '',
        people: '',
        size: '',
        previewimage: [
          {
            src: '/images/leonaara-kadamba-villa-2.jpg', width: 2400, height: 1350, mime: 'image/jpeg', title: null,
            alt: 'Kadamba villa exterior surrounded by mature trees, with a lush landscaped entrance and covered carport',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
          {
            src: '/images/leonaara-kadamba-villa-1.jpg', width: 1926, height: 817, mime: 'image/jpeg', title: null,
            alt: 'Kadamba villa exterior at dusk with warm architectural lighting, wood-clad gable roof, stone accent wall and covered carport',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        images: [
          {
            src: '/images/leonaara-kadamba-villa-1.jpg', width: 1926, height: 817, mime: 'image/jpeg', title: null,
            alt: 'Kadamba villa exterior at dusk with warm architectural lighting, wood-clad gable roof, stone accent wall and covered carport',
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
            src: '/images/leonaara-anantha-meadow.jpg', width: 1642, height: 2000, mime: 'image/jpeg', title: null,
            alt: 'Sunlit green hillside meadow with scattered trees rising toward a ridge under a wide blue sky',
            crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
          },
        ],
        images: [
          {
            src: '/images/leonaara-anantha-meadow.jpg', width: 1642, height: 2000, mime: 'image/jpeg', title: null,
            alt: 'Sunlit green hillside meadow with scattered trees rising toward a ridge under a wide blue sky',
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
        src: '/images/leonaara-forest-canopy.jpg', width: 2464, height: 1856, mime: 'image/jpeg', title: null,
        alt: 'Looking straight up through a dense green forest canopy at gnarled, intertwining tree branches',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgright: [
      {
        src: '/images/leonaara-water-reflection.jpg', width: 2464, height: 1856, mime: 'image/jpeg', title: null,
        alt: 'Rippling water surface reflecting a figure and trees in soft, fractured light and shadow',
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
        src: '/images/leonaara-lakeside-repose.jpg', width: 2464, height: 1856, mime: 'image/jpeg', title: null,
        alt: 'Woman in white seated on a folding chair on a lakeside lawn, framed beneath a dark pine bough with blurred foliage in the foreground',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgright: [
      {
        src: '/images/leonaara-misty-hills.jpg', width: 2000, height: 1116, mime: 'image/jpeg', title: null,
        alt: 'Sunlit green hillside meadow with scattered trees rising toward a ridge under a wide blue sky',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgleftsummer: [
      {
        src: '/images/leonaara-lakeside-repose.jpg', width: 2464, height: 1856, mime: 'image/jpeg', title: null,
        alt: 'Woman in white seated on a folding chair on a lakeside lawn, framed beneath a dark pine bough with blurred foliage in the foreground',
        crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
      },
    ],
    imgrightsummer: [
      {
        src: '/images/leonaara-misty-hills.jpg', width: 2000, height: 1116, mime: 'image/jpeg', title: null,
        alt: 'Sunlit green hillside meadow with scattered trees rising toward a ridge under a wide blue sky',
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
      src: '/images/leonaara-hero-mountain-road.jpg', width: 3200, height: 1600, mime: 'image/jpeg', title: null,
      alt: 'Gravel road cutting through a green alpine meadow toward a dark, storm-lit mountain ridge under a brooding sky',
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
