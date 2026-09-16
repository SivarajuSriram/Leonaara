import type { Metadata } from 'next';
import type { PageContent } from './content';
import { home } from '@/content/en/home';
import { privacy } from '@/content/en/privacy';
import { contact } from '@/content/en/contact';
import { about } from '@/content/en/about';
import { kadamba } from '@/content/en/kadamba';
import { ananthaMeadows } from '@/content/en/ananthameadows';
import { projects } from '@/content/en/projects';

// Every English page, keyed by its TYPO3 slug ('/' is the homepage). Later phases add one line per page.
export const pages: Record<string, PageContent> = {
  '/': home,
  '/privacy/': privacy,
  '/contact/': contact,
  '/about/': about,
  '/projects/': projects,
  '/projects/kadamba/': kadamba,
  '/projects/ananthameadows/': ananthaMeadows,
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
