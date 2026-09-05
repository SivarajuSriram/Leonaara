import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/Footer';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }));

describe('Footer', () => {
  it('renders contact, social, address, partner and the three navs', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer.grid-container')).not.toBeNull();
    expect(screen.getByText('hide@eriro.at').getAttribute('href')).toBe('mailto:hide@eriro.at');
    expect(screen.getByText('0043 5673 40506').getAttribute('href')).toBe('tel:0043 5673 40506');
    expect(container.querySelector('.social a[aria-label="Instagram"]')).not.toBeNull();
    expect(container.querySelector('.address')?.textContent).toContain('Ehrwalder Alm 4');
    expect(container.querySelector('.partner a[href="https://www.laposch.com/en/"]')).not.toBeNull();
    const extra = Array.from(container.querySelectorAll('nav.nav-extra a')).map((a) => a.textContent);
    expect(extra).toEqual(['Booking conditions', 'eriro exclusive', 'Contact and arrival', 'Voucher', 'Newsletter', 'Jobs', 'Press']);
    // spec §16.1: the German mirror is cancelled, so only English remains here.
    const lang = Array.from(container.querySelectorAll('nav.nav-lang a')).map((a) => [a.textContent, a.className]);
    expect(lang).toEqual([['English', 'router-link-active']]);
    expect(Array.from(container.querySelectorAll('nav.nav-footer a')).map((a) => a.textContent)).toEqual(['Imprint', 'Privacy', 'Cookies']);
    expect(container.querySelector('.luxury-hotels-logo img')?.getAttribute('alt')).toBe('Small Luxury Hotels of the World');
    expect(container.querySelector('.unikateur-signet a')?.getAttribute('href')).toBe('https://www.unikateur.com/');
    expect(container.querySelector('.unikateur-signet span')?.textContent).toBe('unique hospitality concepts, by ');
    expect(container.querySelector('.lower-footer .logo a.link-logo svg')).not.toBeNull();
  });
});
