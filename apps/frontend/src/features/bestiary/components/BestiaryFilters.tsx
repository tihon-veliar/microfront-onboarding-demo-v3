"use client";

import { useId, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { BestiaryPageViewData } from "@/services/cms/pages/getBestiaryPageData";

type BestiaryFiltersProps = {
  taxonomyTerms: BestiaryPageViewData["taxonomyTerms"];
  selectedTerms: BestiaryPageViewData["selectedTerms"];
};

type TaxonomyTermWithOptionalCount = BestiaryPageViewData["taxonomyTerms"][number] & {
  count?: number;
};

const FILTER_BACKGROUND_COLORS = [
  "#EFF6FF",
  "#EAF4FF",
  "#F2F7FF",
  "#EEF2FF",
  "#F3F0FF",
  "#EAFBF5",
  "#F2FBF2",
  "#FFF7E8",
  "#FFF1E8",
  "#FDF0F5",
];

function getDeterministicIndex(value: string, length: number): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash % length;
}

const BestiaryFilters = ({ taxonomyTerms, selectedTerms }: BestiaryFiltersProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const filtersContentId = useId();
  const selectedCount = selectedTerms.length;

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
    <section className="sticky top-3 z-30 md:top-4">
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-900/10 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900/10  px-4 py-3 text-black md:px-5">
          <div className="min-w-0">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-black/65">
              Bestiary controls
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2 jus">
              <p className="text-sm font-semibold !mb-0" id="bestiary-filters-heading">
                Filters
              </p>
              <span className="rounded-full border border-balck/15 bg-gray/10 px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-black/85">
                {selectedCount > 0 ? `${selectedCount} selected` : "All creatures"}
              </span>
            </div>
          </div>

          <button
            aria-controls={filtersContentId}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse bestiary filters" : "Expand bestiary filters"}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-black transition hover:bg-white/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            onClick={() => setIsExpanded((current) => !current)}
            type="button"
          >
            {isExpanded ? "Hide filters" : "Show filters"}
          </button>
        </div>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-scroll  max-h-[80vh]">
            <div className="px-4 pb-4 pt-4 md:px-5 md:pb-5">
              <div
                className="flex flex-wrap items-center gap-2 rounded-[1.5rem] bg-slate-100/85 p-2 md:gap-3 md:p-3"
                id={filtersContentId}
                role="group"
                aria-labelledby="bestiary-filters-heading"
              >
                {taxonomyTerms.map((term) => {
                  const isSelected = selectedTerms.includes(term.id);
                  const count = (term as TaxonomyTermWithOptionalCount).count;
                  const backgroundColor =
                    FILTER_BACKGROUND_COLORS[
                      getDeterministicIndex(
                        `${term.id}-${term.title}`,
                        FILTER_BACKGROUND_COLORS.length,
                      )
                    ];

                  return (
                    <button
                      aria-label={`${isSelected ? "Remove filter" : "Add filter"} ${term.title}`}
                      aria-pressed={isSelected}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/70 focus-visible:ring-offset-2 ${
                        isSelected
                          ? "border-slate-950/10 text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.12)]"
                          : "border-slate-200/80 text-slate-700 hover:border-slate-400/40 hover:text-slate-950"
                      }`}
                      key={term.id}
                      onClick={() => handleToggle(term.id)}
                      style={{ backgroundColor }}
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className={`${isSelected ? "text-slate-900" : "text-slate-500"}`}
                      >
                        {isSelected ? "[x]" : "[ ]"}
                      </span>
                      <span>{term.title}</span>
                      {typeof count === "number" ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.68rem] font-semibold tracking-[0.12em] ${
                            isSelected
                              ? "bg-slate-950/10 text-slate-800"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestiaryFilters;
