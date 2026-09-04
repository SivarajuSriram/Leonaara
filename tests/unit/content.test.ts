import { describe, it, expect } from 'vitest';
import { home } from '@/content/en/home';
import { site } from '@/content/site';

describe('homepage content', () => {
  it('has the 15 sections in the original order', () => {
    expect(home.columns.colPos0.map((s) => s.type)).toEqual([
      'mask_hero', 'mask_imgtext', 'mask_video', 'mask_quote', 'mask_roomslider',
      'mask_imgtext', 'mask_imgtext', 'mask_img', 'mask_break', 'mask_imgtext',
      'mask_img', 'mask_imgtext', 'mask_img', 'mask_teaserslider', 'mask_partnermarquee',
    ]);
  });
  it('keeps the literal hero copy and image metadata', () => {
    const hero = home.columns.colPos0[0];
    if (hero.type !== 'mask_hero') throw new Error('expected hero');
    expect(hero.content.herolayout).toBe('default');
    expect(hero.content.titleh2).toBe('Rooted <br>\r\nin its <br>\r\norigins');
    expect(hero.content.title).toBe('the Zugspitze peak rises dramatically<br>\r\nover Alpine pastures<br>\r\n');
    expect(hero.content.imgsummer[0].src).toBe('/images/unikateur_Bilder/AlexMoling_Eriro_Exterior.jpg');
    expect(hero.content.imgsummer[0].width).toBe(3000);
    expect(hero.content.imgsummer[0].height).toBe(2001);
    expect(hero.content.img[0].src).toBe('/images/AlexMoling_Eriro_Winter-first-6.jpg');
  });
  it('decodes percent-encoded paths', () => {
    const it2 = home.columns.colPos0[1];
    if (it2.type !== 'mask_imgtext') throw new Error('expected imgtext');
    expect(it2.content.imgrightsummer[0].src).toBe('/images/Hendrik_Stüwe/Pool_Shooting_2605_09_neu.jpg');
  });
  it('exposes the four suites with literal strings', () => {
    const rs = home.columns.colPos0[4];
    if (rs.type !== 'mask_roomslider') throw new Error('expected roomslider');
    expect(rs.content.rooms.map((r) => r.title)).toEqual(['boum', 'wisa', 'felisa', 'himil']);
    expect(rs.content.rooms[0].minprice).toBe('from 775,- € / night per person / All-In');
    expect(rs.content.rooms[0].size).toBe('approx. 688 sq ft');
    expect(rs.content.rooms[0].people).toBe('for 2 persons');
  });
  it('carries page meta', () => {
    expect(home.meta.title).toBe('eriro - Experience alpine originality');
    expect(home.meta.ogTitle).toBe('eriro Alpine Hide');
    expect(home.id).toBe(1);
  });
});

describe('site data', () => {
  it('has the nine visible nav items', () => {
    expect(site.nav.map((n) => n.title)).toEqual([
      'Alpine Hide', 'Suites', 'All-In-Service', 'Experiences', 'Culinary', 'Spa', 'Origin', 'Summer', 'Winter',
    ]);
    expect(site.nav[1].link).toBe('/en/suites/boum/');
  });
  it('has contact and booking values', () => {
    expect(site.contact.email).toBe('hide@eriro.at');
    expect(site.contact.tel).toBe('0043 5673 40506');
    expect(site.bookingLink).toBe('https://be.synxis.com/?chain=22402&hotel=47531&src=24C');
    expect(site.footerNav.map((n) => n.title)).toEqual([
      'Booking conditions', 'eriro exclusive', 'Contact and arrival', 'Voucher', 'Newsletter', 'Jobs', 'Press',
    ]);
    expect(site.privacyNav.map((n) => n.link)).toEqual(['/en/imprint/', '/en/privacy/', '/en/cookies/']);
  });
});
