import type { Ref, MouseEvent } from 'react';
import { MenuIcon } from '@/components/ui/icons';
import { site } from '@/content/site';

type Props = { ref: Ref<HTMLAnchorElement>; onClick: () => void };

export function MenuButton({ ref, onClick }: Props) {
  const handleClick = (event: MouseEvent) => { event.preventDefault(); onClick(); };
  return (
    // header .menu-button{z-index:120}; mobile adds display:flex;justify-content:flex-end.
    // header .menu-wrapper a{pointer-events:auto}, mobile width:100%.
    // header .menu-wrapper svg{height:2.9rem;width:5.5rem}, mobile height:1.8rem;width:3.5rem —
    // MenuIcon renders a bare <svg className="menuIcon filled">, and passing className here would
    // replace (not merge with) that hardcoded class, dropping "filled" (which .filled *{fill:
    // currentColor} in links.css relies on) — so the sizing is applied via an [&_svg] descendant
    // variant on this wrapping <a> instead, matching the original's plain `svg` tag selector.
    <a
      href="#"
      ref={ref}
      onClick={handleClick}
      className="menu-button text-ink no-underline z-[120] pointer-events-auto [&_svg]:h-[2.9rem] [&_svg]:w-[5.5rem] max-lg:flex max-lg:justify-end max-lg:w-full max-lg:[&_svg]:h-[1.8rem] max-lg:[&_svg]:w-[3.5rem]"
      aria-label={site.t.menu}
    >
      <MenuIcon />
    </a>
  );
}
