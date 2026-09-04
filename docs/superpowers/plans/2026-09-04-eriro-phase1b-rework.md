# Eriro Phase 1b Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the already-built eriro.at homepage clone so it matches the user's Phase 1b instructions: no `/en/` URL prefix, no live fetching or generated content/images, a flat `#F2F1EF` background, direct component composition instead of `SectionRenderer`/`Mask`, Tailwind utility classes instead of per-component CSS files, a hand-built newsletter popup, and two known bug/asset fixes — all while keeping the page a pixel-exact 1:1 clone (§1 of the spec still holds in full).

**Architecture:** Eighteen sequential tasks. Tasks 1–6 change plumbing (deleted tooling, routing, images, content, composition, a colour token) without touching visual output. Tasks 7–13 convert each component's CSS to Tailwind utilities one file-group at a time, using one fully-worked example (Task 7, Hero) to establish the conversion method, then a repeatable protocol for the rest. Tasks 14–16 are small fixes (colour sweep, favicon, a scroll-bug repro+fix). Tasks 17–18 build the newsletter popup, capture-then-build.

**Tech Stack:** Next.js 16.3.4 (App Router), React 19, TypeScript strict, Tailwind CSS v4, GSAP 3.15 + ScrollTrigger/ScrollSmoother/SplitText, Swiper 14, Vitest + Testing Library (unit), Playwright (e2e).

**Spec:** `docs/superpowers/specs/2026-09-04-eriro-clone-design.md` — §1–15 is the original 1:1 design (unchanged, still binding on every visual/behavioural detail), §16 is the Phase 1b amendment this plan implements task-by-task. Read §16 in full before starting; each task below cites the exact §16.x subsection it satisfies.

## Global Constraints

- Visual output is unchanged throughout — this is an architecture/tooling rework, not a design change (spec §16.4). Any pixel difference introduced by a task is a bug in that task, not an accepted side effect.
- `#e4e0db` stays wherever it is a border/line; only **fills** become `#F2F1EF` (spec §16.3).
- No task re-introduces live fetching from `eriro.at`/`typo3.eriro.at` at request time, generated content files, or a runtime image-resize route (spec §16.2). One-time, offline asset-acquisition scripts (crop generation, the popup reference capture) are not "live fetching" — they run once, their output is committed, and the running app never calls out at request time.
- `tests/e2e/*.spec.ts` and `@playwright/test` are **kept** (spec §16.2 — the critique caught an earlier draft that wrongly proposed deleting them). Only `scripts/qa/*.ts` and the `pixelmatch`/`pngjs`/`@types/pngjs` dependencies they alone used are deleted.
- `lib/content.ts`'s `Section` union (the `Base<T, C>` / `mask_*` / `appearance`+`content` shape) is **not** touched by this plan. The user's complaint was about `SectionRenderer`, CSS-file sprawl, and the *generated* `content/en/home.ts` being unreadable — not about the type shape. Changing it too would be unrequested scope creep; if the user wants it flattened later, that is a separate, explicitly-asked-for task.
- Every `next build`, `npm test` (Vitest), and `npm run test:e2e` (Playwright) run referenced below must be zero-error/zero-failure before a task is considered done, per spec §12 item 4.
- Node/npm commands run from `/home/sriram/Office_work/eriro` (the repo root) on branch `phase-1-homepage`.
- `AGENTS.md` (repo root) warns this Next.js version has breaking changes from training-data assumptions — check `node_modules/next/dist/docs/` for anything version-sensitive before writing code that depends on exact current API shape (called out explicitly in Task 3, where it matters most).

## Tailwind Conversion Protocol (used by Tasks 7–13)

Tasks 7–13 all do the same kind of work: delete one component's `.css` file and move every rule in it onto the JSX element(s) it applies to, as Tailwind utility classes using the file's own exact numeric values as arbitrary values. This is 1:1 syntactic transcription of already-correct, already-shipped-and-QA'd CSS — the source of truth for every number is the `.css` file itself, right there in the repo, not something to re-derive. The methodology, established fully in Task 7 with a complete worked example:

1. **Unit conversion:** every `rem` value becomes a Tailwind arbitrary value in brackets, unchanged: `padding-top:43rem` → `pt-[43rem]`. Never round or approximate.
2. **Breakpoint:** the original's one breakpoint is `max-width:1023px` (mobile) / `min-width:1024px` (desktop, the CSS default with no prefix). In Tailwind that's the `lg` breakpoint (`--breakpoint-lg: 1024px`, already usable via Tailwind's default scale since 1024 is a stock breakpoint) — desktop-first rules get no prefix, the `@media (max-width:1023px)` block's rules get the `max-lg:` variant.
3. **Grid placement:** `grid-column-start/end`, `grid-row-start/end`, `grid-template-columns:repeat(N,1fr)`, `grid-column-gap` all have direct Tailwind utilities (`col-start-N`, `col-span-N`, `row-start-N`, `grid-cols-N`, `gap-x-[var(--grid-gap)]`); use them over arbitrary `grid-column: X / Y` strings where a named utility exists.
4. **Escape hatch (rare, must be justified inline):** a rule stays in a plain CSS file only when Tailwind genuinely cannot express it on the element itself — the three known cases across this codebase are the `nth-child`-driven gallery/marquee item patterns (not yet built, out of Phase 1b's homepage scope), the GSAP `horizontalLoop` marquee mechanics (JS, not CSS — Task 11), and cross-sibling `:hover` cascades where one element's hover state restyles *other* elements (Task 8's header nav). For the last case, Tailwind's `group`/`peer` variants are the correct tool (restructure the JSX so the hover-owning element carries `group` and dependents use `group-hover:`), not a CSS-file holdout — a real CSS escape hatch is reserved for things neither Tailwind utilities nor `group`/`peer` can express (keyframe `@keyframes` blocks, `nth-child` selectors). Every escape-hatch rule gets an inline comment saying why Tailwind can't express it.
5. **Coverage check:** before deleting a `.css` file, re-read it once more against the converted JSX and confirm every declaration has a home (a Tailwind class or a documented escape-hatch line). Nothing gets silently dropped.
6. **Regression test:** each task's actual correctness check is a **Playwright screenshot diff**, not manual eyeballing of class names. Steps: (a) with the `.css` file still in place, start `npm run dev` and capture the section at three viewports (1920×951, 1440×900, 390×844) with a small Playwright script into a temp "before" folder; (b) do the conversion; (c) capture the same three shots into an "after" folder; (d) run `pixelmatch`-free comparison isn't available (deleted in Task 1) — instead use Playwright's own built-in `expect(locator).toHaveScreenshot()` snapshot assertion (bundled with `@playwright/test`, no extra dependency), which fails the test on any pixel difference above its default threshold. Commit the baseline snapshot with the task; CI-less local re-runs compare against it. This is the project's TDD substitute for a component with no meaningful unit-level behaviour to assert beyond "looks identical."
7. Existing unit/e2e tests for the component (if any) must still pass unmodified — they assert DOM structure and hrefs, not CSS, so a correct conversion never needs to touch their assertions.

Global colour rule for Tasks 8–13: wherever a rule you're converting sets a **fill** to `#e4e0db`, convert it to `bg-canvas` instead (the token added in Task 6), per spec §16.3 — don't convert it to the old colour and fix it later.

---

### Task 1: Delete rejected tooling

Satisfies spec §16.2's QA bullet and the deletion half of its Content bullet, and §16.7(b)'s resolution (fresh, descriptively-named reference screenshots replacing the 18 opaque ones). Pure cleanup plus one archival capture — nothing else in the repo imports these at runtime.

**Files:**
- Delete: `scripts/gen-content.ts`
- Delete: `scripts/qa/screenshots.ts`, `scripts/qa/diff.ts`, `scripts/qa/textdiff.ts`
- Delete: `docs/reference/screenshots/screenshot-*.jpg` (the 18 opaque files)
- Create: `docs/reference/screenshots/home-{1920,1440,390}.png` (their replacement)
- Modify: `package.json`

**Interfaces:** none — nothing downstream consumes these files or the deleted dependencies.

- [ ] **Step 1: Confirm nothing else references these files**

Run: `grep -rn "gen-content\|scripts/qa" --include="*.ts" --include="*.tsx" --include="*.json" . --exclude-dir=node_modules --exclude-dir=.next`
Expected: only `package.json`'s four script entries (`gen:content`, `qa:shots`, `qa:text`, `qa:diff`) and the files themselves. If anything else references them, stop and investigate before deleting.

- [ ] **Step 2: Capture fresh homepage reference screenshots before deleting anything**

Resolves spec §16.7(b): the existing `docs/reference/screenshots/` holds 18 files named `screenshot-<timestamp>-<n>.jpg` with no page or breakpoint encoded, and no verified coverage — not reusable. Since the QA scripts that produced them are being deleted in this same task, capture their replacement first, against the *live* site (a one-time reference capture is allowed under §16.2 — it's captured once and committed, not fetched live at QA-run time), scoped to the homepage only (Phase 1b's actual scope) at the three breakpoints from spec §12 item 1:

```bash
npx playwright screenshot --viewport-size=1920,951 --full-page https://www.eriro.at/en/ docs/reference/screenshots/home-1920.png
npx playwright screenshot --viewport-size=1440,900 --full-page https://www.eriro.at/en/ docs/reference/screenshots/home-1440.png
npx playwright screenshot --viewport-size=390,844 --full-page https://www.eriro.at/en/ docs/reference/screenshots/home-390.png
rm docs/reference/screenshots/screenshot-*.jpg
```

These three files are the permanent, human-readable reference for "does the homepage still look like the live site" — distinct from Tasks 7–13's own before/after Playwright snapshots (which only prove a Tailwind conversion changed nothing, not that the pre-conversion state was correct; Phase 1 Task 15 already proved that once, this is the durable artifact of it).

- [ ] **Step 3: Delete the rejected scripts**

```bash
rm scripts/gen-content.ts
rm -r scripts/qa
```

- [ ] **Step 4: Remove their package.json scripts and dependencies**

Edit `package.json`: remove the `"gen:content"`, `"qa:shots"`, `"qa:text"`, `"qa:diff"` lines from `"scripts"`, and remove `"pixelmatch"`, `"pngjs"`, `"@types/pngjs"` from `"devDependencies"`. Leave `"@playwright/test"` and `"test:e2e"` untouched (Global Constraints).

- [ ] **Step 5: Reinstall and verify the build is unaffected**

Run: `npm install && npm run typecheck && npm test && npm run build`
Expected: all four succeed with no errors. `npm test` should show the same pass count as before this task (deleting these scripts touches no test file).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: delete rejected content-generator and live-fetch QA scripts

Phase 1b (spec §16.2): scripts/gen-content.ts and scripts/qa/* fetched from
or generated against the live site, which the user rejected as 'cheap
tricks'. pixelmatch/pngjs were only used by the deleted QA scripts.
@playwright/test and tests/e2e/ stay — they're an unrelated, genuine
e2e suite. Also replaces the 18 opaquely-named reference screenshots with
three descriptively-named, homepage-scoped ones (spec §16.7(b))."
```

---

### Task 2: Root routes — drop the `/en/` prefix entirely

Satisfies spec §16.1. This is the full enumerated blast radius from §16.1 — every one of these files was independently verified to contain a hardcoded `/en/` reference before this plan was written.

**Files:**
- Move: `app/en/page.tsx` → `app/page.tsx`
- Modify: `content/site.ts`, `lib/pages.ts`, `components/layout/Header.tsx`, `playwright.config.ts`
- Modify: `tests/e2e/footer-logo.spec.ts`, `tests/e2e/header.spec.ts`, `tests/e2e/home.spec.ts`, `tests/e2e/marquee.spec.ts`, `tests/e2e/roomslider.spec.ts` (and check `tests/e2e/globals.spec.ts`, `tests/e2e/image-route.spec.ts` — `image-route.spec.ts` is superseded entirely by Task 3, skip its `/en/` fix here)
- Modify: `tests/unit/applink.test.tsx`, `tests/unit/content.test.ts`, `tests/unit/footer.test.tsx`, `tests/unit/hero.test.tsx`, `tests/unit/links.test.ts`, `tests/unit/section-renderer.test.tsx`, `tests/unit/sections-basic.test.tsx`, `tests/unit/teaserslider.test.tsx`

**Interfaces:**
- Produces: `/` as the homepage route (was `/en/`). `site.pageLinks.home === '/'`. `metadataFor()`'s canonical path drops the `/en` segment.

- [ ] **Step 1: Move the route file**

```bash
mkdir -p app  # already exists, no-op
git mv app/en/page.tsx app/page.tsx
rmdir app/en 2>/dev/null || true
```

- [ ] **Step 2: Update `content/site.ts`'s hrefs**

Replace every `/en/...` literal with the same path minus the `/en` prefix. The `languages` array's `en` entry becomes `/` (it pointed at `/en/` before); its `de` entry (`/de/`) is dead per §16.1 (German mirror cancelled) but stays in the array shape for now since removing the language switcher entirely is not in this plan's scope — only its href changes to itself as a no-op marker; simplest correct fix is to point `de` at `/` too, since there is no German page to link to:

```ts
export const site = {
  nav: [
    { uid: 58, title: 'Alpine Hide', link: '/alpine-hide/' },
    { uid: 44, title: 'Suites', link: '/suites/boum/' },
    { uid: 120, title: 'All-In-Service', link: '/all-in-service/' },
    { uid: 60, title: 'Experiences', link: '/experiences/' },
    { uid: 61, title: 'Culinary', link: '/culinary/' },
    { uid: 108, title: 'Spa', link: '/spa/' },
    { uid: 86, title: 'Origin', link: '/origin/' },
    { uid: 179, title: 'Summer', link: '/summer/' },
    { uid: 181, title: 'Winter', link: '/winter/' },
  ] as NavItem[],
  footerNav: [
    { uid: 162, title: 'Booking conditions', link: '/booking-conditions/' },
    { uid: 164, title: 'eriro exclusive', link: '/eriro-exclusive/' },
    { uid: 95, title: 'Contact and arrival', link: '/contact-and-arrival/' },
    { uid: 73, title: 'Voucher', link: '/voucher/' },
    { uid: 103, title: 'Newsletter', link: '/newsletter/' },
    { uid: 72, title: 'Jobs', link: '/jobs/' },
    { uid: 71, title: 'Press', link: '/press/' },
  ] as NavItem[],
  privacyNav: [
    { uid: 5, title: 'Imprint', link: '/imprint/' },
    { uid: 6, title: 'Privacy', link: '/privacy/' },
    { uid: 7, title: 'Cookies', link: '/cookies/' },
  ] as NavItem[],
  languages: [
    { code: 'de', title: 'Deutsch', link: '/' },
    { code: 'en', title: 'English', link: '/' },
  ],
  pageLinks: { home: '/', request: '/request/', contact: '/contact-and-arrival/', voucher: '/voucher/', gallery: '/gallery/' },
  // contact, socialHtml, partnerHtml, bookingLink, unikateur, t, season: unchanged
```

Leave `contact`, `socialHtml`, `partnerHtml`, `bookingLink`, `unikateur`, `t`, and `season` exactly as they are — none contain `/en/`.

- [ ] **Step 3: Update `lib/pages.ts`**

```ts
export const pages: Record<string, PageContent> = {
  '/': home,
};

export function getPage(slug: string): PageContent | undefined {
  return pages[slug];
}

export function metadataFor(page: PageContent): Metadata {
  const m = page.meta;
  const path = page.slug; // page.slug is already '/' for home; no /en prefix, no per-page rewrite needed
  return {
    title: m.title,
    description: m.description,
    robots: { index: !m.robots.noIndex, follow: !m.robots.noFollow, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    alternates: { canonical: path, languages: { en: path } },
    openGraph: { title: m.ogTitle, description: m.ogDescription, type: 'website', images: m.ogImage ? [{ url: m.ogImage.src }] : [] },
    twitter: { card: 'summary', title: m.twitterTitle, description: m.twitterDescription, images: m.twitterImage ? [m.twitterImage.src] : [] },
  };
}
```

- [ ] **Step 4: Update `Header.tsx`'s `isHome` check**

In `components/layout/Header.tsx`, change:
```ts
const isHome = pathname === '/en/' || pathname === '/en';
```
to:
```ts
const isHome = pathname === '/';
```

- [ ] **Step 5: Update `playwright.config.ts`**

```ts
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000/',
  reuseExistingServer: true,
  timeout: 120_000,
},
```

- [ ] **Step 6: Update every `/en/` reference in the e2e specs**

In `tests/e2e/footer-logo.spec.ts`, `tests/e2e/header.spec.ts`, `tests/e2e/home.spec.ts`, `tests/e2e/marquee.spec.ts`, `tests/e2e/roomslider.spec.ts`: every `page.goto('/en/')` → `page.goto('/')`; every `expect(page.url()).toContain('/en/')` → `expect(page.url()).toContain('/')` (or more precisely `.toBe('http://localhost:3000/')` where the original asserted an exact URL); `roomslider.spec.ts`'s `toHaveAttribute('href', '/en/suites/boum/')` → `toHaveAttribute('href', '/suites/boum/')`; `home.spec.ts`'s `page.goto('/en/does-not-exist/')` → `page.goto('/does-not-exist/')`. Check `tests/e2e/globals.spec.ts` too (it has one `page.goto('/en/')`).

- [ ] **Step 7: Update the unit tests**

- `tests/unit/applink.test.tsx`: `usePathname: () => '/en/'` → `usePathname: () => '/'`; the four `href="/en/..."` test fixtures drop the `/en` prefix (`/`, `/`, `/spa/`, `/`).
- `tests/unit/content.test.ts`, `tests/unit/hero.test.tsx`, `tests/unit/section-renderer.test.tsx`, `tests/unit/sections-basic.test.tsx`, `tests/unit/teaserslider.test.tsx`, `tests/unit/footer.test.tsx`: every `usePathname: () => '/en/'` mock → `() => '/'`; `content.test.ts`'s `expect(site.nav[1].link).toBe('/en/suites/boum/')` → `'/suites/boum/'`, and its privacy-nav array assertion drops every `/en` prefix; `sections-basic.test.tsx`'s `linkdetail` href assertion `/en/alpine-hide/` → `/alpine-hide/`; `teaserslider.test.tsx`'s button href `/en/spa/` → `/spa/`; `section-renderer.test.tsx`'s canonical assertion `'/en/'` → `'/'`.
- `tests/unit/links.test.ts`: every `/en/`-shaped fixture string (`isInternal`, `isCurrentPage` calls) drops the `/en` prefix — these test path-matching logic generically, so `/`, `/spa/` etc. exercise the same code paths.

`footer.test.tsx`'s `partner a[href="https://www.laposch.com/en/"]` assertion is an **external** URL (laposch.com's own `/en/` path) — leave it untouched, it has nothing to do with this site's routing.

- [ ] **Step 8: Run everything**

Run: `npm run typecheck && npm test && npm run build`
Expected: zero errors. Then start the dev server and run e2e: `npm run dev &` then `npm run test:e2e`, then stop the dev server.
Expected: all e2e specs pass against `/`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: drop the /en/ URL prefix — homepage moves to root /

Phase 1b (spec §16.1): the German mirror is cancelled outright, not
deferred, so there's no reason for a language segment. Updates every
hardcoded /en/ reference: content/site.ts hrefs, lib/pages.ts, Header's
isHome check, playwright.config.ts, and all e2e/unit test fixtures."
```

---

### Task 3: Offline image-crop pipeline — delete the `/i` runtime route

Satisfies spec §16.2's Images bullet and §16.7(a)'s resolution (pre-crop offline, `next/image` does the rest — matching the original's own `_ipx` architecture). **Before writing Picture.tsx**, check `node_modules/next/dist/docs/` for the current `getImageProps` / art-direction pattern per `AGENTS.md` — the implementation below uses that API as of Next 16.3.4's public documentation; confirm it still matches before relying on it.

**Files:**
- Create: `scripts/gen-image-crops.ts`
- Modify: `lib/images.ts`, `components/ui/Picture.tsx`
- Delete: `app/i/route.ts`, `components/ui/Picture.css`
- Modify: `package.json` (move `sharp` to devDependencies)
- Modify: `tests/unit/images.test.ts`, `tests/e2e/image-route.spec.ts`

**Interfaces:**
- Consumes: `ImageRef` from `lib/content.ts` (`{ src, width, height, alt, title, mime, crop: { default, mobile } }`) — **unchanged**, this task does not touch the content type or `content/en/home.ts`'s values.
- Produces: `staticSrc(image, which)` — deterministic cropped-file path; `renderSize(image, preset, which)` — `{width, height}` for `next/image`. Both exported from `lib/images.ts`, consumed by `Picture.tsx` (and by nothing else yet — every section component calls `<Picture image={...} .../>`, unchanged).

- [ ] **Step 1: Rewrite `lib/images.ts`**

```ts
import type { ImageRef } from './content';

export type SizePreset = { widthD?: number; heightD?: number; widthM?: number; heightM?: number };

function dims(preset: SizePreset, which: 'default' | 'mobile') {
  return which === 'default' ? { width: preset.widthD, height: preset.heightD } : { width: preset.widthM, height: preset.heightM };
}

// original truncates the crop fraction to 2 decimals before multiplying
function trunc2(n: number): number {
  const m = n.toString().match(/^-?\d+(?:\.\d{0,2})?/);
  return m ? parseFloat(m[0]) : n;
}

export function extractParam(image: ImageRef, which: 'default' | 'mobile'): string | undefined {
  const c = image.crop[which];
  if (c.x === 0 && c.y === 0 && c.width === 1 && c.height === 1) return undefined;
  return [
    Math.round(c.x * image.width), Math.round(c.y * image.height),
    Math.round(trunc2(c.width) * image.width), Math.round(trunc2(c.height) * image.height),
  ].join('_');
}

// Deterministic static path for a (source, crop) pair: same directory as the
// original, same extension, suffixed with which+extract. scripts/gen-image-crops.ts
// writes files at exactly this path — this function and the script must never
// drift apart, which is why both live in this repo (not one computed, one hardcoded).
export function staticSrc(image: ImageRef, which: 'default' | 'mobile'): string {
  if (image.mime === 'image/svg+xml') return image.src;
  const extract = extractParam(image, which);
  if (!extract) return image.src; // identity crop: the original file already is the answer
  const dot = image.src.lastIndexOf('.');
  return `${image.src.slice(0, dot)}__${which}-${extract}${image.src.slice(dot)}`;
}

export function aspectRatios(image: ImageRef, preset: SizePreset): [number, number] {
  const ratio = (which: 'default' | 'mobile') => {
    const { width, height } = dims(preset, which);
    if (width && height) return width / height;
    const c = image.crop[which];
    return (image.width * c.width) / (image.height * c.height);
  };
  return [ratio('default'), ratio('mobile')];
}

// The width/height next/image's own optimizer needs: the preset override when
// given, otherwise the natural aspect ratio at a base render size (1920 desktop,
// 360 mobile — the original's own Img.vue render widths). next/image's `sizes`
// prop handles picking a smaller device size for narrower viewports from there;
// there is no need to enumerate breakpoints by hand any more.
export function renderSize(image: ImageRef, preset: SizePreset, which: 'default' | 'mobile'): { width: number; height: number } {
  const { width, height } = dims(preset, which);
  if (width && height) return { width, height };
  const base = which === 'default' ? 1920 : 360;
  const ar = aspectRatios(image, preset)[which === 'default' ? 0 : 1];
  return { width: base, height: Math.round(base / ar) };
}
```

This deletes `SourceSpec`, `CONFIGS`, `buildSources`, and `imgUrl` entirely — they existed only to build the six-breakpoint `/i?...` query strings the runtime route consumed; `next/image`'s own optimizer replaces that.

- [ ] **Step 2: Write the offline crop-generation script**

```ts
// scripts/gen-image-crops.ts
// One-time offline pass — never runs as part of the deployed app. Reads every
// image reference on the homepage, crops the ones with a non-identity crop
// rectangle using sharp, and writes the result at the exact path
// lib/images.ts's staticSrc() computes. Run manually after any content change
// that adds a new image or crop:
//   npx tsx scripts/gen-image-crops.ts
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { home } from '../content/en/home';
import { extractParam, staticSrc } from '../lib/images';
import type { ImageRef, Section } from '../lib/content';

const PUBLIC = path.resolve(__dirname, '..', 'public');

function isImageRef(v: unknown): v is ImageRef {
  return !!v && typeof v === 'object' && typeof (v as Record<string, unknown>).src === 'string'
    && typeof (v as Record<string, unknown>).width === 'number' && !!(v as Record<string, unknown>).crop;
}

function collectImages(node: unknown, out: ImageRef[] = []): ImageRef[] {
  if (Array.isArray(node)) { node.forEach((v) => collectImages(v, out)); return out; }
  if (node && typeof node === 'object') {
    if (isImageRef(node)) { out.push(node); return out; }
    Object.values(node as Record<string, unknown>).forEach((v) => collectImages(v, out));
  }
  return out;
}

async function main() {
  const images = collectImages((home.columns.colPos0 as unknown) as Section[]);
  const seen = new Set<string>();
  let written = 0;
  for (const image of images) {
    for (const which of ['default', 'mobile'] as const) {
      const extract = extractParam(image, which);
      if (!extract) continue; // identity crop, nothing to generate
      const outPath = staticSrc(image, which);
      if (seen.has(outPath)) continue;
      seen.add(outPath);
      const [left, top, width, height] = extract.split('_').map(Number);
      const srcFile = path.join(PUBLIC, image.src);
      const outFile = path.join(PUBLIC, outPath);
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await sharp(srcFile).extract({ left, top, width, height }).toFile(outFile);
      written++;
      console.log(`${image.src} [${which}] -> ${outPath}`);
    }
  }
  console.log(`\nWrote ${written} cropped image(s).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 3: Move `sharp` to devDependencies and run the script**

In `package.json`, move `"sharp": "^0.34.5"` from `"dependencies"` to `"devDependencies"`, and add a script entry `"gen:image-crops": "tsx scripts/gen-image-crops.ts"`.

Run: `npm install && npm run gen:image-crops`
Expected: output lines listing each cropped file written, ending with a nonzero "Wrote N cropped image(s)." Spot-check a few: `ls public/images/**/*__default-*.* public/images/**/*__mobile-*.* 2>/dev/null | head -20` should show real files.

- [ ] **Step 4: Rewrite `Picture.tsx`, delete `Picture.css`**

```tsx
'use client';
import { useRef, type CSSProperties } from 'react';
import { getImageProps } from 'next/image';
import type { ImageRef } from '@/lib/content';
import { staticSrc, aspectRatios, renderSize, type SizePreset } from '@/lib/images';
import { gsap, useGSAP } from '@/lib/gsap';

type Props = SizePreset & { image: ImageRef; lazy?: boolean; className?: string };

export function Picture({ image, widthD, heightD, widthM, heightM, lazy = true, className }: Props) {
  const preset: SizePreset = { widthD, heightD, widthM, heightM };
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isSvg = image.mime === 'image/svg+xml';
  const [arD, arM] = aspectRatios(image, preset);

  // Fade the dark overlay out once the image has loaded (original: 0.5s power1.out).
  useGSAP(() => {
    const img = imgRef.current;
    const overlay = overlayRef.current;
    if (!img || !overlay) return;
    const fadeOverlay = () => gsap.to(overlay, { opacity: 0, duration: 0.5, ease: 'power1.out' });
    if (img.complete) fadeOverlay();
    else img.addEventListener('load', fadeOverlay, { once: true });
    return () => img.removeEventListener('load', fadeOverlay);
  }, { dependencies: [image.src] });

  const style = { '--ar-d': String(arD), '--ar-m': String(arM) } as CSSProperties;
  const wrapperClass = ['relative block', className].filter(Boolean).join(' ');
  const imgClass = 'block h-auto w-full [aspect-ratio:var(--ar-d)] max-lg:[aspect-ratio:var(--ar-m)]';
  const overlayClass = 'pointer-events-none absolute inset-0 top-0 left-0 z-[5] h-full w-full bg-ink';

  if (isSvg) {
    return (
      <picture className={wrapperClass} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src={image.src} alt={image.alt ?? ''} title={image.title ?? undefined} loading={lazy ? 'lazy' : undefined} className={imgClass} />
        <div className={overlayClass} ref={overlayRef} />
      </picture>
    );
  }

  const common = { alt: image.alt ?? '', sizes: '100vw', quality: 80 };
  const d = renderSize(image, preset, 'default');
  const m = renderSize(image, preset, 'mobile');
  const { props: mobileProps } = getImageProps({ ...common, src: staticSrc(image, 'mobile'), width: m.width, height: m.height });
  const { props: desktopProps } = getImageProps({ ...common, src: staticSrc(image, 'default'), width: d.width, height: d.height });

  return (
    <picture className={wrapperClass} style={style}>
      <source media="(max-width: 1023px)" srcSet={mobileProps.srcSet} />
      {/* eslint-disable-next-line @next/next/no-img-element -- getImageProps' own art-direction pattern requires a plain <img>, next/image's <Image> can't sit inside a <picture> */}
      <img
        {...desktopProps}
        ref={imgRef}
        title={image.title ?? undefined}
        loading={lazy ? 'lazy' : undefined}
        className={imgClass}
      />
      <div className={overlayClass} ref={overlayRef} />
    </picture>
  );
}
```

```bash
rm components/ui/Picture.css
```

- [ ] **Step 5: Delete the runtime route**

```bash
rm app/i/route.ts
```

- [ ] **Step 6: Rewrite `tests/unit/images.test.ts`**

Read the current file first — it tests the deleted `buildSources`/`imgUrl`/`extractParam` trio. Replace its assertions with the new surface:

```ts
import { describe, it, expect } from 'vitest';
import { staticSrc, aspectRatios, renderSize, extractParam } from '@/lib/images';
import type { ImageRef } from '@/lib/content';

const identityImage: ImageRef = {
  src: '/images/foo/bar.jpg', width: 2000, height: 1000, alt: '', title: null, mime: 'image/jpeg',
  crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
};
const croppedImage: ImageRef = {
  ...identityImage,
  crop: { default: { x: 0.1, y: 0.2, width: 0.5, height: 0.4 }, mobile: { x: 0, y: 0, width: 1, height: 1 } },
};

describe('staticSrc', () => {
  it('returns the original path for an identity crop', () => {
    expect(staticSrc(identityImage, 'default')).toBe('/images/foo/bar.jpg');
  });
  it('returns a deterministic cropped path for a real crop', () => {
    const extract = extractParam(croppedImage, 'default');
    expect(staticSrc(croppedImage, 'default')).toBe(`/images/foo/bar__default-${extract}.jpg`);
  });
  it('returns the original path for an SVG regardless of crop', () => {
    const svg: ImageRef = { ...croppedImage, mime: 'image/svg+xml' };
    expect(staticSrc(svg, 'default')).toBe(svg.src);
  });
});

describe('renderSize', () => {
  it('uses the preset override when given', () => {
    expect(renderSize(identityImage, { widthD: 500, heightD: 400 }, 'default')).toEqual({ width: 500, height: 400 });
  });
  it('falls back to a 1920px-wide desktop render at the natural aspect ratio', () => {
    const [arD] = aspectRatios(identityImage, {});
    expect(renderSize(identityImage, {}, 'default')).toEqual({ width: 1920, height: Math.round(1920 / arD) });
  });
});
```

- [ ] **Step 7: Rewrite `tests/e2e/image-route.spec.ts`**

Read the current file first — it exercises the `/i` route directly (now deleted). Replace it with an assertion against the rendered `<picture>` markup instead — e.g. that a Hero image on the homepage renders a `<source media="(max-width: 1023px)">` and an `<img>` whose `src` is a `/_next/image?...` URL (next/image's own optimizer route), not a bare `/images/...` path and not `/i?...`:

```ts
import { test, expect } from '@playwright/test';

test('Picture renders through next/image, not a custom resize route', async ({ page }) => {
  await page.goto('/');
  const picture = page.locator('.mask_hero .image-big picture').first();
  const img = picture.locator('img');
  await expect(img).toHaveAttribute('src', /\/_next\/image\?/);
  const source = picture.locator('source[media="(max-width: 1023px)"]');
  await expect(source).toHaveAttribute('srcset', /.+/);
});
```

- [ ] **Step 8: Run everything**

Run: `npm run typecheck && npm test && npm run build`, then `npm run dev &`, `npm run test:e2e`, stop dev server.
Expected: zero errors/failures. Load `/` in a browser (or via `curl -s localhost:3000/ | grep -o 'srcset="[^"]*"' | head -3`) and confirm images render (no broken-image icons — a broken cropped path would show as a 404 image).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: replace the runtime /i crop route with offline-cropped static images

Phase 1b (spec §16.2, §16.7(a)): the original site's own _ipx module is a
framework-native on-demand resize service — the only thing it does that
next/image can't is arbitrary-rectangle cropping. So: crop once, offline
(scripts/gen-image-crops.ts), commit the results, and let next/image handle
resize/format/lazy-load from there, same shape as the original. Deletes
app/i/route.ts and the sharp runtime dependency (sharp moves to devDependencies,
used only by the offline script)."
```

---

### Task 4: Hand-write the homepage content file

Satisfies spec §16.2's Content bullet. Per Global Constraints, this task changes *authorship and formatting*, not the `Section`/`PageContent` type shape — every field name, nesting level, and value stays identical; only the `\r\n`-riddled generated-JSON formatting becomes hand-maintainable TypeScript, and the flat array gets named per-section exports so Task 5 can import sections directly instead of indexing into an array.

**Files:**
- Modify: `content/en/home.ts` (full rewrite, same values)

**Interfaces:**
- Produces: named exports `hero`, `originsText`, `originsVideo`, `pressQuote`, `roomSlider`, `roomNatureText`, `spaText`, `spaImage`, `timelessBreak`, `mountainText`, `mountainImage`, `culinaryText`, `culinaryImage`, `teaserSlider`, `partnerMarquee` (one per homepage section, in page order — exact titles verified against the current file's actual copy), plus the existing aggregate `home: PageContent` (unchanged consumers: `lib/pages.ts`, `tests/unit/*`).

- [ ] **Step 1: Read the current generated file in full**

`content/en/home.ts` is 2382 lines. Read it end to end — every field of every one of the 15 sections (in order: hero, imgtext, video, quote, roomslider, imgtext, imgtext, img, break, imgtext, img, imgtext, img, teaserslider, partnermarquee) needs to survive the rewrite with byte-identical string content (text, alt text, hrefs, ids, crop fractions — everything).

- [ ] **Step 2: Rewrite as named per-section constants**

Structure (illustrative skeleton — every field must carry over from the read in Step 1, not be re-typed from memory):

```ts
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
    title: 'the Zugspitze peak rises dramatically<br>\nover Alpine pastures<br>\n',
    titleh2: 'Rooted <br>\nin its <br>\norigins',
    titleimg: 'The first steps in fresh powder snow,<br>\nthe head touches the sky',
    text: '<p>...</p>', // full text carried over verbatim from the read in Step 1
    img: [ /* ImageRef objects, verbatim */ ],
    sideimg: [ /* ... */ ],
    imgsummer: [], sideimgsummer: [],
  },
};

export const originsText: ImgTextSection = { id: /* ... */, type: 'mask_imgtext', appearance: { /* ... */ }, content: { /* ... */ } };
export const originsVideo: VideoSection = { /* ... */ };
export const pressQuote: QuoteSection = { /* ... */ };
export const roomSlider: RoomSliderSection = { /* ... */ };
export const roomNatureText: ImgTextSection = { /* ... */ }; // 2nd imgtext, "Nature infuses the room"
export const spaText: ImgTextSection = { /* ... */ };        // 3rd imgtext, "The sound of nature echoes on skin"
export const spaImage: ImgSection = { /* ... */ };
export const timelessBreak: BreakSection = { /* ... */ };     // "Touch what time has left untouched"
export const mountainText: ImgTextSection = { /* ... */ };    // 4th imgtext, "The natural power of the mountain"
export const mountainImage: ImgSection = { /* ... */ };
export const culinaryText: ImgTextSection = { /* ... */ };    // 5th imgtext, "The flavour of mountain origins"
export const culinaryImage: ImgSection = { /* ... */ };
export const teaserSlider: TeaserSliderSection = { /* ... */ };
export const partnerMarquee: PartnerMarqueeSection = { /* ... */ }; // "Recommended by"

export const home: PageContent = {
  id: 1,
  slug: '/',
  backendLayout: 'defaultLayout',
  meta: { /* verbatim from the current file's "meta" block */ },
  columns: {
    colPos0: [
      hero, originsText, originsVideo, pressQuote, roomSlider, roomNatureText, spaText,
      spaImage, timelessBreak, mountainText, mountainImage, culinaryText, culinaryImage,
      teaserSlider, partnerMarquee,
    ],
  },
};
```

Replace every literal `\r\n` inside string values with a real newline in a template literal (or leave `\n` where the original data legitimately needs a line-break-then-`<br>` sequence — check `SplitWords.tsx`'s `stripBreakWhitespace` comment, which documents that `\r\n` after `<br>` is meaningful source formatting, not an artifact to strip at authoring time). Delete the `// GENERATED by scripts/gen-content.ts...` header comment.

- [ ] **Step 3: Add a value-equality regression test**

Before this task, capture the current `home` object as a fixture (from git history, since this task overwrites the file):

```bash
git show HEAD:content/en/home.ts > /tmp/home-before.ts
```

Add a temporary test (delete it after Step 4 passes — it's a one-time migration check, not a permanent test):

```ts
// tests/unit/_migration-content-equality.test.ts (temporary — delete after this task's Step 4)
import { describe, it, expect } from 'vitest';
import { home } from '@/content/en/home';
// @ts-expect-error -- /tmp is outside the project; this import only exists during the migration
import { home as before } from '/tmp/home-before';

describe('content rewrite preserves every value', () => {
  it('produces a deep-equal PageContent to the pre-rewrite generated file', () => {
    expect(home).toEqual(before);
  });
});
```

(If Vitest can't resolve a `/tmp` import path, instead run `node -e "console.log(JSON.stringify(require('/tmp/home-before').home) === JSON.stringify(require('./content/en/home').home))"` via `tsx`, or diff the two files' `JSON.stringify` output directly — the point is a mechanical proof of value equality, not a specific tool.)

- [ ] **Step 4: Run the equality check, then the full suite**

Run: `npm test -- _migration-content-equality`
Expected: PASS. Any FAIL means a value was dropped or altered during the rewrite — fix it before proceeding, don't adjust the test.

Delete the temporary test file, then run: `npm run typecheck && npm test && npm run build`
Expected: zero errors (the deleted temporary test is expected to be gone from the count).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: hand-write the homepage content file

Phase 1b (spec §16.2): content/en/home.ts was machine-generated JSON-shaped
output (raw \\r\\n, id/uid noise) — unreadable to a new developer. Rewritten
by hand as named per-section constants (hero, originsText, ... partnerMarquee)
with every value carried over verbatim (proven via a one-time equality check
against the pre-rewrite file). Same PageContent/Section type shape — Task 5
imports these names directly instead of indexing into a flat array."
```

---

### Task 5: Direct composition — delete `SectionRenderer` and `Mask`

Satisfies spec §16.4's core architecture change (the dispatch/wrapper removal half; Tailwind conversion is Tasks 7–13). Each section component currently wraps its root in `<Mask type="..." uid={...} appearance={...}>`, which renders `<div class="{layout} space-before-{X} mask mask_{type}" uid="c{id}">`. This task makes each component render that same root element itself, directly, and deletes the generic wrapper.

**Files:**
- Modify: `components/sections/Hero.tsx`, `ImgText.tsx`, `Img.tsx`, `Video.tsx`, `Quote.tsx`, `Break.tsx`, `RoomSlider.tsx`, `TeaserSlider.tsx`, `PartnerMarquee.tsx`
- Modify: `app/page.tsx`
- Delete: `components/sections/SectionRenderer.tsx`, `components/sections/Mask.tsx`
- Delete: `tests/unit/section-renderer.test.tsx` (asserts `SectionRenderer` behaviour directly — no longer applicable; its "every section renders with its mask class" assertion is superseded by this task's own test in Step 3)

**Interfaces:**
- Consumes: the named exports from Task 4 (`hero`, `originsText`, ... `partnerMarquee`).
- Produces: each section component now renders its own `<div className="{layout} space-before-{X} mask mask_{type}" uid={...}>` root inline (className strings unchanged — this task doesn't touch CSS class names, only removes the `Mask` indirection producing them).

- [ ] **Step 1: Inline `Mask`'s className logic into each section component**

Worked example, `Hero.tsx` (apply the identical pattern to the other eight):

```tsx
'use client';
import { useRef } from 'react';
import type { HeroSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { RichText } from '@/components/ui/RichText';
import { useParallax } from '@/components/ui/useParallax';
import { useIsWinter } from '@/lib/season';
import './Hero.css';

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

  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_hero', `hero-${c.herolayout}`]
    .filter(Boolean).join(' ');

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
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
    </div>
  );
}
```

Note what changed from the original: the `Mask` import and `<Mask>` wrapper are gone; the `cls`/`uid` computation `Mask` used to do is now a two-line inline block at the top of the component, using the exact same class-name formula (`{layout} space-before-{spaceBefore} mask mask_{type} {className}`) so the rendered DOM — and every CSS selector targeting it — is byte-identical to before.

Apply the same pattern to the other eight components. Each one's `className` computation differs only in its `type` string (`imgtext`, `img`, `video`, `quote`, `break`, `roomslider`, `teaserslider`, `partnermarquee`) and whether it previously passed an extra `className` to `Mask` (`Img.tsx` and `Video.tsx` passed `className="grid-container"` — fold that into the same `cls` array instead of a separate prop).

- [ ] **Step 2: Compose directly in `app/page.tsx`**

```tsx
import type { Metadata } from 'next';
import {
  hero, originsText, originsVideo, pressQuote, roomSlider, roomNatureText, spaText,
  spaImage, timelessBreak, mountainText, mountainImage, culinaryText, culinaryImage,
  teaserSlider, partnerMarquee, home,
} from '@/content/en/home';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { Hero } from '@/components/sections/Hero';
import { ImgText } from '@/components/sections/ImgText';
import { Video } from '@/components/sections/Video';
import { Quote } from '@/components/sections/Quote';
import { RoomSlider } from '@/components/sections/RoomSlider';
import { Img } from '@/components/sections/Img';
import { Break } from '@/components/sections/Break';
import { TeaserSlider } from '@/components/sections/TeaserSlider';
import { PartnerMarquee } from '@/components/sections/PartnerMarquee';

export const metadata: Metadata = metadataFor(home);

export default function HomePage() {
  return (
    <main>
      <BodyClass pageId={home.id} layout="layout-0" />
      <Hero section={hero} />
      <ImgText section={originsText} />
      <Video section={originsVideo} />
      <Quote section={pressQuote} />
      <RoomSlider section={roomSlider} />
      <ImgText section={roomNatureText} />
      <ImgText section={spaText} />
      <Img section={spaImage} />
      <Break section={timelessBreak} />
      <ImgText section={mountainText} />
      <Img section={mountainImage} />
      <ImgText section={culinaryText} />
      <Img section={culinaryImage} />
      <TeaserSlider section={teaserSlider} />
      <PartnerMarquee section={partnerMarquee} />
    </main>
  );
}
```

- [ ] **Step 3: Delete `SectionRenderer`, `Mask`, and their test; add a page-composition test in its place**

```bash
rm components/sections/SectionRenderer.tsx components/sections/Mask.tsx tests/unit/section-renderer.test.tsx
```

```ts
// tests/unit/homepage-composition.test.tsx — replaces section-renderer.test.tsx's
// "every section renders with its mask class" assertion, now against app/page.tsx directly.
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import HomePage from '@/app/page';

vi.mock('@/lib/gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn(), timeline: vi.fn(() => ({ to: vi.fn() })) },
  SplitText: { create: vi.fn(() => ({ words: [], revert: vi.fn() })) },
  ScrollTrigger: { refresh: vi.fn() },
  ScrollSmoother: { create: vi.fn() },
  useGSAP: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }));

describe('HomePage', () => {
  it('renders all 15 sections in the spec §4 order with their mask classes', () => {
    const { container } = render(<HomePage />);
    const classes = Array.from(container.querySelectorAll(':scope > main > .mask')).map(
      (el) => Array.from(el.classList).find((c) => c.startsWith('mask_')),
    );
    expect(classes).toEqual([
      'mask_hero', 'mask_imgtext', 'mask_video', 'mask_quote', 'mask_roomslider',
      'mask_imgtext', 'mask_imgtext', 'mask_img', 'mask_break', 'mask_imgtext',
      'mask_img', 'mask_imgtext', 'mask_img', 'mask_teaserslider', 'mask_partnermarquee',
    ]);
  });
});
```

(Adjust the `:scope > main > .mask` selector if `render()`'s output nesting differs — the point is asserting the 15-section order and mask-class sequence exactly as `SectionRenderer`'s old test did, just against the new composition root.)

- [ ] **Step 4: Run everything**

Run: `npm run typecheck && npm test && npm run build`, then `npm run dev &`, `npm run test:e2e`, stop dev server.
Expected: zero errors. Manually diff a full-page screenshot of `/` against a screenshot taken just before this task (same viewport) — should be pixel-identical (this task changes no CSS, only where the wrapper markup is generated from).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: delete SectionRenderer and Mask, compose the homepage directly

Phase 1b (spec §16.4): app/page.tsx now imports and renders each section
component explicitly, in order, with explicit typed props — no generic
type-union dispatch, no shared wrapper component. Each section computes its
own mask/space-before classes inline (identical formula to the deleted Mask
component, so the rendered DOM and every CSS selector targeting it are
unchanged)."
```

---

### Task 6: Add the `--color-canvas` Tailwind token

Satisfies the token half of spec §16.3, ahead of the Tailwind conversion tasks that consume it.

**Files:**
- Modify: `styles/globals.css`

**Interfaces:**
- Produces: `bg-canvas`/`text-canvas`/etc. Tailwind utilities resolving to `#F2F1EF`, alongside the existing `--color-ink` (`#211d1d`) and `--color-beige` (`#e4e0db`, kept — still used for every border/line).

- [ ] **Step 1: Add the token**

In `styles/globals.css`:
```css
@theme {
  --color-ink: #211d1d;
  --color-beige: #e4e0db;
  --color-canvas: #F2F1EF;
  --font-sans: karol-sans, sans-serif;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: zero errors (an unused `@theme` token is not a build error — Tailwind v4 only emits utilities that are actually referenced in class names found by its scanner, so `bg-canvas` won't appear in output CSS until a later task uses it; that's expected and fine).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: add the --color-canvas Tailwind token (#F2F1EF)

Phase 1b (spec §16.3): the flat background colour change, consumed by the
Header/Break/PartnerMarquee Tailwind-conversion tasks that follow."
```

---

### Task 7: Tailwind conversion — Hero (worked example)

Satisfies spec §16.4 for `Hero.tsx`/`Hero.css`. This is the fully-worked example the Tailwind Conversion Protocol (above) refers back to — every other conversion task applies this exact method to its own file.

**Files:**
- Modify: `components/sections/Hero.tsx`
- Delete: `components/sections/Hero.css`

**Interfaces:** none new — same `{ section: HeroSection }` props as after Task 5.

- [ ] **Step 1: Capture a "before" screenshot baseline**

```bash
npm run dev &
sleep 3
npx playwright screenshot --viewport-size=1920,951 http://localhost:3000/ /tmp/hero-before-1920.png
npx playwright screenshot --viewport-size=390,844 http://localhost:3000/ /tmp/hero-before-390.png
kill %1
```

- [ ] **Step 2: Write the Playwright snapshot test (fails until Step 3 is done correctly — it's currently trivially true since nothing changed yet, so this step is really "establish the baseline snapshot")**

```ts
// tests/e2e/hero-visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Hero visual regression', () => {
  for (const viewport of [{ width: 1920, height: 951 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`matches at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await expect(page.locator('.mask_hero')).toHaveScreenshot(`hero-${viewport.width}.png`, { maxDiffPixels: 50 });
    });
  }
});
```

Run: `npm run dev &`, `npx playwright test tests/e2e/hero-visual.spec.ts --update-snapshots`, stop dev server. This creates the baseline snapshot files under `tests/e2e/hero-visual.spec.ts-snapshots/` — commit them as part of this task; they're what every future run compares against.

- [ ] **Step 3: Convert `Hero.css` to Tailwind utilities in `Hero.tsx`**

Reading `Hero.css` top to bottom and applying the Protocol's rules:

```tsx
'use client';
import { useRef } from 'react';
import type { HeroSection } from '@/lib/content';
import { Picture } from '@/components/ui/Picture';
import { SplitWords } from '@/components/ui/SplitWords';
import { RichText } from '@/components/ui/RichText';
import { useParallax } from '@/components/ui/useParallax';
import { useIsWinter } from '@/lib/season';

export function Hero({ section }: { section: HeroSection }) {
  const c = section.content;
  const winter = useIsWinter();
  const onlyText = c.herolayout === 'only-text';
  const layout = c.herolayout;
  const big = !winter && c.imgsummer.length ? c.imgsummer : c.img;
  const small = !winter && c.sideimgsummer.length ? c.sideimgsummer : c.sideimg;
  const bigRef = useRef<HTMLDivElement>(null);
  const smallRef = useRef<HTMLDivElement>(null);
  useParallax(bigRef, 1.15);
  useParallax(smallRef, 1.5);

  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_hero', `hero-${layout}`]
    .filter(Boolean).join(' ');

  // padding-top: rule 1 (.space-before-.), overridden per layout by rules 46/61
  // (hero-subpage) below it in source order — CSS cascade means the LAST rule
  // wins, so subpage's 61.1rem (not 50rem) is what actually applies; mobile
  // (max-width:1023px) always uses 22.5rem regardless of layout except
  // hero-subpage (24.4rem) and hero-only-text (24.4rem, "scpae-before-" typo
  // in the original never matched anything — dead rule, correctly omitted here).
  const paddingTop =
    layout === 'default' ? 'pt-[43rem] max-lg:pt-[22.5rem]'
    : layout === 'subpage' ? 'pt-[61.1rem] max-lg:pt-[24.4rem]'
    : 'max-lg:pt-[24.4rem]'; // only-text has no explicit desktop padding-top rule in Hero.css

  const imageWrapperCls = onlyText
    ? 'grid h-fit [grid-column:9/span_4] [grid-row-start:1] gap-x-[var(--grid-gap)] grid-cols-4 max-lg:[grid-column:2/span_12] max-lg:[grid-row-start:2]'
    : 'grid [grid-column:6/span_8] [grid-row-start:1] gap-x-[var(--grid-gap)] grid-cols-8 max-lg:[grid-column:2/span_12] max-lg:[grid-row-start:1]';

  const titleCls = onlyText
    ? '[grid-column:1/span_3] max-lg:[grid-column:1/span_12] max-lg:mt-[6rem]'
    : 'flex items-end h-fit pb-[14rem] [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 origin-center [grid-column:1/span_1] max-lg:[grid-column:12/span_1] max-lg:h-fit max-lg:pb-0 max-lg:pt-[12rem]';

  const titleimgCls = '[grid-column:9/span_5] pt-[6rem] max-lg:[grid-column:8/span_6] max-lg:[grid-row-start:2] max-lg:pt-[1.5rem]';

  const titleh2Cls =
    layout === 'default'
      ? 'self-center [grid-column:2/span_4] [grid-row-start:1] max-lg:self-end max-lg:text-[6.5rem] max-lg:font-light max-lg:[grid-column:2/span_10] max-lg:tracking-normal max-lg:leading-[88%] max-lg:mb-[calc(92%+2rem)]'
      : layout === 'subpage'
      ? '[grid-column:2/span_4] [grid-row-start:2] mt-[-18rem] max-lg:self-end max-lg:[grid-column:2/span_10] max-lg:row-[2/span_1] max-lg:mb-[calc(92%+2rem)] max-lg:mt-[9rem]'
      : 'self-center [grid-column:2/span_4] [grid-row-start:1] max-lg:self-center max-lg:[grid-column:2/span_12]';

  const imageSmallCls =
    layout === 'default'
      ? '[grid-column:3/span_2] [grid-row-start:2] mt-[-3.5rem] max-lg:[grid-column:4/span_5] max-lg:[grid-row-start:3] max-lg:mt-[4.5rem]'
      : '[grid-column:3/span_2] [grid-row-start:1] mt-[-6rem] max-lg:[grid-column:4/span_6] max-lg:row-[1/span_1] max-lg:mb-0 max-lg:mt-[4.5rem]';

  const textCls = '[grid-column:1/span_4] ml-[9rem] mt-[3rem] max-lg:[grid-column:1/span_12] max-lg:ml-[5.8rem] max-lg:mt-[1.5rem]';

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className={`grid-container ${paddingTop}`}>
        <div className={imageWrapperCls}>
          {c.title ? <h1 className={titleCls} dangerouslySetInnerHTML={{ __html: c.title }} /> : null}
          {c.text && onlyText ? <RichText className={textCls} html={c.text} /> : null}
          {!onlyText && big.map((img, i) => (
            <div className="[grid-column:2/span_7] max-lg:[grid-column:1/span_12] max-lg:self-end" key={i} ref={i === 0 ? bigRef : undefined}>
              <Picture image={img} widthD={1014} heightD={780} widthM={340} heightM={260} lazy={false} />
            </div>
          ))}
        </div>
        {c.titleimg && layout === 'default' ? <p className={`h1 ${titleimgCls}`} dangerouslySetInnerHTML={{ __html: c.titleimg }} /> : null}
        {c.titleh2 ? <SplitWords as="h2" className={titleh2Cls} html={c.titleh2} /> : null}
        {!onlyText && small.map((img, i) => (
          <div className={imageSmallCls} key={i} ref={i === 0 ? smallRef : undefined}>
            <Picture image={img} widthD={272} heightD={360} widthM={136} heightM={180} lazy={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

Note two things this worked example demonstrates for every later task: (a) where the original CSS has a **cascade conflict** (Hero.css's two `.hero-subpage.space-before-` rules at lines 46 and 61 — the second silently wins in the browser), resolve it explicitly in the JSX and leave a comment explaining which value wins and why, don't transcribe both rules; (b) a genuinely **dead rule** (line 147's `.scpae-before-` — a typo that never matches the real `.space-before-` class) is *not* carried forward — converting it faithfully would mean converting a bug, which contradicts "1:1 with the live site" (the live site never applied that rule either, typo and all).

- [ ] **Step 4: Delete `Hero.css`, remove its import**

```bash
rm components/sections/Hero.css
```
(The `import './Hero.css'` line is already gone from the Step 3 rewrite above.)

- [ ] **Step 5: Run the visual regression test and the full suite**

Run: `npm run dev &`, `npx playwright test tests/e2e/hero-visual.spec.ts`, stop dev server.
Expected: PASS (0 diff pixels, or within the `maxDiffPixels: 50` anti-aliasing tolerance) against the Step 2 baseline.

Run: `npm run typecheck && npm test && npm run build`
Expected: zero errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: convert Hero to Tailwind utility classes

Phase 1b (spec §16.4): Hero.css's every rule is now a Tailwind arbitrary-value
utility on the JSX element it applied to, using the CSS file's exact numbers.
Two cascade conflicts in the original (duplicate .hero-subpage.space-before-
rules; a dead .scpae-before- typo) are resolved/dropped explicitly rather than
transcribed, matching what the browser actually applied. Visual output
verified pixel-identical via a new Playwright screenshot snapshot test."
```

---

### Task 8: Tailwind conversion — Header, Logo, Menu

Satisfies spec §16.4 for `Header.css` (377 lines, the largest and hardest conversion — the cross-sibling hover cascade the Protocol calls out) and §16.3's two Header colour sites (menu panel background, mobile SVG blob).

**Files:**
- Modify: `components/layout/Header.tsx`, `components/layout/Logo.tsx`, `components/layout/MenuButton.tsx`, `components/layout/MenuPanel.tsx`
- Delete: `components/layout/Header.css`
- Modify/Create: the mobile header's beige SVG blob background image (currently a data-URI in `Header.css` with `fill='%23E4E0DB'`)

**Interfaces:** none new — same component signatures as before.

- [ ] **Step 1: Baseline snapshot + Playwright test**

Same pattern as Task 7 Step 1–2, scoped to `header`: viewports 1920×951 (scrolled and unscrolled — scroll the page 200px before the scrolled screenshot), 1440×900, 390×844 (menu closed and open — click the menu button before the open screenshot). Save as `tests/e2e/header-visual.spec.ts` with `--update-snapshots` run before converting, so the baseline reflects the *current* (pre-conversion) rendering.

- [ ] **Step 2: Convert the cross-sibling hover cascade with `group`**

`Header.css` lines 89–100 (`.nav-main:not(:hover).fadeOut .level-0 a { opacity:.6 }`, `.router-link-active { opacity:1 }`, `.nav-main:hover .level-0 a { opacity:.6 }`, `.nav-main:hover .level-0:hover a { opacity:1 }`) implement: every nav link dims to `.6` opacity except the one currently hovered (or, when nothing is hovered and `.fadeOut` is set — off the home page — except the active route). This needs the nav's root element to carry `group`, and the *link* itself needs its own hover state to win over the group's:

```tsx
// In MenuPanel.tsx's nav-main render (read the current file first — this shows the
// className changes on the existing map, not a full rewrite):
<nav className="group/nav [min-height:calc(100%-4.5rem)]">
  {items.map((item) => (
    <div key={item.uid} className="level-0">
      <a
        href={item.link}
        className={[
          'block transition-opacity',
          isActive(item) ? 'opacity-100' : 'opacity-100 group-hover/nav:opacity-60 hover:!opacity-100',
        ].join(' ')}
      >
        {item.title}
      </a>
    </div>
  ))}
</nav>
```

The key trick: `group-hover/nav:opacity-60` dims every link once the group (`nav`) is hovered at all, and the per-link `hover:!opacity-100` (with `!` to win the specificity fight against the group variant, matching how `:hover` naturally overrides `:not(:hover)` in the original CSS's cascade) restores the one actually under the cursor to full opacity. The active-route link additionally never dims at all (`isActive(item) ? 'opacity-100' : ...`), reproducing `.router-link-active { opacity:1 }` — check `MenuPanel.tsx`'s existing active-link logic (it already knows the current route from `Header.tsx`'s `pathname`/`isHome` props) rather than re-deriving it.

- [ ] **Step 3: Convert the mobile SVG blob background**

`Header.css` line 252's data-URI has `fill='%23E4E0DB'` baked in — a plain Tailwind colour utility can't reach inside an embedded SVG's own fill attribute. Regenerate the same SVG shape with `fill='%23F2F1EF'` (the new canvas colour, per spec §16.3) and either inline it as a new data-URI in a `max-lg:bg-[url('data:image/svg+xml;...')]` arbitrary-value utility, or (cleaner, since it's static) save it as `public/images/header-mobile-blob.svg` and use `max-lg:bg-[url('/images/header-mobile-blob.svg')]`. The rest of that rule (`background-position:100% 100%`, `background-repeat:no-repeat`, `background-size:cover`) converts directly: `max-lg:bg-[100%_100%] max-lg:bg-no-repeat max-lg:bg-cover`.

- [ ] **Step 4: Convert the menu panel background colour**

`Header.css` line 102's `header .menu { background-color:#e4e0db; ... }` becomes `bg-canvas` (the Task 6 token) on the menu panel element in `MenuPanel.tsx`, per spec §16.3 — not `bg-[#e4e0db]` and not left unconverted.

- [ ] **Step 5: Convert the rest of `Header.css` mechanically**

Every remaining rule (positioning, sizing, the `.menu-bg`/`.menu-outline`/`.logo`/`.nav-info`/`.nav-lang`/`.sub` blocks, both desktop and the `max-width:1023px` block) follows the Protocol directly — arbitrary-value utilities with the file's exact numbers, `max-lg:` for the mobile block. `header a { color:#211d1d; text-decoration:none }` becomes `text-ink no-underline` (using the existing `--color-ink` token) on every anchor `Header.tsx`/`MenuPanel.tsx`/`Logo.tsx` render. `header .logo svg { width:56.7rem }` / mobile `width:100%` on `LogoIcon`'s wrapping element, etc. — apply to `Logo.tsx` and `MenuButton.tsx` too, since their SVG sizing rules (`header .menu-wrapper svg { height:2.9rem; width:5.5rem }`) live in `Header.css` but style elements those components render.

Check `Header.css` for every selector before deleting it (per the Protocol's Step 5 coverage check) — this file has three components' worth of rules mixed together (`Header.tsx`, `Logo.tsx`, `MenuButton.tsx`/`MenuPanel.tsx`), so the coverage check must span all four `.tsx` files, not just one.

- [ ] **Step 6: Delete `Header.css`**

```bash
rm components/layout/Header.css
```

- [ ] **Step 7: Run the visual regression test and the full suite**

Run: `npm run dev &`, `npx playwright test tests/e2e/header-visual.spec.ts tests/e2e/header.spec.ts tests/e2e/globals.spec.ts`, stop dev server.
Expected: PASS — both the new visual snapshots and the existing behavioural e2e tests (menu open/close, scrolled state) still pass unmodified, proving the `group`/`peer` restructuring didn't change behaviour, only how it's styled.

Run: `npm run typecheck && npm test && npm run build`
Expected: zero errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: convert Header/Logo/Menu to Tailwind utility classes

Phase 1b (spec §16.4, §16.3): Header.css's 377 lines become Tailwind
utilities across Header.tsx/Logo.tsx/MenuButton.tsx/MenuPanel.tsx. The
cross-sibling nav-link hover cascade (dim every link except the hovered one)
is restructured with group/group-hover since Tailwind has no direct
equivalent to a bare :hover-on-a-different-element selector. The menu panel
background and the mobile header's SVG blob background both move from
#e4e0db to the canvas token (#F2F1EF)."
```

---

### Task 9: Tailwind conversion — Footer

Satisfies spec §16.4 for `Footer.css` (239 lines).

**Files:**
- Modify: `components/layout/Footer.tsx`
- Delete: `components/layout/Footer.css`

**Interfaces:** none new.

- [ ] **Step 1: Baseline snapshot + Playwright test** — same pattern as Task 7 Step 1–2, scoped to `footer`, three viewports.

- [ ] **Step 2: Read `Footer.css` in full and convert per the Protocol**

`Footer.tsx` (already read in full above) renders two `grid-container-inner` rows (`upper-footer`: email/social/address/partner, `lower-footer`: nav/logo/SLH badge/language/privacy/unikateur). Convert every declaration in `Footer.css` — grid column placement for each of the eight named blocks, the `border-top:2px solid #e4e0db` on both rows (stays beige — a border, not a fill, per Global Constraints), `margin-top:19rem` on the footer element itself, link underline/hover rules (`text-decoration-color:transparent`, hover `#211d1d` — use `text-ink` and the existing underline-on-hover pattern already established for `main a` elsewhere in the codebase, check `styles/links.css` for the exact existing Tailwind-adjacent convention before inventing a new one), and the `.footer-bottom-right`/`.unikateur-signet` positioning. Apply `bg-canvas` only if any Footer background (not border) uses `#e4e0db` — check for one; if none exists (the footer is transparent over the page's own `#F2F1EF` body background), no colour change is needed here beyond what Task 6/others already cover.

- [ ] **Step 3: Delete `Footer.css`**

```bash
rm components/layout/Footer.css
```

- [ ] **Step 4: Run the visual regression test and the full suite**

Run: `npm run dev &`, `npx playwright test tests/e2e/footer-logo.spec.ts` plus the new footer-visual spec, stop dev server.
Run: `npm run typecheck && npm test && npm run build`
Expected: zero errors/failures.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: convert Footer to Tailwind utility classes

Phase 1b (spec §16.4): Footer.css's 239 lines become Tailwind utilities
directly in Footer.tsx's JSX."
```

---

### Task 10: Tailwind conversion — ImgText, Img, Video, Quote

Satisfies spec §16.4 for these four files' CSS (60 + 8 + 13 + 58 = 139 lines total — the simplest group, all pure grid-placement + typography, no hover cascades, no backgrounds).

**Files:**
- Modify: `components/sections/ImgText.tsx`, `Img.tsx`, `Video.tsx`, `Quote.tsx`
- Delete: `components/sections/ImgText.css`, `Img.css`, `Video.css`, `Quote.css`

**Interfaces:** none new.

- [ ] **Step 1: Baseline snapshots + Playwright tests** for all four sections (they already appear on the homepage in Task 5's composition, at `.mask_imgtext` ×5, `.mask_img` ×3, `.mask_video`, `.mask_quote` — target each by its section's `id` via `nth-of-type` or a `data-testid` if needed to disambiguate the five `.mask_imgtext` instances; simplest: scope the Playwright locator to the *first* section instance of each type, since the conversion is per-file not per-instance and all five `.mask_imgtext` sections share the same CSS rules).

- [ ] **Step 2: Convert each file per the Protocol**

`Img.css` (8 lines) and `Video.css` (13 lines) are trivial: `Img.css`'s `.image { grid-column:1/span_14 }` → `[grid-column:1/span_14]` on `Img.tsx`'s `<div className="image">`; `Video.css`'s `video { aspect-ratio:16/9; grid-column:2/span_12; width:100% }` + mobile `aspect-ratio:16/10; object-fit:cover` → `aspect-[16/9] [grid-column:2/span_12] w-full max-lg:aspect-[16/10] max-lg:object-cover` on the `<video>` element in `Video.tsx`'s `Player` component.

`ImgText.css` (60 lines): `.image-left`/`.image-right`/`.content` grid placement (note the shared `grid-column-end:span 4` on lines 12–14 covering *both* `.content` and `.image-right` — apply `[grid-column-end:span_4]` to both elements, or more idiomatically `col-span-4` since it's a plain integer span with no arbitrary start offset conflict), `.title { margin-bottom:3rem }`, `.text { margin-left:9rem }`, `.linkdetail { margin-top:4.5rem }`, plus the full mobile block.

`Quote.css` (58 lines): `.image` grid placement + parallax ref (unchanged, `useParallax` stays in the `.tsx`), `.quote-wrapper { grid-column:6/span_6; margin-top:19.5rem; transform:translate(9rem) }` → `[grid-column:6/span_6] mt-[19.5rem] translate-x-[9rem]`, the nested `.quote` and `.autor` typography rules (font-size/weight/letter-spacing/line-height, both desktop and `max-lg:`).

- [ ] **Step 3: Delete all four CSS files**

```bash
rm components/sections/ImgText.css components/sections/Img.css components/sections/Video.css components/sections/Quote.css
```

- [ ] **Step 4: Run the visual regression tests and the full suite**

Run: `npm run dev &`, run the four new visual specs, stop dev server.
Run: `npm run typecheck && npm test && npm run build`
Expected: zero errors/failures.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: convert ImgText, Img, Video, Quote to Tailwind utility classes

Phase 1b (spec §16.4): the four simplest section components' CSS (139 lines
across four files) become Tailwind utilities directly in their JSX — pure
grid placement and typography, no colour or hover-cascade changes needed."
```

---

### Task 11: Tailwind conversion — Break, PartnerMarquee

Satisfies spec §16.4 for these two files' CSS and spec §16.3's two remaining colour sites (Break's wrapper background, PartnerMarquee's section background) — both already read in full above.

**Files:**
- Modify: `components/sections/Break.tsx`, `PartnerMarquee.tsx`
- Delete: `components/sections/Break.css`, `PartnerMarquee.css`

**Interfaces:** none new.

- [ ] **Step 1: Baseline snapshots + Playwright tests** for `.mask_break` and `.mask_partnermarquee`.

- [ ] **Step 2: Convert `Break.css`, changing its background to `bg-canvas`**

```tsx
// Break.tsx's return, converted:
<div className={cls} {...{ uid: `c${section.id}` }}>
  <div className="break-wrapper grid-container bg-canvas pb-[30rem] max-lg:pb-[4.5rem]">
    {left.map((img, i) => (
      <div className="[grid-column:2/span_4] mt-[-12rem] max-lg:[grid-column:2/span_8] max-lg:[grid-row-start:1] max-lg:mt-[-6rem]" key={i} ref={i === 0 ? leftRef : undefined}>
        <Picture image={img} widthD={570} heightD={510} widthM={223} heightM={180} />
      </div>
    ))}
    {c.title ? (
      <SplitWords
        as="h2"
        className="text-center uppercase text-[12rem] font-light tracking-normal leading-none [grid-column:5/span_6] [grid-row-start:2] mt-[-9rem] max-lg:text-[4.2rem] max-lg:tracking-[.05em] max-lg:leading-[98%] max-lg:[grid-column:2/span_12] max-lg:[grid-row-start:2] max-lg:mt-[6rem] max-lg:mb-[6rem]"
        html={c.title}
        duration={0.2}
      />
    ) : null}
    {right.map((img, i) => (
      <div className="self-end [grid-column:12/span_3] [grid-row-start:2] mb-[-7rem] max-lg:[grid-column:8/span_7] max-lg:[grid-row-start:3] max-lg:mb-0" key={i} ref={i === 0 ? rightRef : undefined}>
        <Picture image={img} widthD={352} heightD={280} widthM={175} heightM={139} />
      </div>
    ))}
  </div>
</div>
```

(`cls` computed the same way as every other Task-5-converted component; note the top-level `.mask_break { margin-top:12rem }` / mobile `9rem` goes on the outer `cls` div, not the `break-wrapper` inner one — check `Break.css` line 1 vs line 4's selectors carefully, they target different elements.) `.text`/`.linkdetail`/`img` rules from the file, unused by the current `Break.tsx` markup (no `.text` or `.linkdetail` element exists in this component today), are genuinely dead — confirm via `grep -n "linkdetail\|className=\"text\"" components/sections/Break.tsx` returning nothing, and skip them (don't invent markup to host an unused rule).

- [ ] **Step 3: Convert `PartnerMarquee.css`, changing its section background to `bg-canvas`**

Key conversions: `.grid-container { background-color:#e4e0db → bg-canvas; padding:21rem 0 → py-[21rem] max-lg:py-[9rem] }`; `.content { grid-column:6/span_7 → [grid-column:6/span_7] max-lg:[grid-column:2/span_11] }`; `.marquee-wrapper { display:flex; grid-column:1/span_14; justify-content:space-between; margin-top:12rem; overflow:hidden; width:100vw }` → `flex [grid-column:1/span_14] justify-between mt-[12rem] max-lg:mt-[3rem] overflow-hidden w-screen`; `.marquee-item { margin-right:calc(var(--grid-gap)*5); max-height:35rem; max-width:35rem; mix-blend-mode:multiply }` (desktop) / mobile `margin-right:calc(var(--grid-gap)*3); max-height:10rem; max-width:20rem` → arbitrary-value utilities using the same `calc()` expressions verbatim (Tailwind arbitrary values accept raw `calc()` strings unchanged: `mr-[calc(var(--grid-gap)*5)]`).

The `.swiper-container { display:none }` (a hidden Swiper kept only for DOM parity, per spec §9.9) and its child rules stay exactly that — `hidden` utility, still rendered, still not visible, matching the original's intent precisely.

The **marquee escape hatch**: `horizontalLoop`'s own scroll-drag mechanics (in `lib/horizontalLoop.ts`, unrelated to `PartnerMarquee.css`) are JS, not CSS — nothing to convert there, they already have nothing to do with the deleted CSS file. Nothing in `PartnerMarquee.css` itself is Tailwind-inexpressible; the "escape hatch" the Protocol mentions for marquees refers to the *gallery*'s `nth-child` patterns (§9.11, not yet built) — PartnerMarquee's own CSS converts fully with no CSS-file holdout needed.

- [ ] **Step 4: Delete both CSS files**

```bash
rm components/sections/Break.css components/sections/PartnerMarquee.css
```

- [ ] **Step 5: Run the visual regression tests and the full suite**

Run: `npm run dev &`, run the two new visual specs plus `tests/e2e/marquee.spec.ts`, stop dev server.
Run: `npm run typecheck && npm test && npm run build`
Expected: zero errors/failures.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: convert Break, PartnerMarquee to Tailwind utility classes

Phase 1b (spec §16.4, §16.3): Break.css and PartnerMarquee.css become
Tailwind utilities in their JSX; both sections' beige fill backgrounds
move to the canvas token (#F2F1EF)."
```

---

### Task 12: Tailwind conversion — RoomSlider, TeaserSlider

Satisfies spec §16.4 for these two files' CSS (194 + 197 = 391 lines — the largest section-component pair, both Swiper-heavy with a `:hover` rule each, neither cross-sibling so no `group` restructuring needed).

**Files:**
- Modify: `components/sections/RoomSlider.tsx`, `TeaserSlider.tsx`
- Delete: `components/sections/RoomSlider.css`, `TeaserSlider.css`

**Interfaces:** none new.

- [ ] **Step 1: Read both `.tsx` and `.css` files in full** before converting (not excerpted above — both are large enough that this plan doesn't reproduce them; read them the same way Task 7's Hero conversion did).

- [ ] **Step 2: Baseline snapshots + Playwright tests** for `.mask_roomslider` and `.mask_teaserslider`, including the navigation arrows' hover state (`:hover` opacity change) at each viewport — a static screenshot won't catch a hover-only rule, so add a second snapshot per breakpoint with the mouse hovered over the nav arrow (`await page.hover('.navigation .next'); await expect(...).toHaveScreenshot(...)`).

- [ ] **Step 3: Convert both files per the Protocol**

Both files' `:hover` rules (`.navigation .next:hover,.navigation .prev:hover`) are plain single-element hovers (opacity change on the hovered element itself, not a sibling) — a direct Tailwind `hover:opacity-40` (check the exact original value) on that element, no `group` needed (only Task 8's Header had the *cross-sibling* case that needs `group`). Everything else — the three-Swiper grid placement in `RoomSlider.css` (`.room-image-left`/`.room-image-right`/`.room-content`, plus their `.navigation`), and `TeaserSlider.css`'s four-Swiper `grid-template-rows:auto 1fr` layout (`.image-left`/`.image-right`/`.infotext`/`.teaser-content`/`.teaser-content-inner`) — converts per the Protocol's grid-placement rules. Swiper's own required classes (`swiper-slide`, `swiper-wrapper`, etc.) are Swiper library internals, not this codebase's CSS — leave `swiper.css` (imported globally in `styles/globals.css`, per Global Constraints' file list) untouched; only the rules with the `.mask_roomslider`/`.mask_teaserslider` prefix in these two files are this task's scope.

Preserve the existing `navigation={{ prevEl: null, nextEl: null }}` prop already set on both sliders' `<Swiper>` elements (documented in spec §16.7's "Rulings" carried from the ledger — Swiper injects default blue nav chevrons whenever `navigation={true}` is combined with `onBeforeInit`-assigned refs left `undefined` at prop-resolution time; this bit Task 11/12 of Phase 1 and was fixed in Task 15) — this task changes CSS, not Swiper props, so don't touch that line, just don't accidentally revert it while editing nearby JSX.

- [ ] **Step 4: Delete both CSS files**

```bash
rm components/sections/RoomSlider.css components/sections/TeaserSlider.css
```

- [ ] **Step 5: Run the visual regression tests and the full suite**

Run: `npm run dev &`, run the two new visual specs plus `tests/e2e/roomslider.spec.ts`, stop dev server.
Run: `npm run typecheck && npm test && npm run build`
Expected: zero errors/failures.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: convert RoomSlider, TeaserSlider to Tailwind utility classes

Phase 1b (spec §16.4): RoomSlider.css and TeaserSlider.css (391 lines) become
Tailwind utilities in their JSX. Both files' hover rules are single-element
(no cross-sibling cascade, unlike Header's nav), so a direct hover: variant
suffices — no group restructuring needed. The navigation={{prevEl:null,
nextEl:null}} Swiper prop (fixes a default-chevron leak bug from Phase 1
Task 15) is preserved unchanged."
```

---

### Task 13: Tailwind conversion — not-found page

Satisfies spec §16.4 for `app/not-found.css` (133 lines — the one CSS file the earlier critique caught as missing from the original deletion list).

**Files:**
- Modify: `app/not-found.tsx`
- Delete: `app/not-found.css`

**Interfaces:** none new.

- [ ] **Step 1: Baseline snapshot + Playwright test** — `tests/e2e/home.spec.ts` already navigates to a nonexistent route (`page.goto('/does-not-exist/')` after Task 2's rewrite) to test the 404 page; add a screenshot assertion there or a new small spec.

- [ ] **Step 2: Read `app/not-found.css` in full and convert per the Protocol**

The four named blocks in `not-found.tsx` (`.errorSvgWrapper`, `.errorTextWrapper`, `.errorTitle`, `.errorText`, `.loadingBar`/`.innerLoader`) get their layout/typography from this file. The loading-bar's fill animation (5s after a 1s delay, per the component comment) is likely implemented via a `@keyframes` rule in this CSS file for `.innerLoader`'s width or transform — if so, that's a genuine Protocol escape-hatch case (keyframes can't be Tailwind utilities) and stays in a small residual CSS file or inline `<style>` block with a comment explaining why; if the animation is actually driven by an inline style/JS interval instead (check `not-found.tsx`'s `useEffect` — it currently only sets a `setTimeout` for the redirect, no per-frame width update visible), then there's no keyframe and the whole file converts to plain utilities with no exception.

- [ ] **Step 3: Delete `not-found.css`**

```bash
rm app/not-found.css
```

- [ ] **Step 4: Run the visual regression test and the full suite**

Run: `npm run dev &`, run the new spec, stop dev server.
Run: `npm run typecheck && npm test && npm run build`
Expected: zero errors/failures.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: convert the 404 page to Tailwind utility classes

Phase 1b (spec §16.4): app/not-found.css becomes Tailwind utilities directly
in not-found.tsx's JSX."
```

---

### Task 14: Colour sweep verification

Satisfies the verification half of spec §16.3 — confirms every fill site enumerated in the spec was actually converted across Tasks 8–11, and that nothing else was missed.

**Files:** none modified unless the sweep finds a miss (in which case, fix it in the file it's found in).

**Interfaces:** none.

- [ ] **Step 1: Grep for every remaining literal beige hex in components/app source**

Run: `grep -rniE "#e4e0db" --include="*.tsx" --include="*.ts" --include="*.css" app components styles`
Expected output: only **border**-context matches (`border-top:2px solid #e4e0db` equivalents, now as Tailwind `border-t-2 border-beige` or similar, still using the `--color-beige` token — check they reference the token, not a re-typed literal hex) in `Footer.tsx` (Task 9), `ImgText.tsx`/`Break.tsx` (borders, Tasks 10–11 — wait, ImgText/Break don't have list/accordion borders on the homepage; the actual border sites are `Footer.tsx`'s two `border-top` rules per spec §8.4). **Zero** matches should be a `background-color`/`bg-` fill use — if any fill match remains, that's a bug from an earlier task; fix it there (convert to `bg-canvas`), not here.

- [ ] **Step 2: Confirm the `--color-canvas` token is actually referenced**

Run: `grep -rn "bg-canvas" --include="*.tsx" components`
Expected: at least the Header menu panel (Task 8), Break wrapper (Task 11), and PartnerMarquee section (Task 11) — three or more matches.

- [ ] **Step 3: Note the deferred site**

Spec §16.3 also names `filter-hover`'s beige background (`docs/reference/css-clean/pagefilter.css`/`rooms.css`) — this belongs to the Rooms/PageFilter components, which are not part of Phase 1b's homepage-only scope (spec §13, a later phase). Confirm via `grep -rn "filter-hover" components app` that it genuinely doesn't exist in the codebase yet (nothing to fix); leave a one-line note in this task's commit message so a future session building Rooms/PageFilter knows this is pre-ruled.

- [ ] **Step 4: Full suite one more time**

Run: `npm run typecheck && npm test && npm run build`
Expected: zero errors — this task is read-only unless Step 1 found a miss.

- [ ] **Step 5: Commit** (only if Step 1 found and fixed something; otherwise this task produces no diff and is a no-op checkpoint — say so instead of committing an empty commit)

```bash
git add -A
git commit -m "fix: convert a missed #e4e0db fill site found during the colour sweep

Phase 1b (spec §16.3) verification pass."
```

---

### Task 15: Favicon fix

Satisfies spec §16.6's favicon line. Root cause, confirmed by direct inspection: `public/favicon.svg` is not actually an SVG — it's a 404 error page's JSON error payload (the original crawl fetched `/de/favicon.svg/`, a German-locale URL that doesn't exist, and the error response body got saved to the file instead of real SVG content). The real favicon PNGs (`favicon-16x1601.png`, `favicon-32x3201.png`, `apple-touch-icon.png`) and the mask icon (`safari-pinned-tab01.svg`) are already correctly downloaded at `public/images/favicon/` but never wired up.

**Files:**
- Modify: `app/layout.tsx`
- Delete: `public/favicon.svg` (the corrupted file)
- Fetch: the real root-relative `favicon.svg` and `favicon.ico` (see Step 1)

**Interfaces:** none.

- [ ] **Step 1: Fetch the two still-missing real assets**

The crawled reference HTML (`docs/reference/pages/en.html`) shows the original's exact favicon markup:
```html
<link rel="icon" type="image/svg" href="/favicon.svg">
<link rel="apple-touch-icon" sizes="180x180" href=".../apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href=".../favicon-32x3201.png">
<link rel="icon" type="image/png" sizes="16x16" href=".../favicon-16x1601.png">
<link rel="mask-icon" href=".../safari-pinned-tab01.svg" color="#211D1D">
<link rel="shortcut icon" href=".../favicon.ico">
```
The `/favicon.svg` here is root-relative to `eriro.at` itself (not the TYPO3 backend), which is why the earlier crawl — which only fetched from `typo3.eriro.at` and a `/de/`-prefixed path — got a 404 instead of the real file. Fetch the two genuinely missing files once, as a one-time asset acquisition (same category as the original image/CSS/JS crawl this whole project started from, not "live fetching" in the §16.2 runtime sense):

```bash
curl -sL https://www.eriro.at/favicon.svg -o public/favicon.svg
curl -sL https://typo3.eriro.at/fileadmin/user_upload/favicon/favicon.ico -o public/images/favicon/favicon.ico
```

Verify each is the real file type, not another error page: `file public/favicon.svg` should say `SVG Scalable Vector Graphics image` (not `JSON text data`); `file public/images/favicon/favicon.ico` should say `MS Windows icon resource`. If either still comes back wrong (network restrictions, URL changed), stop and ask the user for the file directly rather than committing a second corrupted placeholder.

- [ ] **Step 2: Wire up the full favicon set in `app/layout.tsx`**

```tsx
<head>
  {FONTS.map((f) => (
    <link key={f} rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href={`/fonts/${f}.woff2`} />
  ))}
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x3201.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x1601.png" />
  <link rel="mask-icon" href="/images/favicon/safari-pinned-tab01.svg" color="#211D1D" />
  <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
  <meta name="format-detection" content="telephone=no" />
</head>
```

- [ ] **Step 3: Verify in a browser**

Run: `npm run dev`, open `http://localhost:3000/` in a real browser (not just curl), check the browser tab shows the eriro logo mark, not a generic globe/blank icon. Stop the dev server.

- [ ] **Step 4: Run the full suite**

Run: `npm run typecheck && npm test && npm run build`
Expected: zero errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix: wire up the real favicon set (was silently serving a corrupted file)

Phase 1b (spec §16.6): public/favicon.svg was actually a 404 error page's JSON
body — the original crawl fetched /de/favicon.svg/, which doesn't exist, and
the error response got saved under that filename. Fetches the real
root-relative favicon.svg and favicon.ico, and wires up the already-downloaded
but never-linked favicon-16/32, apple-touch-icon, and safari-pinned-tab PNGs/SVG
in app/layout.tsx, matching the original site's exact <link> set."
```

---

### Task 16: SmoothScroll/ScrollTrigger orphan bug fix

Satisfies spec §16.6's SmoothScroll line. Root cause (from the ledger, and confirmed by reading `SmoothScroll.tsx`/`useParallax.ts`/`lib/smoother.ts` above): `useParallax`'s `useEffect` calls `onSmoother(cb)`, which is a **one-shot** subscription (`lib/smoother.ts`'s `onSmoother` fires `cb` once — either immediately if a smoother already exists, or on the next `setSmoother(non-null)` call — then the subscription is spent). `SmoothScroll.tsx`'s resize-driven `kill()`/`create()` cycle at the 1024px breakpoint creates a **new** `ScrollSmoother` instance each time the viewport crosses that boundary, but nothing tells already-mounted `useParallax` callers to re-subscribe and re-register their `smoother.effects()` targets against the new instance — their `triggers` array still points at the dead instance's (already-killed) triggers. `autoAlpha: 0.2` in `SplitWords.tsx` is literally the "20% opacity" the ledger's bug description names, which is a strong signal `SplitWords`' scroll-linked reveal freezes at its tween's "from" state when the underlying smoother dies mid-scrub. This is a genuine root-cause hypothesis, not a confirmed fix — verify it against the reproduction test below using `superpowers:systematic-debugging` before committing to it.

**Files:**
- Modify: `lib/smoother.ts`, `components/ui/useParallax.ts`
- Test: `tests/e2e/smoothscroll-resize.spec.ts` (new)

**Interfaces:**
- Modifies: `onSmoother(cb)`'s contract — currently "call `cb` once, with whichever smoother exists next"; becomes "call `cb` every time the smoother changes (including to `null` on kill)". Every existing caller of `onSmoother` (`useParallax.ts` is the only one — verify with `grep -rn "onSmoother" components lib`) must tolerate being called more than once.

- [ ] **Step 1: Write the failing reproduction test first**

```ts
// tests/e2e/smoothscroll-resize.spec.ts
import { test, expect } from '@playwright/test';

test('scroll-linked headings recover after resizing across the 1024px breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 951 });
  await page.goto('/');
  // Scroll to a SplitWords heading (e.g. the first ImgText section's title) so its reveal tween has run.
  const heading = page.locator('.mask_imgtext .title').first();
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // let the scrub tween settle
  const opacityBefore = await heading.evaluate((el) => getComputedStyle(el).opacity);

  // Cross the 1024px breakpoint down and back up, forcing SmoothScroll's kill+create cycle.
  await page.setViewportSize({ width: 800, height: 951 });
  await page.waitForTimeout(300); // SmoothScroll's resize handler is debounced 150ms
  await page.setViewportSize({ width: 1920, height: 951 });
  await page.waitForTimeout(300);

  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const opacityAfter = await heading.evaluate((el) => getComputedStyle(el).opacity);

  // Before the fix: opacityAfter freezes near 0.2 regardless of scroll position.
  // After the fix: it matches opacityBefore (both should be ~1, fully revealed).
  expect(Number(opacityAfter)).toBeGreaterThan(0.9);
  expect(Number(opacityAfter)).toBeCloseTo(Number(opacityBefore), 1);
});
```

Run: `npm run dev &`, `npx playwright test tests/e2e/smoothscroll-resize.spec.ts`, stop dev server.
Expected: **FAIL** (this proves the bug is real and this test catches it — if it passes before any fix, the hypothesis is wrong or the repro doesn't trigger the bug; use `superpowers:systematic-debugging` to find the actual trigger conditions before proceeding, don't force a fix against a repro that isn't actually reproducing anything).

- [ ] **Step 2: Make `onSmoother` a persistent subscription**

```ts
// lib/smoother.ts
import type { ScrollSmoother } from 'gsap/ScrollSmoother';

type Cb = (s: ScrollSmoother | null) => void;

let current: ScrollSmoother | null = null;
const subscribers = new Set<Cb>();

export function setSmoother(s: ScrollSmoother | null) {
  current = s;
  subscribers.forEach((cb) => cb(s));
}

export function getSmoother() {
  return current;
}

// Persistent subscription: cb fires immediately with the current smoother (or
// null), and again every time setSmoother() is called afterward — including
// when the smoother is killed (cb(null)) and recreated (cb(newInstance)) across
// the 1024px breakpoint. Callers must re-register anything smoother-scoped
// (e.g. smoother.effects() targets) on every call, and tear down what they
// registered on the previous call first.
export function onSmoother(cb: Cb) {
  cb(current);
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}
```

- [ ] **Step 3: Make `useParallax` re-register on every smoother change**

```ts
// components/ui/useParallax.ts
'use client';
import { useEffect, type RefObject } from 'react';
import { onSmoother } from '@/lib/smoother';
import type { ScrollTrigger } from '@/lib/gsap';

export function useParallax(ref: RefObject<HTMLElement | null>, speed: number) {
  useEffect(() => {
    let triggers: ScrollTrigger[] = [];
    const clear = () => {
      triggers.forEach((t) => t.kill());
      triggers = [];
    };
    const off = onSmoother((s) => {
      clear(); // always drop whatever the previous smoother instance registered first
      if (!s || !ref.current || window.innerWidth < 1024) return;
      const target = ref.current.querySelector('picture') ?? ref.current;
      triggers = s.effects(target, { speed }) as ScrollTrigger[];
    });
    return () => {
      off();
      clear();
    };
  }, [ref, speed]);
}
```

- [ ] **Step 4: Run the reproduction test again**

Run: `npm run dev &`, `npx playwright test tests/e2e/smoothscroll-resize.spec.ts`, stop dev server.
Expected: **PASS**. If it still fails, the root cause is elsewhere (e.g. `SplitWords`'/`Logo`'s own direct `ScrollTrigger` registration, not routed through `smoother.effects()` at all, might need its own fix — a plain `ScrollTrigger` created while a smoother exists can still go stale on kill even without going through `onSmoother`). Use `superpowers:systematic-debugging` to isolate further if Step 2–3's fix doesn't resolve it: bisect by disabling `SplitWords`' scroll trigger only vs `useParallax`'s only vs `Logo`'s only, to find which one(s) the reproduction actually depends on, and check whether `ScrollTrigger.refresh()` (already called in `SmoothScroll.tsx`'s `sync()`) needs to run *after* `useParallax`'s re-registration rather than before it (an ordering/timing issue `useEffect`'s async scheduling relative to the `setSmoother` call could introduce).

- [ ] **Step 5: Run the full suite, including a manual desktop-resize check**

Run: `npm run typecheck && npm test && npm run build`
Expected: zero errors. Manually resize a real browser window across 1024px a few times while scrolled partway down the page, watching for any heading stuck at partial opacity — the automated test covers one specific heading/scroll position; a manual pass catches anything the automated repro didn't target.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "fix: scroll-linked reveals no longer freeze after resizing across 1024px

Phase 1b (spec §16.6): onSmoother() was a one-shot subscription — components
using it (useParallax) registered their smoother.effects() targets once at
mount and never re-registered when SmoothScroll's kill/create cycle produced
a new ScrollSmoother instance at the 1024px breakpoint, leaving their
ScrollTrigger instances orphaned against a dead smoother. onSmoother is now a
persistent subscription that fires on every smoother change (including to
null), and useParallax re-registers (after clearing its previous triggers) on
each call. Verified with a new Playwright repro test that resizes across the
breakpoint and asserts a scroll-revealed heading returns to full opacity."
```

---

### Task 17: Popup reference capture

Satisfies spec §16.5 / §16.7(c)'s resolution: a fresh capture pass against the live site before building the popup, for pixel fidelity, rather than guessing from the recovered i18n strings alone. Scoped narrowly to the popup — not a repeat of the full Phase-1 site crawl.

**Files:**
- Create: `docs/reference/popup/REPORT.md`, `docs/reference/popup/popup.html`, `docs/reference/popup/*.css`, `docs/reference/popup/screenshots/*.png` (assets — exact filenames depend on what the capture finds)

**Interfaces:**
- Produces: the reference material Task 18 builds from.

- [ ] **Step 1: Load the live site and trigger the popup**

Using a browser automation tool (Chrome DevTools Protocol via the project's available tooling, or Playwright's own `chromium.launch()` in a throwaway script — either is fine, this is a one-time capture, not app code), navigate to `https://www.eriro.at/en/` and wait at least 6 seconds (the popup fires 5s after page view, per the ledger's already-recovered fact) for `div#10625.aa-popup-modal-wrapper` to appear.

- [ ] **Step 2: Capture the full popup — both steps of its form**

Screenshot the popup at desktop (1920×951) and mobile (390×844) viewports, in its open state. Extract its full HTML (`document.querySelector('#10625').outerHTML` or equivalent) and the CSS rules that apply to it (computed styles are enough if the stylesheet itself isn't easily isolated — the point is reproducing the rendered result, not necessarily the vendor's own CSS authoring). Interact with the form to reach and capture **step 2** specifically (the part that was missing before) — fill step 1's fields with placeholder values and submit/advance to reveal step 2's layout, screenshot and extract its HTML/CSS too.

- [ ] **Step 3: Write the capture report**

`docs/reference/popup/REPORT.md`: document everything found — DOM structure (both steps), exact CSS (colors, spacing, typography, the two animation curves already known from the ledger — backdrop `rgba(0,0,0,0→.5)` 0.3s linear, card `scale(.9→1)` 0.5s `cubic-bezier(.85,1.5,.5,1)` — confirm these against what's actually observed, don't just copy the ledger's numbers forward unverified), the mobile bottom-sheet variant's slide-up behaviour, the dismissal cookie's exact name/expiry, and step 2's field layout (labels, input types, validation, submit behaviour) — this last part is the entire reason for this task, since it's what was missing before.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: capture the live site's newsletter popup for Phase 1b

Phase 1b (spec §16.5, §16.7(c)): fresh reference capture of the ADDITIVE
OnPageLeadCampaign popup (both form steps, both viewports), replacing the
lost Task-15-era capture. Task 18 builds the hand-coded component from this."
```

---

### Task 18: Popup component build

Satisfies spec §16.5. Builds the hand-coded, no-third-party-script popup from Task 17's fresh capture.

**Files:**
- Create: `components/layout/NewsletterPopup.tsx`, `components/layout/NewsletterPopup.css` (or Tailwind utilities directly, per the same conversion preference as every other Task 7–13 component — since this is new code, not a conversion of existing CSS, write it in Tailwind utilities from the start; no CSS file needed unless something in Task 17's capture is Tailwind-inexpressible)
- Modify: `app/layout.tsx` (mount alongside Header/Footer/SmoothScroll/CookieConsent, per spec §16.5's new §8.7)
- Test: `tests/unit/newsletter-popup.test.tsx`, `tests/e2e/newsletter-popup.spec.ts`

**Interfaces:**
- Produces: `NewsletterPopup` — a client component with no props, self-contained (timing, dismissal-cookie check, form state all internal).

- [ ] **Step 1: Write the failing unit test for the dismissal-cookie gate**

```tsx
// tests/unit/newsletter-popup.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NewsletterPopup } from '@/components/layout/NewsletterPopup';

vi.mock('@/lib/gsap', () => ({
  gsap: { to: vi.fn(), timeline: vi.fn(() => ({ to: vi.fn() })) },
  useGSAP: vi.fn(),
}));

describe('NewsletterPopup', () => {
  beforeEach(() => {
    document.cookie = 'eriro_popup_dismissed=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    vi.useFakeTimers();
  });

  it('does not render before 5 seconds have elapsed', () => {
    render(<NewsletterPopup />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders after 5 seconds, when not previously dismissed', () => {
    render(<NewsletterPopup />);
    vi.advanceTimersByTime(5000);
    expect(screen.getByRole('dialog')).not.toBeNull();
  });

  it('does not render if the dismissal cookie is set', () => {
    document.cookie = 'eriro_popup_dismissed=1';
    render(<NewsletterPopup />);
    vi.advanceTimersByTime(5000);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
```

Run: `npm test -- newsletter-popup`
Expected: FAIL (`NewsletterPopup` doesn't exist yet).

- [ ] **Step 2: Build the component from Task 17's capture**

Read `docs/reference/popup/REPORT.md` in full before writing this — every structural/timing/animation detail below must match what was actually captured, not just the ledger's pre-capture summary. Skeleton (fill in the exact DOM/copy/field layout from the capture, especially step 2, which this plan cannot specify sight-unseen):

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

const COOKIE = 'eriro_popup_dismissed';
const COOKIE_HOURS = 4; // sliding expiry, per the ledger/capture

function hasBeenDismissed() {
  return document.cookie.split('; ').some((c) => c.startsWith(`${COOKIE}=`));
}
function dismiss() {
  const expires = new Date(Date.now() + COOKIE_HOURS * 3600 * 1000).toUTCString();
  document.cookie = `${COOKIE}=1; expires=${expires}; path=/`;
}

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasBeenDismissed()) return;
    const t = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(t);
  }, []);

  useGSAP(() => {
    if (!open || !backdropRef.current || !cardRef.current) return;
    document.documentElement.style.overflow = 'hidden';
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 0.5, duration: 0.3, ease: 'linear' });
    gsap.fromTo(cardRef.current, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: 'cubic-bezier(.85,1.5,.5,1)' });
    return () => { document.documentElement.style.overflow = ''; };
  }, { dependencies: [open] });

  const close = () => {
    dismiss();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div ref={backdropRef} className="fixed inset-0 z-[9999999] bg-ink/50">
      <div ref={cardRef} role="dialog" aria-modal="true" className="fixed inset-0 flex items-center justify-center max-lg:items-end">
        <div className="relative bg-canvas p-[4rem] max-lg:w-full max-lg:rounded-t-[1rem]">
          <button onClick={close} aria-label="Close" className="absolute top-[1.5rem] right-[1.5rem]">✕</button>
          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              {/* step 1 fields from docs/reference/popup/REPORT.md */}
            </form>
          ) : (
            <div>{/* step 2 layout from docs/reference/popup/REPORT.md — this is the part with no prior fallback, build it directly from the fresh capture */}</div>
          )}
        </div>
      </div>
    </div>
  );
}
```

Fill in step 1's and step 2's actual fields/copy/layout from the capture report — this skeleton establishes the timing/animation/dismissal mechanics (which the ledger already specified precisely and this plan can commit to), not the form content (which only the capture knows).

- [ ] **Step 3: Mount it in `app/layout.tsx`**

```tsx
import { NewsletterPopup } from '@/components/layout/NewsletterPopup';
// ...
<body className="pid-1 layout-layout-0">
  <div id="__app">
    <Header />
    <SmoothScroll>
      {children}
      <Footer />
    </SmoothScroll>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="eriro-bg-attach" src="/HG.jpg" alt="" />
    <NewsletterPopup />
  </div>
</body>
```

- [ ] **Step 4: Run the unit test**

Run: `npm test -- newsletter-popup`
Expected: PASS.

- [ ] **Step 5: Write and run an e2e test for the close-only-via-X, no-Esc, no-backdrop-click behaviour**

```ts
// tests/e2e/newsletter-popup.spec.ts
import { test, expect } from '@playwright/test';

test('popup opens after 5s, closes only via the X button', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.waitForTimeout(5500);
  await expect(page.getByRole('dialog')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeVisible(); // Esc does nothing, per the capture

  await page.mouse.click(10, 10); // backdrop, far from the card
  await expect(page.getByRole('dialog')).toBeVisible(); // backdrop click does nothing either

  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();

  await page.reload();
  await page.waitForTimeout(5500);
  await expect(page.getByRole('dialog')).toBeHidden(); // dismissal cookie persists this session
});
```

Run: `npm run dev &`, `npx playwright test tests/e2e/newsletter-popup.spec.ts`, stop dev server.
Expected: PASS.

- [ ] **Step 6: Run the full suite**

Run: `npm run typecheck && npm test && npm run build`
Expected: zero errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: hand-built newsletter popup, matching the live site's behaviour

Phase 1b (spec §16.5): sitewide popup (mounted in app/layout.tsx alongside
Header/Footer/SmoothScroll/CookieConsent), built from a fresh reference
capture (Task 17) rather than the third-party ADDITIVE OnPageLeadCampaign
script. Fires 5s after page view, closes only via the X (no Esc, no backdrop
click), dismissal persists via a 4h-sliding cookie, both form steps
implemented directly from the capture."
```

---

## After this plan lands

Per `HANDOFF.md` §6 (still accurate): run the final whole-branch review (`superpowers:requesting-code-review`, full diff range from before Phase 1b started through the last commit here) before proposing a merge to `master` — **ask the user's explicit consent before merging**, it has not been given. Re-run the perf diagnosis (deferred per spec §16.7(d)) only if the site still feels laggy after this plan lands; otherwise Task 16's targeted fix plus the CSS-file deletions/Tailwind conversion (which change enough of the runtime that a pre-rework diagnosis would partly be stale anyway) are the whole of this phase's perf work.
