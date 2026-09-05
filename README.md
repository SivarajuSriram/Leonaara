# eriro.at rebuild

A 1:1 rebuild of https://www.eriro.at/en/ in Next.js. The original is a Nuxt + TYPO3 site; every
component here mirrors one original component and keeps its class names, so you can open the live
site and this project side by side in DevTools.

## Where things live
- `app/` – routes. `app/page.tsx` is the homepage at `/` (no `/en/` prefix). Images are optimized by
  Next's own `next/image` at request time; there is no custom resize route — an offline pass
  (`scripts/gen-image-crops.ts`, see below) pre-crops the handful of images that need a non-identity
  crop rectangle, and `next/image` handles resizing/format on top of that.
- `components/layout/` – header, menu, logo, footer, smooth scrolling, the newsletter popup.
- `components/sections/` – one file per section (`Hero.tsx`, `ImgText.tsx`, `Img.tsx`, `Break.tsx`,
  `Quote.tsx`, `RoomSlider.tsx`, `TeaserSlider.tsx`, `PartnerMarquee.tsx`, `Video.tsx`). Each renders
  its own markup with Tailwind utility classes written directly in the JSX — there are no
  per-component `.css` files.
- `components/ui/` – small building blocks: `Picture`, `RichText`, `Button`, `BigLink`, `SplitWords`, icons.
- `content/` – all text, links and image references, hand-written per the design spec (see `content/README.md`).
- `lib/` – plain TypeScript helpers (GSAP setup, image crop/size maths, season rule, marquee loop, page metadata).
- `styles/` – tokens, self-hosted fonts, the original reset/typography/grid, shared link classes, and
  Swiper's own untouched third-party CSS (`swiper.css`) — the only CSS file that isn't Tailwind.
  Everything else styling-wise lives as Tailwind utility classes in the component that uses it.
- `docs/reference/` – the crawled original (HTML, JSON payloads, CSS, JS, icons, screenshots). Read-only.
- `tests/` – `unit/` (Vitest) and `e2e/` (Playwright).

## Rules of thumb
- Numbers (rem sizes, durations, eases, speeds) are copied from the original and commented with `// original: …`.
- Styling is Tailwind utility classes in the JSX, not separate CSS files. `styles/globals.css` only
  holds tokens/fonts/reset/grid/links plus Swiper's third-party stylesheet.
- Copy never lives in components; edit `content/` directly (it's hand-written, not generated).

## Commands
`npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run gen:image-crops`.
