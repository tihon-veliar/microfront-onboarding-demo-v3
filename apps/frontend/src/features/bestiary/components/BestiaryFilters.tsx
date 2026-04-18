"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { BestiaryPageViewData } from "@/services/cms/pages/getBestiaryPageData";

type BestiaryFiltersProps = {
  taxonomyTerms: BestiaryPageViewData["taxonomyTerms"];
  selectedTerms: BestiaryPageViewData["selectedTerms"];
};

const BestiaryFilters = ({ taxonomyTerms, selectedTerms }: BestiaryFiltersProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleToggle(termSlug: string) {
    const nextSelectedTerms = selectedTerms.includes(termSlug)
      ? selectedTerms.filter((selectedTerm) => selectedTerm !== termSlug)
      : [...selectedTerms, termSlug];

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
      <p>Filters</p>
      <ul>
        {taxonomyTerms.map((term) => {
          const isSelected = selectedTerms.includes(term.slug);

          return (
            <li key={term.id}>
              <button onClick={() => handleToggle(term.slug)} type="button">
                {isSelected ? "[x]" : "[ ]"} {term.title}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BestiaryFilters;
