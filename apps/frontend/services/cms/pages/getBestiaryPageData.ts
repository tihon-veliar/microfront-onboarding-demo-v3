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

  const selectedTerms = params.selectedTerms ?? [];

  const creatures = await getCreatures({
    page: params.page,
    limit: params.limit,
    taxonomyIds: selectedTerms,
  });

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
