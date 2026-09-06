'use client';
import * as CookieConsent from 'vanilla-cookieconsent';
import type { CookieConsentButtonSection } from '@/lib/content';

// mask_cookieconsentbutton .wrapper{grid-column-end:span 12;grid-column-start:2}
const wrapperCls = 'wrapper col-start-2 col-span-12';

export function CookieConsentButton({ section }: { section: CookieConsentButtonSection }) {
  const cls = [section.appearance.layout, `space-before-${section.appearance.spaceBefore}`, 'mask', 'mask_cookieconsentbutton']
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...{ uid: `c${section.id}` }}>
      <div className="grid-container">
        <div className={wrapperCls}>
          <a href="#" role="button" className="ht-button" onClick={(e) => { e.preventDefault(); CookieConsent.showPreferences(); }}>
            {section.content.buttontext}
          </a>
        </div>
      </div>
    </div>
  );
}
