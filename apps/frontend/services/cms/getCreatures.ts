import { contentfulClient } from "@/lib/contentful/client";
import { mapCreatureCard } from "@/lib/contentful/mappers";
import type { GetCreaturesParams, PaginatedCreatures } from "@/lib/contentful/types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

export async function getCreatures(params: GetCreaturesParams = {}): Promise<PaginatedCreatures> {
  const page = params.page && params.page > 0 ? params.page : DEFAULT_PAGE;
  const limit = params.limit && params.limit > 0 ? params.limit : DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const { taxonomyIds } = params;

  const response = await contentfulClient.getEntries({
    content_type: "creature",
    skip,
    limit,
    include: 2,
    order: ["fields.creatureIndex"],
    ...(taxonomyIds?.length &&
      taxonomyIds?.length > 0 && {
        "fields.taxonomies.sys.id[in]": taxonomyIds.join(","),
      }),
  });

  return {
    items: response.items.map((item) => mapCreatureCard(item)),
    total: response.total,
    page,
    limit,
  };
}
