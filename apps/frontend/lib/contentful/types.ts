import type { Document } from "@contentful/rich-text-types";

export type ContentfulImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type HomeHero = {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: ContentfulImage | null;
};

export type HomeImageTextSection = {
  title: string;
  content: Document;
  imageAlignment: "left" | "right";
  image: ContentfulImage | null;
};

export type HomeFeaturedSection = {
  title: string;
  creatureIds: string[];
};

export type HomePageData = {
  title: string;
  slug: string;
  hero: HomeHero | null;
  imageTextSection: HomeImageTextSection | null;
  featuredSection: HomeFeaturedSection | null;
};

export type CreatureCard = {
  id: string;
  name: string;
  slug: string;
  shortDescription: {
    json?: unknown;
  } | null;
  image: ContentfulImage | null;
  creatureIndex: number | null;
  rating: number | null;
};

export type GetCreaturesParams = {
  page?: number;
  limit?: number;
  taxonomyIds?: string[];
};

export type PaginatedCreatures = {
  items: CreatureCard[];
  total: number;
  page: number;
  limit: number;
};

export type CreatureDetail = {
  id: string;
  name: string;
  slug: string;
  shortDescription: Record<string, unknown> | null;
  description: unknown;
  image: ContentfulImage | null;
  creatureIndex: number | null;
  height: number | null;
  weight: number | null;
  abilities: string[];
  externalResourceLink: string;
  rating: number | null;
  taxonomyIds: string[];
};

export type ArchivePageData = {
  title: string;
  slug: string;
  pageTitle: string;
  pageDescription: string;
};

export type TaxonomyType = "category" | "segment" | "locale";

export type TaxonomyTermFields = {
  title: string;
  slug: string;
  type: TaxonomyType;
  parent?: {
    sys?: {
      id?: string;
    };
  };
};

export type TaxonomyTerm = {
  id: string;
  title: string;
  slug: string;
  type: TaxonomyType;
  parentId: string | null;
};
