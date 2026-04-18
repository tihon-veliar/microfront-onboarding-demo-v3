import BestiaryListingClient from "./BestiaryListingClient";
import BestiaryFilters from "./components/BestiaryFilters";
import type { BestiaryPageViewData } from "@/services/cms/pages/getBestiaryPageData";

type BestiaryPageProps = BestiaryPageViewData;

const BestiaryPage = ({
  archivePage,
  creatures,
  taxonomyTerms,
  selectedTerms,
  pagination,
}: BestiaryPageProps) => {
  return (
    <main className="p-0 md:p-8">
      {archivePage.pageTitle ? <h1>{archivePage.pageTitle}</h1> : null}
      {archivePage.pageDescription ? <p>{archivePage.pageDescription}</p> : null}

      <BestiaryFilters taxonomyTerms={taxonomyTerms} selectedTerms={selectedTerms} />

      <BestiaryListingClient
        initialItems={creatures}
        initialPagination={pagination}
        selectedTerms={selectedTerms}
      />
    </main>
  );
};

export default BestiaryPage;
