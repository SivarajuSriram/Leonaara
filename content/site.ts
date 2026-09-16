export type NavItem = { uid: number; title: string; link: string; children?: NavItem[] };

export const site = {
  nav: [
    { uid: 9058, title: 'About', link: '/about/' },
    { uid: 58, title: 'Alpine Hide', link: '/alpine-hide/' },
    { uid: 44, title: 'Projects', link: '/projects/' },
    { uid: 120, title: 'All-In-Service', link: '/all-in-service/' },
    { uid: 60, title: 'Experiences', link: '/experiences/' },
    { uid: 61, title: 'Culinary', link: '/culinary/' },
    { uid: 86, title: 'Origin', link: '/origin/' },
    { uid: 179, title: 'Summer', link: '/summer/' },
    { uid: 181, title: 'Winter', link: '/winter/' },
  ] as NavItem[],
  footerNav: [
    { uid: 162, title: 'Booking conditions', link: '/booking-conditions/' },
    { uid: 164, title: 'eriro exclusive', link: '/eriro-exclusive/' },
    { uid: 95, title: 'Contact', link: '/contact/' },
    { uid: 73, title: 'Voucher', link: '/voucher/' },
    { uid: 103, title: 'Newsletter', link: '/newsletter/' },
    { uid: 72, title: 'Jobs', link: '/jobs/' },
    { uid: 71, title: 'Press', link: '/press/' },
  ] as NavItem[],
  privacyNav: [
    { uid: 5, title: 'Imprint', link: '/imprint/' },
    { uid: 6, title: 'Privacy', link: '/privacy/' },
    { uid: 7, title: 'Cookies', link: '/cookies/' },
  ] as NavItem[],
  // spec §16.1: the German mirror is cancelled -- there is no language layer
  // at all, so this holds only the one real language (English). A "Deutsch"
  // entry used to sit here pointing at '/' (the English homepage), which was
  // a false promise to users; removed rather than left dangling.
  languages: [
    { code: 'en', title: 'English', link: '/' },
  ],
  pageLinks: { home: '/', request: '/request/', contact: '/contact/', voucher: '/voucher/', gallery: '/gallery/' },
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
