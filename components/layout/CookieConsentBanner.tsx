'use client';
import { useEffect } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

// The live site never customized vanilla-cookieconsent's own theme (confirmed:
// docs/reference/css-clean/cookieconsent.css has only the library's stock
// --cc-* default tokens, no eriro brand colour or karol-sans anywhere) -- so
// this uses the library's own default CSS unmodified (imported above), no
// theme file of our own. Config text and category shape captured verbatim
// from docs/reference/js/js_gFJzZSaU.js (spec §17.3); the site's own
// onFirstConsent/onChange Google-Consent-Mode callbacks are intentionally not
// cloned (spec §2: no analytics/tracker scripts). hrefs drop /en/ per §16.1.
export function CookieConsentBanner() {
  useEffect(() => {
    // vanilla-cookieconsent's run() defaults hideFromBots: true, which gates the
    // entire init on navigator.webdriver (true under any Playwright/automation
    // context) -- so the banner silently never renders under this project's own
    // e2e tests without the test-layer spoof in tests/e2e/cookie-consent.spec.ts.
    CookieConsent.run({
      cookie: { name: 'cc_cookie', expiresAfterDays: 182 },
      guiOptions: {
        consentModal: { layout: 'bar', position: 'bottom', equalWeightButtons: false, flipButtons: true },
        preferencesModal: { layout: 'box', position: 'right', equalWeightButtons: false, flipButtons: false },
      },
      categories: {
        necessary: { readOnly: true, enabled: true },
        functionality: {},
        marketing: {},
        analytics: { autoClear: { cookies: [{ name: /^(_ga|_gid)/ }] } },
        ads: {},
      },
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: '',
              description:
                'We use cookies and other tracking technologies to personalize and improve your experience. By continuing to use our website you consent to this.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage preferences',
              footer: '<a href="/privacy/">Privacy</a>',
            },
            preferencesModal: {
              title: 'Consent Preferences Center',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close modal',
              serviceCounterLabel: 'Service|Services',
              sections: [
                {
                  title: 'Cookie Usage',
                  description:
                    'Cookies are very small text files that are stored on your computer when you visit a website. We use cookies for a variety of purposes and to enhance your online experience on our website (for example, to remember your account login details).<br/>You can change your preferences and decline certain types of cookies to be stored on your computer while browsing our website. You can also remove any cookies already stored on your computer, but keep in mind that deleting cookies may prevent you from using parts of our website.',
                },
                {
                  title: 'Strictly Necessary Cookies <span class="pm__badge">Always Enabled</span>',
                  description:
                    'These cookies are essential to provide you with services available through our website and to enable you to use certain features of our website.<br/>Without these cookies, we cannot provide you certain services on our website.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Functionality Cookies',
                  description:
                    'These cookies are used to provide you with a more personalized experience on our website and to remember choices you make when you use our website.<br/>For example, we may use functionality cookies to remember your language preferences or remember your login details.',
                  linkedCategory: 'functionality',
                },
                {
                  title: 'Analytics Cookies',
                  description:
                    "These cookies are used to collect information to analyze the traffic to our website and how visitors are using our website.<br/>For example, these cookies may track things such as how long you spend on the website or the pages you visit which helps us to understand how we can improve our website site for you.<br/>The information collected through these tracking and performance cookies do not identify any individual visitor.",
                  linkedCategory: 'analytics',
                },
                {
                  title: 'Advertisement Cookies',
                  description:
                    "These cookies are used to show advertising that is likely to be of interest to you based on your browsing habits.<br/>These cookies, as served by our content and/or advertising providers, may combine information they collected from our website with other information they have independently collected relating to your web browser's activities across their network of websites.<br/>If you choose to remove or disable these targeting or advertising cookies, you will still see adverts but they may not be relevant to you.",
                  linkedCategory: 'marketing',
                },
                {
                  title: 'More information',
                  description:
                    'For any queries in relation to our policy on cookies and your choices, please contact us.',
                },
              ],
            },
          },
        },
      },
    });
  }, []);
  return null;
}
