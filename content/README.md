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
