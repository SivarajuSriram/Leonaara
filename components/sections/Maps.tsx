import type { MapsSection } from '@/lib/content';

// Placeholder only when there's no `image`: no real Leonaara address/coordinates
// exist yet, so this reserves the map's spot in the page layout (same aspect
// ratio the real eriro.at page's Google Maps embed uses) rather than wiring up
// a fake pin. When a section does carry a designed location-map image (e.g.
// Kadamba's), that renders instead -- still not a live Google Maps embed, but
// closer to the real thing until real coordinates exist.
export function Maps({ section }: { section: MapsSection }) {
  // mb-[-8rem] (was no bottom margin at all): the global contact-form Hero
  // mounted after every page's content (app/layout.tsx) already carries a
  // fixed ~19rem top padding of its own (space-before-, globals.css) --
  // stacked under this section's own height with no offset, that read as
  // "too much gap after the map, before the form". Pulls the form back up
  // into some of that padding instead. Per the user's explicit feedback.
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_maps', 'grid-container', 'mb-[-8rem] max-lg:mb-[-4rem]']
    .filter(Boolean).join(' ');
  const { title, image } = section.content;

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      {image ? (
        <>
          <h2 className="h2 [grid-column:1/span_14] mt-[4rem] mb-[3rem] text-center">Location</h2>
          {/* Back to full width, natural (uncropped) height -- every attempt to
              force a shorter height via object-cover (a 16:9 aspect-video, then
              a 2.6:1 band with object-position shifted to protect the pin) still
              read as "zoomed in", because ANY crop on a fixed-content graphic
              like this necessarily magnifies what's left relative to the whole.
              The only way to show this map without it looking zoomed is to not
              crop it at all -- full image, natural ~1450x980 (~1.48:1) ratio. */}
          <div className="[grid-column:1/span_14] w-full overflow-hidden rounded-[1.6rem]">
            {/* eslint-disable-next-line @next/next/no-img-element -- a single designed graphic, not a responsive photo needing next/image's crop machinery */}
            <img src={image} alt={title || 'Location map'} className="block h-auto w-full" />
          </div>
        </>
      ) : (
        <div className="[grid-column:1/span_14] aspect-video w-full bg-ink/5 flex items-center justify-center">
          <span className="text-[1.4rem] tracking-[0.05em] text-ink/40 uppercase">
            {title || 'Map — location to be added'}
          </span>
        </div>
      )}
    </div>
  );
}
