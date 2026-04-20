import { contentfulClient } from "@/lib/contentful/client";
import { mapTaxonomyTerm } from "@/lib/contentful/mappers";
import type { TaxonomyTerm, TaxonomyType } from "@/lib/contentful/types";

export const getTaxonomyTerms = async (
  params?: { type?: TaxonomyType },
): Promise<TaxonomyTerm[]> => {
  const response = await contentfulClient.getEntries({
    content_type: "taxonomyTerm",
    order: ["fields.title"],
    ...(params?.type ? { "fields.type": params.type } : {}),
  });

  return response.items.map((item) => mapTaxonomyTerm(item));
};
