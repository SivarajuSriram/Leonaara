// components/layout/Footer.tsx
import { site } from '@/content/site';
import './Footer.css';
import { TransitionLink } from './TransitionLink';
import { LogoIcon, UnikateurIcon } from '@/components/ui/icons';
import { RichText } from '@/components/ui/RichText';

const nl2br = (s: string) => s.replace(/\r?\n/g, '<br>');

export function Footer() {
  return (
    <footer className="grid-container">
      <div className="upper-footer grid-container-inner">
        <div className="email">
          <h4 className="footer-title">{site.t.contact}</h4>
          <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          <br />
          <a href={`tel:${site.contact.tel}`}>{site.contact.tel}</a>
        </div>
        <div className="social">
          <h4 className="footer-title">{site.t.social}</h4>
          <RichText className="t3-ce-rte" html={nl2br(site.socialHtml)} />
        </div>
        <div className="address">
          <h4 className="footer-title">{site.t.address}</h4>
          <RichText className="t3-ce-rte" html={nl2br(site.contact.address)} />
        </div>
        <div className="partner">
          <h4 className="footer-title">{site.t.partner}</h4>
          <RichText html={site.partnerHtml} />
        </div>
      </div>
      <div className="lower-footer grid-container-inner">
        <nav className="nav-extra" aria-label="Footer Menu">
          {site.footerNav.map((n) => <TransitionLink key={n.uid} href={n.link}>{n.title}</TransitionLink>)}
        </nav>
        <div className="logo">
          <TransitionLink className="link-logo" href={site.pageLinks.home}><LogoIcon /></TransitionLink>
        </div>
        <div className="luxury-hotels-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/slh_black.png" alt="Small Luxury Hotels of the World" />
        </div>
        <div className="footer-bottom-right">
          <nav className="nav-lang" aria-label="Footer Language">
            {site.languages.map((l) => <a key={l.code} className={l.code === 'en' ? 'router-link-active' : ''} href={l.link}>{l.title}</a>)}
          </nav>
          <nav className="nav-footer" aria-label="Footer Privacy">
            {site.privacyNav.map((n) => <TransitionLink key={n.uid} href={n.link}>{n.title}</TransitionLink>)}
          </nav>
        </div>
        <div className="unikateur-signet">
          <a href={site.unikateur} target="_blank" rel="noopener"><span>{site.t.unikSignet}</span><UnikateurIcon /></a>
        </div>
      </div>
    </footer>
  );
}
