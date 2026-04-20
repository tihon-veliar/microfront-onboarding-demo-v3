import type { PlainClientAPI } from "contentful-management";

import { CONTENT_TYPE_IDS, TAXONOMY_TERM_FIELD_IDS } from "../constants";
import taxonomies from "../seed-data/taxonomies.json";

type TaxonomySeedItem = {
  title: string;
  slug: string;
  type: string;
};

const LOCALE = "en-US";

function isConflictError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.includes("409");
}

export async function seedTaxonomies(client: PlainClientAPI): Promise<void> {
  for (const item of taxonomies as TaxonomySeedItem[]) {
    const entryId = `${item.type}-${item.slug}`;

    try {
      const entry = await client.entry.createWithId(
        {
          contentTypeId: CONTENT_TYPE_IDS.creature,
          entryId,
        },
        {
          fields: {
            [TAXONOMY_TERM_FIELD_IDS.title]: {
              [LOCALE]: item.title,
            },
            [TAXONOMY_TERM_FIELD_IDS.slug]: {
              [LOCALE]: item.slug,
            },
            [TAXONOMY_TERM_FIELD_IDS.type]: {
              [LOCALE]: item.type,
            },
          },
        },
      );

      await client.entry.publish({ entryId: entry.sys.id }, entry);
      console.log(`taxonomy created: ${entryId}`);
    } catch (error: unknown) {
      if (isConflictError(error)) {
        console.log(`taxonomy exists, skip: ${entryId}`);
        continue;
      }

      console.error(`taxonomy error: ${entryId}`, error);
    }
  }
}
