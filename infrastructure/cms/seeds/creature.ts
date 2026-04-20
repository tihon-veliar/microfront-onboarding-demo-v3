import type { PlainClientAPI } from "contentful-management";

import { CONTENT_TYPE_IDS, CREATURE_FIELD_IDS } from "../constants";
import creatures from "../seed-data/creatures.json";

type CreatureSeedItem = {
  entryId: string;
  assetId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImageUrl: string;
  creatureIndex: number;
  height: number;
  weight: number;
  abilities: string[];
  externalResourceLink: string;
  taxonomies: string[];
  rating: number;
};

const LOCALE = "en-US";

type ContentfulErrorShape = {
  name?: string;
  message?: string;
  details?: unknown;
  status?: number;
  statusCode?: number;
};

function getErrorStatus(error: unknown): number | null {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const maybeError = error as ContentfulErrorShape;

  if (typeof maybeError.status === "number") {
    return maybeError.status;
  }

  if (typeof maybeError.statusCode === "number") {
    return maybeError.statusCode;
  }

  return null;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string") {
      return message;
    }
  }

  return String(error);
}

function isConflictError(error: unknown): boolean {
  const status = getErrorStatus(error);

  if (status === 409) {
    return true;
  }

  return getErrorMessage(error).includes("409");
}

function isNotFoundError(error: unknown): boolean {
  const status = getErrorStatus(error);

  if (status === 404) {
    return true;
  }

  return getErrorMessage(error).includes("404");
}

function buildAssetLink(assetId: string) {
  return {
    sys: {
      type: "Link",
      linkType: "Asset",
      id: assetId,
    },
  } as const;
}

function buildEntryLink(entryId: string) {
  return {
    sys: {
      type: "Link",
      linkType: "Entry",
      id: entryId,
    },
  } as const;
}

function getFileName(item: CreatureSeedItem): string {
  const url = item.coverImageUrl.trim();

  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const rawName = pathname.split("/").pop();

    if (rawName && rawName.includes(".")) {
      return rawName;
    }
  } catch {
    // ignore and fallback
  }

  return `${item.slug}.jpg`;
}

function getContentTypeFromUrl(url: string): string {
  const normalizedUrl = url.toLowerCase();

  if (normalizedUrl.includes(".png")) {
    return "image/png";
  }

  if (normalizedUrl.includes(".webp")) {
    return "image/webp";
  }

  if (normalizedUrl.includes(".gif")) {
    return "image/gif";
  }

  return "image/jpeg";
}

async function ensureAsset(client: PlainClientAPI, item: CreatureSeedItem): Promise<string> {
  const assetId = item.assetId;

  try {
    await client.asset.get({ assetId });
    return assetId;
  } catch (error: unknown) {
    if (!isNotFoundError(error)) {
      throw new Error(`asset lookup failed: ${assetId}. ${getErrorMessage(error)}`, {
        cause: error,
      });
    }
  }

  const fileName = getFileName(item);
  const contentType = getContentTypeFromUrl(item.coverImageUrl);

  const createdAsset = await client.asset.createWithId(
    { assetId },
    {
      fields: {
        title: {
          [LOCALE]: item.name,
        },
        file: {
          [LOCALE]: {
            fileName,
            contentType,
            upload: item.coverImageUrl,
          },
        },
      },
    },
  );

  try {
    await client.asset.processForAllLocales({}, createdAsset);
  } catch (error: unknown) {
    throw new Error(`asset processing failed: ${assetId}. ${getErrorMessage(error)}`, {
      cause: error,
    });
  }

  let processedAsset;

  try {
    processedAsset = await client.asset.get({ assetId });
  } catch (error: unknown) {
    throw new Error(`processed asset fetch failed: ${assetId}. ${getErrorMessage(error)}`, {
      cause: error,
    });
  }

  try {
    await client.asset.publish({ assetId }, processedAsset);
  } catch (error: unknown) {
    throw new Error(`asset publish failed: ${assetId}. ${getErrorMessage(error)}`, {
      cause: error,
    });
  }

  return assetId;
}

export async function seedCreatures(client: PlainClientAPI): Promise<void> {
  for (const item of creatures as CreatureSeedItem[]) {
    const entryId = item.entryId;

    try {
      const assetId = await ensureAsset(client, item);

      const entry = await client.entry.createWithId(
        {
          contentTypeId: CONTENT_TYPE_IDS.creature,
          entryId,
        },
        {
          fields: {
            [CREATURE_FIELD_IDS.name]: {
              [LOCALE]: item.name,
            },
            [CREATURE_FIELD_IDS.slug]: {
              [LOCALE]: item.slug,
            },
            [CREATURE_FIELD_IDS.shortDescription]: {
              [LOCALE]: item.shortDescription,
            },
            [CREATURE_FIELD_IDS.description]: {
              [LOCALE]: item.description,
            },
            [CREATURE_FIELD_IDS.coverImage]: {
              [LOCALE]: buildAssetLink(assetId),
            },
            [CREATURE_FIELD_IDS.creatureIndex]: {
              [LOCALE]: item.creatureIndex,
            },
            [CREATURE_FIELD_IDS.height]: {
              [LOCALE]: item.height,
            },
            [CREATURE_FIELD_IDS.weight]: {
              [LOCALE]: item.weight,
            },
            [CREATURE_FIELD_IDS.abilities]: {
              [LOCALE]: item.abilities,
            },
            [CREATURE_FIELD_IDS.externalResourceLink]: {
              [LOCALE]: item.externalResourceLink,
            },
            [CREATURE_FIELD_IDS.taxonomies]: {
              [LOCALE]: item.taxonomies.map((taxonomyId) => buildEntryLink(taxonomyId)),
            },
            [CREATURE_FIELD_IDS.rating]: {
              [LOCALE]: item.rating,
            },
          },
        },
      );

      await client.entry.publish({ entryId }, entry);

      console.log(`creature created: ${entryId}`);
    } catch (error: unknown) {
      if (isConflictError(error)) {
        console.log(`creature exists, skip: ${entryId}`);
        continue;
      }

      console.error(`creature error: ${entryId}. ${getErrorMessage(error)}`, error);
    }
  }
}
