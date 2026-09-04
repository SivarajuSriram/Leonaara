import type { Ref, MouseEvent } from 'react';
import { MenuIcon } from '@/components/ui/icons';
import { site } from '@/content/site';

type Props = { ref: Ref<HTMLAnchorElement>; onClick: () => void };

export function MenuButton({ ref, onClick }: Props) {
  const handleClick = (event: MouseEvent) => { event.preventDefault(); onClick(); };
  return (
    <a href="#" ref={ref} onClick={handleClick} className="menu-button" aria-label={site.t.menu}>
      <MenuIcon />
    </a>
  );
}
