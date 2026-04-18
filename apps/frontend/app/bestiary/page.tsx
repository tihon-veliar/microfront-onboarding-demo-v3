import { notFound } from "next/navigation";

import BestiaryPage from "@/src/features/bestiary";
import { getBestiaryPageData } from "@/services/cms/pages/getBestiaryPageData";

type BestiaryRouteProps = {
  searchParams?: Promise<{
    page?: string;
    selectedTerms?: string;
  }>;
};

function parseSelectedTerms(value?: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((term) => term.trim())
    .filter(Boolean);
}

function parsePage(value?: string): number {
  if (!value) {
    return 1;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

export default async function Bestiary({ searchParams }: BestiaryRouteProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const data = await getBestiaryPageData({
    page: parsePage(resolvedSearchParams?.page),
    selectedTerms: parseSelectedTerms(resolvedSearchParams?.selectedTerms),
  });

  if (!data) {
    notFound();
  }

  return <BestiaryPage {...data} />;
}
