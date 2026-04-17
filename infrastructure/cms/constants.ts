export const CONTENT_TYPE_IDS = {
  taxonomyTerm: "taxonomyTerm",
  creature: "creature",
  heroBlock: "heroBlock",
  imageTextBlock: "imageTextBlock",
  featuredCreaturesBlock: "featuredCreaturesBlock",
  homePage: "homePage",
  archivePage: "archivePage",
} as const;

export const TAXONOMY_TYPES = {
  element: "element",
  habitat: "habitat",
  shape: "shape",
  eggGroup: "egg-group",
} as const;

export const TAXONOMY_TERM_FIELD_IDS = {
  title: "title",
  slug: "slug",
  type: "type",
  parent: "parent",
} as const;

export const CREATURE_FIELD_IDS = {
  entryId: "entryId",
  name: "name",
  slug: "slug",
  shortDescription: "shortDescription",
  description: "description",
  coverImage: "coverImage",
  creatureIndex: "creatureIndex",
  height: "height",
  weight: "weight",
  abilities: "abilities",
  externalResourceLink: "externalResourceLink",
  taxonomies: "taxonomies",
  rating: "rating",
} as const;

export const HERO_BLOCK_FIELD_IDS = {
  title: "title",
  subtitle: "subtitle",
  backgroundImage: "backgroundImage",
  ctaText: "ctaText",
  ctaLink: "ctaLink",
} as const;

export const IMAGE_TEXT_BLOCK_FIELD_IDS = {
  title: "title",
  content: "content",
  image: "image",
  imageAlignment: "imageAlignment",
} as const;

export const FEATURED_CREATURES_BLOCK_FIELD_IDS = {
  tile: "tile",
  creatures: "creatures",
} as const;

export const HOME_PAGE_FIELD_IDS = {
  title: "title",
  slug: "slug",
  hero: "hero",
  imageTextSection: "imageTextSection",
  featuredSection: "featuredSection",
} as const;

export const ARCHIVE_PAGE_FIELD_IDS = {
  title: "title",
  slug: "slug",
  pageTitle: "pageTitle",
  pageDescription: "pageDescription",
} as const;
