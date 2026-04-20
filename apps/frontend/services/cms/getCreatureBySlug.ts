import { mapCreatureDetail } from "@/lib/contentful/mappers";
import { GET_CREATURE_BY_SLUG_QUERY } from "@/lib/contentful/queries";
import { contentfulGraphQLRequest } from "@/lib/contentful/graphqlClient";
import type { CreatureDetail } from "@/lib/contentful/types";

type GetCreatureBySlugResponse = {
  creatureCollection?: {
    items?: Array<unknown>;
  };
};

export async function getCreatureBySlug(slug: string): Promise<CreatureDetail | null> {
  const data = await contentfulGraphQLRequest<GetCreatureBySlugResponse>(
    GET_CREATURE_BY_SLUG_QUERY,
    { slug },
  );

  const item = data.creatureCollection?.items?.[0];

  if (!item) {
    return null;
  }

  return mapCreatureDetail(item as Parameters<typeof mapCreatureDetail>[0]);
}
