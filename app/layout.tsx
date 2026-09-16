import type { ReactNode } from 'react';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { ScrollResetOnNavigate } from '@/components/layout/ScrollResetOnNavigate';
import { Footer } from '@/components/layout/Footer';
import { ContactForm, globalContactFormSection } from '@/components/sections/ContactForm';
import { Hero } from '@/components/sections/Hero';
import { contactFormHero } from '@/content/en/contactFormShared';
import { NewsletterPopup } from '@/components/layout/NewsletterPopup';
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner';
// AmbientAudioToggle hidden for now (per the user's "hide the audio thing,
// we can add it later" request) -- no real audio file exists yet anyway
// (components/layout/AmbientAudioToggle.tsx's own NEEDS-AUDIO-FILE comment).
// Component kept in place, just unmounted; re-add the import and the
// <AmbientAudioToggle /> line below to bring it back.
// import { AmbientAudioToggle } from '@/components/layout/AmbientAudioToggle';
import { SCROLLED_BODY_INLINE_SCRIPT } from '@/components/layout/useScrolledBody';

export const viewport = { width: 'device-width', initialScale: 1 };

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
        {/* Junge (Google Fonts): the heading typeface across the site, set via
            --font-serif in globals.css. Body copy stays on the self-hosted
            karol-sans above. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Junge&display=swap" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x3201.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x1601.png" />
        <link rel="mask-icon" href="/images/favicon/safari-pinned-tab01.svg" color="#211D1D" />
        <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
        <meta name="format-detection" content="telephone=no" />
        <script dangerouslySetInnerHTML={{ __html: SCROLLED_BODY_INLINE_SCRIPT }} />
      </head>
      <body className="pid-1 layout-layout-0" suppressHydrationWarning={true}>
        <div id="__app">
          <ScrollResetOnNavigate />
          <Header />
          <SmoothScroll>
            {children}
            <Hero section={contactFormHero} />
            <ContactForm section={globalContactFormSection} />
            <Footer />
          </SmoothScroll>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="eriro-bg-attach" src="/HG.jpg" alt="" />
          <NewsletterPopup />
          <CookieConsentBanner />
          {/* <AmbientAudioToggle /> -- hidden for now, see the import comment above */}
        </div>
      </body>
    </html>
  );
}
