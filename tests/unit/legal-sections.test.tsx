import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { FooterPageText } from '@/components/sections/FooterPageText';
import { IncludePage } from '@/components/sections/IncludePage';
import { CookieConsentButton } from '@/components/sections/CookieConsentButton';
import { imprint } from '@/content/en/imprint';
import { privacy } from '@/content/en/privacy';
import { cookies } from '@/content/en/cookies';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }));
vi.mock('vanilla-cookieconsent', () => ({ showPreferences: vi.fn() }));

describe('FooterPageText', () => {
  it('renders the title and text inside .legal-content, with the first-section padding', () => {
    const section = imprint.columns.colPos0[0];
    if (section.type !== 'mask_footerpagetext') throw new Error('expected footerpagetext');
    const { container } = render(<FooterPageText section={section} first />);
    expect(container.firstElementChild?.className).toContain('mask mask_footerpagetext');
    expect(container.firstElementChild?.className).toContain('pt-[45rem]');
    expect(container.firstElementChild?.className).toContain('max-lg:pt-[25rem]');
    expect(container.querySelector('h1.legal-content')?.textContent).toBe('Imprint');
    expect(container.querySelector('div.legal-content')?.innerHTML).toContain('Almkönig GmbH');
  });
  it('renders nothing visible for an empty placeholder section', () => {
    const section = cookies.columns.colPos0[0];
    if (section.type !== 'mask_footerpagetext') throw new Error('expected footerpagetext');
    const { container } = render(<FooterPageText section={section} />);
    expect(container.querySelector('h1')).toBeNull();
    expect(container.querySelector('.legal-content')).toBeNull();
  });
  it('omits the first-section padding classes when `first` is not passed', () => {
    const section = privacy.columns.colPos0[2];
    if (section.type !== 'mask_footerpagetext') throw new Error('expected footerpagetext');
    const { container } = render(<FooterPageText section={section} />);
    expect(container.firstElementChild?.className).not.toContain('pt-[45rem]');
  });
});

describe('IncludePage', () => {
  it('renders the raw HTML inside .legal-content.t3-ce-rte', () => {
    const section = cookies.columns.colPos0[1];
    if (section.type !== 'hanthaincludepage_includepage') throw new Error('expected includepage');
    const { container } = render(<IncludePage section={section} />);
    expect(container.firstElementChild?.className).toContain('mask_hanthainclude');
    expect(container.firstElementChild?.className).toContain('pt-0');
    const rte = container.querySelector('.t3-ce-rte.legal-content');
    expect(rte).not.toBeNull();
    expect(rte?.innerHTML.length).toBeGreaterThan(9000);
  });
});

describe('CookieConsentButton', () => {
  it('renders a button with the section copy that opens preferences on click', async () => {
    const { showPreferences } = await import('vanilla-cookieconsent');
    const section = cookies.columns.colPos0[2];
    if (section.type !== 'mask_cookieconsentbutton') throw new Error('expected cookieconsentbutton');
    const { getByRole } = render(<CookieConsentButton section={section} />);
    const button = getByRole('button', { name: 'Cookies settings' });
    button.click();
    expect(showPreferences).toHaveBeenCalledTimes(1);
  });
});
