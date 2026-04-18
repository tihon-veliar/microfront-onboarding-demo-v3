"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { BestiaryPageViewData } from "@/services/cms/pages/getBestiaryPageData";

type BestiaryFiltersProps = {
  taxonomyTerms: BestiaryPageViewData["taxonomyTerms"];
  selectedTerms: BestiaryPageViewData["selectedTerms"];
};

type TaxonomyTermWithOptionalCount = BestiaryPageViewData["taxonomyTerms"][number] & {
  count?: number;
};

const BestiaryFilters = ({ taxonomyTerms, selectedTerms }: BestiaryFiltersProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleToggle(termId: string) {
    const nextSelectedTerms = selectedTerms.includes(termId)
      ? selectedTerms.filter((selectedTerm) => selectedTerm !== termId)
      : [...selectedTerms, termId];

    const params = new URLSearchParams(searchParams.toString());

    if (nextSelectedTerms.length > 0) {
      params.set("selectedTerms", nextSelectedTerms.join(","));
    } else {
      params.delete("selectedTerms");
    }

    params.delete("page");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div>
      <p id="bestiary-filters-heading">Filters</p>
      <ul className="flex flex-wrap gap-10 w-full">
        {taxonomyTerms.map((term) => {
          const isSelected = selectedTerms.includes(term.id);
          const count = (term as TaxonomyTermWithOptionalCount).count;

          return (
            <li key={term.id}>
              <button
                aria-label={`${isSelected ? "Remove filter" : "Add filter"} ${term.title}`}
                aria-pressed={isSelected}
                onClick={() => handleToggle(term.id)}
                type="button"
              >
                {isSelected ? "[x]" : "[ ]"} {term.title}
                {typeof count === "number" ? ` (${count})` : ""}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BestiaryFilters;
