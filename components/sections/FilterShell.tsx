'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Appearance } from '@/lib/content';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { setHeaderForceHover } from '@/lib/headerHover';
import { getSmoother } from '@/lib/smoother';
import { suppressNextScrollReset } from '@/lib/links';

export type FilterShellItem = { uid: string; title: string; href: string };
type FilterMeta = { title: string; description: string };

type Props = {
  id: number;
  appearance: Appearance;
  variant: 'pagefilter' | 'rooms';
  items: FilterShellItem[];
  nodes: ReactNode[];
  activeIndex: number | null;
  metaByIndex: FilterMeta[];
};

// pagefilter.css/rooms.css: .filterGrid{background-image:linear-gradient(0);
// transition:background-color .3s ease;z-index:55}. The two mask types share
// byte-identical CSS (confirmed: only the mask_pagefilter/mask_rooms class
// name differs between the two source stylesheets).
const filterGridBaseCls = 'filterGrid grid-container [background-image:linear-gradient(0)] transition-colors duration-300 ease-in-out z-[55]';
// .grid-container-inner{border-bottom:2px solid #e4e0db;grid-column-end:span 12;grid-column-start:2}
// + mobile{border-bottom:none;grid-column-end:span 12;grid-column-start:2}
const gridInnerCls = 'grid-container-inner col-start-2 col-span-12 border-b-2 border-[#e4e0db] max-lg:border-b-0';
// .filter-wrapper{display:flex;grid-column-end:span 9;grid-column-start:4;width:100%}
// + mobile{grid-column-end:span 12;grid-column-start:1;overflow:auto}
const filterWrapperCls = 'filter-wrapper flex w-full col-start-4 col-span-9 max-lg:col-start-1 max-lg:col-span-12 max-lg:overflow-x-auto';
// .filter-item{cursor:pointer;font-size:2.5rem;font-weight:300;letter-spacing:.05em;
// line-height:148%;margin-right:3rem;text-decoration:underline;text-decoration-color:
// transparent;text-transform:uppercase;transition:all .5s} + :last-child{margin-right:0}
// + :hover{text-decoration-color:currentColor} + .active{text-decoration-color:
// currentColor;text-shadow:0 0 #000} + mobile{font-size:1.6rem;letter-spacing:0;
// line-height:156%;margin-right:2rem} + mobile:last-child{margin-right:0;padding-right:1rem}
function filterItemCls(isActive: boolean) {
  return [
    'filter-item cursor-pointer font-light text-[2.5rem] tracking-[.05em] leading-[148%] uppercase',
    'mr-[3rem] last:mr-0 transition-all duration-500 underline decoration-transparent hover:decoration-current',
    'max-lg:text-[1.6rem] max-lg:tracking-normal max-lg:leading-[156%] max-lg:mr-[2rem] max-lg:last:mr-0 max-lg:last:pr-[1rem]',
    isActive ? 'active decoration-current [text-shadow:0_0_#000]' : '',
  ].filter(Boolean).join(' ');
}
// Mobile-only dark SVG blob background (pagefilter.css/rooms.css, mobile block):
// fill='%23211D1D' (ink -- NOT the beige-fill token; this one wasn't in spec
// §16.3's enumerated fill-swap list). Same technique as Header.tsx's own mobile
// blob (a data-URI SVG, fill parameterised via re-export -- this one is used
// verbatim since its fill is already the unchanged ink colour).
const mobileBlobCls =
  "max-lg:[background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg_xmlns='http://www.w3.org/2000/svg'_width='360'_height='53'_fill='none'%3E%3Cpath_fill='%23211D1D'_d='M269.043_0H-7.605c-.997_10.83.235_37.594_0_52.772_2.23.354.645.123.997.164_1.936.369_3.144-1.213_5.608-1.13L41_53l45.5-1.194L312.5_53l49.002-1.194_4.32-32.967L367_0z'/%3E%3C/svg%3E\")] max-lg:bg-[length:100%] max-lg:bg-no-repeat max-lg:bg-bottom max-lg:pt-[2.5rem] max-lg:pb-[1rem] max-lg:mt-[6rem]";
// mobile .filter-wrapper{color:#e4e0db} -- text colour on the dark blob, not a
// fill per §16.3's enumerated swap list, so this stays the original border/text hex.
const mobileTextCls = 'max-lg:text-[#e4e0db]';

export function FilterShell({ id, appearance, variant, items, nodes, activeIndex, metaByIndex }: Props) {
  const [active, setActive] = useState(activeIndex);
  const [isPinned, setIsPinned] = useState(false);
  const filterOuterRef = useRef<HTMLDivElement>(null);
  const filterGridRef = useRef<HTMLDivElement>(null);
  const hasCreatedTrigger = useRef(false);
  // Seeded from the current value at render time, not toggled inside the
  // effect -- see ScrollResetOnNavigate.tsx's identical pattern and comment
  // for why a naive "skip the first call" boolean flag doesn't survive
  // React's dev-mode double-invoke: the second (delayed) synthetic
  // invocation would see the flag already flipped and incorrectly proceed.
  // Comparing against the last value actually processed instead means both
  // synthetic invocations compare `active` to itself and skip; only a real
  // click (a real change to `active`) fires the effect body.
  const lastActive = useRef(active);

  // If this component unmounts while hovered (or isPinned flips false under
  // a stationary cursor), setHeaderForceHover(true) above would otherwise
  // never be reset, leaving the header stuck in its hovered visual state for
  // the rest of the session.
  useEffect(() => () => setHeaderForceHover(false), []);

  const headerHeight = () => {
    if (typeof window === 'undefined') return 10;
    if (window.innerWidth < 1024) {
      const upper = document.querySelector<HTMLElement>('header .upper');
      return (upper?.clientHeight ?? 10) - 10;
    }
    return 10 * parseFloat(getComputedStyle(document.documentElement).fontSize);
  };

  // spec §9.15: ScrollTrigger created 500ms after first content load; on
  // later switches, ScrollTrigger.refresh() after 100ms instead of recreating.
  // contextSafe wraps the setTimeout callback below because @gsap/react's
  // useGSAP context-tracking is only active for the synchronous duration of
  // the callback passed to useGSAP -- anything GSAP-related created inside an
  // async callback (like this setTimeout) runs after that window has closed
  // and is never added to the component's GSAP context, so it would never be
  // auto-reverted/killed on unmount. Same pattern and rationale as
  // Header.tsx's own contextSafe usage (see the comment there): this app
  // keeps Header/SmoothScroll mounted across client-side navigations, so an
  // un-wrapped ScrollTrigger.create() here would leak a live, permanently
  // pinned trigger every time this component unmounts after the 500ms delay
  // has elapsed.
  // The callback below takes `contextSafe` as its second parameter (rather
  // than using the value destructured from useGSAP's return below) because
  // useGSAP only returns that value once the call completes -- referencing
  // the destructured `contextSafe` from inside this same synchronous
  // callback would hit it in its temporal-dead-zone and throw. Taking it as
  // a parameter is the documented @gsap/react way to get contextSafe inside
  // the callback passed to useGSAP itself.
  const { contextSafe } = useGSAP((_context, contextSafeInline) => {
    if (!filterOuterRef.current || !filterGridRef.current) return;
    const timer = setTimeout(
      contextSafeInline!(() => {
        ScrollTrigger.create({
          trigger: filterOuterRef.current!,
          start: `-${headerHeight()} top`,
          end: 'bottom top',
          pin: filterGridRef.current!,
          pinSpacing: false,
          onEnter: () => setIsPinned(true),
          onLeave: () => setIsPinned(false),
          onEnterBack: () => setIsPinned(true),
          onLeaveBack: () => setIsPinned(false),
        });
        hasCreatedTrigger.current = true;
      }),
      500
    );
    return () => clearTimeout(timer);
  }, { scope: filterOuterRef });

  // Handler stays synchronous-only: flip the active index, update the URL bar
  // and document metadata. The actual scroll (below, in a useEffect keyed on
  // `active`) has to wait until AFTER React has committed the newly active
  // suite's content -- see that effect's own comment for why.
  const handleClick = (index: number) => {
    if (index === active) return;
    setActive(index);
    const meta = metaByIndex[index];
    // react-hooks/immutability flags mutating document as a render-time concern
    // for the compiler's static analysis, but this only ever runs from a click
    // handler, never during render -- same class of false positive as
    // Header.tsx's react-hooks/refs suppressions on its own event handlers.
    // eslint-disable-next-line react-hooks/immutability
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    // ScrollResetOnNavigate.tsx reacts to this pushState too (Next's router
    // surfaces it via usePathname() regardless of how the URL changed) --
    // suppress its jumpToTop() for this one change, since the effect below
    // already scrolls the page itself; see suppressNextScrollReset's own
    // comment in lib/links.ts for the full explanation.
    suppressNextScrollReset();
    window.history.pushState({}, '', items[index].href);
  };

  // Runs after React commits the newly active suite's content. Guarded with
  // the lastActive-ref comparison above (not a plain "skip the first run"
  // flag) so React's dev-mode double-invoke of this effect doesn't fire it a
  // second, unwanted time on mount -- ScrollResetOnNavigate.tsx has the same
  // pattern and the full explanation for why the naive version breaks.
  // Two real bugs lived in the previous same-tick version of this logic:
  // 1) Scrolling `window` via gsap.to(...) is what caused the switch to
  //    visibly jump then glide down: GSAP's ScrollToPlugin auto-detects the
  //    active ScrollSmoother and hands the animation off to it, but the
  //    smoother then eases using its own `smooth: 1.5` config, not the
  //    tween's `duration` -- so window.scrollY snapped to the target in a
  //    single frame (the jump) while the smoother's separately-driven visual
  //    transform only caught up afterward (the glide down), two systems
  //    animating the same motion out of step. Calling the smoother's own
  //    scrollTo() directly (same pattern as jumpToTop() in lib/links.ts)
  //    keeps it to one coherent, smooth motion.
  // 2) Even switched to smoother.scrollTo(), calling it synchronously --
  //    including from this very effect, still in the same commit/paint cycle
  //    as the newly active content landing -- silently did nothing: verified
  //    empirically that only deferring the call past that same cycle (a
  //    setTimeout, same as this effect's own sibling below for the initial
  //    ScrollTrigger.create()) makes it actually animate. The effect above
  //    still does the useful part (correctly gating on a real `active`
  //    change); this timeout is what gets the timing right on top of that.
  // contextSafe wraps the callback because it creates a GSAP tween outside
  // the synchronous useGSAP window; ScrollTrigger.refresh() itself doesn't
  // need wrapping since it only re-measures already-tracked triggers rather
  // than creating a new one.
  useEffect(() => {
    if (lastActive.current === active) return;
    lastActive.current = active;
    const timer = setTimeout(
      contextSafe(() => {
        // Refresh before scrolling, not after: the previous 100ms-later
        // refresh could land mid-tween and yank the position, another source
        // of the same jump/glide glitch. Refreshing first means the scroll
        // animates against already-correct bounds for the new content's height.
        if (hasCreatedTrigger.current) ScrollTrigger.refresh();
        const smoother = getSmoother();
        if (smoother) smoother.scrollTo(filterOuterRef.current!, true);
        else gsap.to(window, { duration: 0.2, scrollTo: { y: filterOuterRef.current!.offsetTop, offsetY: 0 } });
      }),
      0
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maskType = variant === 'pagefilter' ? 'mask_pagefilter' : 'mask_rooms';
  const maskCls = [appearance.layout, `space-before-${appearance.spaceBefore}`, 'mask', maskType].filter(Boolean).join(' ');
  const filterGridCls = [filterGridBaseCls, isPinned ? 'filter-hover' : '', mobileBlobCls].filter(Boolean).join(' ');

  return (
    <div className={maskCls} {...{ uid: `c${id}` }}>
      <div ref={filterOuterRef} className="filterOuter">
        <div
          ref={filterGridRef}
          className={filterGridCls}
          onMouseEnter={() => { if (isPinned) setHeaderForceHover(true); else setHeaderForceHover(false); }}
          onMouseLeave={() => setHeaderForceHover(false)}
        >
          <div className={gridInnerCls}>
            <div className={`${filterWrapperCls} ${mobileTextCls}`}>
              {items.map((item, i) => (
                <div key={item.uid} className={filterItemCls(i === active)} onClick={() => handleClick(i)}>
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        </div>
        {active !== null ? nodes[active] : null}
      </div>
    </div>
  );
}
