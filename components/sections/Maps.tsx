import type { MapsSection } from '@/lib/content';

// Placeholder only: no real Leonaara address/coordinates exist yet, so this
// reserves the map's spot in the page layout (same aspect ratio the real
// eriro.at page's Google Maps embed uses) rather than wiring up a fake pin.
// Swap this for a real embed once there's an address to point it at.
export function Maps({ section }: { section: MapsSection }) {
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_maps', 'grid-container']
    .filter(Boolean).join(' ');

  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className="[grid-column:1/span_14] aspect-video w-full bg-ink/5 flex items-center justify-center">
        <span className="text-[1.4rem] tracking-[0.05em] text-ink/40 uppercase">
          {section.content.title || 'Map — location to be added'}
        </span>
      </div>
    </div>
  );
}
