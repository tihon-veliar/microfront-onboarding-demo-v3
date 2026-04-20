import type {
  ContentfulImage,
  HomeFeaturedSection,
  HomeHero,
  HomeImageTextSection,
  HomePageData,
  CreatureCard,
  CreatureDetail,
  ArchivePageData,
  TaxonomyTerm,
  TaxonomyType,
  SeoFields,
} from "./types";
import type { Document } from "@contentful/rich-text-types";

type ContentfulAsset = {
  fields?: {
    title?: string;
    description?: string;
    file?: {
      url?: string;
      details?: {
        image?: {
          width?: number;
          height?: number;
        };
      };
    };
  };
};

type ContentfulEntryLink = {
  sys?: {
    id?: string;
  };
};

type HeroBlockEntry = {
  fields?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundImage?: ContentfulAsset;
  };
};

type ImageTextBlockEntry = {
  fields?: {
    title?: string;
    content?: unknown;
    imageAlignment?: string;
    image?: ContentfulAsset;
  };
};

type FeaturedCreaturesBlockEntry = {
  fields?: {
    tile?: string;
    title?: string;
    creatures?: ContentfulEntryLink[];
  };
};

type SeoEntry = {
  fields?: {
    title?: string;
    description?: string;
    image?: ContentfulAsset;
  };
};

type HomePageEntry = {
  fields?: {
    title?: string;
    slug?: string;
    seo?: SeoEntry;
    hero?: HeroBlockEntry;
    imageTextSection?: ImageTextBlockEntry;
    featuredSection?: FeaturedCreaturesBlockEntry;
  };
};

type GraphQLAsset = {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  width?: number | null;
  height?: number | null;
};

type GraphQLTaxonomyItem = {
  sys?: {
    id?: string | null;
  };
};

type GraphQLCreature = {
  sys?: {
    id?: string | null;
  };
  name?: string | null;
  slug?: string | null;
  shortDescription?: {
    json?: unknown;
  } | null;
  description?: {
    json?: unknown;
  } | null;
  coverImage?: GraphQLAsset | null;
  creatureIndex?: number | null;
  height?: number | null;
  weight?: number | null;
  abilities?: Array<string | null> | null;
  externalResourceLink?: string | null;
  rating?: number | null;
  taxonomiesCollection?: {
    items?: Array<GraphQLTaxonomyItem | null> | null;
  } | null;
};

export function mapSeo(entry?: SeoEntry): SeoFields | null {
  const fields = entry?.fields;

  if (!fields) {
    return null;
  }

  return {
    title: fields.title || "",
    description: fields.description || "",
    image: mapAssetImage(fields.image),
  };
}

function mapRichTextDocument(value: unknown): Document | null {
  if (
    value &&
    typeof value === "object" &&
    "nodeType" in value &&
    value.nodeType === "document" &&
    "content" in value &&
    Array.isArray(value.content) &&
    "data" in value
  ) {
    return value as Document;
  }

  return null;
}

export function mapGraphQLAssetImage(asset?: GraphQLAsset | null): ContentfulImage | null {
  if (!asset?.url || !asset.width || !asset.height) {
    return null;
  }

  return {
    url: normalizeContentfulUrl(asset.url),
    width: asset.width,
    height: asset.height,
    alt: asset.description || asset.title || "",
  };
}

export function mapCreatureDetail(entry: GraphQLCreature): CreatureDetail {
  return {
    id: entry.sys?.id || "",
    name: entry.name || "",
    slug: entry.slug || "",
    shortDescription: mapRichTextDocument(entry.shortDescription?.json),
    description: mapRichTextDocument(entry.description?.json),
    image: mapGraphQLAssetImage(entry.coverImage),
    creatureIndex: typeof entry.creatureIndex === "number" ? entry.creatureIndex : null,
    height: typeof entry.height === "number" ? entry.height : null,
    weight: typeof entry.weight === "number" ? entry.weight : null,
    abilities: (entry.abilities || []).filter((value): value is string => Boolean(value)),
    externalResourceLink: entry.externalResourceLink || "",
    rating: typeof entry.rating === "number" ? entry.rating : null,
    taxonomyIds: (entry.taxonomiesCollection?.items || [])
      .map((item) => item?.sys?.id)
      .filter((id): id is string => Boolean(id)),
  };
}

function normalizeContentfulUrl(url: string): string {
  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  return url;
}

export function mapAssetImage(asset?: ContentfulAsset): ContentfulImage | null {
  const url = asset?.fields?.file?.url;
  const width = asset?.fields?.file?.details?.image?.width;
  const height = asset?.fields?.file?.details?.image?.height;

  if (!url || !width || !height) {
    return null;
  }

  return {
    url: normalizeContentfulUrl(url),
    width,
    height,
    alt: asset?.fields?.description || asset?.fields?.title || "",
  };
}

export function mapHeroBlock(entry?: HeroBlockEntry): HomeHero | null {
  const fields = entry?.fields;

  if (!fields) {
    return null;
  }

  return {
    title: fields.title || "",
    subtitle: fields.subtitle || "",
    ctaText: fields.ctaText || "",
    ctaLink: fields.ctaLink || "",
    backgroundImage: mapAssetImage(fields.backgroundImage),
  };
}

export function mapImageTextBlock(entry?: ImageTextBlockEntry): HomeImageTextSection | null {
  const fields = entry?.fields;

  if (!fields) {
    return null;
  }

  const alignment = fields.imageAlignment === "left" ? "left" : "right";

  return {
    title: fields.title || "",
    content: mapRichTextDocument(fields.content),
    imageAlignment: alignment,
    image: mapAssetImage(fields.image),
  };
}

export function mapFeaturedCreaturesBlock(
  entry?: FeaturedCreaturesBlockEntry,
): HomeFeaturedSection | null {
  const fields = entry?.fields;

  if (!fields) {
    return null;
  }

  return {
    title: fields.title || fields.tile || "",
    creatureIds: (fields.creatures || [])
      .map((creature) => creature?.sys?.id)
      .filter((id): id is string => Boolean(id)),
  };
}

export function mapHomePage(entry: HomePageEntry): HomePageData {
  const fields = entry.fields;

  return {
    title: fields?.title || "",
    slug: fields?.slug || "",
    seo: mapSeo(fields?.seo),
    hero: mapHeroBlock(fields?.hero),
    imageTextSection: mapImageTextBlock(fields?.imageTextSection),
    featuredSection: mapFeaturedCreaturesBlock(fields?.featuredSection),
  };
}

type CreatureEntry = {
  sys?: {
    id?: string;
  };
  fields?: {
    name?: string;
    slug?: string;
    shortDescription?: {
      json?: unknown;
    } | null;
    coverImage?: ContentfulAsset;
    creatureIndex?: number;
    rating?: number;
  };
};

export function mapCreatureCard(entry: CreatureEntry): CreatureCard {
  const fields = entry.fields;

  return {
    id: entry.sys?.id || "",
    name: fields?.name || "",
    slug: fields?.slug || "",
    shortDescription: mapRichTextDocument(fields?.shortDescription?.json),
    image: mapAssetImage(fields?.coverImage),
    creatureIndex: typeof fields?.creatureIndex === "number" ? fields.creatureIndex : null,
    rating: typeof fields?.rating === "number" ? fields.rating : null,
  };
}

type ArchivePageEntry = {
  fields?: {
    title?: string;
    slug?: string;
    seo?: SeoEntry;
    pageTitle?: string;
    pageDescription?: string;
  };
};

export function mapArchivePage(entry: ArchivePageEntry): ArchivePageData {
  const fields = entry.fields;

  return {
    title: fields?.title || "",
    slug: fields?.slug || "",
    seo: mapSeo(fields?.seo),
    pageTitle: fields?.pageTitle || "",
    pageDescription: fields?.pageDescription || "",
  };
}

type TaxonomyTermEntry = {
  sys?: {
    id?: string;
  };
  fields?: {
    title?: string;
    slug?: string;
    type?: TaxonomyType;
    parent?: ContentfulEntryLink;
  };
};

export function mapTaxonomyTerm(entry: TaxonomyTermEntry): TaxonomyTerm {
  const fields = entry.fields;

  return {
    id: entry.sys?.id || "",
    title: fields?.title || "",
    slug: fields?.slug || "",
    type: fields?.type || "category",
    parentId: fields?.parent?.sys?.id || null,
  };
}
