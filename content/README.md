# content/

All copy, links and image references. Nothing in `components/` contains text.

- `site.ts` – navigation, footer navs, contact details, booking link, UI strings, season switch. Hand-maintained.
- `en/<slug>.ts` – one file per page, HAND-WRITTEN against the design spec (`docs/superpowers/specs/`)
  and cross-checked against the crawled reference JSON in `docs/reference/pages/`. There is no
  generator script — edit these files directly.
- Image `src` values point into `public/images/`; `width`/`height` are the original pixel sizes and
  `crop` is the TYPO3 crop area (0..1). `lib/images.ts` turns these into `<source>` sizes, and
  `scripts/gen-image-crops.ts` (`npm run gen:image-crops`) is the offline pass that actually produces
  the cropped image files on disk for any non-identity crop — run it after adding a new image or crop.
- To change wording, edit the page file directly. Keep HTML fragments (`<br>`, `<i>`, `<ul>`) as they
  are; they are rendered verbatim.
