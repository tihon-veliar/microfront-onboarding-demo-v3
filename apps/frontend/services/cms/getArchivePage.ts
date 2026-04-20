import { contentfulClient } from "@/lib/contentful/client";
import { mapArchivePage } from "@/lib/contentful/mappers";
import type { ArchivePageData } from "@/lib/contentful/types";

export async function getArchivePage(): Promise<ArchivePageData | null> {
  const response = await contentfulClient.getEntries({
    content_type: "archivePage",
    "fields.slug": "bestiary",
    include: 10,
    limit: 1,
  });

  const entry = response.items[0];

  if (!entry) {
    return null;
  }

  return mapArchivePage(entry);
}
