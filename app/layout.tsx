import type { ReactNode } from 'react';
import '@/styles/globals.css';

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
      <body>{children}</body>
    </html>
  );
}
