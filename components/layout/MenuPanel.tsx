import type { Ref } from 'react';
import { site } from '@/content/site';
import { TransitionLink } from './TransitionLink';
import { TelIcon, MailIcon, MapIcon, VoucherIcon, GalleryIcon } from '@/components/ui/icons';

type Props = { ref: Ref<HTMLDivElement>; isHome: boolean; pathname: string };

// The beige panel that slides down. Structure copied from the original header markup.
export function MenuPanel({ ref, isHome, pathname }: Props) {
  const isActive = (link: string) => pathname.startsWith(link.replace(/\/$/, ''));
  return (
    <div className="menu-outline">
      <div className="menu" ref={ref}>
        <nav className="nav-info">
          <div className="tel-icon"><a href={`tel:${site.contact.tel}`}><TelIcon /></a></div>
          <div className="mail-icon"><a href={`mailto:${site.contact.email}`}><MailIcon /></a></div>
          <div className="map-icon"><TransitionLink href={site.pageLinks.contact}><MapIcon /></TransitionLink></div>
          <div className="voucher-icon"><TransitionLink href={site.pageLinks.voucher}><VoucherIcon /></TransitionLink></div>
          <div className="gallery-icon"><TransitionLink href={site.pageLinks.gallery}><GalleryIcon /></TransitionLink></div>
        </nav>
        <div className="mobile-hr" />
        <div className="main-nav-wrapper">
          {/* Outside the home page the nav gets `fadeOut`: links at .6 opacity, the active one at 1 (CSS). */}
          <nav aria-label="Menu" className={isHome ? 'nav-main' : 'nav-main fadeOut'}>
            {site.nav.map((item) => (
              <div key={item.uid} className="level-0">
                <TransitionLink href={item.link} className={isActive(item.link) ? 'link-0 router-link-active' : 'link-0'}>
                  {item.title}{' '}
                </TransitionLink>
                <div className="sub"><div /></div>
              </div>
            ))}
          </nav>
          <nav className="nav-lang" aria-label="Language">
            {site.languages.map((language) => (
              <a key={language.code} className={language.code === 'en' ? 'router-link-active' : ''} href={language.link}>
                <span>{language.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
