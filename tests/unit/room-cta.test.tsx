import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { RoomCta } from '@/components/sections/RoomCta';
import type { RoomCtaSection } from '@/lib/content';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/suites/boum/' }));
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => <a href={href} {...rest}>{children}</a>,
}));

const section: RoomCtaSection = {
  id: 107, type: 'mask_roomcta',
  appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
  content: { room: { uid: '3', title: 'boum', asacode: '1', bookingcode: '' } },
};

describe('RoomCta', () => {
  it('renders Request and Book links with the room codes in the query string', () => {
    const { container } = render(<RoomCta section={section} />);
    const links = container.querySelectorAll('a.ht-biglink');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('/request/?room=1');
    expect(links[1].getAttribute('href')).toContain('&room=');
  });
});
