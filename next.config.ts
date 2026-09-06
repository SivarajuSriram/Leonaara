import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  // The dev-mode build-activity badge (<nextjs-portal>, bottom-left) is dev-only
  // tooling with no production effect, but its host element sits inside several
  // full-viewport-height Playwright screenshot regions (e.g. break-visual.spec.ts)
  // and produced a small but consistent pixel diff across runs. Disabling it here
  // is simpler and more robust than masking it in every affected spec.
  devIndicators: false,
  // serverExternalPackages: ['sharp'] removed here — sharp is now a devDependency
  // only used by the offline scripts/gen-image-crops.ts script, never bundled
  // into the Next.js server (app/i/route.ts, the only runtime consumer, is deleted).
  images: {
    // Next 16 requires an explicit allowlist of `quality` values (defaults to
    // [75] only) — the original _ipx route served everything at quality 80,
    // so 80 has to be allowlisted here or next/image silently coerces every
    // request down to 75, a visual regression the Global Constraints forbid.
    qualities: [75, 80],
  },
};

export default nextConfig;
