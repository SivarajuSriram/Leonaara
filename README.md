# eriro.at rebuild

A 1:1 rebuild of https://www.eriro.at/en/ in Next.js. The original is a Nuxt + TYPO3 site; every
component here mirrors one original component and keeps its class names, so you can open the live
site and this project side by side in DevTools.

## Where things live
- `app/` – routes. `app/en/page.tsx` is the homepage. `app/i/route.ts` resizes images (like the original `_ipx`).
- `components/layout/` – header, menu, logo, footer, smooth scrolling, page transition.
- `components/sections/` – one folder-less pair per section: `Hero.tsx` + `Hero.css`, `ImgText.tsx` + `ImgText.css`, …
- `components/ui/` – small building blocks: `Picture`, `RichText`, `Button`, `BigLink`, `SplitWords`, icons.
- `content/` – all text, links and image references, generated from the crawled site (see `content/README.md`).
- `lib/` – plain TypeScript helpers (GSAP setup, image size maths, season rule, marquee loop).
- `styles/` – global CSS only: tokens, fonts, the original reset/typography/grid, shared link classes, Swiper base.
- `docs/reference/` – the crawled original (HTML, JSON payloads, CSS, JS, icons, screenshots). Read-only.
- `tests/` – `unit/` (Vitest) and `e2e/` (Playwright).

## Rules of thumb
- Numbers (rem sizes, durations, eases, speeds) are copied from the original and commented with `// original: …`.
- CSS belongs next to its component. `styles/globals.css` is not a dumping ground.
- Copy never lives in components; edit `content/` (or regenerate it).

## Commands
`npm run dev`, `npm run build`, `npm test`, `npm run test:e2e`, `npm run gen:content`, `npm run qa:shots`, `npm run qa:text`.
