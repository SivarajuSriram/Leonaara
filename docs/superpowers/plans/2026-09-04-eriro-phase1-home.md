# eriro.at Clone, Phase 1 (foundation + homepage) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Next.js project with the site's exact design system, header/menu/logo/footer, smooth scroll and image pipeline, and ship `/en/` (the homepage) pixel- and behaviour-identical to https://www.eriro.at/en/.

**Architecture:** Static typed content files (generated from the crawled TYPO3 payloads in `docs/reference/`) are rendered by one React component per original Vue component, using the original class names and the original CSS copied verbatim (de-scoped copies live in `docs/reference/css-clean/`). GSAP (ScrollSmoother, ScrollTrigger, SplitText, MorphSVG, Draggable, Inertia) and Swiper reproduce every behaviour with the same numbers. An on-demand `/i` route resizes images with sharp exactly like the original `_ipx` service.

**Tech Stack:** Next.js 16 (App Router, `trailingSlash: true`), React 19, TypeScript strict, Tailwind v4 (theme + utilities only, no preflight), GSAP 3.15 + `@gsap/react`, Swiper 14, sharp, lucide-react (installed, unused by site artwork), Vitest + Testing Library (unit), Playwright (behaviour + visual QA), tsx (scripts).

**Spec:** `docs/superpowers/specs/2026-09-04-eriro-clone-design.md` (sections 3, 5, 6, 7, 8, 9.1–9.9, 9.24, 9.25, 10, 12, 13.1 apply to this phase). Phases 2–5 get their own plans after this one lands, because their components reuse the conventions fixed here.

## Global Constraints

- Colours: text `#211d1d`, beige `#e4e0db`, texture `public/HG.jpg` fixed at `z-index: -1`. Copy every value from `docs/reference/css-clean/*.css`; never round or "improve" a number.
- Root font-size: `2.77777778vw` (<768px), `1.50208333vw` (≥768px), `.52083333vw` (≥1024px), all `!important`. Every dimension stays in rem.
- One layout breakpoint: `@media (max-width:1023px)` mobile, `@media (min-width:1024px)` desktop.
- Class names in JSX are the original class names (`grid-container`, `mask_hero`, `image-left`, …) so the copied CSS applies unchanged and the live site can be inspected side by side.
- Text and HTML come from `content/en/*.ts`, generated from `docs/reference/pages/*.json`. Never retype copy. Keep the site's typos ("fuir", "Unparalled").
- Code style (user requirement): write code a newcomer can read and maintain. Small components with one job, plain functions, descriptive names, no `any`, no clever generics. Every number copied from the original gets a one-line comment saying what it reproduces (e.g. `// original: speed 700`). No hardcoded copy or URLs in components; they come from `content/`.
- CSS lives next to the component that uses it (`components/sections/Hero.css` imported by `Hero.tsx`), one file per component. `styles/globals.css` holds only the Tailwind imports, theme tokens, fonts, the original reset/typography/grid (`base.css`), the shared link/button classes and the Swiper base stylesheet. Nothing else goes into `globals.css`.
- Font family name stays `karol-sans` (declared with `@font-face` in `styles/fonts.css`, files in `public/fonts/`). Deviation from the spec's `next/font/local`: a plain `@font-face` keeps the copied CSS verbatim; the four files are preloaded in `app/layout.tsx`.
- Images are served through `/i?src=…&w=…&h=…&q=80` (webp, sharp). Never use `next/image`'s `<Image>` component; the original markup is `<picture>` + `<source>` + `<img>` + `.overlay`.
- GSAP plugins are registered once in `lib/gsap.ts` and imported from there; all GSAP work happens in client components inside `useGSAP`.
- Reference material: `docs/reference/pages/en.html` (original SSR markup of the homepage), `docs/reference/structure.txt` (DOM outline), `docs/reference/screenshots/` (live site at 1920px), `docs/reference/css-clean/`, `docs/reference/icons/`, `docs/reference/js/` (original compiled components, for behaviour questions).
- Commit after every task with the message given in the task. Author: `git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com"`; end messages with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Dev server: `npm run dev` on port 3000. Playwright config starts it automatically for `npm run test:e2e`.

## File map (this phase)

| File | Responsibility |
|---|---|
| `next.config.ts` | `trailingSlash: true`, `redirects` for `/`, `images.unoptimized` irrelevant (we don't use next/image), `serverExternalPackages: ['sharp']` |
| `styles/globals.css` | Tailwind theme+utilities imports, `@theme` tokens, imports of `fonts.css`, `base.css`, `links.css`, `swiper.css` (and nothing else) |
| `styles/fonts.css` | four `@font-face` blocks for `karol-sans` |
| `styles/base.css` | copy of `docs/reference/css-clean/base.css` (reset, typography, grid, spacing, page transition) |
| `styles/links.css` | shared `.ht-biglink`, `.small-font`, `.ht-button`, `.filled` classes |
| `styles/swiper.css` | the Swiper base stylesheet the original ships |
| `components/**/<Name>.css` | one CSS file per component, copied from `docs/reference/css-clean/`, imported by that component only |
| `README.md`, `content/README.md` | how the project is organised and how content is regenerated (for newcomers) |
| `lib/gsap.ts` | registers plugins, exports `gsap`, `ScrollTrigger`, `ScrollSmoother`, `SplitText`, `MorphSVGPlugin`, `Draggable`, `InertiaPlugin`, `ScrollToPlugin`, `useGSAP` |
| `lib/smoother.ts` | tiny store: `setSmoother()`, `onSmoother(cb)`, `getSmoother()` so sections can register parallax effects regardless of mount order |
| `lib/horizontalLoop.ts` | TypeScript port of GSAP's `horizontalLoop` helper (marquees) |
| `lib/images.ts` | `buildSources`, `aspectRatios`, `imgUrl`, `extractParam` (port of the original `Img.vue` math) |
| `lib/season.ts` | `isWinter(now, start, end)` rule |
| `lib/content.ts` | content types (`ImageRef`, `Section` union, `PageContent`) and `pages` registry |
| `content/site.ts` | nav, footer navs, contact vars, booking link, i18n strings, season switch |
| `content/en/home.ts` | generated homepage content |
| `scripts/gen-content.ts` | converts `docs/reference/pages/<slug>.json` → `content/en/<slug>.ts` |
| `app/i/route.ts` | image resize endpoint |
| `app/layout.tsx`, `app/page.tsx`, `app/en/page.tsx`, `app/not-found.tsx` | shell, redirect, home, 404 |
| `components/layout/*` | `Header` (composition), `MenuButton`, `MenuPanel`, `Logo`, `menuAnimations.ts`, `useScrolledBody.ts`, `Footer`, `SmoothScroll`, `PageTransition`, `TransitionLink`, `BodyClass` |
| `components/ui/*` | `Picture`, `RichText`, `Button`, `BigLink`, `SplitWords`, `useParallax`, `icons/*` |
| `components/sections/*` | `Mask`, `Hero`, `ImgText`, `Img`, `Video`, `Quote`, `Break`, `RoomSlider`, `TeaserSlider`, `PartnerMarquee`, `SectionRenderer` |
| `tests/unit/*.test.ts(x)` | Vitest |
| `tests/e2e/*.spec.ts` | Playwright behaviour tests |
| `scripts/qa/*.ts` | live-vs-local screenshot and text diff |

---

### Task 1: Scaffold the project, install dependencies, wire test runners

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs` (from create-next-app), `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `.gitignore`, `tests/unit/smoke.test.ts`
- Existing (keep): `docs/`, `public/`, `.git/`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test` (vitest), `test:e2e` (playwright), `gen:content`, `qa:shots`, `qa:text`.

- [ ] **Step 1: Scaffold into a temp dir and merge (create-next-app refuses non-empty dirs)**

```bash
cd /home/sriram/Office_work/eriro
npx --yes create-next-app@latest /tmp/eriro-scaffold --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --skip-install --yes
rsync -a --ignore-existing /tmp/eriro-scaffold/ ./
rm -rf /tmp/eriro-scaffold app/page.tsx app/globals.css public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg 2>/dev/null; true
ls
```
Expected: `app/ docs/ public/ package.json next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs`.

- [ ] **Step 2: Install runtime and dev dependencies**

```bash
npm install gsap@^3.15 @gsap/react@^2 swiper@^14 sharp@^0.34 lucide-react@latest
npm install -D vitest@^3 @vitejs/plugin-react@^4 jsdom@^26 @testing-library/react@^16 @testing-library/jest-dom@^6 @playwright/test@^1.55 tsx@^4 @types/node
npx playwright install chromium
```
Expected: no peer-dependency errors; `node_modules/gsap/ScrollSmoother.js` and `node_modules/gsap/SplitText.js` exist.

- [ ] **Step 3: Write `next.config.ts`**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  serverExternalPackages: ['sharp'],
  async redirects() {
    return [{ source: '/', destination: '/en/', permanent: true }];
  },
};

export default nextConfig;
```

- [ ] **Step 4: Write `vitest.config.ts` and `vitest.setup.ts`**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    css: false,
  },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
});
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Write `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  retries: 0,
  use: { baseURL: 'http://localhost:3000', viewport: { width: 1920, height: 951 } },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000/en/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
```

- [ ] **Step 6: Add scripts to `package.json`**

Replace the `"scripts"` block with:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:e2e": "playwright test",
  "gen:content": "tsx scripts/gen-content.ts",
  "qa:shots": "tsx scripts/qa/screenshots.ts",
  "qa:text": "tsx scripts/qa/textdiff.ts"
}
```
Add to `.gitignore`: `/.cache`, `/docs/qa`, `/test-results`, `/playwright-report`.

- [ ] **Step 7: Write the smoke test and run it**

```ts
// tests/unit/smoke.test.ts
import { describe, it, expect } from 'vitest';

describe('toolchain', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2);
  });
});
```
Run: `npm test`
Expected: `1 passed`.

- [ ] **Step 8: Minimal `app/layout.tsx` and `app/en/page.tsx` so the build passes**

```tsx
// app/layout.tsx
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
```
```tsx
// app/en/page.tsx
export default function Home() {
  return <main>eriro</main>;
}
```
Run: `npm run build`
Expected: build succeeds, route list shows `/en` and the `/` redirect.

- [ ] **Step 9: Write `README.md` for newcomers**

```markdown
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
```

- [ ] **Step 10: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "chore: scaffold Next.js 16 app with GSAP, Swiper, sharp, vitest, playwright

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Design system CSS, fonts, root scale

**Files:**
- Create: `styles/globals.css`, `styles/fonts.css`, `styles/base.css`, `styles/links.css`
- Modify: `app/layout.tsx`
- Test: `tests/e2e/globals.spec.ts`

**Interfaces:**
- Produces: global classes `grid-container`, `grid-container-inner`, `h1…h4`, `.h1…h4`, `space-before-*`, `linkdetail`, `ht-biglink`, `small-font`, `ht-button`, `filled`, page transition classes; CSS vars `--grid-gap`, `--grid-margin`; Tailwind tokens `--color-ink`, `--color-beige`.

- [ ] **Step 1: Write the failing e2e test**

```ts
// tests/e2e/globals.spec.ts
import { test, expect } from '@playwright/test';

test('root scale and body tokens match the original', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 951 });
  await page.goto('/en/');
  const html = page.locator('html');
  await expect(html).toHaveCSS('font-size', '10px');
  const body = page.locator('body');
  await expect(body).toHaveCSS('color', 'rgb(33, 29, 29)');
  await expect(body).toHaveCSS('background-color', 'rgb(228, 224, 219)');
  await expect(body).toHaveCSS('font-family', 'karol-sans, sans-serif');
  await expect(body).toHaveCSS('font-size', '25px');
  await expect(body).toHaveCSS('font-weight', '300');

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(html).toHaveCSS('font-size', '7.5px');

  await page.setViewportSize({ width: 390, height: 844 });
  const fs = await html.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(fs).toBeGreaterThan(10.82);
  expect(fs).toBeLessThan(10.84);

  const loaded = await page.evaluate(async () => {
    await (document as Document & { fonts: FontFaceSet }).fonts.ready;
    return document.fonts.check('300 20px karol-sans');
  });
  expect(loaded).toBe(true);
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm run test:e2e -- tests/e2e/globals.spec.ts`
Expected: FAIL on `font-size` (`16px` instead of `10px`).

- [ ] **Step 3: Create `styles/fonts.css`**

```css
@font-face { font-family: karol-sans; src: url("/fonts/karol-sans-300-normal.woff2") format("woff2"); font-weight: 300; font-style: normal; font-display: auto; }
@font-face { font-family: karol-sans; src: url("/fonts/karol-sans-300-italic.woff2") format("woff2"); font-weight: 300; font-style: italic; font-display: auto; }
@font-face { font-family: karol-sans; src: url("/fonts/karol-sans-400-normal.woff2") format("woff2"); font-weight: 400; font-style: normal; font-display: auto; }
@font-face { font-family: karol-sans; src: url("/fonts/karol-sans-400-italic.woff2") format("woff2"); font-weight: 400; font-style: italic; font-display: auto; }
```

- [ ] **Step 4: Copy base CSS and write `styles/globals.css`**

```bash
cp docs/reference/css-clean/base.css styles/base.css
cat docs/reference/css-clean/biglink.css docs/reference/css-clean/button.css docs/reference/css-clean/filled.css > styles/links.css
```
`styles/base.css` already contains: the reset, `body{background-color:#e4e0db…}`, `body>.body-inner`, the `:root` grid vars and font-size steps, `body{color:#211d1d;font-family:karol-sans…}`, `h1–h4`, `.space-before-*`, `main a`, `a.linkdetail`, lists with the SVG bullet, `::selection`, `picture{display:block}`, `.eriro-bg-attach`, `.page-enter-active…` and the `mask_errorpage` rules. Open it once and confirm the `:root` font-size lines exist at three breakpoints; do not edit values.

```css
/* styles/globals.css */
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);

@theme {
  --color-ink: #211d1d;
  --color-beige: #e4e0db;
  --font-sans: karol-sans, sans-serif;
}

/* Global only: fonts, the original reset/typography/grid, shared link classes. Component CSS is imported by each component. */
@import "./fonts.css";
@import "./base.css";
@import "./links.css";
```
(Task 11 adds one more line for the Swiper base stylesheet. Nothing else is ever added here.)

- [ ] **Step 5: Wire the stylesheet and font preloads into `app/layout.tsx`**

```tsx
import type { ReactNode } from 'react';
import '@/styles/globals.css';

const FONTS = [
  'karol-sans-300-normal',
  'karol-sans-300-italic',
  'karol-sans-400-normal',
  'karol-sans-400-italic',
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {FONTS.map((f) => (
          <link key={f} rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href={`/fonts/${f}.woff2`} />
        ))}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Run the e2e test**

Run: `npm run test:e2e -- tests/e2e/globals.spec.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "feat: global design system (fluid rem scale, grid, typography, Karol Sans)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Content types, site data, content generator, homepage content

**Files:**
- Create: `lib/content.ts`, `content/site.ts`, `scripts/gen-content.ts`, `content/en/home.ts` (generated)
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Produces (from `lib/content.ts`):
  - `type Crop = { x: number; y: number; width: number; height: number }`
  - `type ImageRef = { src: string; width: number; height: number; alt: string; title: string | null; mime: string; crop: { default: Crop; mobile: Crop } }`
  - `type VideoRef = { src: string; mime: string }`
  - `type Html = string`
  - `type LinkRef = { href: string; target: string | null }`
  - `type Appearance = { layout: string; frameClass: string; spaceBefore: '' | 'small' | 'medium' | 'large'; spaceAfter: string }`
  - `type Room = { uid: string; pid: string; title: string; description: Html; minprice: string; people: string; size: string; previewimage: ImageRef[]; images: ImageRef[] }`
  - `type TeaserSlide = { uid: string; title: Html; imgleft: ImageRef[]; imgright: ImageRef[]; infotext: Html; linktext: string; link: LinkRef | '' }`
  - `type Partner = { uid: string; img: ImageRef[]; link: LinkRef | '' }`
  - Section types: `HeroSection`, `ImgTextSection`, `ImgSection`, `VideoSection`, `QuoteSection`, `BreakSection`, `RoomSliderSection`, `TeaserSliderSection`, `PartnerMarqueeSection`, union `Section`, plus `UnknownSection = { id: number; type: string; appearance: Appearance; content: Record<string, unknown> }` for types not built yet.
  - `type PageMeta = { title: string; description: string; ogTitle: string; ogDescription: string; ogImage: ImageRef | null; twitterTitle: string; twitterDescription: string; twitterImage: ImageRef | null; twitterCard: string; robots: { noIndex: boolean; noFollow: boolean } }`
  - `type PageContent = { id: number; slug: string; backendLayout: string; meta: PageMeta; columns: { colPos0: Section[]; colPos5?: Section[] } }`
- Produces (from `content/site.ts`): `site` object with `nav`, `footerNav`, `privacyNav`, `languages`, `contact`, `bookingLink`, `unikateur`, `partnerHtml`, `socialHtml`, `addressHtml`, `t` (i18n strings), `season`.
- Produces: `content/en/home.ts` exporting `home: PageContent`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/content.test.ts
import { describe, it, expect } from 'vitest';
import { home } from '@/content/en/home';
import { site } from '@/content/site';

describe('homepage content', () => {
  it('has the 15 sections in the original order', () => {
    expect(home.columns.colPos0.map((s) => s.type)).toEqual([
      'mask_hero', 'mask_imgtext', 'mask_video', 'mask_quote', 'mask_roomslider',
      'mask_imgtext', 'mask_imgtext', 'mask_img', 'mask_break', 'mask_imgtext',
      'mask_img', 'mask_imgtext', 'mask_img', 'mask_teaserslider', 'mask_partnermarquee',
    ]);
  });
  it('keeps the literal hero copy and image metadata', () => {
    const hero = home.columns.colPos0[0];
    if (hero.type !== 'mask_hero') throw new Error('expected hero');
    expect(hero.content.herolayout).toBe('default');
    expect(hero.content.titleh2).toBe('Rooted <br>\r\nin its <br>\r\norigins');
    expect(hero.content.title).toBe('the Zugspitze peak rises dramatically<br>\r\nover Alpine pastures<br>\r\n');
    expect(hero.content.imgsummer[0].src).toBe('/images/unikateur_Bilder/AlexMoling_Eriro_Exterior.jpg');
    expect(hero.content.imgsummer[0].width).toBe(3000);
    expect(hero.content.imgsummer[0].height).toBe(2001);
    expect(hero.content.img[0].src).toBe('/images/AlexMoling_Eriro_Winter-first-6.jpg');
  });
  it('decodes percent-encoded paths', () => {
    const it2 = home.columns.colPos0[1];
    if (it2.type !== 'mask_imgtext') throw new Error('expected imgtext');
    expect(it2.content.imgrightsummer[0].src).toBe('/images/Hendrik_Stüwe/Pool_Shooting_2605_09_neu.jpg');
  });
  it('exposes the four suites with literal strings', () => {
    const rs = home.columns.colPos0[4];
    if (rs.type !== 'mask_roomslider') throw new Error('expected roomslider');
    expect(rs.content.rooms.map((r) => r.title)).toEqual(['boum', 'wisa', 'felisa', 'himil']);
    expect(rs.content.rooms[0].minprice).toBe('from 775,- € / night per person / All-In');
    expect(rs.content.rooms[0].size).toBe('approx. 688 sq ft');
    expect(rs.content.rooms[0].people).toBe('for 2 persons');
  });
  it('carries page meta', () => {
    expect(home.meta.title).toBe('eriro - Experience alpine originality');
    expect(home.meta.ogTitle).toBe('eriro Alpine Hide');
    expect(home.id).toBe(1);
  });
});

describe('site data', () => {
  it('has the nine visible nav items', () => {
    expect(site.nav.map((n) => n.title)).toEqual([
      'Alpine Hide', 'Suites', 'All-In-Service', 'Experiences', 'Culinary', 'Spa', 'Origin', 'Summer', 'Winter',
    ]);
    expect(site.nav[1].link).toBe('/en/suites/boum/');
  });
  it('has contact and booking values', () => {
    expect(site.contact.email).toBe('hide@eriro.at');
    expect(site.contact.tel).toBe('0043 5673 40506');
    expect(site.bookingLink).toBe('https://be.synxis.com/?chain=22402&hotel=47531&src=24C');
    expect(site.footerNav.map((n) => n.title)).toEqual([
      'Booking conditions', 'eriro exclusive', 'Contact and arrival', 'Voucher', 'Newsletter', 'Jobs', 'Press',
    ]);
    expect(site.privacyNav.map((n) => n.link)).toEqual(['/en/imprint/', '/en/privacy/', '/en/cookies/']);
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm test -- tests/unit/content.test.ts`
Expected: FAIL, cannot resolve `@/content/en/home`.

- [ ] **Step 3: Write `lib/content.ts`**

```ts
export type Crop = { x: number; y: number; width: number; height: number };
export type ImageRef = {
  src: string; width: number; height: number; alt: string; title: string | null; mime: string;
  crop: { default: Crop; mobile: Crop };
};
export type VideoRef = { src: string; mime: string };
export type Html = string;
export type LinkRef = { href: string; target: string | null };
export type Appearance = { layout: string; frameClass: string; spaceBefore: '' | 'small' | 'medium' | 'large'; spaceAfter: string };

type Base<T extends string, C> = { id: number; type: T; appearance: Appearance; content: C };

export type HeroSection = Base<'mask_hero', {
  herolayout: 'default' | 'subpage' | 'only-text'; title: Html; titleh2: Html; titleimg: Html; text: Html;
  img: ImageRef[]; sideimg: ImageRef[]; imgsummer: ImageRef[]; sideimgsummer: ImageRef[];
}>;
export type ImgTextSection = Base<'mask_imgtext', {
  title: Html; text: Html; imgleft: ImageRef[]; imgright: ImageRef[]; imgleftsummer: ImageRef[]; imgrightsummer: ImageRef[];
}>;
export type ImgSection = Base<'mask_img', { img: ImageRef[]; imgsummer: ImageRef[] }>;
export type VideoSection = Base<'mask_video', { video: VideoRef[]; videosummer: VideoRef[] }>;
export type QuoteSection = Base<'mask_quote', { quote: Html; autor: string; img: ImageRef[] }>;
export type BreakSection = Base<'mask_break', {
  title: Html; imgleft: ImageRef[]; imgleftsummer: ImageRef[]; imgright: ImageRef[]; imgrightsummer: ImageRef[];
}>;
export type Room = {
  uid: string; pid: string; title: string; description: Html; minprice: string; people: string; size: string;
  previewimage: ImageRef[]; images: ImageRef[];
};
export type RoomSliderSection = Base<'mask_roomslider', { rooms: Room[] }>;
export type TeaserSlide = {
  uid: string; title: Html; imgleft: ImageRef[]; imgright: ImageRef[]; infotext: Html; linktext: string; link: LinkRef | '';
};
export type TeaserSliderSection = Base<'mask_teaserslider', { teaserslides: TeaserSlide[] }>;
export type Partner = { uid: string; img: ImageRef[]; link: LinkRef | '' };
export type PartnerMarqueeSection = Base<'mask_partnermarquee', { title: Html; text: Html; partners: Partner[] }>;
export type UnknownSection = { id: number; type: string; appearance: Appearance; content: Record<string, unknown> };

export type Section =
  | HeroSection | ImgTextSection | ImgSection | VideoSection | QuoteSection | BreakSection
  | RoomSliderSection | TeaserSliderSection | PartnerMarqueeSection | UnknownSection;

export type PageMeta = {
  title: string; description: string; ogTitle: string; ogDescription: string; ogImage: ImageRef | null;
  twitterTitle: string; twitterDescription: string; twitterImage: ImageRef | null; twitterCard: string;
  robots: { noIndex: boolean; noFollow: boolean };
};
export type PageContent = {
  id: number; slug: string; backendLayout: string; meta: PageMeta;
  columns: { colPos0: Section[]; colPos5?: Section[] };
};
```

- [ ] **Step 4: Write `content/site.ts`**

Values come from `docs/reference/nav_en.json` (`hanthavars`, `i18n`) and the SSR header/footer in `docs/reference/pages/en.html`.

```ts
export type NavItem = { uid: number; title: string; link: string; children?: NavItem[] };

export const site = {
  nav: [
    { uid: 58, title: 'Alpine Hide', link: '/en/alpine-hide/' },
    { uid: 44, title: 'Suites', link: '/en/suites/boum/' },
    { uid: 120, title: 'All-In-Service', link: '/en/all-in-service/' },
    { uid: 60, title: 'Experiences', link: '/en/experiences/' },
    { uid: 61, title: 'Culinary', link: '/en/culinary/' },
    { uid: 108, title: 'Spa', link: '/en/spa/' },
    { uid: 86, title: 'Origin', link: '/en/origin/' },
    { uid: 179, title: 'Summer', link: '/en/summer/' },
    { uid: 181, title: 'Winter', link: '/en/winter/' },
  ] as NavItem[],
  footerNav: [
    { uid: 162, title: 'Booking conditions', link: '/en/booking-conditions/' },
    { uid: 164, title: 'eriro exclusive', link: '/en/eriro-exclusive/' },
    { uid: 95, title: 'Contact and arrival', link: '/en/contact-and-arrival/' },
    { uid: 73, title: 'Voucher', link: '/en/voucher/' },
    { uid: 103, title: 'Newsletter', link: '/en/newsletter/' },
    { uid: 72, title: 'Jobs', link: '/en/jobs/' },
    { uid: 71, title: 'Press', link: '/en/press/' },
  ] as NavItem[],
  privacyNav: [
    { uid: 5, title: 'Imprint', link: '/en/imprint/' },
    { uid: 6, title: 'Privacy', link: '/en/privacy/' },
    { uid: 7, title: 'Cookies', link: '/en/cookies/' },
  ] as NavItem[],
  languages: [
    { code: 'de', title: 'Deutsch', link: '/de/' },
    { code: 'en', title: 'English', link: '/en/' },
  ],
  pageLinks: { home: '/en/', request: '/en/request/', contact: '/en/contact-and-arrival/', voucher: '/en/voucher/', gallery: '/en/gallery/' },
  contact: { email: 'hide@eriro.at', tel: '0043 5673 40506', address: 'Ehrwalder Alm 4\r\n6632 Ehrwald, Austria' },
  socialHtml:
    '<a href="https://www.instagram.com/eriro.alpinehide?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" rel="nofollow" target="_blank" aria-label="Instagram">Instagram</a><br>\r\n<a href="https://www.facebook.com/eriroalpinehide" rel="nofollow" target="_blank" aria-label="Facebook">Facebook</a>',
  partnerHtml:
    '<a href="https://www.laposch.com/en/" target="_blank" rel="noopener" aria-label="www.laposch.com">laposch.com</a><br>\r\n<a href="https://www.hotel-spielmann.com/en/" target="_blank" rel="noopener" aria-label="www.hotel-spielmann.com">hotel-spielmann.com</a>',
  bookingLink: 'https://be.synxis.com/?chain=22402&hotel=47531&src=24C',
  unikateur: 'https://www.unikateur.com/',
  t: {
    menu: 'Menu', close: 'Close', email: 'Email', contact: 'Contact', partner: 'Partner', phone: 'Phone', address: 'Address',
    social: 'Follow us', request: 'Request', book: 'Book', visitSuite: 'View Suite', year: 'y.', kidsage: 'Kids age',
    removeRoom: 'Remove room', addRoom: 'Add room', all: 'All', unikSignet: 'unique hospitality concepts, by ',
  },
  season: { seasonswitchstart: 0, seasonswitchend: 1792999620 },
} as const;
```

- [ ] **Step 5: Write `scripts/gen-content.ts`**

```ts
import fs from 'node:fs';
import path from 'node:path';

type Json = Record<string, unknown>;
const ROOT = path.resolve(__dirname, '..');
const META_KEYS = new Set(['header', 'subheader', 'headerLayout', 'headerPosition', 'headerLink']);

function isImage(o: unknown): o is Json {
  return !!o && typeof o === 'object' && 'originalUrl' in (o as Json) && 'dimensions' in (o as Json);
}
function toSrc(originalUrl: string): string {
  let p = originalUrl;
  try { p = decodeURIComponent(p); } catch { /* keep */ }
  try { p = decodeURIComponent(p); } catch { /* keep */ }
  return '/images/' + p.replace(/^\/?fileadmin\/user_upload\//, '').replace(/^\/?fileadmin\//, '');
}
function toVideoSrc(originalUrl: string): string {
  let p = originalUrl;
  try { p = decodeURIComponent(p); } catch { /* keep */ }
  return '/videos/' + path.posix.basename(p);
}
function cropOf(img: Json, key: string) {
  const crop = (img.crop as Json | undefined)?.[key] as Json | undefined;
  const area = (crop?.cropArea as Json | undefined) ?? { x: 0, y: 0, width: 1, height: 1 };
  return { x: Number(area.x), y: Number(area.y), width: Number(area.width), height: Number(area.height) };
}
function convert(o: unknown): unknown {
  if (Array.isArray(o)) return o.map(convert);
  if (o && typeof o === 'object') {
    if (isImage(o)) {
      const mime = String(o.mime ?? '');
      if (mime.startsWith('video/')) return { src: toVideoSrc(String(o.originalUrl)), mime };
      const dims = o.dimensions as Json;
      return {
        src: toSrc(String(o.originalUrl)), width: Number(dims.width), height: Number(dims.height),
        alt: (o.alt as string) ?? '', title: (o.title as string | null) ?? null, mime,
        crop: { default: cropOf(o, 'default'), mobile: cropOf(o, 'mobile') },
      };
    }
    const out: Json = {};
    for (const [k, v] of Object.entries(o as Json)) out[k] = convert(v);
    return out;
  }
  return o;
}
function convertSection(e: Json) {
  const content = e.content as Json;
  const cleaned: Json = {};
  for (const [k, v] of Object.entries(content)) if (!META_KEYS.has(k) && k !== 'type') cleaned[k] = v;
  return { id: Number(e.id), type: String(e.type), appearance: e.appearance, content: convert(cleaned) };
}
function convertMeta(m: Json) {
  const img = (x: unknown) => (isImage(x) ? convert(x) : null);
  return {
    title: m.title ?? '', description: m.description ?? '', ogTitle: m.ogTitle ?? '', ogDescription: m.ogDescription ?? '',
    ogImage: img(m.ogImage), twitterTitle: m.twitterTitle ?? '', twitterDescription: m.twitterDescription ?? '',
    twitterImage: img(m.twitterImage), twitterCard: m.twitterCard ?? 'summary',
    robots: (m.robots as Json) ?? { noIndex: false, noFollow: false },
  };
}
export function generate(slug: string, exportName: string) {
  const src = path.join(ROOT, 'docs/reference/pages', slug === 'home' ? 'en.json' : `en__${slug}.json`);
  const page = JSON.parse(fs.readFileSync(src, 'utf8')) as Json;
  const columns: Json = {};
  for (const [col, els] of Object.entries(page.content as Json)) columns[col] = (els as Json[]).map(convertSection);
  const out = {
    id: Number(page.id), slug: String(page.slug), backendLayout: String((page.appearance as Json).backendLayout),
    meta: convertMeta(page.meta as Json), columns,
  };
  const file = path.join(ROOT, 'content/en', `${slug}.ts`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file,
    `// GENERATED by scripts/gen-content.ts from docs/reference/pages/${path.basename(src)}. Do not edit by hand.\n` +
    `import type { PageContent } from '@/lib/content';\n\nexport const ${exportName}: PageContent = ${JSON.stringify(out, null, 2)};\n`);
  console.log('wrote', path.relative(ROOT, file));
}
const [slug = 'home', name = 'home'] = process.argv.slice(2);
generate(slug, name);
```
Run: `npm run gen:content` (generates `content/en/home.ts`).

- [ ] **Step 6: Run the tests and typecheck**

Run: `npm test -- tests/unit/content.test.ts && npm run typecheck`
Expected: all content tests PASS; typecheck clean. If `tsc` rejects the generated literal for a `Section` union member, the generator output for that section has an unexpected key: compare with `lib/content.ts` and fix the type, not the data.

- [ ] **Step 7: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "feat: typed content model, site data and generator for the homepage

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Image pipeline (`/i` resize route, srcset math, `Picture`)

**Files:**
- Create: `app/i/route.ts`, `lib/images.ts`, `lib/gsap.ts`, `components/ui/Picture.tsx`, `components/ui/Picture.css`
- Test: `tests/unit/images.test.ts`, `tests/e2e/image-route.spec.ts`

**Interfaces:**
- Produces (`lib/images.ts`):
  - `type SizePreset = { widthD?: number; heightD?: number; widthM?: number; heightM?: number }`
  - `type SourceSpec = { media: string; width?: number; height?: number }`
  - `buildSources(image: ImageRef, preset: SizePreset): SourceSpec[]` (6 entries: 3 desktop then 3 mobile)
  - `aspectRatios(image: ImageRef, preset: SizePreset): [desktop: number, mobile: number]`
  - `extractParam(image: ImageRef, which: 'default' | 'mobile'): string | undefined` (`"x_y_w_h"` in pixels, `undefined` when the crop is the full image)
  - `imgUrl(src: string, o: { w?: number; h?: number; q?: number; extract?: string }): string`
- Produces (`lib/gsap.ts`): `export { gsap, ScrollTrigger, ScrollSmoother, SplitText, MorphSVGPlugin, Draggable, InertiaPlugin, ScrollToPlugin, useGSAP }`
- Produces (`components/ui/Picture.tsx`): `Picture({ image, widthD, heightD, widthM, heightM, lazy = true })` rendering `<picture class="picture">`.

- [ ] **Step 1: Write the failing unit test**

```ts
// tests/unit/images.test.ts
import { describe, it, expect } from 'vitest';
import { buildSources, aspectRatios, extractParam, imgUrl } from '@/lib/images';
import type { ImageRef } from '@/lib/content';

const full = { x: 0, y: 0, width: 1, height: 1 };
const hero: ImageRef = { src: '/images/a.jpg', width: 3000, height: 2001, alt: '', title: null, mime: 'image/jpeg', crop: { default: full, mobile: full } };

describe('buildSources', () => {
  it('matches the original _ipx sizes for the hero big image', () => {
    const s = buildSources(hero, { widthD: 1014, heightD: 780, widthM: 340, heightM: 260 });
    expect(s).toEqual([
      { media: '(min-width: 1920px)', width: 1352, height: 1040 },
      { media: '(min-width: 1440px)', width: 1014, height: 780 },
      { media: '(min-width: 1024px)', width: 761, height: 585 },
      { media: '(min-width: 768px)', width: 967, height: 740 },
      { media: '(min-width: 480px)', width: 725, height: 555 },
      { media: '(min-width: 0px)', width: 453, height: 347 },
    ]);
  });
  it('produces height-only sizes for logos', () => {
    const s = buildSources(hero, { heightD: 180, heightM: 120 });
    expect(s.map((x) => x.height)).toEqual([240, 180, 135, 341, 256, 160]);
    expect(s.every((x) => x.width === undefined)).toBe(true);
  });
});

describe('aspectRatios', () => {
  it('uses the preset ratio when width and height are given', () => {
    expect(aspectRatios(hero, { widthD: 1014, heightD: 780, widthM: 340, heightM: 260 })).toEqual([1.3, 1.3076923076923077]);
  });
  it('falls back to the cropped image ratio for height-only presets', () => {
    expect(aspectRatios(hero, { heightD: 180, heightM: 120 })).toEqual([3000 / 2001, 3000 / 2001]);
  });
});

describe('extractParam and imgUrl', () => {
  it('omits extract for the full image and encodes the src', () => {
    expect(extractParam(hero, 'default')).toBeUndefined();
    expect(imgUrl('/images/Hendrik_Stüwe/x.jpg', { w: 10, h: 5 })).toBe('/i?src=%2Fimages%2FHendrik_St%C3%BCwe%2Fx.jpg&w=10&h=5&q=80');
  });
  it('emits pixel extract for a partial crop', () => {
    const cropped: ImageRef = { ...hero, crop: { default: { x: 0, y: 0.10644216691068813, width: 1, height: 0.7871156661786237 }, mobile: full } };
    expect(extractParam(cropped, 'default')).toBe('0_213_3000_1561');
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm test -- tests/unit/images.test.ts`
Expected: FAIL, cannot resolve `@/lib/images`.

- [ ] **Step 3: Write `lib/images.ts` (port of `Img.vue`)**

```ts
import type { ImageRef } from './content';

export type SizePreset = { widthD?: number; heightD?: number; widthM?: number; heightM?: number };
export type SourceSpec = { media: string; width?: number; height?: number };

const CONFIGS = [
  { id: 'default' as const, size: 1920, breakpoints: [{ view: 1920, size: 2560 }, { view: 1440, size: 1920 }, { view: 1024, size: 1440 }] },
  { id: 'mobile' as const, size: 360, breakpoints: [{ view: 768, size: 1024 }, { view: 480, size: 768 }, { view: 0, size: 480 }] },
];

function trunc2(n: number): number {
  const m = n.toString().match(/^-?\d+(?:\.\d{0,2})?/);
  return m ? parseFloat(m[0]) : n;
}
function dims(preset: SizePreset, id: 'default' | 'mobile') {
  return id === 'default' ? { width: preset.widthD, height: preset.heightD } : { width: preset.widthM, height: preset.heightM };
}

export function extractParam(image: ImageRef, which: 'default' | 'mobile'): string | undefined {
  const c = image.crop[which];
  if (c.x === 0 && c.y === 0 && c.width === 1 && c.height === 1) return undefined;
  return [
    Math.round(c.x * image.width), Math.round(c.y * image.height),
    Math.round(trunc2(c.width) * image.width), Math.round(trunc2(c.height) * image.height),
  ].join('_');
}

export function buildSources(image: ImageRef, preset: SizePreset): SourceSpec[] {
  const out: SourceSpec[] = [];
  for (const cfg of CONFIGS) {
    const { width, height } = dims(preset, cfg.id);
    const r = width ? cfg.size / width : 0;
    const n = width && height ? width / height : height ? cfg.size / height : 0;
    for (const bp of cfg.breakpoints) {
      out.push({
        media: `(min-width: ${bp.view}px)`,
        width: r !== 0 ? Math.round(bp.size / r) : undefined,
        height: width && height ? Math.round(bp.size / r / n) : n !== 0 ? Math.round(bp.size / n) : undefined,
      });
    }
  }
  return out;
}

export function aspectRatios(image: ImageRef, preset: SizePreset): [number, number] {
  const ratio = (id: 'default' | 'mobile') => {
    const { width, height } = dims(preset, id);
    if (width && height) return width / height;
    const c = image.crop[id];
    return (image.width * c.width) / (image.height * c.height);
  };
  return [ratio('default'), ratio('mobile')];
}

export function imgUrl(src: string, o: { w?: number; h?: number; q?: number; extract?: string }): string {
  const p = new URLSearchParams();
  p.set('src', src);
  if (o.w) p.set('w', String(o.w));
  if (o.h) p.set('h', String(o.h));
  p.set('q', String(o.q ?? 80));
  if (o.extract) p.set('extract', o.extract);
  return `/i?${p.toString().replace(/\+/g, '%20')}`;
}
```

- [ ] **Step 4: Run the unit test**

Run: `npm test -- tests/unit/images.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Write the failing e2e test for the route**

```ts
// tests/e2e/image-route.spec.ts
import { test, expect } from '@playwright/test';
import sharp from 'sharp';

test('/i resizes to the exact requested box as webp', async ({ request }) => {
  const res = await request.get('/i?src=%2Fimages%2Funikateur_Bilder%2FAlexMoling_Eriro_Exterior.jpg&w=1352&h=1040&q=80');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toBe('image/webp');
  const meta = await sharp(await res.body()).metadata();
  expect(meta.width).toBe(1352);
  expect(meta.height).toBe(1040);
});

test('/i height-only keeps the aspect ratio', async ({ request }) => {
  const res = await request.get('/i?src=%2Fimages%2FLogos%2Fbilanz.png&h=180&q=80');
  const meta = await sharp(await res.body()).metadata();
  expect(meta.height).toBe(180);
  expect(meta.width).toBe(Math.round((180 * 3750) / 2084));
});

test('/i rejects paths outside public/images', async ({ request }) => {
  const res = await request.get('/i?src=%2F..%2Fpackage.json&w=10');
  expect(res.status()).toBe(400);
});
```

- [ ] **Step 6: Write `app/i/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

export const runtime = 'nodejs';
const PUBLIC = path.resolve(process.cwd(), 'public');
const IMAGES = path.join(PUBLIC, 'images');
const CACHE = path.resolve(process.cwd(), '.cache/img');

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const src = q.get('src') ?? '';
  const w = q.get('w') ? Number(q.get('w')) : undefined;
  const h = q.get('h') ? Number(q.get('h')) : undefined;
  const quality = q.get('q') ? Number(q.get('q')) : 80;
  const extract = q.get('extract') ?? undefined;
  if (!src.startsWith('/images/') || src.includes('..')) return new NextResponse('bad src', { status: 400 });
  if ((w !== undefined && !(w > 0 && w < 5000)) || (h !== undefined && !(h > 0 && h < 5000))) return new NextResponse('bad size', { status: 400 });
  const file = path.resolve(PUBLIC, '.' + src);
  if (!file.startsWith(IMAGES + path.sep)) return new NextResponse('bad src', { status: 400 });
  if (src.toLowerCase().endsWith('.svg')) {
    const svg = await fs.readFile(file);
    return new NextResponse(svg, { headers: { 'content-type': 'image/svg+xml', 'cache-control': 'public, max-age=31536000, immutable' } });
  }
  const key = crypto.createHash('sha1').update(`${src}|${w}|${h}|${quality}|${extract}`).digest('hex');
  const cached = path.join(CACHE, `${key}.webp`);
  try {
    const buf = await fs.readFile(cached);
    return webp(buf);
  } catch { /* not cached */ }
  let img = sharp(file, { failOn: 'none' }).rotate();
  if (extract) {
    const [left, top, width, height] = extract.split('_').map(Number);
    img = img.extract({ left, top, width, height });
  }
  if (w && h) img = img.resize(w, h, { fit: 'cover', position: 'centre', withoutEnlargement: false });
  else if (w) img = img.resize({ width: w });
  else if (h) img = img.resize({ height: h });
  const out = await img.webp({ quality }).toBuffer();
  await fs.mkdir(CACHE, { recursive: true });
  await fs.writeFile(cached, out);
  return webp(out);
}

function webp(buf: Buffer) {
  return new NextResponse(new Uint8Array(buf), {
    headers: { 'content-type': 'image/webp', 'cache-control': 'public, max-age=31536000, immutable' },
  });
}
```

- [ ] **Step 7: Run the route test**

Run: `npm run test:e2e -- tests/e2e/image-route.spec.ts`
Expected: 3 PASS.

- [ ] **Step 8: Write `lib/gsap.ts`**

```ts
'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, MorphSVGPlugin, Draggable, InertiaPlugin, ScrollToPlugin, useGSAP);
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, MorphSVGPlugin, Draggable, InertiaPlugin, ScrollToPlugin, useGSAP };
```

- [ ] **Step 9: Copy picture CSS with renamed custom properties**

```bash
sed 's/--c57b0150/--ar-d/g; s/--c57b013e/--ar-m/g' docs/reference/css-clean/picture.css > components/ui/Picture.css
cat components/ui/Picture.css
```
Expected content:
```css
picture.picture { display:block; position:relative; }
picture.picture > .overlay { background-color:#211d1d; height:100%; left:0; pointer-events:none; position:absolute; top:0; width:100%; z-index:5; }
picture.picture > img { aspect-ratio:var(--ar-d); height:auto; width:100%; }
@media (max-width:1023px) { picture.picture > img { aspect-ratio:var(--ar-m); } }
```
`Picture.tsx` imports it with `import './Picture.css';` (Next.js allows global CSS imports from any component).

- [ ] **Step 10: Write `components/ui/Picture.tsx`**

```tsx
'use client';
import { useRef, type CSSProperties } from 'react';
import type { ImageRef } from '@/lib/content';
import { buildSources, aspectRatios, extractParam, imgUrl, type SizePreset } from '@/lib/images';
import { gsap, useGSAP } from '@/lib/gsap';
import './Picture.css';

// Mirrors the original Img.vue: a <picture> with six webp sources (3 desktop, 3 mobile),
// a dark overlay that fades out once the image has loaded (original: 0.5s power1.out).

type Props = SizePreset & { image: ImageRef; lazy?: boolean; className?: string };

export function Picture({ image, widthD, heightD, widthM, heightM, lazy = true, className }: Props) {
  const preset: SizePreset = { widthD, heightD, widthM, heightM };
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [arD, arM] = aspectRatios(image, preset);
  const isSvg = image.mime === 'image/svg+xml';
  const sources = isSvg ? [] : buildSources(image, preset);

  const reveal = () => {
    if (overlayRef.current && imgRef.current?.complete) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.5, ease: 'power1.out' });
    }
  };
  useGSAP(() => { reveal(); }, { dependencies: [image.src] });

  const style = { '--ar-d': String(arD), '--ar-m': String(arM) } as CSSProperties;
  return (
    <picture className={className ? `picture ${className}` : 'picture'} style={style}>
      {sources.map((s, i) => (
        <source
          key={i}
          type="image/webp"
          media={s.media}
          srcSet={imgUrl(image.src, { w: s.width, h: s.height, extract: extractParam(image, i < 3 ? 'default' : 'mobile') })}
        />
      ))}
      <img
        ref={imgRef}
        src={isSvg ? image.src : imgUrl(image.src, { w: widthD, h: heightD })}
        alt={image.alt ?? ''}
        title={image.title ?? undefined}
        loading={lazy ? 'lazy' : undefined}
        onLoad={reveal}
      />
      <div className="overlay" ref={overlayRef} />
    </picture>
  );
}
```

- [ ] **Step 11: Typecheck and run all unit tests**

Run: `npm run typecheck && npm test`
Expected: clean; all unit tests PASS.

- [ ] **Step 12: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "feat: sharp image route, ipx-compatible srcset math, Picture with overlay reveal, gsap registry

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Shared primitives (Mask, RichText, links, page transition, smooth scroll, SplitWords, parallax)

**Files:**
- Create: `lib/smoother.ts`, `lib/transition.ts`, `lib/season.ts`, `components/layout/SmoothScroll.tsx`, `components/layout/PageTransition.tsx`, `components/layout/TransitionLink.tsx`, `components/sections/Mask.tsx`, `components/ui/RichText.tsx`, `components/ui/Button.tsx`, `components/ui/BigLink.tsx`, `components/ui/SplitWords.tsx`, `components/ui/useParallax.ts`
- Modify: `app/layout.tsx`
- Test: `tests/unit/primitives.test.tsx`

**Interfaces:**
- `lib/smoother.ts`: `setSmoother(s: ScrollSmoother | null)`, `getSmoother(): ScrollSmoother | null`, `onSmoother(cb: (s: ScrollSmoother) => void): () => void`
- `lib/transition.ts`: `PAGE_ID = 'page-transition'`, `leavePage(): Promise<void>`, `enterPage(): void`, `isInternal(href: string): boolean`
- `lib/season.ts`: `isWinter(now: Date, start: number, end: number): boolean`, `useIsWinter(): boolean`
- `Mask({ type, appearance, uid, className?, as?, children })` → element with classes `${layout} space-before-${spaceBefore} mask mask_${type}` and attribute `uid="c${uid}"`
- `RichText({ html, className?, as? })` → element with `dangerouslySetInnerHTML`, internal `<a>` clicks go through `leavePage()` + `router.push`
- `TransitionLink({ href, className?, target?, rel?, children, onClick? })`
- `Button({ href, className?, target?, children })` → `<a class="ht-button">`; `BigLink(...)` → `<a class="ht-biglink">`
- `SplitWords({ as, className, html, duration = 0.4 })` → heading whose words fade from `autoAlpha .2` scrubbed by scroll
- `useParallax(ref: RefObject<HTMLElement | null>, speed: number)`

- [ ] **Step 1: Write the failing unit tests**

```tsx
// tests/unit/primitives.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Mask } from '@/components/sections/Mask';
import { isWinter } from '@/lib/season';
import { setSmoother, onSmoother } from '@/lib/smoother';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/en/' }));

describe('Mask', () => {
  it('renders the original wrapper classes and uid', () => {
    const { container } = render(
      <Mask type="imgtext" uid={75} appearance={{ layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }}>
        <span>x</span>
      </Mask>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toBe('default space-before- mask mask_imgtext');
    expect(el.getAttribute('uid')).toBe('c75');
  });
  it('adds extra classes after the mask classes', () => {
    const { container } = render(
      <Mask type="img" uid={712} className="grid-container" appearance={{ layout: 'default', frameClass: 'default', spaceBefore: 'large', spaceAfter: '' }} />,
    );
    expect((container.firstElementChild as HTMLElement).className).toBe('default space-before-large mask mask_img grid-container');
  });
});

describe('isWinter', () => {
  it('is false when the start timestamp is 0 (site setting)', () => {
    expect(isWinter(new Date('2026-01-15T00:00:00Z'), 0, 1792999620)).toBe(false);
  });
  it('is true outside the summer window when both timestamps are set', () => {
    const start = Date.UTC(2020, 4, 1) / 1000; // 1 May
    const end = Date.UTC(2020, 9, 26) / 1000; // 26 Oct
    expect(isWinter(new Date('2026-12-15T00:00:00Z'), start, end)).toBe(true);
    expect(isWinter(new Date('2026-07-15T00:00:00Z'), start, end)).toBe(false);
  });
});

describe('smoother store', () => {
  it('runs queued callbacks once a smoother is set', () => {
    const cb = vi.fn();
    setSmoother(null);
    onSmoother(cb);
    expect(cb).not.toHaveBeenCalled();
    const fake = {} as never;
    setSmoother(fake);
    expect(cb).toHaveBeenCalledWith(fake);
    const cb2 = vi.fn();
    onSmoother(cb2);
    expect(cb2).toHaveBeenCalledWith(fake);
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- tests/unit/primitives.test.tsx`
Expected: FAIL, modules missing.

- [ ] **Step 3: Write `lib/smoother.ts`, `lib/season.ts`, `lib/transition.ts`**

```ts
// lib/smoother.ts
import type { ScrollSmoother } from 'gsap/ScrollSmoother';
type Cb = (s: ScrollSmoother) => void;
let current: ScrollSmoother | null = null;
const queue: Cb[] = [];
export function setSmoother(s: ScrollSmoother | null) {
  current = s;
  if (s) queue.splice(0).forEach((cb) => cb(s));
}
export function getSmoother() { return current; }
export function onSmoother(cb: Cb) {
  if (current) { cb(current); return () => {}; }
  queue.push(cb);
  return () => { const i = queue.indexOf(cb); if (i >= 0) queue.splice(i, 1); };
}
```

```ts
// lib/season.ts  (port of the typo3 store getter `isWinter`)
import { site } from '@/content/site';
export function isWinter(now: Date, start: number, end: number): boolean {
  if (!(start && end)) return false;
  const s = new Date(start * 1000);
  const e = new Date(end * 1000);
  s.setFullYear(now.getFullYear());
  e.setFullYear(now.getFullYear());
  if (e < s) e.setFullYear(e.getFullYear() + 1);
  return !(now >= s && now <= e);
}
export function useIsWinter(): boolean {
  return isWinter(new Date(), site.season.seasonswitchstart, site.season.seasonswitchend);
}
```

```ts
// lib/transition.ts  (the original .page-enter/.page-leave transition: .6s, opacity 0, blur 1rem, translateY 2rem)
'use client';
import { gsap } from '@/lib/gsap';
export const PAGE_ID = 'page-transition';
export function isInternal(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}
export function leavePage(): Promise<void> {
  const el = document.getElementById(PAGE_ID);
  if (!el) return Promise.resolve();
  return new Promise((resolve) => {
    gsap.to(el, { opacity: 0, filter: 'blur(1rem)', y: '2rem', duration: 0.6, ease: 'none', onComplete: resolve });
  });
}
export function enterPage(): void {
  const el = document.getElementById(PAGE_ID);
  if (!el) return;
  gsap.fromTo(el, { opacity: 0, filter: 'blur(1rem)', y: '2rem' }, { opacity: 1, filter: 'blur(0rem)', y: 0, duration: 0.6, ease: 'none', clearProps: 'filter,transform' });
}
```

- [ ] **Step 4: Write the layout components**

```tsx
// components/layout/SmoothScroll.tsx
'use client';
import { useEffect, type ReactNode } from 'react';
import { ScrollSmoother, ScrollTrigger } from '@/lib/gsap';
import { setSmoother } from '@/lib/smoother';

const DESKTOP = 1024;

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    let instance: ScrollSmoother | null = null;
    const create = () => {
      if (instance) return;
      instance = ScrollSmoother.create({
        wrapper: '#smooth-wrapper', content: '#smooth-content',
        smooth: 1.5, effects: true, smoothTouch: 0.1, normalizeScroll: false,
      });
      setSmoother(instance);
    };
    const kill = () => { instance?.kill(); instance = null; setSmoother(null); };
    const sync = () => { if (window.innerWidth >= DESKTOP) create(); else kill(); ScrollTrigger.refresh(); };
    sync();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(t); t = setTimeout(sync, 150); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); kill(); };
  }, []);
  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
```

```tsx
// components/layout/PageTransition.tsx
'use client';
import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { PAGE_ID, enterPage } from '@/lib/transition';

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useEffect(() => { enterPage(); }, [pathname]);
  return <div id={PAGE_ID}>{children}</div>;
}
```

```tsx
// components/layout/TransitionLink.tsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { isInternal, leavePage } from '@/lib/transition';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode };

export function TransitionLink({ href, onClick, target, children, ...rest }: Props) {
  const router = useRouter();
  const internal = isInternal(href) && target !== '_blank';
  const handle = async (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !internal || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    await leavePage();
    router.push(href);
  };
  if (!internal) return <a href={href} target={target} onClick={onClick} {...rest}>{children}</a>;
  return <Link href={href} onClick={handle} {...rest}>{children}</Link>;
}
```

- [ ] **Step 5: Write the UI primitives**

```tsx
// components/sections/Mask.tsx
import type { ElementType, ReactNode } from 'react';
import type { Appearance } from '@/lib/content';

type Props = { type: string; uid: number; appearance: Appearance; className?: string; as?: ElementType; children?: ReactNode };

export function Mask({ type, uid, appearance, className, as: Tag = 'div', children }: Props) {
  const cls = [`${appearance.layout}`, `space-before-${appearance.spaceBefore}`, 'mask', `mask_${type}`, className].filter(Boolean).join(' ');
  return <Tag className={cls} uid={`c${uid}`}>{children}</Tag>;
}
```

```tsx
// components/ui/RichText.tsx
'use client';
import { useRouter } from 'next/navigation';
import type { ElementType, MouseEvent } from 'react';
import { isInternal, leavePage } from '@/lib/transition';

type Props = { html: string; className?: string; as?: ElementType };

export function RichText({ html, className, as: Tag = 'div' }: Props) {
  const router = useRouter();
  const onClick = async (e: MouseEvent<HTMLElement>) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const href = a.getAttribute('href') ?? '';
    if (!isInternal(href)) return;
    e.preventDefault();
    await leavePage();
    router.push(href);
  };
  return <Tag className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
```

```tsx
// components/ui/Button.tsx
import type { ReactNode } from 'react';
import { TransitionLink } from '@/components/layout/TransitionLink';
type Props = { href: string; className?: string; target?: string; rel?: string; children: ReactNode };
export function Button({ href, className, target, rel, children }: Props) {
  return <TransitionLink href={href} target={target} rel={rel} className={className ? `ht-button ${className}` : 'ht-button'}>{children}</TransitionLink>;
}
```

```tsx
// components/ui/BigLink.tsx
import type { ReactNode } from 'react';
import { TransitionLink } from '@/components/layout/TransitionLink';
type Props = { href: string; className?: string; target?: string; rel?: string; children: ReactNode };
export function BigLink({ href, className, target, rel, children }: Props) {
  return <TransitionLink href={href} target={target} rel={rel} className={className ? `ht-biglink ${className}` : 'ht-biglink'}>{children}</TransitionLink>;
}
```

```tsx
// components/ui/SplitWords.tsx  (port of: new SplitText(el,{type:'words'}); gsap.from(words,{duration,autoAlpha:.2,stagger:.1,scrollTrigger:{trigger:el,start:'top 85%',end:'bottom 50%',scrub:true}}))
'use client';
import { useRef, type ElementType } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

type Props = { as?: ElementType; className?: string; html: string; duration?: number };

export function SplitWords({ as: Tag = 'h2', className, html, duration = 0.4 }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const split = SplitText.create(el, { type: 'words' });
    gsap.from(split.words, {
      duration, autoAlpha: 0.2, stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 50%', scrub: true },
    });
    return () => split.revert();
  }, { dependencies: [html] });
  return <Tag ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
```

```ts
// components/ui/useParallax.ts  (port of: smoother.effects(picture, { speed }) on desktop only)
'use client';
import { useEffect, type RefObject } from 'react';
import { onSmoother } from '@/lib/smoother';

export function useParallax(ref: RefObject<HTMLElement | null>, speed: number) {
  useEffect(() => {
    let triggers: { kill: () => void }[] = [];
    const off = onSmoother((s) => {
      if (!ref.current || window.innerWidth < 1024) return;
      triggers = s.effects(ref.current, { speed }) as unknown as { kill: () => void }[];
    });
    return () => { off(); triggers.forEach((t) => t.kill()); };
  }, [ref, speed]);
}
```

- [ ] **Step 6: Wire SmoothScroll and PageTransition into `app/layout.tsx`**

Replace the body with:
```tsx
<body>
  <div className="body-inner">
    <div id="__app">
      <SmoothScroll>
        <PageTransition>{children}</PageTransition>
      </SmoothScroll>
      <img className="eriro-bg-attach" src="/HG.jpg" alt="" />
    </div>
  </div>
</body>
```
(add the imports; `eslint-disable-next-line @next/next/no-img-element` above the texture `img`). The original DOM is `body > #__nuxt > (header, #smooth-wrapper > #smooth-content > div > main, img.eriro-bg-attach)`; header lands here in Task 7 and footer in Task 8.

- [ ] **Step 7: Run tests, typecheck, and check the dev page**

Run: `npm test -- tests/unit/primitives.test.tsx && npm run typecheck && npm run build`
Expected: PASS, clean, build OK. Open `http://localhost:3000/en/` after `npm run dev`: the page fades in over 0.6s and the paper texture shows behind the beige body.

- [ ] **Step 8: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "feat: layout primitives (smooth scroll, page transition, mask, rich text, split words, parallax)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Icon components from the original SVG artwork

**Files:**
- Create: `components/ui/icons/MenuIcon.tsx`, `LogoIcon.tsx`, `TelIcon.tsx`, `MailIcon.tsx`, `MapIcon.tsx`, `VoucherIcon.tsx`, `GalleryIcon.tsx`, `ArrowSliderIcon.tsx`, `SubmenuIcon.tsx`, `UnikateurIcon.tsx`, `index.ts`
- Test: `tests/unit/icons.test.tsx`

**Interfaces:**
- Each icon: `export function XIcon(props: SVGProps<SVGSVGElement>)`, renders the exact original `<svg>` (same `viewBox`, same paths) with `className="filled"` by default (except `LogoIcon`, class `""`), spreading `props` last so callers can override.
- `MenuIcon` paths carry `className="a1" | "a2" | "a3"` (needed by the morph).

| Component | Source file in `docs/reference/icons/` | viewBox |
|---|---|---|
| `MenuIcon` | `inline_menuIcon_0x0x55x29.svg` | `0 0 55 29` |
| `LogoIcon` | `inline_svg_0x0x567x217.svg` | `0 0 567 217` |
| `TelIcon` | `inline_filled_0x0x28x28.svg` (= `telefon.svg`) | `0 0 28 28` |
| `MailIcon` | `inline_filled_0x0x33x29.svg` (= `mail.svg`) | `0 0 33 29` |
| `MapIcon` | `inline_filled_0x0x23x30.svg` (= `anreise.svg`) | `0 0 23 30` |
| `VoucherIcon` | `inline_filled_0x0x21x31.svg` (= `gutschein.svg`) | `0 0 21 31` |
| `GalleryIcon` | `inline_filled_0x0x30x26.svg` (= `galerie.svg`) | `0 0 30 26` |
| `ArrowSliderIcon` | `inline_filled_0x0x70x25.svg` (= `arrowslider.svg`) | `0 0 70 25` |
| `SubmenuIcon` | `submenuIcon.svg` | `0 0 13 8` |
| `UnikateurIcon` | `inline_filled_0x0x71x11.svg` (= `unikateur.svg`) | `0 0 71 11` |

- [ ] **Step 1: Write the failing test**

```tsx
// tests/unit/icons.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as Icons from '@/components/ui/icons';

const expected: Record<string, string> = {
  MenuIcon: '0 0 55 29', LogoIcon: '0 0 567 217', TelIcon: '0 0 28 28', MailIcon: '0 0 33 29', MapIcon: '0 0 23 30',
  VoucherIcon: '0 0 21 31', GalleryIcon: '0 0 30 26', ArrowSliderIcon: '0 0 70 25', SubmenuIcon: '0 0 13 8', UnikateurIcon: '0 0 71 11',
};

describe('icons', () => {
  for (const [name, viewBox] of Object.entries(expected)) {
    it(`${name} renders the original viewBox`, () => {
      const Cmp = (Icons as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>)[name];
      const { container } = render(<Cmp />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('viewBox')).toBe(viewBox);
      expect(svg?.querySelectorAll('path').length).toBeGreaterThan(0);
    });
  }
  it('MenuIcon exposes the three morph targets', () => {
    const { container } = render(<Icons.MenuIcon />);
    expect(container.querySelector('path.a1')).not.toBeNull();
    expect(container.querySelector('path.a2')).not.toBeNull();
    expect(container.querySelector('path.a3')).not.toBeNull();
    expect(container.querySelector('svg')?.getAttribute('class')).toBe('menuIcon filled');
  });
  it('LogoIcon has the six logo paths', () => {
    const { container } = render(<Icons.LogoIcon />);
    expect(container.querySelectorAll('path').length).toBe(6);
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- tests/unit/icons.test.tsx`
Expected: FAIL, module missing.

- [ ] **Step 3: Create the icon components**

Conversion rules for every file: open the source SVG, keep every `<path>` with its `d`, `fill`, `stroke`, `stroke-width`, `stroke-miterlimit`, `style` values unchanged; rename attributes to JSX (`stroke-width` → `strokeWidth`, `stroke-miterlimit` → `strokeMiterlimit`, `class` → `className`, `data-name` stays), convert `style="fill:#1d1d1b;stroke:#1d1d1b;stroke-miterlimit:10"` to `style={{ fill: '#1d1d1b', stroke: '#1d1d1b', strokeMiterlimit: 10 }}`, drop `xmlns`. Pattern (shown complete for `TelIcon`; the `d` string is the one from `docs/reference/icons/inline_filled_0x0x28x28.svg`, copied verbatim):

```tsx
// components/ui/icons/TelIcon.tsx
import type { SVGProps } from 'react';
export function TelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 28 28" className="filled" {...props}>
      <path fill="#211D1D" stroke="#211D1D" strokeWidth="1.1" d="m3.632 14.381.032.053a38 38 0 0 0 1.95 2.93 … (verbatim from the reference file)" />
    </svg>
  );
}
```
`MenuIcon` root: `<svg fill="none" className="menuIcon filled" viewBox="0 0 55 29" {...props}>` with three `<path fill="#211D1D" className="a1|a2|a3" d="…"/>`.
`LogoIcon` root: `<svg fill="none" viewBox="0 0 567 217" className="" {...props}>` with the six `<path fill="#211D1D" d="…"/>`.
`MailIcon` paths use `style` (fill/stroke `#1d1d1b`, `strokeMiterlimit: 10`) exactly as in the source.
`VoucherIcon` and `GalleryIcon` have several paths with `strokeWidth=".8"`; keep all of them, including the four tiny paths at the end of the voucher file.

```ts
// components/ui/icons/index.ts
export { MenuIcon } from './MenuIcon';
export { LogoIcon } from './LogoIcon';
export { TelIcon } from './TelIcon';
export { MailIcon } from './MailIcon';
export { MapIcon } from './MapIcon';
export { VoucherIcon } from './VoucherIcon';
export { GalleryIcon } from './GalleryIcon';
export { ArrowSliderIcon } from './ArrowSliderIcon';
export { SubmenuIcon } from './SubmenuIcon';
export { UnikateurIcon } from './UnikateurIcon';
```

- [ ] **Step 4: Run the test**

Run: `npm test -- tests/unit/icons.test.tsx`
Expected: 12 PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "feat: inline the original SVG icon artwork as React components

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Header (logo scrub, hamburger morph, menu timeline, scrolled state)

**Files:**
- Create: `components/layout/Header.tsx`, `components/layout/Header.css`, `components/layout/MenuButton.tsx`, `components/layout/MenuPanel.tsx`, `components/layout/Logo.tsx`, `components/layout/menuAnimations.ts`, `components/layout/useScrolledBody.ts`
- Modify: `app/layout.tsx`
- Test: `tests/e2e/header.spec.ts`

Kept deliberately small so each file has one job:

| File | Job |
|---|---|
| `menuAnimations.ts` | the exact GSAP tweens for opening/closing the menu and morphing the hamburger; exports the path strings `OPEN` and `CLOSED` |
| `useScrolledBody.ts` | adds/removes `body.scrolled` with the original rule |
| `Logo.tsx` | fixed logo that scrubs out on scroll |
| `MenuButton.tsx` | the hamburger link |
| `MenuPanel.tsx` | the sliding beige panel: contact icons, main nav, language nav |
| `Header.tsx` | puts the pieces together and owns the open/closed state |

**Interfaces:**
- `menuAnimations.ts`: `type MenuParts = { panel: HTMLElement; background: HTMLElement; icon: HTMLElement }`, `openMenu(parts: MenuParts): void`, `closeMenu(parts: MenuParts): void`, `OPEN`, `CLOSED` (each `{ a1, a2, a3 }` path strings).
- `useScrolledBody(): void`
- `Logo(): JSX` (client)
- `MenuButton({ ref, onClick })`, `MenuPanel({ ref, isHome, pathname })` (React 19 passes `ref` as a normal prop)
- `Header(): JSX` (client)

- [ ] **Step 1: Write the failing e2e test**

```ts
// tests/e2e/header.spec.ts
import { test, expect } from '@playwright/test';
import { OPEN, CLOSED } from '../../components/layout/menuAnimations';

test.describe('header', () => {
  test('menu opens and closes with the original timeline', async ({ page }) => {
    await page.goto('/en/');
    const menu = page.locator('header .menu');
    await expect(menu).toHaveCSS('transform', /matrix\(1, 0, 0, 1, 0, -\d+/);
    await page.click('header .menu-button');
    await page.waitForTimeout(1700);
    await expect(page.locator('header')).toHaveClass(/header-menu-open/);
    await expect(menu).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await expect(page.locator('header .menu-bg')).toHaveCSS('opacity', '1');
    await expect(page.locator('header .menu-bg')).toHaveCSS('visibility', 'visible');
    expect(await page.locator('header .menu-button path.a1').getAttribute('d')).toBe(OPEN.a1);
    await expect(page.locator('header .button-wrapper')).toBeHidden();
    const links = page.locator('header .nav-main .level-0 a');
    await expect(links).toHaveCount(9);
    await expect(links.first()).toHaveText('Alpine Hide');
    // the open timeline tweens the .level-0 wrappers to opacity .6
    await expect(page.locator('header .nav-main .level-0').first()).toHaveCSS('opacity', '0.6');
    await page.click('header .menu-bg', { position: { x: 1500, y: 500 } });
    await page.waitForTimeout(800);
    await expect(page.locator('header')).not.toHaveClass(/header-menu-open/);
    expect(await page.locator('header .menu-button path.a1').getAttribute('d')).toBe(CLOSED.a1);
    await expect(page.locator('header .menu-bg')).toHaveCSS('visibility', 'hidden');
  });

  test('scrolled class follows the original rule and the logo scrubs out', async ({ page }) => {
    await page.goto('/en/');
    await page.evaluate(() => { document.body.style.minHeight = '6000px'; });
    const logo = page.locator('header .logo-wrapper');
    await expect(logo).toHaveCSS('opacity', '1');
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(200);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(600);
    await expect(page.locator('body')).toHaveClass(/scrolled/);
    await expect(page.locator('header .upper')).toHaveCSS('background-color', 'rgb(228, 224, 219)');
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(800);
    const opacity = await logo.evaluate((el) => parseFloat(getComputedStyle(el).opacity));
    expect(opacity).toBeLessThan(0.05);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).not.toHaveClass(/scrolled/);
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm run test:e2e -- tests/e2e/header.spec.ts`
Expected: FAIL (no header).

- [ ] **Step 3: Copy the header CSS**

```bash
cp docs/reference/css-clean/header.css components/layout/Header.css
```
The file holds, verbatim from the original: the fixed `.upper` (`padding-top:12.5rem`), the `body.scrolled` rules, the `.menu` panel (`54.2rem`, `translateY(-101%)`), `.menu-bg` (`#211d1db3`), `.nav-info` (`top:10.5rem; right:6rem`), nav typography, `.logo-wrapper` / `56.7rem` logo, the mobile blob background and the `.nav-lang` rules.

- [ ] **Step 4: Write `menuAnimations.ts`**

```ts
// components/layout/menuAnimations.ts
// Every number below is copied from the original site's menu timeline.
import { gsap } from '@/lib/gsap';

// MorphSVG targets: the three hamburger bars (CLOSED) and the X they turn into (OPEN).
export const OPEN = {
  a1: 'M14.0926 14.4781L14.1354 14.5093L32.5702 28.2398C33.1876 27.4615 33.8973 26.5473 34.5641 25.6695L17.7142 14.0586C17.6904 14.0415 17.6678 14.0244 17.6462 14.0071L1.88541 2.21653L0.0915469 4.88732L14.0926 14.4781Z',
  a2: 'M17.1415 11.977L17.0871 12.0075L2.20727 20.1575C2.70282 20.9742 3.2845 21.8943 3.82103 22.6237L26.8157 8.88441L26.87 8.85386L38.5519 2.52055L37.0445 0.0300942L17.1415 11.977Z',
  a3: 'M17.1415 11.977L17.0871 12.0075L2.20727 20.1575C2.70282 20.9742 3.2845 21.8943 3.82103 22.6237L26.8157 8.88441L26.87 8.85386L38.5519 2.52055L37.0445 0.0300942L17.1415 11.977Z',
};
export const CLOSED = {
  a1: 'M36.3057 16.978V16.9771L54.8613 17.4722L54.7842 13.7183L44.9854 13.6563L22.6577 14.0347L0.0698225 13.5278L0.0390625 17.519L36.2334 16.9771L36.3057 16.978Z',
  a2: 'M23.3623 5.89111L23.4346 5.8916L54.7588 6.43066C54.8232 5.07812 54.8818 3.50195 54.9219 2L27.0376 2.54688C26.9976 2.54688 26.959 2.5459 26.9214 2.54395L0.0996094 2.02588L0.237789 6.40869L23.3623 5.89111Z',
  a3: 'M23.2022 25.1362L23.1172 25.1353L0 24.6147C0.02832 25.9165 0.08789 27.3989 0.22412 28.6255L36.7285 28.0786L36.8135 28.0796L54.918 28.5649L54.8359 24.5981L23.2022 25.1362Z',
};

export type MenuParts = { panel: HTMLElement; background: HTMLElement; icon: HTMLElement };

function morphIcon(icon: HTMLElement, to: typeof OPEN) {
  gsap.to(icon.querySelector('.a1'), { duration: 0.5, morphSVG: to.a1 });
  gsap.to(icon.querySelector('.a2'), { duration: 0.5, morphSVG: to.a2 });
  gsap.to(icon.querySelector('.a3'), { duration: 0.5, morphSVG: to.a3 });
}

function panelParts(panel: HTMLElement) {
  return {
    items: panel.querySelectorAll('.level-0'),
    info: panel.querySelector('.nav-info'),
    lang: panel.querySelector('.nav-lang'),
    hr: panel.querySelector('.mobile-hr'),
  };
}

export function openMenu({ panel, background, icon }: MenuParts) {
  const { items, info, lang, hr } = panelParts(panel);
  gsap.to(background, { autoAlpha: 1, duration: 0.8, ease: 'power1.out' });
  gsap.to(panel, { y: 0, duration: 1, delay: 0.5, ease: 'expoScale(10,2.5,power1.inOut)' });
  gsap.fromTo(items, { opacity: 0, y: '10px' }, { opacity: 0.6, y: '0', stagger: 0.1, delay: 0.6, duration: 1, ease: 'sine.out' });
  gsap.fromTo(info, { opacity: 0 }, { opacity: 1, delay: 1, duration: 1, ease: 'power1.out' });
  gsap.fromTo(lang, { opacity: 0 }, { opacity: 1, delay: 1, duration: 1, ease: 'power1.out' });
  gsap.fromTo(hr, { opacity: 0 }, { opacity: 1, delay: 1, duration: 1, ease: 'power1.out' });
  morphIcon(icon, OPEN);
}

export function closeMenu({ panel, background, icon }: MenuParts) {
  const { items, info, lang, hr } = panelParts(panel);
  gsap.to(panel, { y: '-101%', duration: 0.6, ease: 'power1.inOut' });
  gsap.to(background, { autoAlpha: 0, duration: 0.5 });
  gsap.fromTo(items, { opacity: 1 }, { opacity: 0, duration: 0.1, stagger: 0, ease: 'power1.in' });
  gsap.fromTo(info, { opacity: 1 }, { opacity: 0, duration: 0.1, ease: 'power1.in' });
  gsap.fromTo(lang, { opacity: 1 }, { opacity: 0, duration: 0.1, ease: 'power1.in' });
  gsap.fromTo(hr, { opacity: 1 }, { opacity: 0, duration: 0.1, ease: 'power1.in' });
  morphIcon(icon, CLOSED);
}
```

- [ ] **Step 5: Write `useScrolledBody.ts` and `Logo.tsx`**

```ts
// components/layout/useScrolledBody.ts
// Original rule: add `scrolled` when scrolling down from a non-zero position; remove it only back at the top.
'use client';
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

export function useScrolledBody() {
  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (lastY > 0 && y > lastY) {
        if (y) document.body.classList.add('scrolled');
      } else if (!y) {
        document.body.classList.remove('scrolled');
      }
      lastY = y;
    };
    // The original refreshes ScrollTrigger whenever the body changes height.
    const observer = new ResizeObserver(() => { if (window.scrollY) ScrollTrigger.refresh(); });
    observer.observe(document.body);
    window.addEventListener('scroll', onScroll);
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);
}
```

```tsx
// components/layout/Logo.tsx
'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { site } from '@/content/site';
import { TransitionLink } from './TransitionLink';
import { LogoIcon } from '@/components/ui/icons';

// The fixed logo scrubs out while its own box scrolls past the top:
// original: translateY -80% (sine.inOut), opacity 0 with .1 delay, scale .6 (both expoScale(0.5,7,none)).
export function Logo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const timeline = gsap.timeline({ scrollTrigger: { trigger: wrapper, start: 'top top', end: 'bottom top', scrub: true } });
    timeline.to(wrapper, { translateY: '-80%', ease: 'sine.inOut' }, 0);
    timeline.to(wrapper, { opacity: 0, delay: 0.1, ease: 'expoScale(0.5,7,none)' }, 0);
    timeline.to(wrapper, { scale: 0.6, ease: 'expoScale(0.5,7,none)' }, 0);
  }, []);
  return (
    <div className="logo-wrapper grid-container" ref={wrapperRef}>
      <div className="logo">
        <TransitionLink href={site.pageLinks.home} className="router-link-active router-link-exact-active">
          <LogoIcon />
        </TransitionLink>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Write `MenuButton.tsx` and `MenuPanel.tsx`**

```tsx
// components/layout/MenuButton.tsx
import type { Ref, MouseEvent } from 'react';
import { MenuIcon } from '@/components/ui/icons';
import { site } from '@/content/site';

type Props = { ref: Ref<HTMLAnchorElement>; onClick: () => void };

export function MenuButton({ ref, onClick }: Props) {
  const handleClick = (event: MouseEvent) => { event.preventDefault(); onClick(); };
  return (
    <a href="#" ref={ref} onClick={handleClick} className="menu-button" aria-label={site.t.menu}>
      <MenuIcon />
    </a>
  );
}
```

```tsx
// components/layout/MenuPanel.tsx
import type { Ref } from 'react';
import { site } from '@/content/site';
import { TransitionLink } from './TransitionLink';
import { TelIcon, MailIcon, MapIcon, VoucherIcon, GalleryIcon } from '@/components/ui/icons';

type Props = { ref: Ref<HTMLDivElement>; isHome: boolean; pathname: string };

// The beige panel that slides down. Structure copied from the original header markup.
export function MenuPanel({ ref, isHome, pathname }: Props) {
  const isActive = (link: string) => pathname.startsWith(link.replace(/\/$/, ''));
  return (
    <div className="menu-outline">
      <div className="menu" ref={ref}>
        <nav className="nav-info">
          <div className="tel-icon"><a href={`tel:${site.contact.tel}`}><TelIcon /></a></div>
          <div className="mail-icon"><a href={`mailto:${site.contact.email}`}><MailIcon /></a></div>
          <div className="map-icon"><TransitionLink href={site.pageLinks.contact}><MapIcon /></TransitionLink></div>
          <div className="voucher-icon"><TransitionLink href={site.pageLinks.voucher}><VoucherIcon /></TransitionLink></div>
          <div className="gallery-icon"><TransitionLink href={site.pageLinks.gallery}><GalleryIcon /></TransitionLink></div>
        </nav>
        <div className="mobile-hr" />
        <div className="main-nav-wrapper">
          {/* Outside the home page the nav gets `fadeOut`: links at .6 opacity, the active one at 1 (CSS). */}
          <nav aria-label="Menu" className={isHome ? 'nav-main' : 'nav-main fadeOut'}>
            {site.nav.map((item) => (
              <div key={item.uid} className="level-0">
                <TransitionLink href={item.link} className={isActive(item.link) ? 'link-0 router-link-active' : 'link-0'}>
                  {item.title}{' '}
                </TransitionLink>
                <div className="sub"><div /></div>
              </div>
            ))}
          </nav>
          <nav className="nav-lang" aria-label="Language">
            {site.languages.map((language) => (
              <a key={language.code} className={language.code === 'en' ? 'router-link-active' : ''} href={language.link}>
                <span>{language.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
```
(The original supports nested sub-menus with an accordion; no English nav item has children, so `.sub` is rendered empty exactly like the live markup and the accordion code is not ported. It can be added in a later phase if the nav ever gets children.)

- [ ] **Step 7: Write `Header.tsx`**

```tsx
// components/layout/Header.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { site } from '@/content/site';
import { BigLink } from '@/components/ui/BigLink';
import { MenuButton } from './MenuButton';
import { MenuPanel } from './MenuPanel';
import { Logo } from './Logo';
import { openMenu, closeMenu, type MenuParts } from './menuAnimations';
import { useScrolledBody } from './useScrolledBody';
import './Header.css';

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/en/' || pathname === '/en';
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  useScrolledBody();

  const parts = (): MenuParts | null => {
    if (!panelRef.current || !backgroundRef.current || !buttonRef.current) return null;
    return { panel: panelRef.current, background: backgroundRef.current, icon: buttonRef.current };
  };
  const toggleMenu = () => {
    const p = parts();
    if (!p) return;
    if (isOpen) closeMenu(p); else openMenu(p);
    setIsOpen(!isOpen);
  };

  // Navigating to another page closes the menu (original: page:loading:end hook).
  useEffect(() => {
    const p = parts();
    if (isOpen && p) { closeMenu(p); setIsOpen(false); }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const upperClass = ['upper grid-container', isOpen ? 'menu-open' : '', isHovered ? 'header-hover' : ''].filter(Boolean).join(' ');

  return (
    <header className={isOpen ? 'header-menu-open' : ''}>
      <div className={upperClass} onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div className="menu-wrapper">
          <MenuButton ref={buttonRef} onClick={toggleMenu} />
        </div>
        {/* Request / Book are hidden while the menu is open (original: v-show). */}
        <div className="button-wrapper" style={isOpen ? { display: 'none' } : undefined}>
          <BigLink className="small-font" href={site.pageLinks.request}>{site.t.request}</BigLink>
          <BigLink className="small-font" target="_blank" rel="noopener nofollow" href={site.bookingLink}>{site.t.book}</BigLink>
        </div>
        <div className="menu-bg" onClick={toggleMenu} ref={backgroundRef} />
        <MenuPanel ref={panelRef} isHome={isHome} pathname={pathname} />
      </div>
      <Logo />
    </header>
  );
}
```

- [ ] **Step 8: Mount the header in `app/layout.tsx`**

Inside `<div id="__app">`, before `<SmoothScroll>`: `<Header />` (import from `@/components/layout/Header`).

- [ ] **Step 9: Run the e2e test**

Run: `npm run test:e2e -- tests/e2e/header.spec.ts`
Expected: 2 PASS. If the `menu-bg` visibility assertion fails, `autoAlpha` needs the initial `visibility:hidden` from `Header.css` (`header .menu-bg { opacity:0; visibility:hidden }`); confirm `Header.css` is imported by `Header.tsx`.

- [ ] **Step 10: Visual check against the reference**

At 1920 wide compare with `docs/reference/screenshots/screenshot-1788498756234-0.jpg`: logo width (567px), hamburger at 66px from the left and 100px from the top, REQUEST / BOOK at the right edge of the grid. Open the menu and compare with spec 8.3 (beige panel 542px wide, 20px inset, five icons top right).

- [ ] **Step 11: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "feat: header with logo scrub, morphing hamburger, menu timeline and scrolled state

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Footer

**Files:**
- Create: `components/layout/Footer.tsx`, `components/layout/Footer.css`
- Modify: `app/layout.tsx`
- Test: `tests/unit/footer.test.tsx`

**Interfaces:**
- `Footer()` server component rendering `<footer class="grid-container">` with the original structure.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/unit/footer.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/Footer';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/en/' }));

describe('Footer', () => {
  it('renders contact, social, address, partner and the three navs', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer.grid-container')).not.toBeNull();
    expect(screen.getByText('hide@eriro.at').getAttribute('href')).toBe('mailto:hide@eriro.at');
    expect(screen.getByText('0043 5673 40506').getAttribute('href')).toBe('tel:0043 5673 40506');
    expect(container.querySelector('.social a[aria-label="Instagram"]')).not.toBeNull();
    expect(container.querySelector('.address')?.textContent).toContain('Ehrwalder Alm 4');
    expect(container.querySelector('.partner a[href="https://www.laposch.com/en/"]')).not.toBeNull();
    const extra = Array.from(container.querySelectorAll('nav.nav-extra a')).map((a) => a.textContent);
    expect(extra).toEqual(['Booking conditions', 'eriro exclusive', 'Contact and arrival', 'Voucher', 'Newsletter', 'Jobs', 'Press']);
    const lang = Array.from(container.querySelectorAll('nav.nav-lang a')).map((a) => [a.textContent, a.className]);
    expect(lang).toEqual([['Deutsch', ''], ['English', 'router-link-active']]);
    expect(Array.from(container.querySelectorAll('nav.nav-footer a')).map((a) => a.textContent)).toEqual(['Imprint', 'Privacy', 'Cookies']);
    expect(container.querySelector('.luxury-hotels-logo img')?.getAttribute('alt')).toBe('Small Luxury Hotels of the World');
    expect(container.querySelector('.unikateur-signet a')?.getAttribute('href')).toBe('https://www.unikateur.com/');
    expect(container.querySelector('.unikateur-signet span')?.textContent).toBe('unique hospitality concepts, by ');
    expect(container.querySelector('.lower-footer .logo a.link-logo svg')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- tests/unit/footer.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Copy the footer CSS and write the component**

```bash
cp docs/reference/css-clean/footer.css components/layout/Footer.css
```

```tsx
// components/layout/Footer.tsx
import { site } from '@/content/site';
import './Footer.css';
import { TransitionLink } from './TransitionLink';
import { LogoIcon, UnikateurIcon } from '@/components/ui/icons';
import { RichText } from '@/components/ui/RichText';

const nl2br = (s: string) => s.replace(/\r?\n/g, '<br>');

export function Footer() {
  return (
    <footer className="grid-container">
      <div className="upper-footer grid-container-inner">
        <div className="email">
          <h4 className="footer-title">{site.t.contact}</h4>
          <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          <br />
          <a href={`tel:${site.contact.tel}`}>{site.contact.tel}</a>
        </div>
        <div className="social">
          <h4 className="footer-title">{site.t.social}</h4>
          <RichText className="t3-ce-rte" html={nl2br(site.socialHtml)} />
        </div>
        <div className="address">
          <h4 className="footer-title">{site.t.address}</h4>
          <RichText className="t3-ce-rte" html={nl2br(site.contact.address)} />
        </div>
        <div className="partner">
          <h4 className="footer-title">{site.t.partner}</h4>
          <RichText html={site.partnerHtml} />
        </div>
      </div>
      <div className="lower-footer grid-container-inner">
        <nav className="nav-extra" aria-label="Footer Menu">
          {site.footerNav.map((n) => <TransitionLink key={n.uid} href={n.link}>{n.title}</TransitionLink>)}
        </nav>
        <div className="logo">
          <TransitionLink className="link-logo" href={site.pageLinks.home}><LogoIcon /></TransitionLink>
        </div>
        <div className="luxury-hotels-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/slh_black.png" alt="Small Luxury Hotels of the World" />
        </div>
        <div className="footer-bottom-right">
          <nav className="nav-lang" aria-label="Footer Language">
            {site.languages.map((l) => <a key={l.code} className={l.code === 'en' ? 'router-link-active' : ''} href={l.link}>{l.title}</a>)}
          </nav>
          <nav className="nav-footer" aria-label="Footer Privacy">
            {site.privacyNav.map((n) => <TransitionLink key={n.uid} href={n.link}>{n.title}</TransitionLink>)}
          </nav>
        </div>
        <div className="unikateur-signet">
          <a href={site.unikateur} target="_blank" rel="noopener"><span>{site.t.unikSignet}</span><UnikateurIcon /></a>
        </div>
      </div>
    </footer>
  );
}
```
The original social block wraps the two links in `nl2br`, which turns the `\r\n` between them into `<br>`; `site.socialHtml` already contains `<br>\r\n`, so `nl2br` here produces `<br><br>`? No: check `docs/reference/pages/en.html` — the SSR output is `Instagram</a><br>Facebook`. Therefore set `site.socialHtml` to the value without `<br>` (only `\r\n`) and let `nl2br` add it; update `content/site.ts` accordingly and keep the test.

- [ ] **Step 4: Mount the footer**

In `app/layout.tsx`, inside `<SmoothScroll>` after `<PageTransition>{children}</PageTransition>` add `<Footer />` (the original footer is inside `#smooth-content`, after `main`).

- [ ] **Step 5: Run the test, typecheck, visual check**

Run: `npm test -- tests/unit/footer.test.tsx && npm run typecheck`
Expected: PASS. In the browser at 1920px the footer matches spec 8.4: two rows separated by 2px beige rules, logo 294px wide, SLH badge in column 9, signet bottom right.

- [ ] **Step 6: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "feat: footer

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Hero section (all three layouts)

**Files:**
- Create: `components/sections/Hero.tsx`, `components/sections/Hero.css`
- Test: `tests/unit/hero.test.tsx`

**Interfaces:**
- `Hero({ section }: { section: HeroSection })` client component. Structure (from `docs/reference/structure.txt` lines 89–126):
  `Mask(type='hero', className='hero-{layout}') > div.grid-container > [div.image-wrapper > (h1.title, div.text?, div.image-big > Picture), p.titleimg.h1?, h2.titleh2 (SplitWords), div.image-small > Picture]`
- Picture presets: big `widthD 1014, heightD 780, widthM 340, heightM 260, lazy=false`; small `widthD 272, heightD 360, widthM 136, heightM 180, lazy=false`. Parallax speeds `1.15` (first picture) and `1.5` (second).
- Season: renders `imgsummer`/`sideimgsummer` when `!isWinter` and the summer array is non-empty, else `img`/`sideimg`.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/unit/hero.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { home } from '@/content/en/home';

vi.mock('@/lib/gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn(), timeline: vi.fn(() => ({ to: vi.fn() })) },
  SplitText: { create: vi.fn(() => ({ words: [], revert: vi.fn() })) },
  ScrollTrigger: { refresh: vi.fn() },
  useGSAP: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/en/' }));

describe('Hero', () => {
  const hero = home.columns.colPos0[0];
  if (hero.type !== 'mask_hero') throw new Error('expected hero');
  it('renders the default layout with summer images and literal copy', () => {
    const { container } = render(<Hero section={hero} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toBe('default space-before- mask mask_hero hero-default');
    expect(container.querySelector('h1.title')?.innerHTML).toBe(hero.content.title);
    expect(container.querySelector('p.titleimg.h1')?.innerHTML).toBe(hero.content.titleimg);
    expect(container.querySelector('h2.titleh2')?.innerHTML).toBe(hero.content.titleh2);
    const big = container.querySelector('.image-big picture img') as HTMLImageElement;
    expect(big.getAttribute('src')).toContain('AlexMoling_Eriro_Exterior.jpg');
    expect(big.getAttribute('src')).toContain('w=1014&h=780');
    expect(big.getAttribute('loading')).toBeNull();
    const small = container.querySelector('.image-small picture img') as HTMLImageElement;
    expect(small.getAttribute('src')).toContain('w=272&h=360');
    expect(container.querySelectorAll('.image-big source').length).toBe(6);
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- tests/unit/hero.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Copy the CSS and write the component**

```bash
cp docs/reference/css-clean/hero.css components/sections/Hero.css
```

```tsx
// components/sections/Hero.tsx
'use client';
import { useRef } from 'react';
import type { HeroSection } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { RichText } from '@/components/ui/RichText';
import { useParallax } from '@/components/ui/useParallax';
import { useIsWinter } from '@/lib/season';
import './Hero.css';

// Mirrors the original Hero.vue. Three layouts share one markup: default (home), subpage, only-text.
export function Hero({ section }: { section: HeroSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const onlyText = c.herolayout === 'only-text';
  const big = !winter && c.imgsummer.length ? c.imgsummer : c.img;
  const small = !winter && c.sideimgsummer.length ? c.sideimgsummer : c.sideimg;
  const bigRef = useRef<HTMLDivElement>(null);
  const smallRef = useRef<HTMLDivElement>(null);
  useParallax(bigRef, 1.15);
  useParallax(smallRef, 1.5);

  return (
    <Mask type="hero" uid={section.id} appearance={section.appearance} className={`hero-${c.herolayout}`}>
      <div className="grid-container">
        <div className="image-wrapper">
          {c.title ? <h1 className="title" dangerouslySetInnerHTML={{ __html: c.title }} /> : null}
          {c.text && onlyText ? <RichText className="text" html={c.text} /> : null}
          {!onlyText && big.map((img, i) => (
            <div className="image-big" key={i} ref={i === 0 ? bigRef : undefined}>
              <Picture image={img} widthD={1014} heightD={780} widthM={340} heightM={260} lazy={false} />
            </div>
          ))}
        </div>
        {c.titleimg && c.herolayout === 'default' ? <p className="titleimg h1" dangerouslySetInnerHTML={{ __html: c.titleimg }} /> : null}
        {c.titleh2 ? <SplitWords as="h2" className="titleh2" html={c.titleh2} /> : null}
        {!onlyText && small.map((img, i) => (
          <div className="image-small" key={i} ref={i === 0 ? smallRef : undefined}>
            <Picture image={img} widthD={272} heightD={360} widthM={136} heightM={180} lazy={false} />
          </div>
        ))}
      </div>
    </Mask>
  );
}
```
Note: the original registers the parallax on the `<picture>` elements (`querySelectorAll('picture')[0]` and `[1]`); registering on the wrapping `div.image-big` / `div.image-small` moves the same box and keeps the `Picture` primitive generic.

- [ ] **Step 4: Run the test**

Run: `npm test -- tests/unit/hero.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "feat: hero section (default, subpage, only-text layouts)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: ImgText, Img, Video, Quote, Break sections

**Files:**
- Create: `components/sections/ImgText.tsx` + `ImgText.css`, `Img.tsx` + `Img.css`, `Video.tsx` + `Video.css`, `Quote.tsx` + `Quote.css`, `Break.tsx` + `Break.css`
- Test: `tests/unit/sections-basic.test.tsx`

**Interfaces:**
- `ImgText({ section: ImgTextSection })`: `Mask(imgtext) > div.grid-container > [div.image-left > Picture(501×390 / 250×224), div.image-right > Picture(570×510 / 476×384), div.content > (SplitWords h2.title, RichText div.text)]`; parallax left `1.5`, right `1.05`.
- `Img({ section: ImgSection })`: `Mask(img, className 'grid-container') > div.image > Picture(1920×1080 / 360×300)`.
- `Video({ section: VideoSection })`: `Mask(video, className 'grid-container') > div > video` per source; empty when no sources.
- `Quote({ section: QuoteSection })`: `Mask(quote) > div.grid-container > [div.image > Picture(273×317 / 136×180)?, div.quote-wrapper > (div.quote (SplitWords as div), div.autor)]`; parallax image `1.6`.
- `Break({ section: BreakSection })`: `Mask(break) > div.break-wrapper.grid-container > [div.image-left > Picture(570×510 / 476×384), h2.title (SplitWords, duration .2), div.image-right > Picture(352×280 / 175×139)]`; parallax `1.2`, `1.5`.

Picture presets are taken from the original compiled components in `docs/reference/js/`: `js_CIR7VRHd.js` (Imgtext: left `widthD:501,heightD:390,widthM:250,heightM:224`; right `widthD:570,heightD:510,widthM:476,heightM:384`), `js_C7Dn0-2O.js` (Img `1920×1080 / 360×300`), `js_BW6l2EZi.js` (Quote image `273×317 / 136×180`), `js_C5RlduNq.js` (Break left `570×510 / 476×384`, right `352×280 / 175×139`). Verify each by grepping `widthD` in that file before writing.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/unit/sections-basic.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ImgText } from '@/components/sections/ImgText';
import { Img } from '@/components/sections/Img';
import { Video } from '@/components/sections/Video';
import { Quote } from '@/components/sections/Quote';
import { Break } from '@/components/sections/Break';
import { home } from '@/content/en/home';

vi.mock('@/lib/gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn(), timeline: vi.fn(() => ({ to: vi.fn() })) },
  SplitText: { create: vi.fn(() => ({ words: [], revert: vi.fn() })) },
  ScrollTrigger: { refresh: vi.fn() },
  useGSAP: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/en/' }));

const sec = <T extends string>(i: number, type: T) => {
  const s = home.columns.colPos0[i];
  if (s.type !== type) throw new Error(`expected ${type} at ${i}, got ${s.type}`);
  return s as Extract<typeof s, { type: T }>;
};

describe('basic sections', () => {
  it('ImgText renders both images, title and text with the link', () => {
    const { container } = render(<ImgText section={sec(1, 'mask_imgtext')} />);
    expect(container.firstElementChild?.className).toBe('default space-before- mask mask_imgtext');
    expect(container.querySelector('.image-left picture img')?.getAttribute('src')).toContain('w=501&h=390');
    expect(container.querySelector('.image-right picture img')?.getAttribute('src')).toContain('w=570&h=510');
    expect(container.querySelector('.content h2.title')?.innerHTML).toBe('Travel back <br>\r\nto the beginnings <br>\r\nof everything');
    expect(container.querySelector('.content .text a.linkdetail')?.getAttribute('href')).toBe('/en/alpine-hide/');
  });
  it('Img renders one full-bleed picture', () => {
    const { container } = render(<Img section={sec(7, 'mask_img')} />);
    expect(container.firstElementChild?.className).toBe('default space-before- mask mask_img grid-container');
    expect(container.querySelector('.image picture img')?.getAttribute('src')).toContain('w=1920&h=1080');
  });
  it('Video renders an empty wrapper when there is no video', () => {
    const { container } = render(<Video section={sec(2, 'mask_video')} />);
    expect(container.firstElementChild?.className).toBe('default space-before- mask mask_video grid-container');
    expect(container.querySelector('video')).toBeNull();
  });
  it('Quote renders text and author', () => {
    const { container } = render(<Quote section={sec(3, 'mask_quote')} />);
    expect(container.querySelector('.quote-wrapper .quote')?.textContent).toBe('eriro – One of the "World’s Greatest Places 2025"');
    expect(container.querySelector('.quote-wrapper .autor')?.textContent).toBe('TIME');
    expect(container.querySelector('.image')).toBeNull();
  });
  it('Break renders the beige wrapper with title and two images', () => {
    const { container } = render(<Break section={sec(8, 'mask_break')} />);
    expect(container.querySelector('.break-wrapper.grid-container')).not.toBeNull();
    expect(container.querySelector('h2.title')?.innerHTML).toContain('Touch what time<br>');
    expect(container.querySelector('.image-left picture img')?.getAttribute('src')).toContain('w=570&h=510');
    expect(container.querySelector('.image-right picture img')?.getAttribute('src')).toContain('w=352&h=280');
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- tests/unit/sections-basic.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Copy the five CSS files and register them**

```bash
cp docs/reference/css-clean/imgtext.css components/sections/ImgText.css
cp docs/reference/css-clean/img.css components/sections/Img.css
cp docs/reference/css-clean/video.css components/sections/Video.css
cp docs/reference/css-clean/quote.css components/sections/Quote.css
cp docs/reference/css-clean/break.css components/sections/Break.css
```
Each component imports its own file (`import './ImgText.css';` and so on) right after the other imports.

- [ ] **Step 4: Write the components**

```tsx
// components/sections/ImgText.tsx
'use client';
import { useRef } from 'react';
import type { ImgTextSection } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { RichText } from '@/components/ui/RichText';
import { useParallax } from '@/components/ui/useParallax';
import { useIsWinter } from '@/lib/season';
import './ImgText.css';

export function ImgText({ section }: { section: ImgTextSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const left = !winter && c.imgleftsummer.length ? c.imgleftsummer : c.imgleft;
  const right = !winter && c.imgrightsummer.length ? c.imgrightsummer : c.imgright;
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  useParallax(leftRef, 1.5);
  useParallax(rightRef, 1.05);
  return (
    <Mask type="imgtext" uid={section.id} appearance={section.appearance}>
      <div className="grid-container">
        {left.map((img, i) => (
          <div className="image-left" key={i} ref={i === 0 ? leftRef : undefined}>
            <Picture image={img} widthD={501} heightD={390} widthM={250} heightM={224} />
          </div>
        ))}
        {right.map((img, i) => (
          <div className="image-right" key={i} ref={i === 0 ? rightRef : undefined}>
            <Picture image={img} widthD={570} heightD={510} widthM={476} heightM={384} />
          </div>
        ))}
        <div className="content">
          {c.title ? <SplitWords as="h2" className="title" html={c.title} /> : null}
          {c.text ? <RichText className="text" html={c.text} /> : null}
        </div>
      </div>
    </Mask>
  );
}
```

```tsx
// components/sections/Img.tsx
'use client';
import type { ImgSection } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { useIsWinter } from '@/lib/season';
import './Img.css';

export function Img({ section }: { section: ImgSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const imgs = !winter && c.imgsummer.length ? c.imgsummer : c.img;
  return (
    <Mask type="img" uid={section.id} appearance={section.appearance} className="grid-container">
      {imgs.map((img, i) => (
        <div className="image" key={i}>
          <Picture image={img} widthD={1920} heightD={1080} widthM={360} heightM={300} />
        </div>
      ))}
    </Mask>
  );
}
```

```tsx
// components/sections/Video.tsx  (port of Video.vue: load once on first intersection, play while visible, pause when not)
'use client';
import { useEffect, useRef } from 'react';
import type { VideoRef, VideoSection } from '@/lib/content';
import { Mask } from './Mask';
import { useIsWinter } from '@/lib/season';
import './Video.css';

function Player({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    let loaded = false;
    v.addEventListener('play', () => v.classList.add('js-video-playing'), { once: true });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.intersectionRatio > 0) { if (!loaded) { v.load(); loaded = true; } void v.play().catch(() => {}); }
        else v.pause();
      });
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video preload="metadata" playsInline loop muted ref={ref}>
      <source src={src} type="video/mp4" />
    </video>
  );
}

export function Video({ section }: { section: VideoSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const list: VideoRef[] = !winter && c.videosummer.length ? c.videosummer : c.video;
  return (
    <Mask type="video" uid={section.id} appearance={section.appearance} className="grid-container">
      {list.map((v, i) => <div key={i}><Player src={v.src} /></div>)}
    </Mask>
  );
}
```

```tsx
// components/sections/Quote.tsx
'use client';
import { useRef } from 'react';
import type { QuoteSection } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { useParallax } from '@/components/ui/useParallax';
import './Quote.css';

export function Quote({ section }: { section: QuoteSection }) {
  const c = section.content;
  const imgRef = useRef<HTMLDivElement>(null);
  useParallax(imgRef, 1.6);
  return (
    <Mask type="quote" uid={section.id} appearance={section.appearance}>
      <div className="grid-container">
        {c.img.map((img, i) => (
          <div className="image" key={i} ref={i === 0 ? imgRef : undefined}>
            <Picture image={img} widthD={273} heightD={317} widthM={136} heightM={180} />
          </div>
        ))}
        <div className="quote-wrapper">
          <SplitWords as="div" className="quote" html={c.quote} />
          <div className="autor">{c.autor}</div>
        </div>
      </div>
    </Mask>
  );
}
```

```tsx
// components/sections/Break.tsx
'use client';
import { useRef } from 'react';
import type { BreakSection } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { useParallax } from '@/components/ui/useParallax';
import { useIsWinter } from '@/lib/season';
import './Break.css';

export function Break({ section }: { section: BreakSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const left = !winter && c.imgleftsummer.length ? c.imgleftsummer : c.imgleft;
  const right = !winter && c.imgrightsummer.length ? c.imgrightsummer : c.imgright;
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  useParallax(leftRef, 1.2);
  useParallax(rightRef, 1.5);
  return (
    <Mask type="break" uid={section.id} appearance={section.appearance}>
      <div className="break-wrapper grid-container">
        {left.map((img, i) => (
          <div className="image-left" key={i} ref={i === 0 ? leftRef : undefined}>
            <Picture image={img} widthD={570} heightD={510} widthM={476} heightM={384} />
          </div>
        ))}
        {c.title ? <SplitWords as="h2" className="title" html={c.title} duration={0.2} /> : null}
        {right.map((img, i) => (
          <div className="image-right" key={i} ref={i === 0 ? rightRef : undefined}>
            <Picture image={img} widthD={352} heightD={280} widthM={175} heightM={139} />
          </div>
        ))}
      </div>
    </Mask>
  );
}
```

- [ ] **Step 5: Run tests and typecheck**

Run: `npm test -- tests/unit/sections-basic.test.tsx && npm run typecheck`
Expected: 5 PASS, clean.

- [ ] **Step 6: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "feat: imgtext, img, video, quote and break sections

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: RoomSlider (three synced Swipers)

**Files:**
- Create: `components/sections/RoomSlider.tsx`, `components/sections/RoomSlider.css`, `styles/swiper.css`
- Modify: `styles/globals.css` (one line: the Swiper base stylesheet)
- Test: `tests/e2e/roomslider.spec.ts`

**Interfaces:**
- `RoomSlider({ section: RoomSliderSection })`. Structure (`docs/reference/structure.txt` lines 174–326): `Mask(roomslider, 'grid-container') > div.grid-container-inner > [.swiper.room-image-left, .swiper.room-image-right, .swiper.room-content, div.navigation > (div.next.swiper-button-lock > ArrowSliderIcon, div.prev.swiper-button-lock > ArrowSliderIcon)]`.
- Swiper config (from `docs/reference/js/js_Buj7d3j6.js`): left `loop, allowTouchMove:false` (speed default 300), images `719×864 / 252×300`; right `loop, allowTouchMove:false, speed:700`, images `273×317 / 136×180`; content `effect:'fade', speed:1300, loop, navigation {prevEl,nextEl}, controller {control:[right, left]}`; slides carry class `roomslide`.
- Content slide: `div.grid-container-inner > [h2 (room.title), div.room-info > (span.room-info-price, span.room-info-size, span.room-info-spacer, span.room-info-people), div.room-button > Button('View Suite') href /en/suites/{title}/]`.

- [ ] **Step 1: Write the failing e2e test**

```ts
// tests/e2e/roomslider.spec.ts
import { test, expect } from '@playwright/test';

test('room slider shows boum first and advances all three swipers together', async ({ page }) => {
  await page.goto('/en/');
  const section = page.locator('.mask_roomslider');
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator('.room-content .swiper-slide-active h2')).toHaveText('boum');
  await expect(section.locator('.room-content .swiper-slide-active .room-info-price')).toHaveText('from 775,- € / night per person / All-In');
  await expect(section.locator('.room-content .swiper-slide-active a.ht-button')).toHaveAttribute('href', '/en/suites/boum/');
  const leftBefore = await section.locator('.room-image-left .swiper-slide-active img').getAttribute('src');
  await section.locator('.navigation .next').click();
  await page.waitForTimeout(1500);
  await expect(section.locator('.room-content .swiper-slide-active h2')).toHaveText('wisa');
  const leftAfter = await section.locator('.room-image-left .swiper-slide-active img').getAttribute('src');
  expect(leftAfter).not.toBe(leftBefore);
  expect(leftAfter).toContain('wisa');
  await expect(section.locator('.room-image-right .swiper-slide-active img')).toHaveAttribute('src', /wisa-02/);
  await section.locator('.navigation .prev').click();
  await page.waitForTimeout(1500);
  await expect(section.locator('.room-content .swiper-slide-active h2')).toHaveText('boum');
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm run test:e2e -- tests/e2e/roomslider.spec.ts`
Expected: FAIL (section absent).

- [ ] **Step 3: Swiper CSS and component CSS**

```bash
cp docs/reference/css-clean/swiper-original.css styles/swiper.css
cp docs/reference/css-clean/roomslider.css components/sections/RoomSlider.css
```
Add `@import "./swiper.css";` as the last line of `styles/globals.css` (shared by every slider). `RoomSlider.tsx` imports `./RoomSlider.css`. (`swiper-original.css` is the exact stylesheet the original ships: Swiper core + fade effect + navigation styles; do not import `swiper/css` as well.)

- [ ] **Step 4: Write the component**

```tsx
// components/sections/RoomSlider.tsx
'use client';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller, EffectFade, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { RoomSliderSection } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { Button } from '@/components/ui/Button';
import { ArrowSliderIcon } from '@/components/ui/icons';
import { site } from '@/content/site';
import './RoomSlider.css';

// Mirrors Roomslider.vue: three Swipers. The content slider drives the two image sliders (Controller module).
export function RoomSlider({ section }: { section: RoomSliderSection }) {
  const rooms = section.content.rooms;
  const [left, setLeft] = useState<SwiperType | null>(null);
  const [right, setRight] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const suiteHref = (title: string) => `/en/suites/${title}/`;

  return (
    <Mask type="roomslider" uid={section.id} appearance={section.appearance} className="grid-container">
      <div className="grid-container-inner">
        <Swiper className="room-image-left" loop allowTouchMove={false} onSwiper={setLeft}>
          {rooms.map((r) => (
            <SwiperSlide key={r.uid} className="roomslide">
              <Picture image={r.previewimage[0]} widthD={719} heightD={864} widthM={252} heightM={300} />
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper className="room-image-right" loop allowTouchMove={false} speed={700} onSwiper={setRight}>
          {rooms.map((r) => (
            <SwiperSlide key={r.uid} className="roomslide">
              <Picture image={r.images[0]} widthD={273} heightD={317} widthM={136} heightM={180} />
            </SwiperSlide>
          ))}
        </Swiper>
        {left && right ? (
          <Swiper
            className="room-content"
            modules={[Navigation, Controller, EffectFade]}
            effect="fade"
            speed={1300}
            loop
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            controller={{ control: [right, left] }}
            onBeforeInit={(s) => {
              const nav = s.params.navigation;
              if (nav && typeof nav === 'object') { nav.prevEl = prevRef.current; nav.nextEl = nextRef.current; }
            }}
          >
            {rooms.map((r) => (
              <SwiperSlide key={r.uid} className="roomslide">
                <div className="grid-container-inner">
                  <h2>{r.title}</h2>
                  <div className="room-info">
                    <span className="room-info-price">{r.minprice}</span>
                    <span className="room-info-size">{r.size}</span>
                    <span className="room-info-spacer" />
                    <span className="room-info-people">{r.people}</span>
                  </div>
                  <div className="room-button">
                    <Button href={suiteHref(r.title)}>{site.t.visitSuite}</Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}
        {rooms.length > 1 ? (
          <div className="navigation">
            <div className="next swiper-button-lock" ref={nextRef}><ArrowSliderIcon /></div>
            <div className="prev swiper-button-lock" ref={prevRef}><ArrowSliderIcon /></div>
          </div>
        ) : null}
      </div>
    </Mask>
  );
}
```
The original derives the suite URL from `getUrlByUid(parseInt(room.pid))`; pids 84/85/93/94 map to `/en/suites/boum|wisa|felisa|himil/`, which equals `/en/suites/${title}/` for all four rooms (see `docs/reference/nav_en.json`). The fade timing curve `cubic-bezier(0.25, 0.1, 0.25, 1)` is what Swiper's fade effect uses by default (`transition-timing-function: ease`), so no override is needed.

- [ ] **Step 5: Run the e2e test**

Run: `npm run test:e2e -- tests/e2e/roomslider.spec.ts`
Expected: PASS. If the navigation buttons do nothing, the content Swiper mounted before the refs existed: keep the `left && right` guard (the nav `div`s render in the same pass) and confirm `onBeforeInit` assigns the elements.

- [ ] **Step 6: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "feat: room slider with three controller-synced swipers

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 12: TeaserSlider (four synced Swipers)

**Files:**
- Create: `components/sections/TeaserSlider.tsx`, `components/sections/TeaserSlider.css`
- Test: `tests/unit/teaserslider.test.tsx`

**Interfaces:**
- `TeaserSlider({ section: TeaserSliderSection })`. Structure (`docs/reference/structure.txt` lines 523–564 and `docs/reference/subpage_outlines.txt` lines 129–196): `Mask(teaserslider) > div.grid-container > div.teaser-wrapper.grid-container-inner > [.swiper.image-left, .swiper.image-right, .swiper.infotext, .swiper.teaser-content, div.navigation?]`.
- Swiper config (from `docs/reference/js/js_kvOOAud5.js`): image-left `loop, allowTouchMove:false` (slides: `div > Picture(277×330 / 136×180)` per `imgleft` image); image-right same with `Picture(876×960 / 252×300)`; infotext `loop, allowTouchMove:false` (slides: `p.infotext` html); teaser-content `effect:'fade', speed:1300, loop, navigation, controller {control:[right, left, infotext]}` (slides: `div.teaser-content-inner > (h2.title html, Button(linktext) href link.href)`).
- Navigation only when `teaserslides.length > 1`: `div.navigation > [div.prev.swiper-button-lock > (ArrowSliderIcon, span 'PREV'), div.spacer '/', div.next.swiper-button-lock > (ArrowSliderIcon, span 'NEXT')]`.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/unit/teaserslider.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { TeaserSlider } from '@/components/sections/TeaserSlider';
import { home } from '@/content/en/home';

vi.mock('@/lib/gsap', () => ({ gsap: { to: vi.fn() }, useGSAP: vi.fn(), SplitText: {}, ScrollTrigger: {} }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/en/' }));

describe('TeaserSlider', () => {
  it('renders the four swipers and hides navigation for a single slide', () => {
    const s = home.columns.colPos0[13];
    if (s.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
    const { container } = render(<TeaserSlider section={s} />);
    expect(container.querySelector('.teaser-wrapper.grid-container-inner')).not.toBeNull();
    expect(container.querySelector('.swiper.image-left picture img')?.getAttribute('src')).toContain('w=277&h=330');
    expect(container.querySelector('.swiper.image-right picture img')?.getAttribute('src')).toContain('w=876&h=960');
    expect(container.querySelector('.swiper.infotext p.infotext')?.textContent).toBe('Origins of the Alpine region');
    expect(container.querySelector('.swiper.teaser-content h2.title')?.textContent).toBe('Bask in stillness');
    const btn = container.querySelector('.swiper.teaser-content a.ht-button');
    expect(btn?.textContent).toBe('Path to regeneration');
    expect(btn?.getAttribute('href')).toBe('/en/spa/');
    expect(container.querySelector('.navigation')).toBeNull();
  });
  it('renders PREV / NEXT navigation for multiple slides', () => {
    const s = home.columns.colPos0[13];
    if (s.type !== 'mask_teaserslider') throw new Error('expected teaserslider');
    const two = { ...s, content: { teaserslides: [s.content.teaserslides[0], { ...s.content.teaserslides[0], uid: '2' }] } };
    const { container } = render(<TeaserSlider section={two} />);
    expect(container.querySelector('.navigation .prev span')?.textContent).toBe('PREV');
    expect(container.querySelector('.navigation .spacer')?.textContent).toBe('/');
    expect(container.querySelector('.navigation .next span')?.textContent).toBe('NEXT');
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- tests/unit/teaserslider.test.tsx`
Expected: FAIL.

- [ ] **Step 3: CSS + component**

```bash
cp docs/reference/css-clean/teaserslider.css components/sections/TeaserSlider.css
```

```tsx
// components/sections/TeaserSlider.tsx
'use client';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller, EffectFade, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { TeaserSliderSection } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { Button } from '@/components/ui/Button';
import { ArrowSliderIcon } from '@/components/ui/icons';
import './TeaserSlider.css';

// Mirrors Teaserslider.vue: four Swipers, the text slider drives the other three.
export function TeaserSlider({ section }: { section: TeaserSliderSection }) {
  const slides = section.content.teaserslides;
  const [left, setLeft] = useState<SwiperType | null>(null);
  const [right, setRight] = useState<SwiperType | null>(null);
  const [info, setInfo] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const multi = slides.length > 1;

  return (
    <Mask type="teaserslider" uid={section.id} appearance={section.appearance}>
      <div className="grid-container">
        <div className="teaser-wrapper grid-container-inner">
          <Swiper className="image-left" loop allowTouchMove={false} onSwiper={setLeft}>
            {slides.map((s) => (
              <SwiperSlide key={s.uid}>
                {s.imgleft.map((img, i) => <div key={i}><Picture image={img} widthD={277} heightD={330} widthM={136} heightM={180} /></div>)}
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper className="image-right" loop allowTouchMove={false} onSwiper={setRight}>
            {slides.map((s) => (
              <SwiperSlide key={s.uid}>
                {s.imgright.map((img, i) => <div key={i}><Picture image={img} widthD={876} heightD={960} widthM={252} heightM={300} /></div>)}
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper className="infotext" loop allowTouchMove={false} onSwiper={setInfo}>
            {slides.map((s) => (
              <SwiperSlide key={s.uid}><p className="infotext" dangerouslySetInnerHTML={{ __html: s.infotext }} /></SwiperSlide>
            ))}
          </Swiper>
          {left && right && info ? (
            <Swiper
              className="teaser-content"
              modules={[Navigation, Controller, EffectFade]}
              effect="fade"
              speed={1300}
              loop
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              controller={{ control: [right, left, info] }}
              onBeforeInit={(s) => {
                const nav = s.params.navigation;
                if (nav && typeof nav === 'object') { nav.prevEl = prevRef.current; nav.nextEl = nextRef.current; }
              }}
            >
              {slides.map((s) => (
                <SwiperSlide key={s.uid}>
                  <div className="teaser-content-inner">
                    {s.title ? <h2 className="title" dangerouslySetInnerHTML={{ __html: s.title }} /> : null}
                    {s.link ? <Button href={s.link.href} target={s.link.target ?? undefined}>{s.linktext}</Button> : null}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}
          {multi ? (
            <div className="navigation">
              <div className="prev swiper-button-lock" ref={prevRef}><ArrowSliderIcon /><span>PREV</span></div>
              <div className="spacer">/</div>
              <div className="next swiper-button-lock" ref={nextRef}><ArrowSliderIcon /><span>NEXT</span></div>
            </div>
          ) : null}
        </div>
      </div>
    </Mask>
  );
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- tests/unit/teaserslider.test.tsx`
Expected: 2 PASS. (jsdom renders Swiper's markup without layout; that is enough for the structure assertions.)

- [ ] **Step 5: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "feat: teaser slider with four controller-synced swipers

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 13: PartnerMarquee and the horizontalLoop helper

**Files:**
- Create: `lib/horizontalLoop.ts`, `components/sections/PartnerMarquee.tsx`, `components/sections/PartnerMarquee.css`
- Test: `tests/unit/marquee-order.test.ts`, `tests/e2e/marquee.spec.ts`

**Interfaces:**
- `lib/horizontalLoop.ts`: `horizontalLoop(items: HTMLElement[] | NodeListOf<Element>, config: { speed?: number; snap?: number | false; draggable?: boolean; paused?: boolean; repeat?: number; center?: boolean; paddingRight?: number; reversed?: boolean }): gsap.core.Timeline & { next, previous, toIndex, current, times, draggable? }` — the TypeScript port of GSAP's documented helper (the original bundle `docs/reference/js/js_CNdXacx9.js` is that helper, with `speed*100` px/s, `center` support and `Draggable`+`InertiaPlugin` when `draggable: true`; it resumes 3s after a drag ends).
- `interleave<T>(items: T[]): T[]` (exported from `PartnerMarquee.tsx`): the original's 5-bucket round-robin, repeated `ceil(n/5)*5*3` times.
- `PartnerMarquee({ section: PartnerMarqueeSection })`: `Mask(partnermarquee) > div.grid-container > [div.content > SplitWords h2.title (+ RichText .text?), div.swiper-container > Swiper (hidden by CSS), div.marquee-wrapper > div.marquee-inner > div.marquee-item* > (a? > Picture(heightD 180, heightM 120, lazy=false))]`.

- [ ] **Step 1: Write the failing unit test for the ordering**

```ts
// tests/unit/marquee-order.test.ts
import { describe, it, expect } from 'vitest';
import { interleave } from '@/components/sections/PartnerMarquee';

describe('interleave', () => {
  it('reproduces the original 5-bucket round robin repeated three times', () => {
    const names = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'];
    const out = interleave(names);
    expect(out.length).toBe(45);
    expect(out.slice(0, 15).join('')).toBe('abcdefghijklmno');
    expect(out.slice(15, 30).join('')).toBe('abcdefghijklmno');
  });
  it('handles counts that are not multiples of five', () => {
    const out = interleave(['a','b','c','d','e','f','g']);
    expect(out.length).toBe(30);
    expect(out.slice(0, 10).join('')).toBe('abcdefgcde');
  });
  it('returns an empty list for no items', () => {
    expect(interleave([])).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- tests/unit/marquee-order.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write `lib/horizontalLoop.ts`**

```ts
'use client';
import { gsap, Draggable } from '@/lib/gsap';

export type LoopConfig = {
  speed?: number; snap?: number | false; draggable?: boolean; paused?: boolean; repeat?: number;
  center?: boolean; paddingRight?: number; reversed?: boolean;
};
export type LoopTimeline = gsap.core.Timeline & {
  next: (vars?: gsap.TweenVars) => gsap.core.Tween; previous: (vars?: gsap.TweenVars) => gsap.core.Tween;
  toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween; current: () => number; times: number[];
  draggable?: Draggable;
};

// Port of GSAP's official horizontalLoop helper (https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop),
// matching the compiled original in docs/reference/js/js_CNdXacx9.js (speed*100 px/s, center, draggable+inertia).
export function horizontalLoop(itemsIn: HTMLElement[] | NodeListOf<Element>, config: LoopConfig = {}): LoopTimeline {
  const items = gsap.utils.toArray<HTMLElement>(itemsIn as never);
  const onChange = () => {};
  const tl = gsap.timeline({
    repeat: config.repeat, paused: config.paused, defaults: { ease: 'none' },
    onReverseComplete: () => { tl.totalTime(tl.rawTime() + tl.duration() * 100); },
  }) as LoopTimeline;
  const length = items.length;
  const startX = items[0].offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const spaceBefore: number[] = [];
  const xPercents: number[] = [];
  let curIndex = 0;
  let indexIsDirty = false;
  const center = config.center;
  const pixelsPerSecond = (config.speed || 1) * 100;
  const snap = config.snap === false ? (v: number) => v : gsap.utils.snap(config.snap || 1);
  let timeOffset = 0;
  const container = center === true ? items[0].parentNode as HTMLElement : (gsap.utils.toArray(center as never)[0] as HTMLElement) || (items[0].parentNode as HTMLElement);
  let totalWidth = 0;
  const getTotalWidth = () =>
    items[length - 1].offsetLeft + (xPercents[length - 1] / 100) * widths[length - 1] - startX + spaceBefore[0] +
    items[length - 1].offsetWidth * (gsap.getProperty(items[length - 1], 'scaleX') as number) + (parseFloat(String(config.paddingRight)) || 0);
  const populateWidths = () => {
    let b1 = container.getBoundingClientRect();
    let b2: DOMRect;
    items.forEach((el, i) => {
      widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px') as string);
      xPercents[i] = snap((parseFloat(gsap.getProperty(el, 'x', 'px') as string) / widths[i]) * 100 + (gsap.getProperty(el, 'xPercent') as number));
      b2 = el.getBoundingClientRect();
      spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
      b1 = b2;
    });
    gsap.set(items, { xPercent: (i) => xPercents[i] });
    totalWidth = getTotalWidth();
  };
  let timeWrap: (v: number) => number;
  const populateOffsets = () => {
    timeOffset = center ? (tl.duration() * (container.offsetWidth / 2)) / totalWidth : 0;
    if (center) {
      times.forEach((t, i) => { times[i] = timeWrap(tl.labels['label' + i] + (tl.duration() * widths[i]) / 2 / totalWidth - timeOffset); });
    }
  };
  const getClosest = (values: number[], value: number, wrap: number) => {
    let i = values.length; let closest = 1e10; let index = 0; let d: number;
    while (i--) {
      d = Math.abs(values[i] - value);
      if (d > wrap / 2) d = wrap - d;
      if (d < closest) { closest = d; index = i; }
    }
    return index;
  };
  const populateTimeline = () => {
    tl.clear();
    for (let i = 0; i < length; i++) {
      const item = items[i];
      const curX = (xPercents[i] / 100) * widths[i];
      const distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
      const distanceToLoop = distanceToStart + widths[i] * (gsap.getProperty(item, 'scaleX') as number);
      tl.to(item, { xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
        .fromTo(item, { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
          { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
        .add('label' + i, distanceToStart / pixelsPerSecond);
      times[i] = distanceToStart / pixelsPerSecond;
    }
    timeWrap = gsap.utils.wrap(0, tl.duration());
  };
  const refresh = (deep?: boolean) => {
    const progress = tl.progress();
    tl.progress(0, true);
    populateWidths();
    if (deep) populateTimeline();
    populateOffsets();
    if (deep && tl.draggable && tl.paused()) tl.time(times[curIndex], true);
    else tl.progress(progress, true);
  };
  gsap.set(items, { x: 0 });
  populateWidths();
  populateTimeline();
  populateOffsets();
  window.addEventListener('resize', () => refresh(true));
  const toIndex = (index: number, vars: gsap.TweenVars = {}) => {
    if (Math.abs(index - curIndex) > length / 2) index += index > curIndex ? -length : length;
    const newIndex = gsap.utils.wrap(0, length, index);
    let time = times[newIndex];
    if (time > tl.time() !== index > curIndex && index !== curIndex) time += tl.duration() * (index > curIndex ? 1 : -1);
    if (time < 0 || time > tl.duration()) vars.modifiers = { time: timeWrap };
    curIndex = newIndex;
    vars.overwrite = true;
    gsap.killTweensOf(tl);
    return vars.duration === 0 ? tl.time(timeWrap(time)) as unknown as gsap.core.Tween : tl.tweenTo(time, vars);
  };
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.closestIndex = (setCurrent?: boolean) => {
    const index = getClosest(times, tl.time(), tl.duration());
    if (setCurrent) { curIndex = index; indexIsDirty = false; }
    return index;
  };
  tl.current = () => (indexIsDirty ? (tl as LoopTimeline & { closestIndex: (b: boolean) => number }).closestIndex(true) : curIndex);
  tl.next = (vars) => toIndex(tl.current() + 1, vars);
  tl.previous = (vars) => toIndex(tl.current() - 1, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true);
  if (config.reversed) { tl.vars.onReverseComplete?.(); tl.reverse(); }
  if (config.draggable && typeof Draggable === 'function') {
    const proxy = document.createElement('div');
    const wrap = gsap.utils.wrap(0, 1);
    let ratio = 0; let startProgress = 0; let lastSnap = 0; let initChangeX = 0; let wasPlaying = false;
    const align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio));
    const syncIndex = () => (tl as LoopTimeline & { closestIndex: (b: boolean) => number }).closestIndex(true);
    const draggable = Draggable.create(proxy, {
      trigger: items[0].parentNode as HTMLElement, type: 'x', inertia: true, overshootTolerance: 0, allowContextMenu: true,
      onPressInit() {
        const x = this.x as number;
        gsap.killTweensOf(tl); wasPlaying = !tl.paused(); tl.pause();
        startProgress = tl.progress(); refresh(); ratio = 1 / totalWidth; initChangeX = startProgress / -ratio - x;
        gsap.set(proxy, { x: startProgress / -ratio });
      },
      onDrag: align, onThrowUpdate: align,
      overshootTolerance: 0,
      inertia: true,
      snap(value: number) {
        if (Math.abs(startProgress / -ratio - this.x) < 10) return lastSnap + initChangeX;
        const time = -(value * ratio) * tl.duration();
        const wrappedTime = timeWrap(time);
        const snapTime = times[getClosest(times, wrappedTime, tl.duration())];
        let dif = snapTime - wrappedTime;
        if (Math.abs(dif) > tl.duration() / 2) dif += dif < 0 ? tl.duration() : -tl.duration();
        lastSnap = (time + dif) / tl.duration() / -ratio;
        return lastSnap;
      },
      onRelease() { syncIndex(); if (draggable.isThrowing) indexIsDirty = true; },
      onThrowComplete: () => { syncIndex(); if (wasPlaying) setTimeout(() => tl.play(), 3000); },
    })[0];
    tl.draggable = draggable;
  }
  (tl as LoopTimeline & { closestIndex: (b: boolean) => number }).closestIndex(true);
  onChange();
  return tl;
}
```
(`onChange` is kept as a no-op hook so later phases can wire the gallery slider callbacks without changing the signature.)

- [ ] **Step 4: Copy CSS, write the component**

```bash
cp docs/reference/css-clean/partnermarquee.css components/sections/PartnerMarquee.css
```

```tsx
// components/sections/PartnerMarquee.tsx
'use client';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, A11y, Keyboard, FreeMode } from 'swiper/modules';
import type { PartnerMarqueeSection, Partner } from '@/lib/content';
import { Mask } from './Mask';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { RichText } from '@/components/ui/RichText';
import { useGSAP } from '@/lib/gsap';
import { horizontalLoop, type LoopTimeline } from '@/lib/horizontalLoop';
import { TransitionLink } from '@/components/layout/TransitionLink';
import './PartnerMarquee.css';

// Port of the original ordering: 5 buckets filled round-robin, output ceil(n/5)*5*3 items cycling per bucket.
export function interleave<T>(items: T[]): T[] {
  if (!items.length) return [];
  const cols = 5;
  const total = Math.ceil(items.length / cols) * cols * 3;
  const buckets = new Map<number, T[]>();
  items.forEach((item, i) => { const k = i % cols; if (!buckets.has(k)) buckets.set(k, []); buckets.get(k)!.push(item); });
  const out: T[] = [];
  const counters = new Map<number, number>();
  for (let t = 0; t < total; t++) {
    const k = t % cols; const b = buckets.get(k) || [];
    if (b.length) { const c = counters.get(k) || 0; out.push(b[c % b.length]); counters.set(k, c + 1); }
  }
  return out;
}

function Logo({ p }: { p: Partner }) {
  const pic = <Picture image={p.img[0]} heightD={180} heightM={120} lazy={false} />;
  return p.link ? <TransitionLink href={p.link.href} target={p.link.target ?? undefined}>{pic}</TransitionLink> : pic;
}

export function PartnerMarquee({ section }: { section: PartnerMarqueeSection }) {
  const c = section.content;
  const wrapRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<LoopTimeline | null>(null);
  const items = interleave(c.partners);

  useGSAP(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    loopRef.current = horizontalLoop(wrap.querySelectorAll('.marquee-item'), {
      speed: window.innerWidth < 1024 ? 0.8 : 1, snap: false, draggable: true, paused: false, repeat: -1, center: true,
    });
    return () => { loopRef.current?.kill(); loopRef.current = null; };
  }, { scope: wrapRef });

  return (
    <Mask type="partnermarquee" uid={section.id} appearance={section.appearance}>
      <div className="grid-container">
        <div className="content">
          {c.title ? <SplitWords as="h2" className="title" html={c.title} /> : null}
          {c.text ? <RichText className="text" html={c.text} /> : null}
        </div>
        <div className="swiper-container">
          <Swiper modules={[Autoplay, A11y, Keyboard, FreeMode]} spaceBetween={0} loop speed={650} grabCursor={false} slidesPerView={4} slidesPerGroup={1} a11y={{ enabled: true }} autoplay>
            {c.partners.map((p) => <SwiperSlide key={p.uid}><Logo p={p} /></SwiperSlide>)}
          </Swiper>
        </div>
        <div className="marquee-wrapper" ref={wrapRef} onMouseOver={() => loopRef.current?.pause()} onMouseLeave={() => loopRef.current?.resume()}>
          <div className="marquee-inner">
            {items.map((p, i) => <div className="marquee-item" key={`${p.uid}-${i}`}><Logo p={p} /></div>)}
          </div>
        </div>
      </div>
    </Mask>
  );
}
```

- [ ] **Step 5: Write the e2e test**

```ts
// tests/e2e/marquee.spec.ts
import { test, expect } from '@playwright/test';

test('partner marquee moves, pauses on hover, and lays out 45 logos', async ({ page }) => {
  await page.goto('/en/');
  const wrap = page.locator('.mask_partnermarquee .marquee-wrapper');
  await wrap.scrollIntoViewIfNeeded();
  await expect(wrap.locator('.marquee-item')).toHaveCount(45);
  const first = wrap.locator('.marquee-item').first();
  const x1 = await first.evaluate((el) => el.getBoundingClientRect().left);
  await page.waitForTimeout(1000);
  const x2 = await first.evaluate((el) => el.getBoundingClientRect().left);
  expect(x2).not.toBe(x1);
  await wrap.hover({ position: { x: 900, y: 100 } });
  await page.waitForTimeout(300);
  const x3 = await first.evaluate((el) => el.getBoundingClientRect().left);
  await page.waitForTimeout(700);
  const x4 = await first.evaluate((el) => el.getBoundingClientRect().left);
  expect(Math.abs(x4 - x3)).toBeLessThan(1);
  await expect(page.locator('.mask_partnermarquee .swiper-container')).toBeHidden();
  await expect(wrap.locator('.marquee-item img').first()).toHaveAttribute('src', /h=180/);
});
```

- [ ] **Step 6: Run both tests, typecheck**

Run: `npm test -- tests/unit/marquee-order.test.ts && npm run typecheck && npm run test:e2e -- tests/e2e/marquee.spec.ts`
Expected: PASS. The e2e test needs the section on the homepage: it runs green after Task 14 wires the page; until then run only the unit test and typecheck here and re-run the e2e in Task 14 Step 6.

- [ ] **Step 7: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "feat: partner marquee with the GSAP horizontal loop helper

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 14: Assemble the homepage (section renderer, metadata, body classes, 404)

**Files:**
- Create: `components/sections/SectionRenderer.tsx`, `components/layout/BodyClass.tsx`, `app/not-found.tsx`, `app/not-found.css`, `content/README.md`, `lib/pages.ts`
- Modify: `app/en/page.tsx`, `app/layout.tsx`
- Test: `tests/unit/section-renderer.test.tsx`, `tests/e2e/home.spec.ts`

**Interfaces:**
- `lib/pages.ts`: `pages: Record<string, PageContent>` keyed by slug (`'/'` for home) and `getPage(slug: string): PageContent | undefined`.
- `SectionRenderer({ sections: Section[] })`: maps `section.type` to the component; unknown types render nothing and log a warning once in development.
- `BodyClass({ pageId, layout })`: sets `document.body.className = \`pid-${pageId} layout-${layout}\`` (original: `body.pid-1.layout-layout-0`) while keeping `scrolled`.
- `metadataFor(page: PageContent): Metadata` (in `lib/pages.ts`).

- [ ] **Step 1: Write the failing unit test**

```tsx
// tests/unit/section-renderer.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { home } from '@/content/en/home';
import { metadataFor } from '@/lib/pages';

vi.mock('@/lib/gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn(), timeline: vi.fn(() => ({ to: vi.fn() })) },
  SplitText: { create: vi.fn(() => ({ words: [], revert: vi.fn() })) },
  ScrollTrigger: { refresh: vi.fn() },
  ScrollSmoother: { create: vi.fn() },
  useGSAP: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/en/' }));

describe('SectionRenderer', () => {
  it('renders every homepage section in order with its mask class', () => {
    const { container } = render(<SectionRenderer sections={home.columns.colPos0} />);
    const classes = Array.from(container.querySelectorAll(':scope > .mask')).map((el) => Array.from(el.classList).find((c) => c.startsWith('mask_')));
    expect(classes).toEqual(home.columns.colPos0.map((s) => s.type));
  });
  it('skips unknown section types', () => {
    const { container } = render(
      <SectionRenderer sections={[{ id: 1, type: 'mask_unknown', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' }, content: {} }]} />,
    );
    expect(container.children.length).toBe(0);
  });
});

describe('metadataFor', () => {
  it('maps the page meta to Next metadata', () => {
    const m = metadataFor(home);
    expect(m.title).toBe('eriro - Experience alpine originality');
    expect(m.description).toContain('smallest luxury hideaway');
    expect((m.openGraph as { title?: string }).title).toBe('eriro Alpine Hide');
    expect((m.openGraph as { images?: { url: string }[] }).images?.[0].url).toBe('/images/2c0a3fac2ab04ecb63b3c016f3214849.jpg');
    expect(m.alternates?.canonical).toBe('/en/');
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- tests/unit/section-renderer.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write `lib/pages.ts`, `SectionRenderer.tsx`, `BodyClass.tsx`**

```ts
// lib/pages.ts
import type { Metadata } from 'next';
import type { PageContent } from './content';
import { home } from '@/content/en/home';

// Every English page, keyed by its TYPO3 slug ('/' is the homepage). Later phases add one line per page.
export const pages: Record<string, PageContent> = {
  '/': home,
};

export function getPage(slug: string): PageContent | undefined {
  return pages[slug];
}

// The original <head>: title, description, og:*, twitter:*, canonical (see docs/reference/pages/en.html).
export function metadataFor(page: PageContent): Metadata {
  const m = page.meta;
  const path = page.slug === '/' ? '/en/' : `/en${page.slug}/`;
  return {
    title: m.title,
    description: m.description,
    robots: { index: !m.robots.noIndex, follow: !m.robots.noFollow, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    alternates: { canonical: path, languages: { en: path } }, // `de` hreflang is added when the German mirror exists (spec §2)
    openGraph: { title: m.ogTitle, description: m.ogDescription, type: 'website', images: m.ogImage ? [{ url: m.ogImage.src }] : [] },
    twitter: { card: 'summary', title: m.twitterTitle, description: m.twitterDescription, images: m.twitterImage ? [m.twitterImage.src] : [] },
  };
}
```

```tsx
// components/sections/SectionRenderer.tsx
import type { Section } from '@/lib/content';
import { Hero } from './Hero';
import { ImgText } from './ImgText';
import { Img } from './Img';
import { Video } from './Video';
import { Quote } from './Quote';
import { Break } from './Break';
import { RoomSlider } from './RoomSlider';
import { TeaserSlider } from './TeaserSlider';
import { PartnerMarquee } from './PartnerMarquee';

const warned = new Set<string>();

// One case per original TYPO3 content type. Later phases add cases here.
function renderSection(section: Section) {
  switch (section.type) {
    case 'mask_hero': return <Hero section={section} />;
    case 'mask_imgtext': return <ImgText section={section} />;
    case 'mask_img': return <Img section={section} />;
    case 'mask_video': return <Video section={section} />;
    case 'mask_quote': return <Quote section={section} />;
    case 'mask_break': return <Break section={section} />;
    case 'mask_roomslider': return <RoomSlider section={section} />;
    case 'mask_teaserslider': return <TeaserSlider section={section} />;
    case 'mask_partnermarquee': return <PartnerMarquee section={section} />;
    default:
      if (process.env.NODE_ENV !== 'production' && !warned.has(section.type)) {
        warned.add(section.type);
        console.warn(`SectionRenderer: no component for "${section.type}" yet`);
      }
      return null;
  }
}

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return <>{sections.map((section) => <Fragment key={section.id}>{renderSection(section)}</Fragment>)}</>;
}
```
(add `import { Fragment } from 'react';` at the top). Keyed fragments add no DOM node, so every section stays a direct child of `main` exactly like the original (`[page-id] main > div:first-child` rules in later phases depend on this).

```tsx
// components/layout/BodyClass.tsx
'use client';
import { useEffect } from 'react';

// The original body carries `pid-{pageId} layout-{layout}`; `scrolled` is managed separately by the header.
export function BodyClass({ pageId, layout }: { pageId: number; layout: string }) {
  useEffect(() => {
    const body = document.body;
    Array.from(body.classList).filter((c) => c.startsWith('pid-') || c.startsWith('layout-')).forEach((c) => body.classList.remove(c));
    body.classList.add(`pid-${pageId}`, `layout-${layout}`);
  }, [pageId, layout]);
  return null;
}
```

- [ ] **Step 4: Write `app/en/page.tsx` and the 404 page**

```tsx
// app/en/page.tsx
import type { Metadata } from 'next';
import { home } from '@/content/en/home';
import { metadataFor } from '@/lib/pages';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { BodyClass } from '@/components/layout/BodyClass';

export const metadata: Metadata = metadataFor(home);

export default function HomePage() {
  return (
    <main>
      <BodyClass pageId={home.id} layout="layout-0" />
      <SectionRenderer sections={home.columns.colPos0} />
    </main>
  );
}
```

```bash
cp docs/reference/css-clean/errorpage.css app/not-found.css
```
```tsx
// app/not-found.tsx  (original error page: logo, "something went wrong", 5s loading bar after 1s, then redirect home)
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogoIcon } from '@/components/ui/icons';
import { site } from '@/content/site';
import './not-found.css';

export default function NotFound() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push(site.pageLinks.home), 6000); // 1s delay + 5s bar
    return () => clearTimeout(t);
  }, [router]);
  return (
    <main>
      <div className="default mask mask_errorpage">
        <div className="grid-container-error">
          <div className="errorSvgWrapper"><LogoIcon /></div>
          <div className="errorTextWrapper">
            <h1 className="errorTitle">something went wrong</h1>
            <p className="errorText">You will be redirected shortly. Click here to access the <a href={site.pageLinks.home}>homepage</a>.</p>
          </div>
          <div className="loadingBar"><div className="innerLoader" /></div>
        </div>
      </div>
    </main>
  );
}
```
(The error texts are the `en` i18n strings `errorText1`, `errorText3`, `errorText4`, `errorText5` from `docs/reference/js/js_BsE3zN_y.js`.)

- [ ] **Step 5: Finish `app/layout.tsx`**

Final shape (the original DOM order: header, smooth wrapper with main + footer, texture image):
```tsx
import type { ReactNode } from 'react';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { PageTransition } from '@/components/layout/PageTransition';

const FONTS = ['karol-sans-300-normal', 'karol-sans-300-italic', 'karol-sans-400-normal', 'karol-sans-400-italic'];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {FONTS.map((f) => <link key={f} rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href={`/fonts/${f}.woff2`} />)}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="pid-1 layout-layout-0">
        <div className="body-inner">
          <div id="__app">
            <Header />
            <SmoothScroll>
              <PageTransition>{children}</PageTransition>
              <Footer />
            </SmoothScroll>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="eriro-bg-attach" src="/HG.jpg" alt="" />
          </div>
        </div>
      </body>
    </html>
  );
}
```
Also add `export const viewport = { width: 'device-width', initialScale: 1 }` so the viewport meta matches the original.

- [ ] **Step 6: Write `content/README.md`**

```markdown
# content/

All copy, links and image references. Nothing in `components/` contains text.

- `site.ts` – navigation, footer navs, contact details, booking link, UI strings, season switch. Hand-maintained.
- `en/<slug>.ts` – one file per page, GENERATED from the crawled site. Regenerate with
  `npm run gen:content -- <slug> <exportName>` (e.g. `npm run gen:content -- home home`,
  `npm run gen:content -- alpine-hide alpineHide`). Source JSON lives in `docs/reference/pages/`.
- Image `src` values point into `public/images/`; `width`/`height` are the original pixel sizes and
  `crop` is the TYPO3 crop area (0..1). `lib/images.ts` turns these into `<source>` sizes.
- To change wording, edit the generated file (or the JSON and regenerate). Keep HTML fragments
  (`<br>`, `<i>`, `<ul>`) as they are; they are rendered verbatim.
```

- [ ] **Step 7: Write the e2e test for the assembled page**

```ts
// tests/e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test('homepage renders all 15 sections with the original text', async ({ page }) => {
  await page.goto('/en/');
  await expect(page).toHaveTitle('eriro - Experience alpine originality');
  const masks = page.locator('main .mask');
  await expect(masks).toHaveCount(15);
  await expect(page.locator('.mask_hero h2.titleh2')).toContainText('Rooted');
  await expect(page.locator('.mask_quote .quote')).toHaveText('eriro – One of the "World’s Greatest Places 2025"');
  await expect(page.locator('.mask_break h2.title')).toContainText('Experience');
  await expect(page.locator('.mask_partnermarquee h2.title')).toHaveText('Recommended by');
  await expect(page.locator('footer .unikateur-signet span')).toHaveText('unique hospitality concepts, by ');
  await expect(page.locator('body')).toHaveClass(/pid-1/);
  await expect(page.locator('#smooth-wrapper #smooth-content main')).toBeVisible();
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(total).toBeGreaterThan(18000); // original: 19667px at 1920×951
  expect(total).toBeLessThan(21000);
});

test('unknown routes show the error page', async ({ page }) => {
  await page.goto('/en/does-not-exist/');
  await expect(page.locator('.mask_errorpage .errorTitle')).toHaveText('something went wrong');
});
```

- [ ] **Step 8: Run everything**

Run: `npm run typecheck && npm run lint && npm test && npm run test:e2e`
Expected: all green, including `tests/e2e/marquee.spec.ts` from Task 13. If `lint` flags the `uid` attribute on `Mask`, keep it (it mirrors the original DOM) and add `// eslint-disable-next-line` with the rule name shown.

- [ ] **Step 9: Commit**

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "feat: assemble the homepage, metadata, body classes and the error page

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 15: Visual and text QA against the live site, then fix until identical

**Files:**
- Create: `scripts/qa/screenshots.ts`, `scripts/qa/textdiff.ts`
- Output (git-ignored): `docs/qa/<route>/<width>-<n>.{live,local}.png`, `docs/qa/text-diff.txt`

**Interfaces:**
- `npm run qa:shots -- /en/` captures both sites at 1920×951, 1440×900 and 390×844, scrolling in viewport steps with 1.5s settle time, saving paired PNGs.
- `npm run qa:text -- /en/` prints a unified diff of the visible text of `main` (whitespace-normalised) between live and local and exits non-zero on differences.

- [ ] **Step 1: Write `scripts/qa/screenshots.ts`**

```ts
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const LIVE = 'https://www.eriro.at';
const LOCAL = 'http://localhost:3000';
const SIZES = [[1920, 951], [1440, 900], [390, 844]] as const;

async function capture(base: string, route: string, tag: 'live' | 'local') {
  const browser = await chromium.launch();
  for (const [width, height] of SIZES) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const dir = path.join('docs/qa', route.replace(/\//g, '_') || '_root');
    fs.mkdirSync(dir, { recursive: true });
    let n = 0;
    for (let y = 0; y < total; y += height) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(dir, `${width}-${String(n).padStart(2, '0')}.${tag}.png`) });
      n++;
    }
    await page.close();
  }
  await browser.close();
}

const route = process.argv[2] ?? '/en/';
await capture(LIVE, route, 'live');
await capture(LOCAL, route, 'local');
console.log('done: docs/qa');
```

- [ ] **Step 2: Write `scripts/qa/textdiff.ts`**

```ts
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const route = process.argv[2] ?? '/en/';
async function mainText(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 951 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const text = await page.evaluate(() => {
    const clone = document.querySelector('main')!.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.marquee-inner').forEach((el) => el.remove()); // marquee repeats logos, no text
    return clone.innerText;
  });
  await browser.close();
  return text.replace(/\s+/g, ' ').trim();
}
const live = await mainText('https://www.eriro.at' + route);
const local = await mainText('http://localhost:3000' + route);
fs.mkdirSync('docs/qa', { recursive: true });
fs.writeFileSync('docs/qa/text-live.txt', live);
fs.writeFileSync('docs/qa/text-local.txt', local);
if (live === local) { console.log('TEXT IDENTICAL'); process.exit(0); }
const a = live.split(' '); const b = local.split(' ');
let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
console.log('FIRST DIFFERENCE at word', i);
console.log('live :', a.slice(Math.max(0, i - 10), i + 10).join(' '));
console.log('local:', b.slice(Math.max(0, i - 10), i + 10).join(' '));
process.exit(1);
```

- [ ] **Step 3: Run the text diff and fix until identical**

Run: `npm run dev` (in another terminal) then `npm run qa:text -- /en/`
Expected: `TEXT IDENTICAL`. A difference means a section renders different copy or misses a node; fix the component (never the content file) and re-run.

- [ ] **Step 4: Run the screenshots and compare pair by pair**

Run: `npm run qa:shots -- /en/`
Open `docs/qa/_en_/` and compare every `NN.live.png` with `NN.local.png` at each width. Check, in this order: section vertical positions, image boxes (position and aspect), heading sizes and line breaks, text column widths, header bar state, footer. Every visible difference is a CSS or markup bug in the clone; fix and re-run until no differences remain at any width. Mobile (390px) must match the original's mobile rules (hamburger right, REQUEST/BOOK left, beige blob, stacked layout).

- [ ] **Step 5: Behaviour checklist (manual, desktop)**

- Menu opens in ~1.5s with the bar-to-X morph; links fade in staggered; clicking the dark area closes it.
- Header bar turns beige after scrolling down; logo shrinks and fades within the first screen.
- Headings brighten word by word as they pass 85% of the viewport.
- Images move at different speeds (parallax) on desktop, not on mobile.
- Suite slider arrows change all three images and the text together; text crossfades in 1.3s.
- Partner logos scroll continuously, pause on hover, and can be dragged with inertia.
- Navigating via any link blurs the page out and in (0.6s each).

- [ ] **Step 6: Final gates and commit**

Run: `npm run typecheck && npm run lint && npm test && npm run test:e2e && npm run build`
Expected: all green.

```bash
git add -A
git -c user.name="Sriram" -c user.email="info.marksandmethods@gmail.com" commit -m "chore: QA scripts (live vs local screenshots, text diff) and homepage parity fixes

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Self-review notes (done while writing)

- Spec coverage for this phase: §3 findings → Tasks 2, 5; §5 structure → file map; §6 content model → Task 3; §7 design system → Task 2; §8.1–8.3 header/logo/menu → Task 7; §8.4 footer → Task 8; §8.5 smooth scroll → Task 5; §9.1 hero → Task 9; §9.2–9.6 → Task 10; §9.7 → Task 11; §9.8 → Task 12; §9.9 → Task 13; §9.24 Picture → Task 4; §9.25 SplitWords → Task 5; §10 assets → already in `public/` (fonts, images, videos, texture, SLH badge, favicon); §12 verification → Task 15; error page → Task 14. §8.6 CookieConsent is scheduled with the cookies page in Phase 2 (no banner is shown on the live homepage today).
- Names used across tasks: `Mask`, `Picture`, `SplitWords`, `RichText`, `Button`, `BigLink`, `TransitionLink`, `useParallax`, `useIsWinter`, `onSmoother/setSmoother`, `openMenu/closeMenu/OPEN/CLOSED`, `horizontalLoop`, `interleave`, `SectionRenderer`, `metadataFor`, `BodyClass` are defined before they are used and spelled identically everywhere.
- No `TBD`/`TODO`/"similar to" placeholders; every code step shows the code.
