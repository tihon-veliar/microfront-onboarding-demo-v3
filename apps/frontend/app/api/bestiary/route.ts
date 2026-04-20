import { NextResponse } from "next/server";

import { getCreatures } from "@/services/cms/getCreatures";
import { getTaxonomyTerms } from "@/services/cms/getTaxonomyTerms";

const DEFAULT_LIMIT = 12;
const DEFAULT_OFFSET = 0;

function parseNumberParam(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }

  return Math.floor(parsed);
}

function parseSelectedTermsParam(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((term) => term.trim())
    .filter(Boolean);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const limit = parseNumberParam(searchParams.get("limit"), DEFAULT_LIMIT);
  const offset = parseNumberParam(searchParams.get("offset"), DEFAULT_OFFSET);
  const selectedTerms = parseSelectedTermsParam(searchParams.get("selectedTerms"));
  const taxonomyTerms = selectedTerms.length > 0 ? await getTaxonomyTerms() : [];

  let taxonomyIds: string[] | undefined;

  if (selectedTerms.length > 0) {
    taxonomyIds = selectedTerms.filter((selectedTerm) =>
      taxonomyTerms.some((term) => term.id === selectedTerm),
    );
  }

  const response = await getCreatures({
    limit: offset + limit,
    taxonomyIds,
  });

  return NextResponse.json({
    items: response.items.slice(offset, offset + limit),
    total: response.total,
  });
}
