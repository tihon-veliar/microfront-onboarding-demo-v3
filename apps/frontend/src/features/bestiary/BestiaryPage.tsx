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
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-0 py-2 md:gap-8 md:px-8 md:py-8">
      {archivePage.pageTitle || archivePage.pageDescription ? (
        <header className=" px-5 py-6 md:px-8 md:py-8">
          {archivePage.pageTitle ? (
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
              {archivePage.pageTitle}
            </h1>
          ) : null}
          {archivePage.pageDescription ? (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 md:text-base">
              {archivePage.pageDescription}
            </p>
          ) : null}
        </header>
      ) : null}

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
