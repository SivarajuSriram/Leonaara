# eriro.at English site: 1:1 rebuild in Next.js

Date: 2026-09-04
Status: draft for review

## 1. Goal

Rebuild https://www.eriro.at/en/ (all 25 English pages plus the 7 routes the site loads lazily) as a pixel-exact, behaviour-exact clone on a modern React stack:

- Next.js latest stable at scaffold time (16.x today, App Router), React 19, TypeScript strict
- Tailwind CSS v4 (CSS-first `@theme`), plus plain CSS where Tailwind cannot express a rule verbatim
- GSAP 3.15 (latest) with ScrollTrigger, ScrollSmoother, SplitText, MorphSVGPlugin, Draggable, InertiaPlugin, ScrollToPlugin (all free on npm since 3.13)
- Swiper 14 (latest, React components) for every slider the original builds with Swiper
- lucide-react installed and available; the site's own hand-drawn SVG artwork is inlined as React components because Lucide has no 1:1 equivalents
- Karol Sans self-hosted (4 woff2 files) through `next/font/local`
- Deployable to Vercel with zero config; deployment itself is out of scope for now

"1:1" means: same text, same images, same layout at every breakpoint, same fonts, same colours, same spacing, same scroll and hover behaviour, same animation timings and easings, same slider behaviour, same URLs.

## 2. Non-goals

- German mirror (`/de/`): phase 3, not in this spec. `hreflang` for `de` is omitted until it exists.
- Backend/CMS: content is static TypeScript files, not TYPO3.
- Analytics and trackers (nootiz, gtag, AdditiveTR, Google site verification): not cloned.
- The `mask_marquee` top ribbon component: exists in the bundle but no page currently uses it. Not built.
- Real e-mail delivery from the forms: the route handler is built and validated, delivery is behind an optional env var (see 9.6).

## 3. What the original is (findings)

- Nuxt 3 + Vue 3 front end, TYPO3 headless backend (`typo3.eriro.at`), images through Nuxt `_ipx` with explicit crop/size per breakpoint, Adobe Fonts kit `lmg1rih` for Karol Sans (300, 400, italics).
- Fluid scale: `:root` font-size is `2.7778vw` below 768px, `1.5021vw` from 768px, `0.5208vw` from 1024px (10px at 1920). Every dimension on the site is in rem, so the whole page scales with viewport width.
- One breakpoint for layout changes: `max-width: 1023px` is "mobile", `min-width: 1024px` is "desktop".
- Colours: text `#211d1d`, beige `#e4e0db` (body background, header bar when scrolled, break section, borders, button hover), paper texture `HG.jpg` fixed full-screen at `z-index: -1` behind everything, selection `#211d1d`/white, form error red `#ea0000`, dropdown `#f4f2ed`.
- Motion: GSAP ScrollSmoother (`smooth: 1.5, effects: true, smoothTouch: 0.1, normalizeScroll: false`, disabled below 1024px), per-image parallax speeds via `effects`, SplitText word-by-word fade scrubbed by scroll, MorphSVG hamburger and accordion icons, a horizontal-loop helper for marquees, ScrollTrigger pinning for filter bars.
- Swiper for: suite slider (home), teaser slider, suite detail gallery, image slider, partner logo slider (hidden, display none).
- Page transition: `.page-enter-from/.page-leave-to { opacity: 0; filter: blur(1rem); transform: translateY(2rem) }`, 0.6s.
- Season switch: every image-bearing section has `*summer` variants. The getter `isWinter` is `false` unless both `seasonswitchstart` and `seasonswitchend` are set; the site currently has `seasonswitchstart: 0`, so summer is always active. The clone keeps both variants in content and reproduces the rule with the same two timestamps.

## 4. Routes

| Route | Backend layout | Sections (colPos: type) |
|---|---|---|
| `/en/` | default | hero:default, imgtext, video(empty), quote, roomslider, imgtext, imgtext, img, break, imgtext, img, imgtext, img, teaserslider(1), partnermarquee |
| `/en/all-in-service/` | default | hero:subpage, imgtext, list(4), galleryslider(11) |
| `/en/alpine-hide/` | default | hero:subpage, imgtext, quote, img, imgtext, accordions(5), video(empty), accordions(2), teaserslider(3) |
| `/en/booking-conditions/` | default | hero:subpage, accordions(7), galleryslider(5) |
| `/en/contact-and-arrival/` | default | hero:only-text, accordions(3), maps, hero:only-text, powermail(contact), video |
| `/en/cookies/` | 8 | footerpagetext, includepage(html), cookieconsentbutton |
| `/en/culinary/` | default | hero:subpage, imgtext, img, imgtext, img, teaserslider(3) |
| `/en/eriro-exclusive/` | default | hero:subpage, imgtext, list(2), galleryslider(14) |
| `/en/experiences/` | default | hero:only-text, pagefilter(5 subpages), teaserslider(3) |
| `/en/gallery/` | default | hero:only-text, gallery(34) |
| `/en/imprint/` | 8 | footerpagetext |
| `/en/jobs/` | default | hero:subpage, imgtext, jobs(4 categories) |
| `/en/newsletter/` | default | hero:only-text, newsletter widget, video, teaserslider(3) |
| `/en/origin/` | default | hero:subpage, imgtext, video, accordions(3), img, imgtext, teaserslider(3) |
| `/en/press/` | default | hero:only-text, accordions(3), galleryslider(14) |
| `/en/privacy/` | 8 | footerpagetext, includepage(html), footerpagetext |
| `/en/request/` | default | hero:only-text, powermail(request) |
| `/en/spa/` | default | hero:only-text, imgtext, accordions(4), video, break, imgtext, accordions(2), imgtext, accordions(2), img, imgtext, video(empty), teaserslider(3) |
| `/en/suites/{boum,wisa,felisa,himil}/` | 2 | colPos0: hero:only-text, rooms(filter); colPos5: roomdetail, imgslider(8–10), list(3), img(space-before large), roomcta, teaserslider(1) |
| `/en/summer/` | default | hero:subpage, imgtext, list(9), galleryslider(8) |
| `/en/voucher/` | default | hero:only-text, voucher widget, img, teaserslider(3) |
| `/en/winter/` | default | hero:subpage, imgtext, list(10), galleryslider(8) |
| `/en/{leiba,sela,herchomen,hantwerc,sneo}/` | 11 | colPos0: shortcut (renders the experiences page shell); colPos5: hero:subpage, imgtext, then img or video |
| `/en/request/thank-you/`, `/en/contact-and-arrival/thank-you/` | 10 | thankyoupage |
| `/` | | permanent redirect to `/en/` |

Unknown routes render the site's 404 page (`mask_errorpage`: logo SVG, "something went wrong" title, redirect text, loading bar animation that runs 5s after a 1s delay, then redirects to `/en/`).

## 5. Project structure

```
/home/sriram/Office_work/eriro
  app/
    layout.tsx                 html/body, fonts, texture image, Header, Footer, SmoothScroll, CookieConsent
    page.tsx                   redirect('/en/')
    not-found.tsx              error page
    en/page.tsx                home
    en/[...slug]/page.tsx      every other page; generateStaticParams from content registry
    api/forms/[form]/route.ts  request + contact submissions
  components/
    layout/    Header, Menu, MenuIcon, Logo, Footer, SmoothScroll, PageTransition, SeasonProvider
    sections/  Hero, ImgText, Img, Video, Quote, Break, RoomSlider, TeaserSlider, PartnerMarquee,
               GallerySlider, Gallery, List, Accordions, Jobs, PageFilter, Rooms, RoomDetail,
               ImgSlider, RoomCta, Maps, NewsletterWidget, VoucherWidget, FooterPageText,
               IncludePage, CookieConsentButton, ThankYouPage, Shortcut, Mask (section wrapper)
    forms/     PowermailForm, FormPage, fields/{Input,Textarea,Radio,Select,DateRange,Counter,
               Kids,KidsAge,Checkbox,Hidden,Divider,Text,Submit,RoomsSelect}
    ui/        Picture, Button (ht-button), BigLink (ht-biglink), LinkDetail, SplitWords,
               RichText, icons/{Logo,MenuIcon,Tel,Mail,Map,Voucher,Gallery,ArrowSlider,
               SubmenuIcon,AccordionIcon1..4,Checkbox,Unikateur,Plus,Minus,SelectArrow}
  lib/
    gsap.ts                    registerPlugin once, client only
    horizontalLoop.ts          port of the GSAP helper used by both marquees
    season.ts                  isWinter rule
    content.ts                 types + registry of all pages
    images.ts                  image descriptor helpers (aspect ratio per breakpoint, sizes)
  content/
    site.ts                    nav, footer navs, contact vars, booking link, i18n strings, cookie texts
    en/home.ts, en/alpine-hide.ts, ... one file per route (typed PageContent)
    en/forms/request.ts, contact.ts
  public/
    images/...                 originals, same relative paths as fileadmin/user_upload
    videos/...                 3 files (2 mp4, 1 mov)
    fonts/karol-sans-*.woff2   4 files
    favicon.svg + png set
  styles/
    globals.css                @import tailwindcss, @theme tokens, root font-size rules, reset,
                               typography classes, grid, cookie-consent theme overrides
```

Component CSS that cannot be expressed as Tailwind utilities verbatim (nth-child grid patterns, scoped descendant rules, keyframes) lives in a CSS module next to the component. Tailwind utilities with arbitrary rem values cover everything else; the numbers are copied from the original stylesheet, never rounded.

## 6. Content model

```ts
type ImageRef = { src: string; width: number; height: number; alt: string; title?: string;
                  crop?: { default: CropArea; mobile: CropArea } };
type Link = { href: string; target?: '_blank' | null; text?: string };
type Appearance = { spaceBefore: '' | 'small' | 'medium' | 'large' };

type Section =
  | { type: 'hero'; layout: 'default' | 'subpage' | 'only-text'; title: Html; titleh2: Html;
      titleimg?: Html; text?: Html; img: ImageRef[]; sideimg: ImageRef[];
      imgsummer: ImageRef[]; sideimgsummer: ImageRef[] }
  | { type: 'imgtext'; title: Html; text: Html; imgleft; imgright; imgleftsummer; imgrightsummer }
  | { type: 'img'; img; imgsummer }
  | { type: 'video'; video: VideoRef[]; videosummer: VideoRef[] }
  | { type: 'quote'; quote: Html; autor: string; img: ImageRef[] }
  | { type: 'break'; title: Html; imgleft; imgright; imgleftsummer; imgrightsummer }
  | { type: 'roomslider'; rooms: Room[] }
  | { type: 'teaserslider'; slides: TeaserSlide[] }
  | { type: 'partnermarquee'; title: Html; partners: Partner[] }
  | { type: 'galleryslider'; images: ImageRef[] }
  | { type: 'gallery'; images: ImageRef[] }
  | { type: 'list'; title?: Html; text?: Html; items: { title: Html; text: Html }[] }
  | { type: 'accordions'; title?: Html; text?: Html; items: AccordionItem[] }
  | { type: 'jobs'; categories: JobCategory[] }
  | { type: 'pagefilter'; pages: { title: string; slug: string }[] }
  | { type: 'rooms'; rooms: { title: string; slug: string }[] }
  | { type: 'roomdetail'; room: Room; icons: ImageRef[] }
  | { type: 'imgslider'; images; imgsummer }
  | { type: 'roomcta'; room: { title; asacode; bookingcode } }
  | { type: 'maps'; lat; lng; zoom: 14; style: google.maps.MapTypeStyle[]; marker: ImageRef; markerLink: Link }
  | { type: 'newsletter'; html: string; script: string }
  | { type: 'voucher' }
  | { type: 'footerpagetext'; title?: Html; text?: Html }
  | { type: 'includepage'; html: string }
  | { type: 'cookieconsentbutton'; text: string }
  | { type: 'thankyoupage'; title; text; link; linktext; socialstitle; socials }
  | { type: 'powermail'; form: PowermailForm }
  | { type: 'shortcut'; of: '/en/experiences/' };

type PageContent = { slug: string; pageId: number; backendLayout: 'default' | '2' | '8' | '10' | '11';
  meta: { title; description; ogTitle; ogDescription; ogImage; twitterCard; robots };
  columns: { colPos0: Section[]; colPos5?: Section[] } };
```

`Html` is a string containing the original rich text (`<br>`, `<i>`, `<ul>`, `<a>`, `<h4>`), rendered through `RichText` (sanitised `dangerouslySetInnerHTML`). Text is copied verbatim from the crawled payloads, including typographic quotes and the site's own typos (e.g. "fuir", "Unparalled").

Source of truth for authoring: the crawled `pages/*.json` and `api/*.json` payloads in the session scratchpad (see memory note `eriro_clone`). A one-off script converts them to the TypeScript content files so nothing is retyped by hand.

## 7. Global design system (globals.css)

Root font-size and breakpoints, reset, body, `::selection`, `img { display:block; object-fit:cover; user-select:none }`, `a { display:inline-block; transition: all .5s }`, tables, `ul` with the custom SVG bullet, `ol` with `padding-left: 2.5ch`, `.abcList`.

Grid:
- `--grid-gap: 2.5rem; --grid-margin: 5.5rem` (mobile `1rem` / `0`)
- `.grid-container`: 14 columns `[margin] 1fr×12 [margin]`, `column-gap: var(--grid-gap)`
- `.grid-container-inner`: 12 × 1fr
- `.grid-container > div:first-child:last-child:not([class])` spans columns 2–13

Typography classes (desktop / mobile):
- body: 2.5rem, 300, lh 148% / 1.6rem, ls .1em, lh 144%
- `h1,.h1,h4,.h4`: 2rem, 300, ls .08em, lh 125%, uppercase / 1.3rem, ls .05em, lh 131%
- `h2,.h2`: 10rem, 300, ls .03em, lh 90% / 4.2rem, ls .05em, lh 98%
- `h3,.h3`: 6.7rem, 300, lh 88%, uppercase / 3.5rem, ls .05em, lh 114%
- `a.linkdetail`: 2rem, 300, ls .08em, lh 125%, uppercase, `margin-top: 4.5rem` inside sections / 1.7rem, lh 94%
- `.ht-biglink`: 4.5rem, 300, ls .08em, lh 111%, underline, uppercase; hover underline transparent / 3.5rem
- `.small-font`: 2rem, 400, ls .08em, lh 125%, uppercase / 1.7rem, lh 94%
- `a.ht-button`: 2rem, 300, ls .08em, lh 125%, uppercase, `border: 2px solid #e4e0db`, `padding: 1.5rem 2rem`, hover `background: #e4e0db` / 1.3rem, padding 1rem 2rem
- `main a`: underline in currentColor, hover underline `#e4e0db`
- `.space-before-`: 19rem / 9rem; `-small` 10 / 1.5; `-medium` 18 / 6; `-large` 25 / 12
- Footer text: 2rem, 400, ls .08em, lh 125%, uppercase / 1.3rem, ls .05em, lh 131%

Page transition: wrapper gets the enter/leave classes; GSAP or CSS transition 0.6s with `opacity`, `filter: blur(1rem)`, `translateY(2rem)`.

`prefers-reduced-motion`: the original collapses all CSS animations to 1ms; GSAP tweens are not disabled. Same here.

## 8. Layout components

### 8.1 Header (`.upper`, fixed)
- Desktop: `padding-top: 12.5rem`; menu button cols 2–5 left (SVG 5.5×2.9rem); Request + Book links (`.ht-biglink.small-font`, second link `margin-left: 3rem`) right-aligned cols 10–13. Book opens `https://be.synxis.com/?chain=22402&hotel=47531&src=24C` in a new tab. Request goes to `/en/request/`.
- `body.scrolled` (desktop only): background `#e4e0db`, `padding: 4rem 0 2rem`, transitions `padding .5s ease, background-color .5s ease`. The class is added on any downward scroll and removed only when `scrollY` returns to 0 (exact rule from the bundle).
- Mobile: beige SVG blob background (`background-size: cover`, positioned bottom right), `padding: 1.6rem 0`; buttons cols 2–8 left, menu button cols 10–13 right, SVG 3.5×1.8rem.
- `z-index: 100`; header gets `header-menu-open` while the menu is open, and `.upper` gets `menu-open` (the scrolled background is suppressed while open). Request/Book are hidden (`v-show`) while the menu is open.

### 8.2 Logo (`.logo-wrapper`, fixed, pointer-events none)
- Desktop `padding-top: 12.5rem`, logo SVG 56.7rem wide centred in cols 5–8. Mobile `padding-top: 9rem`, 16.5rem wide.
- ScrollTrigger timeline on the wrapper (trigger itself, `start: 'top top', end: 'bottom top', scrub: true`): `translateY: '-80%'` ease `sine.inOut`; `opacity: 0` with `delay: .1` ease `expoScale(0.5,7,none)`; `scale: .6` ease `expoScale(0.5,7,none)`. Link is disabled while scrolled.

### 8.3 Menu
- `.menu-bg`: fixed full-screen `#211d1db3`, hidden until opened, click closes.
- `.menu-outline`: fixed, inset 2rem, overflow hidden, pointer-events none (mobile inset 0).
- `.menu`: `54.2rem` wide, height 100%, background `#e4e0db`, `padding: 27rem 6rem 6rem`, initial `transform: translateY(-101%)`, `will-change: transform`. Mobile: full width, `padding: 15rem 1rem 1.5rem 6.8rem`.
- `.nav-info` (tel, mail, map, voucher, gallery icons): absolute `top: 10.5rem; right: 6rem`, each 2.9rem tall, `margin-right: 2.8rem`, hover `opacity: .5`. Mobile: centred at bottom `7.5rem`, plus `.mobile-hr` 1px line at bottom 5rem and `.nav-lang` (Deutsch / English) bottom right.
- `.nav-main` links: 2rem, 400, ls .05em, lh 140%, uppercase (mobile 3.1rem, 300). Hover rule: when hovering the nav, every link is `.6` except the hovered one at `1`. Outside the home page the nav has `fadeOut`: when not hovered, links are `.6` and the active one `1`.
- Sub-menus: `.sub` max-height 0, GSAP `maxHeight` tween .5s `power1.inOut`, chevron rotates 180deg. The English nav currently has no children; the mechanism is built anyway because the content model supports it.
- Open timeline (exact): bg `autoAlpha: 1, .8s, power1.out`; menu `y: 0, 1s, delay .5, ease: expoScale(10,2.5,power1.inOut)`; level-0 items `fromTo({opacity:0, y:'10px'}, {opacity:.6, y:0, stagger:.1, delay:.6, duration:1, ease:'sine.out'})`; nav-info, nav-lang, mobile-hr `opacity 0→1, delay 1, duration 1, power1.out`; hamburger paths `.a1/.a2/.a3` morph to the X paths, `.5s`.
- Close: menu `y: '-101%', .6s, power1.inOut`; bg `autoAlpha: 0, .5s`; items/info/lang/hr `opacity → 0, .1s, power1.in`; paths morph back `.5s`. Route change closes the menu the same way.
- The nine nav items and every href come from `content/site.ts`.

### 8.4 Footer
Two `grid-container-inner` rows inside a `grid-container`, both with `border-top: 2px solid #e4e0db`, `margin-top: 19rem` on the footer (mobile 6rem):
- Upper (`padding: 6rem 0`): Contact (mail + tel), Follow us (Instagram, Facebook), Address, Partner (laposch.com, hotel-spielmann.com); spans 3/3/3/3 with the last two right-aligned. Mobile layout as per the original media rules (6/6, then social right, address left, partner left).
- Lower (`padding: 6rem 0 2.5rem`, align end): footer nav (Booking conditions, eriro exclusive, Contact and arrival, Voucher, Newsletter, Jobs, Press), logo (29.4rem, 13.7rem mobile), SLH badge (col 9, 90% width), language nav (Deutsch / English, active `.5` opacity, active link disabled), privacy nav (Imprint, Privacy, Cookies), Unikateur signet ("unique hospitality concepts, by" + SVG 7.1rem) right-aligned with `margin-top: 6rem`.
- Links: underline transparent, hover underline `#211d1d`; active link `opacity: .5`, weight 300.

### 8.5 SmoothScroll
`#smooth-wrapper > #smooth-content` around `main` + footer. ScrollSmoother created on mount when `innerWidth >= 1024` with the exact config; killed on resize below 1024; `effects: true` so sections can register `data-speed` equivalents through `smoother.effects(el, { speed })`. Header, logo wrapper, menu and the texture image stay outside the wrapper (fixed elements).

### 8.6 CookieConsent
vanilla-cookieconsent v3 with the site's config: categories necessary (read-only), functionality, marketing, analytics (auto-clear `_ga`, `_gid`), ads; English texts copied from the bundle (consent modal description, "Accept all", "Reject all", "Manage preferences", footer links to `/en/cookies/` and `/en/privacy/`; preferences modal title and sections). Cookie name `cc_cookie`, 182 days. The "Cookies settings" button on `/en/cookies/` calls `showPreferences()`. Theme variables from the original `#cc-main` CSS.

## 9. Section components

Every section is wrapped by `Mask`: `<div class="{layout} space-before-{spaceBefore} mask mask_{type}" uid="c{id}">` so the original CSS selectors apply verbatim.

### 9.1 Hero (three layouts)
- Shared: `.image-wrapper` is an 8-column sub-grid in cols 6–13 (mobile 12 cols in 2–13); `.title` (h1) is vertical text (`writing-mode: vertical-rl; transform: rotate(180deg)`, bottom-aligned, `padding-bottom: 14rem`); `.image-big` cols 2–8 of the sub-grid; `.titleh2` (h2, split-words reveal) cols 2–5 vertically centred; `.image-small` cols 3–4, `margin-top: -3.5rem`.
- `default` (home only): `.titleimg` paragraph (`.h1`) at sub-grid cols 9–13 `padding-top: 6rem`; section `padding-top: 43rem` (mobile 22.5rem, titleh2 6.5rem lh 88% with `margin-bottom: calc(92% + 2rem)`).
- `subpage`: `padding-top: 61.1rem`; titleh2 row 2 with `margin-top: -18rem`; image-small row 1 `margin-top: -6rem`.
- `only-text`: `.image-wrapper` is 4 cols at 9–12 with `.title` (3 cols) and `.text` (`margin-left: 9rem; margin-top: 3rem`); titleh2 cols 2–5.
- Parallax: `smoother.effects(pictures[0], {speed: 1.15}); effects(pictures[1], {speed: 1.5})` on desktop.
- Images: big 1014×780 desktop / 340×260 mobile (aspect from the crop), small 272×360 / 136×180, `loading` eager.

### 9.2 ImgText
`.image-left` cols 1–4, rows 2–3, `margin-top: -22.5rem`; `.image-right` cols 10–13, `margin-bottom: 7.5rem`; `.content` cols 6–9 with `.title` (h2, split-words, `margin-bottom: 3rem`) and `.text` (`margin-left: 9rem`). Parallax speeds 1.5 (left) and 1.05 (right). Mobile: left 1–5 `margin-top: -5.5rem`, right 6–13, content 2–12 `margin-top: 4.5rem`, text `margin-left: 5.8rem`.

### 9.3 Img
Full-bleed picture spanning all 14 columns, 1920×1080 desktop / 360×300 mobile (aspect 16:9 and 1.2). Supports `spaceBefore: 'large'` (suite pages).

### 9.4 Video
`<video preload="metadata" playsinline loop muted>` with one `<source type="video/mp4">`, cols 2–13, `aspect-ratio: 16/9` (mobile 16/10, cover). IntersectionObserver: on first intersection call `load()` once, `play()` while visible, `pause()` when not; adds `js-video-playing` on first play. Empty video arrays render the wrapper only (keeps the 19rem spacing, exactly like the original).

### 9.5 Quote
`.image` cols 2–3 (parallax 1.6); `.quote-wrapper` cols 6–11, `margin-top: 19.5rem`, `transform: translateX(9rem)`; `.quote` 7rem, 300, ls .04em, lh 97% (split-words reveal); `.autor` 2rem, 400, uppercase, `margin-top: 2rem`. Mobile: image cols 4–8, wrapper cols 2–13, 3.7rem lh 119%.

### 9.6 Break
`margin-top: 12rem`; `.break-wrapper` beige background, `padding-bottom: 30rem`; `.image-left` cols 2–5 `margin-top: -12rem` (parallax 1.2); `.title` 12rem, uppercase, centred, cols 5–10 row 2, `margin-top: -9rem` (split-words); `.image-right` cols 12–14 row 2, `margin-bottom: -7rem`, self-end (parallax 1.5). Mobile rules as per stylesheet (4.2rem title, images 2–9 and 8–14).

### 9.7 RoomSlider (home)
Three Swipers kept in sync with the Controller module:
- `.room-image-left` cols 1–6: `loop`, `allowTouchMove: false`, default slide effect, speed 300. Images 719×864 / 252×300.
- `.room-image-right` cols 11–12, self-end, `pointer-events: none`, `z-index: -1`: `loop`, no touch, `speed: 700`. Images 273×317 / 136×180.
- `.room-content` cols 1–12 (same row): `effect: 'fade'`, `speed: 1300`, `loop`, navigation next/prev, transition timing `cubic-bezier(0.25, 0.1, 0.25, 1)` applied to the fade via CSS. Inactive slides `opacity: 0 !important`. Content: h2 6.7rem uppercase cols 8–10 `padding-top: 12rem`; `.room-info` (price full width, size, 3rem×2px spacer, people) 2rem 300 ls .05em lh 150% `margin-top: 4rem`; `.ht-button` "View Suite" `margin-top: 9rem`.
- `.navigation` cols 8–9, self-end: next then prev arrows (7×2.5rem, prev rotated 180deg, hover `.4`). Mobile positions per stylesheet.
- Rooms: boum, wisa, felisa, himil with the literal price/size/people strings.

### 9.8 TeaserSlider
Four synced Swipers in a 12-column `.teaser-wrapper` (`grid-template-rows: auto 1fr`): `.image-left` cols 1–2 `margin-top: 12rem` (277×330); `.image-right` cols 7–12 rows 1–2 (876×960); `.infotext` cols 7–10 row 3 `margin-top: 1.5rem` (2rem uppercase); `.teaser-content` cols 1–12 rows 1–3, fade 1300ms, each slide a 2-row grid with `.teaser-content-inner` in row 2 (`padding-right: 55%; padding-top: 4.5rem`) holding h2 (`margin-bottom: 2rem`) and an `.ht-button`. Navigation only when more than one slide: `PREV / NEXT` text with arrows hidden on desktop (col 12, row 3), arrows only on mobile (col 1, rows 1–2, `margin-top: 810%`). `swiper-button-disabled` never applies because loop is on.

### 9.9 PartnerMarquee (home)
`.grid-container` with beige background and `padding: 21rem 0`; `.content` cols 6–12 with h2 "Recommended by" (split-words). A hidden Swiper (`display: none`) is kept for parity but never shown. `.marquee-wrapper` spans 14 cols, `margin-top: 12rem`, `overflow: hidden`, `width: 100vw`; items `max-width/max-height: 35rem`, `margin-right: calc(var(--grid-gap) * 5)`, `mix-blend-mode: multiply`, logos rendered 180px tall (120 mobile). Item order: the 15 partners distributed round-robin into 5 buckets and repeated 3× (exact algorithm from the bundle). Motion: `horizontalLoop(items, { speed: 1 (0.8 mobile), snap: false, draggable: true, paused: false, repeat: -1, center: true })`; `mouseover` pauses, `mouseleave` resumes. Draggable uses InertiaPlugin and resumes 3s after release.

### 9.10 GallerySlider
Same helper with `speed: .5 (.3 mobile)`, `draggable: false`, same 5-bucket ×3 ordering. Items: pattern `4n+1` 27.3rem `margin-left: 8rem`; `4n+2` 41rem `margin-left: 2.5rem; margin-top: 21rem`; `4n+3` 27.3rem `margin-left: 2.5rem; margin-top: 16rem`; `4n+4` 41rem `margin-left: 16.5rem`; each `padding-right: var(--grid-gap)`. Image sizes alternate 273×317 and 421×421. Mobile uses the `5n` pattern from the stylesheet.

### 9.11 Gallery
34 pictures in the 14-column grid with the `8n+k` placement rules (spans, offsets, negative margins) copied verbatim; parallax speeds cycle `[1.3, 1.1, 1.1, 1.3, 1.7, 1.2, 1.2, 1.1]`. Image sizes per position: 570×510, 867×960, 150×150, 273×317, 719×864, 273×317, 570×510, 501×390 (mobile set from the bundle).

### 9.12 List
`.content` cols 9–12 (title split-words, text `margin-left: 9rem; margin-bottom: 12rem`); `.list-wrapper` cols 2–13; each `.list-item` is a 12-col inner grid with `border-top: 2px solid #e4e0db`, `padding-top: 3rem`, `padding-bottom: 12rem` except last; `.list-title` (h4 style) cols 2–4; `.list-text` cols 5–9 `translateX(9rem)`.

### 9.13 Accordions
`.content` cols 6–9; `.accordion-wrapper` cols 2–13; each accordion is a 12-col inner grid: header (cols 1–12, `justify-self: end`, `max-width: 66.66%`, `border-top: 2px solid #e4e0db`, `padding: 3rem 0`) with h4 (`translateX(9rem)`, hover 7.5rem, open 14.5rem, open+hover 12.5rem, transition .5s), `.accordion-side` (info `.h4` + icon 2rem, `margin-left: 12rem`), body (cols 5–12, `height: 0`, overflow hidden) with `.accordion-content` (8-col grid, `padding-bottom: 12rem`) holding `.accordion-text` (cols 1–6, `translateX(9rem)`) and an optional `.ht-biglink` (`margin-top: 12rem`), bottom hr (same width rule).
Toggle (GSAP): open → body `height: auto .5s`, header `maxWidth: 100%, paddingBottom: 4.5rem .5s`, hr `maxWidth: 100% .5s`, icon `.a1` and `.a2` morph to the horizontal bar path (`.2s`); close → `height: 0`, `maxWidth` back to 66.66% (83.33% mobile), `paddingBottom` 3rem (2rem mobile), `.a2` morphs back to the vertical bar (`.3s`). Opening one closes all others. Icon variant is `i-accordionIcon{index % 4 + 1}` (four hand-drawn plus signs).

### 9.14 Jobs
Filter row (`.filter-grid`, cols 2–13, `border-bottom: 2px solid #e4e0db`, `margin-bottom: 12.5rem`) with `[ x ]` style checkboxes (`All` + one per category, active = `text-shadow: 0 0 #000`, hover underline), 33.33% basis each. Below, one `.jobs-container` per category (fade 0.5s in/out when filtered) containing accordions identical to 9.13 but with a `.button-wrapper` (rtl flex, two `.ht-biglink`s: apply link and phone link).

### 9.15 PageFilter (experiences) and Rooms (suites)
Identical mechanics, different data:
- `.filterOuter > .filterGrid.grid-container` with `.grid-container-inner` (cols 2–13, `border-bottom: 2px solid #e4e0db`) and `.filter-wrapper` cols 4–12: items 2.5rem 300 ls .05em uppercase, `margin-right: 3rem`, underline transparent → currentColor on hover, active = underline + `text-shadow`.
- ScrollTrigger created 500ms after first content load: `trigger: filterOuter, start: '-{headerHeight} top', end: 'bottom top', pin: filterGrid, pinSpacing: false`; while pinned the grid gets `filter-hover` (beige background on desktop when the menu is closed) and the header hover state is toggled so the header bar shows its background. `headerHeight` is `document.querySelector('header .upper').clientHeight - 10` on mobile, `10px` otherwise. On later switches `ScrollTrigger.refresh()` after 100ms.
- Clicking an item: marks it active, swaps the content column below (colPos5 of the target page), pushes the target URL with `history.pushState`, updates `document.title`/meta, and tweens `window` scroll to the filter top over `.2s` (ScrollToPlugin). All five (or four) subpage contents are statically imported, so no fetch is needed. The direct URLs (`/en/leiba/`, `/en/suites/wisa/` …) render the same shell with that item active on first paint.
- Mobile: dark SVG blob background, beige text, `padding: 2.5rem 0 1rem`, horizontal overflow scroll.

### 9.16 RoomDetail (suite pages)
`section.mask_roomdetail.grid-container`: `.room-image-left` cols 2–7 with a Swiper (`loop`, `speed: 650`, `slidesPerView: 1`, keyboard, navigation, `grabCursor`; images 866×856 / 360×520); `.navigation` cols 9–10 `margin-top: 12rem` (shown when more than one image); `.room-image-right` cols 12–13 `margin-top: 12rem` (273×317); `.room-info` cols 3–7 `margin-top: 6rem` (size · people · price, uppercase 2rem, 1px spacers, with `.room-icons` row of 9rem SVG amenity icons); `.room-content` cols 9–12 `margin-top: -6rem` with `h1.h2` (split-words) and `.room-description` (`margin-left: 9rem; margin-top: 3rem`).

### 9.17 ImgSlider
`.swiper-container` spanning 14 cols; wrapper height 60rem (30rem mobile) with half-gap negative margins; slides `width: auto`, images `height: 100%; width: auto`, `padding-right: var(--grid-gap)`. Swiper: FreeMode (`momentum: true, momentumRatio: .09, momentumBounce: false, sticky: true`), `centeredSlides: true` below 1024 only, `loop`, `speed: 650`, `slidesPerView: 'auto'`, keyboard, navigation, `grabCursor`. Navigation cols 9–10 `margin-top: 3rem`, centred.

### 9.18 RoomCta
`.buttons-wrapper` cols 9–13 with two block `.ht-biglink`s: "Request" → `/en/request/?room={asacode}` and "Book" → booking link + `&room={bookingcode}`.

### 9.19 Maps
Google Maps JS API (`@googlemaps/js-api-loader`, `version: 'weekly'`, `libraries: ['places']`, language `en`): centre 47.385007234125084 / 10.969970612228026, zoom 14, the site's custom style array (copied), marker SVG `eriro_map.svg` titled "Eriro", marker click opens `https://maps.app.goo.gl/HvBKVv4pwiadF5ix6`. Container `.google-map` cols 2–13, `height: 45vw` desktop with `border: 1px solid #e4e0db`, `45rem` mobile full-bleed. API key from `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (the original's key is referrer-locked to eriro.at).

### 9.20 Newsletter and Voucher widgets
Newsletter: renders the literal `<div id="additive-newsletter-664458cf61093">` (cols 6–11) and injects `https://newsletter.additive-apps.tech/eriro-at/widgets/e79ae8b2-1c7e-4467-a330-f48110f5a95d/en/` once. Voucher: `<div id="internetseite" class="aa-voucher-widget">` (cols 2–13) and injects `https://voucher.additive-apps.tech/eriro-at/widgets/7b12cd09-5819-4ac4-857c-e6c1a47ae604/en`. Both scripts are removed on unmount. Whether the third party renders on a non-eriro origin is outside our control; the markup and styling match regardless.

### 9.21 FooterPageText, IncludePage, CookieConsentButton
Layout 8 pages (`page-id` 5/6/7 in the original): first section `padding-top: 45rem` (25rem mobile), `h1` 4rem uppercase, `h2` 3rem, `h3` 2rem bold, `p/ul/ol` 1.8rem lh 156%, links underlined with `hyphens: auto; word-break: break-all`. IncludePage renders the stored HTML (cookie policy tables, privacy text) inside `.t3-ce-rte` spanning cols 2–13. The `body` carries `pid-{pageId}` so these selectors keep working.

### 9.22 ThankYouPage
`padding-top: 55rem` (25rem mobile); `h1` 6.7rem uppercase cols 7–12 `margin-bottom: 6rem`; `.text`; `.button-wrapper` with an `.ht-button`; `.socials` (`margin-top: 7rem`) with round 7.5rem bordered icon links.

### 9.23 Shortcut
Wrapper used by the five experience routes: renders the experiences page's colPos0 (only-text hero + PageFilter + teaser) with the matching item active. `.space-before-.mask_shortcut { margin-top: 0 }`.

### 9.24 Picture (shared image primitive)
Renders `<picture>` with six webp `<source>` entries exactly like the original's breakpoint table (desktop: 1920→2560, 1440→1920, 1024→1440; mobile: 768→1024, 480→768, 0→480) whose URLs point at the built-in `/_next/image` optimizer (quality 80) so each breakpoint gets a resized webp, `aspect-ratio` set from the crop via CSS custom properties (desktop and mobile values), and the `.overlay` (`#211d1d`, absolute, `z-index: 5`) that GSAP fades to `opacity: 0` in `.5s power1.out` once `img.complete` is true (on `load`, or immediately if cached). SVG images skip the sources.

### 9.25 SplitWords (shared reveal)
Client wrapper that runs `SplitText` (`type: 'words'`) on the heading and `gsap.from(words, { duration: .4 (.2 for Break), autoAlpha: .2, stagger: .1, scrollTrigger: { trigger, start: 'top 85%', end: 'bottom 50%', scrub: true } })`. Reverts on unmount. Used by Hero titleh2, ImgText, Quote, Break, List, Accordions, PartnerMarquee, RoomDetail.

### 9.26 Powermail forms (request, contact)
Field definitions are copied from the crawled `data.form.fields.pages` into `content/en/forms/*.ts` (labels, markers, mandatory flags, options, order, page titles, CSS classes such as `room`).
- Layout: `form` cols 2–13; each `.section` (white background, `margin-bottom: 2rem`, `padding: 4.5rem 0`) has `.inner` (20-column grid cols 2–11) with `.title` 3rem/500 and items `margin-top: 5rem` spanning 10 (or `col3/col5/col7/col20`). Floating labels (`background: #fff`, `left: 1rem; top: 2rem`, `.active/.hasContent` → `translateY(-70%)`, colour `#211d1db3`), inputs `border: 1px solid #211d1d; border-radius: 3px; padding: 2rem`, focus `box-shadow: 0 0 5px 1px #c7c7c7`, error border `#ea0000` and right-aligned error text.
- Fields: Input, Email, Tel, Textarea (auto-grow), Radio (salutation), Select (custom dropdown, GSAP height tween `.3s linear`, arrow rotate), DateRange (range picker with 2 months, min today, default today→+7 days, auto-apply, format `dd.mm.yyyy - dd.mm.yyyy`, read-only input), Counter (adults, +/− with 7rem-offset controls), Kids (0–6, each child adds a KidsAge select), RoomsSelect (custom dropdown with 130×90 preview image, title and price per suite, "No specific room preference…" first option, preselect from `?room=`), Checkbox (privacy, hand-drawn tick), Hidden, Divider, Text, Submit (`.ht-submit-button` with `animate`, `success`, `error` states). "Add room" / "Remove room" clone the Suite section (max index) exactly as the original `Page` component does.
- Validation: react-hook-form + zod mirroring the original vee-validate/yup rules (required where `mandatory`, email format, phone kept only if longer than 3 chars). First error scrolls into view and focuses.
- Submit: POST to `/api/forms/{request|contact}`; on 200 the button gets `success`, GA event is skipped, and after 300ms the browser navigates to the thank-you route. On error the button gets `error` for 2s. The handler validates with the same zod schema, builds the same summary the original mails (period, rooms with adults/children/ages/meal type, personal data) and, if `RESEND_API_KEY` and `FORM_TO_EMAIL` are set, sends it; otherwise it logs and still returns 200 so the flow can be tested end to end.

## 10. Assets

- 281 images (photos, press logos, amenity icons, marker SVG) downloaded from `typo3.eriro.at` keep their relative paths under `public/images/`. `next/image` handles resizing/webp; `images.remotePatterns` stays empty because everything is local.
- Videos: `eriro_alpinehide_nebel.mp4`, `eriro_alpinehide_luft.mp4`, `GONDEL3.mov` under `public/videos/`, served with `type="video/mp4"` like the original.
- Texture `HG.jpg`, SLH badge, favicon set, `unikateur` and logo SVGs.
- Fonts: `karol-sans-{300,400}-{normal,italic}.woff2`, `font-display: swap`, family name `karol-sans` so the copied CSS keeps working.
- Metadata per page from the crawled `meta` (title, description, og:*, twitter:card summary) plus the JSON-LD `Hotel` schema and the geo coordinates from the site vars.

## 11. Responsive rules

Only two layout modes exist: `≤1023px` and `≥1024px`, plus the root font-size step at 768px. Every component copies both rule sets from the original stylesheet. No additional breakpoints are introduced. The `body > .body-inner` wrapper keeps `max-width: 2550px; overflow: hidden` so ultra-wide screens match too.

## 12. Verification

1. Screenshot diff: a Playwright script captures every route at 1920×951, 1440×900 and 390×844 on both the live site and `localhost:3000`, scrolling in viewport-height steps so scroll-linked reveals and parallax are in the same state, and writes side-by-side images to `docs/qa/`. Reviewed by eye; differences are fixed until none remain at the section level.
2. Text diff: a script extracts the visible text of `main` from each original SSR page and from the built clone and asserts equality (ignoring whitespace).
3. Behaviour checklist per page (menu open/close, header scrolled state, logo scrub, sliders next/prev and sync, accordion open/close, filters pin and swap, forms validate and reach the thank-you page, video autoplay on scroll, marquee drag/pause).
4. `next build` with zero type errors and zero lint errors; Lighthouse accessibility pass on home and request.

## 13. Phasing (implementation order)

1. Scaffold, tokens, fonts, texture, grid, typography, header, logo, menu, footer, smooth scroll, page transition, home page with all 15 sections, verified against the live site.
2. Shared subpage sections: hero variants, list, accordions, gallery, gallery slider, image slider, maps, widgets, layout-8 pages, thank-you page. Pages: alpine-hide, all-in-service, culinary, origin, spa, summer, winter, eriro-exclusive, booking-conditions, press, gallery, imprint, privacy, cookies, newsletter, voucher.
3. Filters and suite pages: PageFilter + Shortcut (experiences and its 5 subpages), Rooms + RoomDetail + RoomCta (4 suites).
4. Forms: request and contact, route handler, thank-you flow. Jobs page.
5. Full verification pass (section 12), 404 page, Vercel config check.

## 14. Risks and open points

- Font licence: Karol Sans is served from eriro's Adobe Fonts kit; self-hosting it is fine for local development but needs a licence before the site is published.
- Images and copy belong to eriro; same caveat.
- Google Maps needs the user's own API key; until then the map container renders empty with the correct size.
- Third-party newsletter/voucher widgets are bound to the `eriro-at` tenant and may refuse to render off-domain.
- GSAP MorphSVG requires the morph target paths to be the exact strings from the bundle (already extracted for hamburger and accordion icons).
- The `.mov` video may not play in Firefox; the original has the same limitation.
