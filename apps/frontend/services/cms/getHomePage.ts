import { contentfulClient } from "@/lib/contentful/client";
import { mapHomePage } from "@/lib/contentful/mappers";
import type { HomePageData } from "@/lib/contentful/types";

export async function getHomePage(): Promise<HomePageData | null> {
  const response = await contentfulClient.getEntries({
    content_type: "homePage",
    "fields.slug": "home",
    include: 10,
    limit: 1,
  });

  const entry = response.items[0];

  if (!entry) {
    return null;
  }

  return mapHomePage(entry);
}
