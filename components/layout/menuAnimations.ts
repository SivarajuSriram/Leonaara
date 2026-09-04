// components/layout/menuAnimations.ts
// Every number below is copied from the original site's menu timeline.
import { gsap } from '@/lib/gsap';

// MorphSVG targets: the three hamburger bars (CLOSED) and the X they turn into (OPEN).
export const OPEN = {
  a1: 'M14.0926 14.4781L14.1354 14.5093L32.5702 28.2398C33.1876 27.4615 33.8973 26.5473 34.5641 25.6695L17.7142 14.0586C17.6904 14.0415 17.6678 14.0244 17.6462 14.0071L1.88541 2.21653L0.0915469 4.88732L14.0926 14.4781Z',
  a2: 'M17.1415 11.977L17.0871 12.0075L2.20727 20.1575C2.70282 20.9742 3.2845 21.8943 3.82103 22.6237L26.8157 8.88441L26.87 8.85386L38.5519 2.52055L37.0445 0.0300942L17.1415 11.977Z',
  a3: 'M17.1415 11.977L17.0871 12.0075L2.20727 20.1575C2.70282 20.9742 3.2845 21.8943 3.82103 22.6237L26.8157 8.88441L26.87 8.85386L38.5519 2.52055L37.0445 0.0300942L17.1415 11.977Z',
};
export const CLOSED = {
  a1: 'M36.3057 16.978V16.9771L54.8613 17.4722L54.7842 13.7183L44.9854 13.6563L22.6577 14.0347L0.0698225 13.5278L0.0390625 17.519L36.2334 16.9771L36.3057 16.978Z',
  a2: 'M23.3623 5.89111L23.4346 5.8916L54.7588 6.43066C54.8232 5.07812 54.8818 3.50195 54.9219 2L27.0376 2.54688C26.9976 2.54688 26.959 2.5459 26.9214 2.54395L0.0996094 2.02588L0.237789 6.40869L23.3623 5.89111Z',
  a3: 'M23.2022 25.1362L23.1172 25.1353L0 24.6147C0.02832 25.9165 0.08789 27.3989 0.22412 28.6255L36.7285 28.0786L36.8135 28.0796L54.918 28.5649L54.8359 24.5981L23.2022 25.1362Z',
};

export type MenuParts = { panel: HTMLElement; background: HTMLElement; icon: HTMLElement };

function morphIcon(icon: HTMLElement, to: typeof OPEN) {
  gsap.to(icon.querySelector('.a1'), { duration: 0.5, morphSVG: to.a1 });
  gsap.to(icon.querySelector('.a2'), { duration: 0.5, morphSVG: to.a2 });
  gsap.to(icon.querySelector('.a3'), { duration: 0.5, morphSVG: to.a3 });
}

function panelParts(panel: HTMLElement) {
  return {
    items: panel.querySelectorAll('.level-0'),
    info: panel.querySelector('.nav-info'),
    lang: panel.querySelector('.nav-lang'),
    hr: panel.querySelector('.mobile-hr'),
  };
}

export function openMenu({ panel, background, icon }: MenuParts) {
  const { items, info, lang, hr } = panelParts(panel);
  gsap.to(background, { autoAlpha: 1, duration: 0.8, ease: 'power1.out' });
  gsap.to(panel, { y: 0, duration: 1, delay: 0.5, ease: 'expoScale(10,2.5,power1.inOut)' });
  gsap.fromTo(items, { opacity: 0, y: '10px' }, { opacity: 0.6, y: '0', stagger: 0.1, delay: 0.6, duration: 1, ease: 'sine.out' });
  gsap.fromTo(info, { opacity: 0 }, { opacity: 1, delay: 1, duration: 1, ease: 'power1.out' });
  gsap.fromTo(lang, { opacity: 0 }, { opacity: 1, delay: 1, duration: 1, ease: 'power1.out' });
  gsap.fromTo(hr, { opacity: 0 }, { opacity: 1, delay: 1, duration: 1, ease: 'power1.out' });
  morphIcon(icon, OPEN);
}

export function closeMenu({ panel, background, icon }: MenuParts) {
  const { items, info, lang, hr } = panelParts(panel);
  gsap.to(panel, { y: '-101%', duration: 0.6, ease: 'power1.inOut' });
  gsap.to(background, { autoAlpha: 0, duration: 0.5 });
  gsap.fromTo(items, { opacity: 1 }, { opacity: 0, duration: 0.1, stagger: 0, ease: 'power1.in' });
  gsap.fromTo(info, { opacity: 1 }, { opacity: 0, duration: 0.1, ease: 'power1.in' });
  gsap.fromTo(lang, { opacity: 1 }, { opacity: 0, duration: 0.1, ease: 'power1.in' });
  gsap.fromTo(hr, { opacity: 1 }, { opacity: 0, duration: 0.1, ease: 'power1.in' });
  morphIcon(icon, CLOSED);
}
