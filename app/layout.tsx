import type { ReactNode } from 'react';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { PageTransition } from '@/components/layout/PageTransition';
import { Footer } from '@/components/layout/Footer';

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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="pid-1 layout-layout-0">
        <div className="body-inner">
          <div id="__app">
            <Header />
            <SmoothScroll>
              <PageTransition>{children}</PageTransition>
              <Footer />
            </SmoothScroll>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="eriro-bg-attach" src="/HG.jpg" alt="" />
          </div>
        </div>
      </body>
    </html>
  );
}
