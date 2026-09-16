export type NavItem = { uid: number; title: string; link: string; children?: NavItem[] };

export const site = {
  nav: [
    { uid: 9057, title: 'Home', link: '/' },
    { uid: 9058, title: 'About', link: '/about/' },
    { uid: 44, title: 'Projects', link: '/projects/' },
    { uid: 95, title: 'Contact', link: '/contact/' },
  ] as NavItem[],
  footerNav: [
    { uid: 9057, title: 'Home', link: '/' },
    { uid: 9058, title: 'About', link: '/about/' },
    { uid: 44, title: 'Projects', link: '/projects/' },
    { uid: 95, title: 'Contact', link: '/contact/' },
  ] as NavItem[],
  privacyNav: [
    { uid: 6, title: 'Privacy', link: '/privacy/' },
  ] as NavItem[],
  // spec §16.1: the German mirror is cancelled -- there is no language layer
  // at all, so this holds only the one real language (English). A "Deutsch"
  // entry used to sit here pointing at '/' (the English homepage), which was
  // a false promise to users; removed rather than left dangling.
  languages: [
    { code: 'en', title: 'English', link: '/' },
  ],
  pageLinks: { home: '/', request: '/request/', contact: '/contact/' },
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
    social: 'Follow us', request: 'Request', book: 'Book', visitSuite: 'Explore', year: 'y.', kidsage: 'Kids age',
    removeRoom: 'Remove room', addRoom: 'Add room', all: 'All', unikSignet: 'unique hospitality concepts, by ',
  },
  season: { seasonswitchstart: 0, seasonswitchend: 1792999620 },
} as const;
