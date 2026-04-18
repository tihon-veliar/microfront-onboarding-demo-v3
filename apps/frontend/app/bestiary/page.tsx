import { notFound } from "next/navigation";

import BestiaryPage from "@/src/features/bestiary";
import { getBestiaryPageData } from "@/services/cms/pages/getBestiaryPageData";

type BestiaryRouteProps = {
  searchParams?: Promise<{
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

export default async function Bestiary({ searchParams }: BestiaryRouteProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const data = await getBestiaryPageData({
    selectedTerms: parseSelectedTerms(resolvedSearchParams?.selectedTerms),
  });

  if (!data) {
    notFound();
  }

  return <BestiaryPage {...data} />;
}
