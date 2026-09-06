import type { ReactNode } from 'react';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { Footer } from '@/components/layout/Footer';
import { NewsletterPopup } from '@/components/layout/NewsletterPopup';

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
        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x3201.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x1601.png" />
        <link rel="mask-icon" href="/images/favicon/safari-pinned-tab01.svg" color="#211D1D" />
        <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
        <meta name="format-detection" content="telephone=no" />
      </head>
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
    </html>
  );
}
