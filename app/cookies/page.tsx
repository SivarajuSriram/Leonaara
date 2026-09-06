import type { Metadata } from 'next';
import { cookies } from '@/content/en/cookies';
import { metadataFor } from '@/lib/pages';
import { BodyClass } from '@/components/layout/BodyClass';
import { FooterPageText } from '@/components/sections/FooterPageText';
import { IncludePage } from '@/components/sections/IncludePage';
import { CookieConsentButton } from '@/components/sections/CookieConsentButton';

export const metadata: Metadata = metadataFor(cookies);

export default function CookiesPage() {
  const [placeholder, include, button] = cookies.columns.colPos0;
  if (placeholder.type !== 'mask_footerpagetext') throw new Error('expected footerpagetext');
  if (include.type !== 'hanthaincludepage_includepage') throw new Error('expected includepage');
  if (button.type !== 'mask_cookieconsentbutton') throw new Error('expected cookieconsentbutton');
  return (
    <main>
      <BodyClass pageId={cookies.id} layout="layout-8" />
      <FooterPageText section={placeholder} first />
      <IncludePage section={include} />
      <CookieConsentButton section={button} />
    </main>
  );
}
