import type { Metadata } from 'next';
import type { PageContent } from './content';
import { home } from '@/content/en/home';
import { imprint } from '@/content/en/imprint';
import { privacy } from '@/content/en/privacy';
import { cookies } from '@/content/en/cookies';
import { allInService } from '@/content/en/all-in-service';
import { eriroExclusive } from '@/content/en/eriro-exclusive';
import { summer } from '@/content/en/summer';
import { winter } from '@/content/en/winter';
import { bookingConditions } from '@/content/en/booking-conditions';
import { contact } from '@/content/en/contact';
import { press } from '@/content/en/press';
import { about } from '@/content/en/about';
import { alpineHide } from '@/content/en/alpine-hide';
import { origin } from '@/content/en/origin';
import { culinary } from '@/content/en/culinary';
import { gallery } from '@/content/en/gallery';
import { newsletter } from '@/content/en/newsletter';
import { voucher } from '@/content/en/voucher';
import { experiences } from '@/content/en/experiences';
import { leiba } from '@/content/en/leiba';
import { sela } from '@/content/en/sela';
import { herchomen } from '@/content/en/herchomen';
import { hantwerc } from '@/content/en/hantwerc';
import { sneo } from '@/content/en/sneo';
import { kadamba } from '@/content/en/kadamba';
import { ananthaMeadows } from '@/content/en/ananthameadows';
import { projects } from '@/content/en/projects';

// Every English page, keyed by its TYPO3 slug ('/' is the homepage). Later phases add one line per page.
export const pages: Record<string, PageContent> = {
  '/': home,
  '/imprint/': imprint,
  '/privacy/': privacy,
  '/cookies/': cookies,
  '/all-in-service/': allInService,
  '/eriro-exclusive/': eriroExclusive,
  '/summer/': summer,
  '/winter/': winter,
  '/booking-conditions/': bookingConditions,
  '/contact/': contact,
  '/press/': press,
  '/about/': about,
  '/alpine-hide/': alpineHide,
  '/origin/': origin,
  '/culinary/': culinary,
  '/gallery/': gallery,
  '/newsletter/': newsletter,
  '/voucher/': voucher,
  '/experiences/': experiences,
  '/leiba/': leiba,
  '/sela/': sela,
  '/herchomen/': herchomen,
  '/hantwerc/': hantwerc,
  '/sneo/': sneo,
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
