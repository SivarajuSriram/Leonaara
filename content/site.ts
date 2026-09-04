export type NavItem = { uid: number; title: string; link: string; children?: NavItem[] };

export const site = {
  nav: [
    { uid: 58, title: 'Alpine Hide', link: '/en/alpine-hide/' },
    { uid: 44, title: 'Suites', link: '/en/suites/boum/' },
    { uid: 120, title: 'All-In-Service', link: '/en/all-in-service/' },
    { uid: 60, title: 'Experiences', link: '/en/experiences/' },
    { uid: 61, title: 'Culinary', link: '/en/culinary/' },
    { uid: 108, title: 'Spa', link: '/en/spa/' },
    { uid: 86, title: 'Origin', link: '/en/origin/' },
    { uid: 179, title: 'Summer', link: '/en/summer/' },
    { uid: 181, title: 'Winter', link: '/en/winter/' },
  ] as NavItem[],
  footerNav: [
    { uid: 162, title: 'Booking conditions', link: '/en/booking-conditions/' },
    { uid: 164, title: 'eriro exclusive', link: '/en/eriro-exclusive/' },
    { uid: 95, title: 'Contact and arrival', link: '/en/contact-and-arrival/' },
    { uid: 73, title: 'Voucher', link: '/en/voucher/' },
    { uid: 103, title: 'Newsletter', link: '/en/newsletter/' },
    { uid: 72, title: 'Jobs', link: '/en/jobs/' },
    { uid: 71, title: 'Press', link: '/en/press/' },
  ] as NavItem[],
  privacyNav: [
    { uid: 5, title: 'Imprint', link: '/en/imprint/' },
    { uid: 6, title: 'Privacy', link: '/en/privacy/' },
    { uid: 7, title: 'Cookies', link: '/en/cookies/' },
  ] as NavItem[],
  languages: [
    { code: 'de', title: 'Deutsch', link: '/de/' },
    { code: 'en', title: 'English', link: '/en/' },
  ],
  pageLinks: { home: '/en/', request: '/en/request/', contact: '/en/contact-and-arrival/', voucher: '/en/voucher/', gallery: '/en/gallery/' },
  contact: { email: 'hide@eriro.at', tel: '0043 5673 40506', address: 'Ehrwalder Alm 4\r\n6632 Ehrwald, Austria' },
  // raw value (no <br>); the footer applies nl2br like the original
  socialHtml:
    '<a href="https://www.instagram.com/eriro.alpinehide?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" rel="nofollow" target="_blank" aria-label="Instagram">Instagram</a>\r\n<a href="https://www.facebook.com/eriroalpinehide" rel="nofollow" target="_blank" aria-label="Facebook">Facebook</a>',
  partnerHtml:
    '<a href="https://www.laposch.com/en/" target="_blank" rel="noopener" aria-label="www.laposch.com">laposch.com</a><br>\r\n<a href="https://www.hotel-spielmann.com/en/" target="_blank" rel="noopener" aria-label="www.hotel-spielmann.com">hotel-spielmann.com</a>',
  bookingLink: 'https://be.synxis.com/?chain=22402&hotel=47531&src=24C',
  unikateur: 'https://www.unikateur.com/',
  t: {
    menu: 'Menu', close: 'Close', email: 'Email', contact: 'Contact', partner: 'Partner', phone: 'Phone', address: 'Address',
    social: 'Follow us', request: 'Request', book: 'Book', visitSuite: 'View Suite', year: 'y.', kidsage: 'Kids age',
    removeRoom: 'Remove room', addRoom: 'Add room', all: 'All', unikSignet: 'unique hospitality concepts, by ',
  },
  season: { seasonswitchstart: 0, seasonswitchend: 1792999620 },
} as const;
