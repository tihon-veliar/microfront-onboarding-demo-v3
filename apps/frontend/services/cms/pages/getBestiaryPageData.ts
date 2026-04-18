import { getArchivePage } from "@/services/cms/getArchivePage";
import { getCreatures } from "@/services/cms/getCreatures";
import { getTaxonomyTerms } from "@/services/cms/getTaxonomyTerms";
import type {
  ArchivePageData,
  CreatureCard,
  GetCreaturesParams,
  PaginatedCreatures,
  TaxonomyTerm,
} from "@/lib/contentful/types";

export type GetBestiaryPageDataParams = {
  page?: GetCreaturesParams["page"];
  limit?: GetCreaturesParams["limit"];
  selectedTerms?: TaxonomyTerm["slug"][];
};

export type BestiaryPageViewData = {
  archivePage: ArchivePageData;
  creatures: CreatureCard[];
  taxonomyTerms: TaxonomyTerm[];
  selectedTerms: TaxonomyTerm["slug"][];
  pagination: Pick<PaginatedCreatures, "page" | "limit" | "total">;
};

export async function getBestiaryPageData(
  params: GetBestiaryPageDataParams = {},
): Promise<BestiaryPageViewData | null> {
  const [archivePage, taxonomyTerms] = await Promise.all([getArchivePage(), getTaxonomyTerms()]);

  if (!archivePage) {
    return null;
  }

  const selectedTerms = (params.selectedTerms ?? []).filter((selectedTerm) =>
    taxonomyTerms.some((term) => term.id === selectedTerm),
  );

  const requestedPage = params.page && params.page > 0 ? params.page : 1;

  let creatures = await getCreatures({
    page: requestedPage,
    limit: params.limit,
    taxonomyIds: selectedTerms,
  });

  const totalPages = Math.max(1, Math.ceil(creatures.total / creatures.limit));

  if (requestedPage > totalPages) {
    creatures = await getCreatures({
      page: totalPages,
      limit: params.limit,
      taxonomyIds: selectedTerms,
    });
  }

  return {
    archivePage,
    creatures: creatures.items,
    taxonomyTerms,
    selectedTerms,
    pagination: {
      page: creatures.page,
      limit: creatures.limit,
      total: creatures.total,
    },
  };
}
