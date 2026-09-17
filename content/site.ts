export type NavItem = { uid: number; title: string; link: string; children?: NavItem[] };

export const site = {
  nav: [
    { uid: 9057, title: 'Home', link: '/' },
    { uid: 9058, title: 'About', link: '/about/' },
    {
      uid: 44, title: 'Projects', link: '/projects/', children: [
        { uid: 84, title: 'Kadamba', link: '/projects/kadamba/' },
        { uid: 85, title: 'Anantha Meadows', link: '/projects/ananthameadows/' },
      ],
    },
    { uid: 9300, title: 'NRI Corner', link: '/nri/' },
    { uid: 95, title: 'Contact', link: '/contact/' },
  ] as NavItem[],
  footerNav: [
    { uid: 9057, title: 'Home', link: '/' },
    { uid: 9058, title: 'About', link: '/about/' },
    { uid: 44, title: 'Projects', link: '/projects/' },
    { uid: 9300, title: 'NRI Corner', link: '/nri/' },
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
  // Placeholder contact/social/booking details -- the original crawl's values all
  // pointed at eriro.at's own accounts/booking engine (hide@eriro.at, the
  // eriro.alpinehide Instagram/Facebook handles, a synxis booking link scoped to
  // eriro's own hotel/chain IDs), none of which belong to Leonaara. Removed at
  // the user's explicit request ("remove all external links that point to eriro
  // or something related to that, use placeholder links for now") rather than
  // left pointing at a real, unrelated business. Swap these for Leonaara's own
  // real values once they exist.
  // 3 lines (was 2) -- per the user's explicit "make the address come in 3 lines"
  // request. Rebalanced (was "Sy No. 149, Prime Titania," / "1st floor, Mokila,"
  // / "Telangana 501203.") because the first line alone was still wider than the
  // footer's address column, wrapping onto a 4th line -- see Footer.tsx's addressCls
  // comment for the matching column-width fix.
  contact: { email: 'hello@leonaara.com', tel: '+00 12345 67890', address: '1st Floor, Prime Titania,\r\n Above ICICI Bank,\r\nMokila, Telangana 501203.' },
  // raw value (no <br>); the footer applies nl2br like the original
  socialHtml:
    '<a href="https://www.instagram.com/leonaara_org/" rel="nofollow" target="_blank" aria-label="Instagram">Instagram</a>\r\n<a href="https://www.linkedin.com/company/leonaarahyd/" rel="nofollow" target="_blank" aria-label="LinkedIn">LinkedIn</a>\r\n<a href="https://www.facebook.com/leonaara/" rel="nofollow" target="_blank" aria-label="Facebook">Facebook</a>\r\n<a href="https://www.youtube.com/@Leonaara-infra" rel="nofollow" target="_blank" aria-label="YouTube">YouTube</a>',
  t: {
    menu: 'Menu', close: 'Close', email: 'Email', contact: 'Contact', partner: 'Partner', phone: 'Phone', address: 'Office Address',
    social: 'Follow us', request: 'Request', book: 'Book', visitSuite: 'Explore', year: 'y.', kidsage: 'Kids age',
    removeRoom: 'Remove room', addRoom: 'Add room', all: 'All',
  },
  season: { seasonswitchstart: 0, seasonswitchend: 1792999620 },
} as const;
