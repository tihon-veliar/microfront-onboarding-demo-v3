"use client";

import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import BestiaryEmptyState from "./components/BestiaryEmptyState";
import BestiaryGrid from "./components/BestiaryGrid";
import BestiaryLoadMore from "./components/BestiaryLoadMore";
import type { BestiaryPageViewData } from "@/services/cms/pages/getBestiaryPageData";

type BestiaryListingClientProps = {
  initialItems: BestiaryPageViewData["creatures"];
  initialPagination: BestiaryPageViewData["pagination"];
  selectedTerms: BestiaryPageViewData["selectedTerms"];
};

type PaginationMode = "infinite" | "prev-next";

function getVisiblePages(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

function getPageFromUrl(): number {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("page");

  if (!value) {
    return 1;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

function getModeButtonClass(isActive: boolean) {
  return `inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/70 focus-visible:ring-offset-2 ${
    isActive
      ? "border-slate-950 bg-slate-950 text-white shadow-[0_12px_24px_rgba(15,23,42,0.22)]"
      : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-slate-950"
  }`;
}

const BestiaryListingClient = ({
  initialItems,
  initialPagination,
  selectedTerms,
}: BestiaryListingClientProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mode, setMode] = useState<PaginationMode>("infinite");
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(initialPagination.total);
  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inFlightRef = useRef(false);
  const requestIdRef = useRef(0);
  const retryActionRef = useRef<(() => void) | null>(null);
  const pageSize = initialPagination.limit;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const visiblePages = getVisiblePages(currentPage, totalPages);

  useEffect(() => {
    requestIdRef.current += 1;
    setItems(initialItems);
    setTotal(initialPagination.total);
    setLoading(false);
    setError(null);
    setCurrentPage(initialPagination.page);
    inFlightRef.current = false;
  }, [initialItems, initialPagination.page, initialPagination.total, selectedTerms]);

  useEffect(() => {
    const storedMode = window.localStorage.getItem("bestiary-pagination-mode");

    if (storedMode === "infinite" || storedMode === "prev-next") {
      setMode(storedMode);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("bestiary-pagination-mode", mode);
  }, [mode]);

  const hasNext = mode === "infinite" ? items.length < total : currentPage < totalPages;
  const hasPrev = currentPage > 1;

  function updatePageInUrl(nextPage: number) {
    const params = new URLSearchParams(window.location.search);

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    } else {
      params.delete("page");
    }

    const query = params.toString();
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;

    window.history.pushState({}, "", nextUrl);
  }

  async function fetchItems(offset: number, nextMode: PaginationMode) {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const params = new URLSearchParams({
      limit: String(pageSize),
      offset: String(offset),
    });

    if (selectedTerms.length > 0) {
      params.set("selectedTerms", selectedTerms.join(","));
    }

    const response = await fetch(`/api/bestiary?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to load creatures");
    }

    const data = (await response.json()) as {
      items: BestiaryPageViewData["creatures"];
      total: BestiaryPageViewData["pagination"]["total"];
    };

    if (requestId !== requestIdRef.current) {
      return;
    }

    setItems((currentItems) =>
      nextMode === "infinite" ? [...currentItems, ...data.items] : data.items,
    );
    setTotal(data.total);
  }

  async function handleLoadMore() {
    if (loading || inFlightRef.current || !hasNext) {
      return;
    }

    inFlightRef.current = true;
    setLoading(true);
    setError(null);
    retryActionRef.current = () => {
      void handleLoadMore();
    };

    try {
      await fetchItems(items.length, "infinite");
    } catch {
      setError("Failed to load more creatures.");
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }

  async function handlePageChange(nextPage: number, options?: { syncUrl?: boolean }) {
    if (loading || inFlightRef.current || nextPage < 1 || nextPage > totalPages) {
      return;
    }

    inFlightRef.current = true;
    setLoading(true);
    setError(null);
    retryActionRef.current = () => {
      void handlePageChange(nextPage);
    };

    try {
      await fetchItems((nextPage - 1) * pageSize, "prev-next");
      setCurrentPage(nextPage);
      if (options?.syncUrl !== false) {
        updatePageInUrl(nextPage);
      }
      listRef.current?.focus();
    } catch {
      setError("Failed to load the selected page.");
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }

  function handleModeChange(nextMode: PaginationMode) {
    if (nextMode === mode) {
      return;
    }

    requestIdRef.current += 1;
    retryActionRef.current = null;
    setMode(nextMode);
    setCurrentPage(1);
    setLoading(false);
    setError(null);
    inFlightRef.current = false;

    startTransition(() => {
      router.replace(pathname);
      router.refresh();
    });
  }

  const handleLoadMoreEvent = useEffectEvent(() => {
    void handleLoadMore();
  });

  const handlePopStateEvent = useEffectEvent((nextPage: number) => {
    void handlePageChange(nextPage, { syncUrl: false });
  });

  useEffect(() => {
    if (mode !== "infinite" || loading || !hasNext) {
      return;
    }

    const node = loadMoreRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry?.isIntersecting) {
        handleLoadMoreEvent();
      }
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [mode, loading, hasNext, items.length, selectedTerms]);

  useEffect(() => {
    function handlePopState() {
      if (mode !== "prev-next") {
        return;
      }

      const nextPage = Math.min(getPageFromUrl(), totalPages);

      if (nextPage !== currentPage) {
        handlePopStateEvent(nextPage);
      }
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [mode, currentPage, totalPages, loading, selectedTerms]);

  return (
    <section className="flex flex-col gap-5 md:gap-6">
      <div className="lg:sticky top-[7rem] z-20 md:top-[8rem] mb-2 mt-2">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-slate-900/10  px-4 py-3 shadow-[0_14px_30px_rgba(15,23,42,0.1)] bg-white/10backdrop-blur supports-backdrop-filter:bg-white/10 md:px-5">
          <div className="min-w-0">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-slate-500">
              Navigation mode
            </p>
            <p className="mt-1 text-sm text-slate-700 md:text-base">
              {mode === "infinite"
                ? `Showing ${items.length} of ${total} creatures`
                : `Page ${currentPage} of ${totalPages}`}
            </p>
          </div>

          <div
            aria-label="Listing mode switcher"
            className="flex flex-wrap items-center gap-2"
            role="group"
          >
            <button
              aria-label="Switch to infinite scroll mode"
              aria-pressed={mode === "infinite"}
              className={getModeButtonClass(mode === "infinite")}
              disabled={mode === "infinite"}
              onClick={() => handleModeChange("infinite")}
              type="button"
            >
              Infinite
            </button>
            <button
              aria-label="Switch to paged navigation mode"
              aria-pressed={mode === "prev-next"}
              className={getModeButtonClass(mode === "prev-next")}
              disabled={mode === "prev-next"}
              onClick={() => handleModeChange("prev-next")}
              type="button"
            >
              Prev / Next
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-rose-900">
          <p role="alert">{error}</p>
          {retryActionRef.current ? (
            <button
              className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-900 transition hover:bg-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
              onClick={() => retryActionRef.current?.()}
              type="button"
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <p aria-live="polite" className="text-sm font-medium text-slate-600">
          {mode === "infinite" ? "Loading more creatures..." : "Loading page..."}
        </p>
      ) : null}

      <div className="min-h-[12rem]" ref={listRef} tabIndex={-1}>
        {items.length === 0 ? <BestiaryEmptyState /> : <BestiaryGrid items={items} />}
      </div>

      {mode === "infinite" ? (
        hasNext ? (
          <div className="flex justify-center pt-2" ref={loadMoreRef}>
            <BestiaryLoadMore
              ariaLabel="Load more creatures"
              disabled={loading}
              loading={loading}
              onClick={handleLoadMore}
            />
          </div>
        ) : null
      ) : (
        <div
          aria-label="Pagination"
          className="flex flex-wrap items-center justify-center gap-2 rounded-[1.5rem] border border-slate-900/10 bg-slate-50 px-3 py-3 md:px-4"
          role="navigation"
        >
          <BestiaryLoadMore
            ariaLabel="Go to previous page"
            disabled={loading || !hasPrev}
            label="Prev"
            loading={loading}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {visiblePages.map((pageNumber, index) =>
            pageNumber === "ellipsis" ? (
              <span
                aria-hidden="true"
                className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm text-slate-400"
                key={`ellipsis-${index}`}
              >
                ...
              </span>
            ) : (
              <button
                aria-current={pageNumber === currentPage ? "page" : undefined}
                aria-label={`Go to page ${pageNumber}`}
                className={getModeButtonClass(pageNumber === currentPage)}
                disabled={loading || pageNumber === currentPage}
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                type="button"
              >
                {pageNumber}
              </button>
            ),
          )}
          <BestiaryLoadMore
            ariaLabel="Go to next page"
            disabled={loading || !hasNext}
            label="Next"
            loading={loading}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </div>
      )}
    </section>
  );
};

export default BestiaryListingClient;
