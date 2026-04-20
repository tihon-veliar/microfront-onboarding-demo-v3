import { contentfulClient } from "@/lib/contentful/client";
import { mapCreatureCard } from "@/lib/contentful/mappers";
import type { CreatureCard } from "@/lib/contentful/types";

export async function getCreaturesByIds(ids: string[]): Promise<CreatureCard[]> {
  if (ids.length === 0) {
    return [];
  }

  const response = await contentfulClient.getEntries({
    content_type: "creature",
    "sys.id[in]": ids,
    include: 2,
    limit: ids.length,
  });

  const mapped = response.items.map((item) => mapCreatureCard(item));

  const orderMap = new Map(ids.map((id, index) => [id, index]));

  return mapped.sort((a, b) => {
    const indexA = orderMap.get(a.id) ?? 0;
    const indexB = orderMap.get(b.id) ?? 0;

    return indexA - indexB;
  });
}
