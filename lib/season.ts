// Port of the typo3 store getter `isWinter`.
import { site } from '@/content/site';

export function isWinter(now: Date, start: number, end: number): boolean {
  if (!(start && end)) return false;
  const s = new Date(start * 1000);
  const e = new Date(end * 1000);
  s.setFullYear(now.getFullYear());
  e.setFullYear(now.getFullYear());
  if (e < s) e.setFullYear(e.getFullYear() + 1);
  return !(now >= s && now <= e);
}

export function useIsWinter(): boolean {
  return isWinter(new Date(), site.season.seasonswitchstart, site.season.seasonswitchend);
}
