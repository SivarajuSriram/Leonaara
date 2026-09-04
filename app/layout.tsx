import type { ReactNode } from 'react';
import '@/styles/globals.css';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { PageTransition } from '@/components/layout/PageTransition';

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
      <body>
        <div className="body-inner">
          <div id="__app">
            <SmoothScroll>
              <PageTransition>{children}</PageTransition>
            </SmoothScroll>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="eriro-bg-attach" src="/HG.jpg" alt="" />
          </div>
        </div>
      </body>
    </html>
  );
}
