import type { Metadata } from 'next';
import type { PageContent } from './content';
import { home } from '@/content/en/home';
import { imprint } from '@/content/en/imprint';
import { privacy } from '@/content/en/privacy';
import { cookies } from '@/content/en/cookies';

// Every English page, keyed by its TYPO3 slug ('/' is the homepage). Later phases add one line per page.
export const pages: Record<string, PageContent> = {
  '/': home,
  '/imprint/': imprint,
  '/privacy/': privacy,
  '/cookies/': cookies,
};

export function getPage(slug: string): PageContent | undefined {
  return pages[slug];
}

// The original <head>: title, description, og:*, twitter:*, canonical (see docs/reference/pages/en.html).
export function metadataFor(page: PageContent): Metadata {
  const m = page.meta;
  const path = page.slug; // page.slug is already '/' for home; no /en prefix, no per-page rewrite needed
  return {
    title: m.title,
    description: m.description,
    robots: { index: !m.robots.noIndex, follow: !m.robots.noFollow, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    // spec §16.1: the German mirror is cancelled (not deferred) -- there is
    // exactly one language, so `hreflang` stays omitted, permanently.
    alternates: { canonical: path },
    openGraph: { title: m.ogTitle, description: m.ogDescription, type: 'website', images: m.ogImage ? [{ url: m.ogImage.src }] : [] },
    twitter: { card: 'summary', title: m.twitterTitle, description: m.twitterDescription, images: m.twitterImage ? [m.twitterImage.src] : [] },
  };
}
