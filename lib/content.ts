export type Crop = { x: number; y: number; width: number; height: number };
export type ImageRef = {
  src: string; width: number; height: number; alt: string; title: string | null; mime: string;
  crop: { default: Crop; mobile: Crop };
};
export type VideoRef = { src: string; mime: string };
export type Html = string;
// TYPO3 link fields carry more than href/target (class, title, linkText,
// additionalAttributes); the generator copies them through unchanged, so the
// type keeps them too rather than silently dropping data the site actually has.
export type LinkRef = {
  href: string; target: string | null; class: string | null; title: string | null;
  linkText: string; additionalAttributes: unknown[];
};
export type Appearance = { layout: string; frameClass: string; spaceBefore: '' | 'small' | 'medium' | 'large'; spaceAfter: string };

type Base<T extends string, C> = { id: number; type: T; appearance: Appearance; content: C };

export type HeroSection = Base<'mask_hero', {
  herolayout: 'default' | 'subpage' | 'only-text'; title: Html; titleh2: Html; titleimg: Html; text: Html;
  img: ImageRef[]; sideimg: ImageRef[]; imgsummer: ImageRef[]; sideimgsummer: ImageRef[];
}>;
export type ImgTextSection = Base<'mask_imgtext', {
  title: Html; text: Html; imgleft: ImageRef[]; imgright: ImageRef[]; imgleftsummer: ImageRef[]; imgrightsummer: ImageRef[];
}>;
export type ImgSection = Base<'mask_img', { img: ImageRef[]; imgsummer: ImageRef[] }>;
export type VideoSection = Base<'mask_video', { video: VideoRef[]; videosummer: VideoRef[] }>;
export type QuoteSection = Base<'mask_quote', { quote: Html; autor: string; img: ImageRef[] }>;
export type BreakSection = Base<'mask_break', {
  title: Html; imgleft: ImageRef[]; imgleftsummer: ImageRef[]; imgright: ImageRef[]; imgrightsummer: ImageRef[];
}>;
export type Room = {
  uid: string; pid: string; title: string; description: Html; minprice: string; people: string; size: string;
  previewimage: ImageRef[]; images: ImageRef[];
};
export type RoomSliderSection = Base<'mask_roomslider', { rooms: Room[] }>;
export type TeaserSlide = {
  uid: string; title: Html; imgleft: ImageRef[]; imgright: ImageRef[]; infotext: Html; linktext: string; link: LinkRef | '';
};
export type TeaserSliderSection = Base<'mask_teaserslider', { teaserslides: TeaserSlide[] }>;
export type Partner = { uid: string; img: ImageRef[]; link: LinkRef | '' };
export type PartnerMarqueeSection = Base<'mask_partnermarquee', { title: Html; text: Html; partners: Partner[] }>;
export type FooterPageTextSection = Base<'mask_footerpagetext', { title: Html; text: Html }>;
export type IncludePageSection = Base<'hanthaincludepage_includepage', { html: Html }>;
export type CookieConsentButtonSection = Base<'mask_cookieconsentbutton', { buttontext: string }>;
export type AccordionItem = { uid: string; title: Html; info: Html; text: Html; linktext: string; link: LinkRef | '' };
export type AccordionsSection = Base<'mask_accordions', { title: Html; text: Html; accordion: AccordionItem[] }>;
export type ListItem = { uid: string; title: Html; text: Html };
export type ListSection = Base<'mask_list', { title: Html; text: Html; listitems: ListItem[] }>;
export type GallerySliderSection = Base<'mask_galleryslider', { images: ImageRef[] }>;
export type GallerySection = Base<'mask_gallery', { images: ImageRef[] }>;
export type NewsletterWidgetSection = Base<'mask_widget_newsletter', Record<string, never>>;
export type VoucherWidgetSection = Base<'mask_widget_voucher', Record<string, never>>;
// `type: string` here would defeat literal narrowing on `Section.type` for
// every other member (a bare string catch-all can't be excluded when a caller
// checks `section.type !== 'mask_hero'`), so this lists the content-element
// types seen across docs/reference/pages/*.json that don't have a Section yet.
// Add to this list, not back to `string`, when a newly crawled page needs one.
export type UnknownSection = {
  id: number;
  type:
    | 'mask_imgslider' | 'mask_jobs' | 'mask_maps' | 'mask_pagefilter' | 'mask_roomcta'
    | 'mask_roomdetail' | 'mask_rooms' | 'powermail_pi1' | 'room';
  appearance: Appearance;
  content: Record<string, unknown>;
};

export type Section =
  | HeroSection | ImgTextSection | ImgSection | VideoSection | QuoteSection | BreakSection
  | RoomSliderSection | TeaserSliderSection | PartnerMarqueeSection
  | FooterPageTextSection | IncludePageSection | CookieConsentButtonSection
  | AccordionsSection | ListSection | GallerySliderSection | GallerySection
  | NewsletterWidgetSection | VoucherWidgetSection | UnknownSection;

export type PageMeta = {
  title: string; description: string; ogTitle: string; ogDescription: string; ogImage: ImageRef | null;
  twitterTitle: string; twitterDescription: string; twitterImage: ImageRef | null; twitterCard: string;
  robots: { noIndex: boolean; noFollow: boolean };
};
export type PageContent = {
  id: number; slug: string; backendLayout: string; meta: PageMeta;
  columns: { colPos0: Section[]; colPos5?: Section[] };
};
