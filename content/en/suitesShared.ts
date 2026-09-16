import type { HeroSection, RoomsSection } from '@/lib/content';

// titleh2/text intentionally left empty: this Hero is kept only as the
// scroll anchor the fixed site logo needs to fade against (see
// app/projects/kadamba/page.tsx's comment) -- the "Structure and shelter"
// heading/paragraph were removed from both project pages at the user's
// request.
export const suitesHero: HeroSection = { id: 104, type: 'mask_hero', appearance: { layout: "default", frameClass: "default", spaceBefore: "", spaceAfter: "" }, content: { herolayout: "only-text", title: "", titleh2: "", titleimg: "", text: "", img: [], sideimg: [], imgsummer: [], sideimgsummer: [] } };

export const suitesRooms: RoomsSection = { id: 97, type: 'mask_rooms', appearance: { layout: "default", frameClass: "default", spaceBefore: "", spaceAfter: "" }, content: { rooms: [{ uid: "3", title: "kadamba", slug: "/projects/kadamba/", pid: "84" },{ uid: "4", title: "anantha meadows", slug: "/projects/ananthameadows/", pid: "85" }] } };
