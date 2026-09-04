import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as Icons from '@/components/ui/icons';

const expected: Record<string, string> = {
  MenuIcon: '0 0 55 29', LogoIcon: '0 0 567 217', TelIcon: '0 0 28 28', MailIcon: '0 0 33 29', MapIcon: '0 0 23 30',
  VoucherIcon: '0 0 21 31', GalleryIcon: '0 0 30 26', ArrowSliderIcon: '0 0 70 25', SubmenuIcon: '0 0 13 8', UnikateurIcon: '0 0 71 11',
};

describe('icons', () => {
  for (const [name, viewBox] of Object.entries(expected)) {
    it(`${name} renders the original viewBox`, () => {
      const Cmp = (Icons as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>)[name];
      const { container } = render(<Cmp />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('viewBox')).toBe(viewBox);
      expect(svg?.querySelectorAll('path').length).toBeGreaterThan(0);
    });
  }
  it('MenuIcon exposes the three morph targets', () => {
    const { container } = render(<Icons.MenuIcon />);
    expect(container.querySelector('path.a1')).not.toBeNull();
    expect(container.querySelector('path.a2')).not.toBeNull();
    expect(container.querySelector('path.a3')).not.toBeNull();
    expect(container.querySelector('svg')?.getAttribute('class')).toBe('menuIcon filled');
  });
  it('LogoIcon has the six logo paths', () => {
    const { container } = render(<Icons.LogoIcon />);
    expect(container.querySelectorAll('path').length).toBe(6);
  });
});
