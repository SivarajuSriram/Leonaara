// lib/accordionIcons.ts
// Four "plus" icon variants (i-accordionIcon1..4, cycling by index % 4), extracted
// from the live site's rendered SVG (.accordion-icon .a1/.a2 path `d` attributes)
// at https://eriro.at/en/alpine-hide/. OPEN_ICON is the single shared target both
// paths morph to when an accordion opens (both a1 and a2 converge on the same
// horizontal "minus" bar) -- confirmed identical across every variant on the live
// site, matching spec §9.13's "icon .a1 and .a2 morph to the horizontal bar path".
export const ICON_VARIANTS = [
  { a1: 'M9.898 10.939 0 11l.357-.985 8.572.031L20 10l-.46.985z', a2: 'M10.062 9.898 10 0l.985.357-.031 8.572L11 20l-.985-.46z' },
  { a1: 'M8.47 9.134h-.03l-8.42-.13c.01.323-.05 1.191 0 1.496l13.376-.636h.031l6.593.121L19.99 9z', a2: 'm11.135 9.913.234-9.896-.99.34-.12 8.571-.239 11.069.993-.442z' },
  { a1: 'm10.003 13.26-.005 6.771.94-.044-.047-3.575-.237-8.142L11 .01l-1 .006-.363 9z', a2: 'M11.526 9.974H11.5L.076 9.651c-.029.305-.056.66-.077.999l10.173.054q.022 0 .043.002l9.781.287-.033-.99z' },
  { a1: 'm13.23 9.864 6.77.124-.028-.94-3.575-.016-8.145.095L.012 9 0 10l13.204-.136z', a2: 'M10.122 8.487v.026L10 19.94c.305.023.661.044 1 .059l-.123-10.173v-.042L10.994 0l-.989.05z' },
] as const;

export const OPEN_ICON = {
  a1: 'M9.89796 10.9385L0 11L0.357143 10.0154L8.92857 10.0462L20 10L19.5408 10.9846L9.89796 10.9385Z',
  a2: 'M9.89796 10.9385L0 11L0.357143 10.0154L8.92857 10.0462L20 10L19.5408 10.9846L9.89796 10.9385Z',
} as const;
