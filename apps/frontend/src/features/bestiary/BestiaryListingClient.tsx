"use client";

import { startTransition, useEffect, useRef, useState } from "react";
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

  const hasNext =
    mode === "infinite"
      ? items.length < total
      : currentPage < totalPages;
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
        void handleLoadMore();
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
        void handlePageChange(nextPage, { syncUrl: false });
      }
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [mode, currentPage, totalPages, loading, selectedTerms]);

  return (
    <div>
      <div>
        <button
          aria-label="Switch to infinite scroll mode"
          disabled={mode === "infinite"}
          onClick={() => handleModeChange("infinite")}
          type="button"
        >
          Infinite
        </button>
        <button
          aria-label="Switch to paged navigation mode"
          disabled={mode === "prev-next"}
          onClick={() => handleModeChange("prev-next")}
          type="button"
        >
          Prev / Next
        </button>
      </div>

      {error ? (
        <div>
          <p role="alert">{error}</p>
          {retryActionRef.current ? (
            <button onClick={() => retryActionRef.current?.()} type="button">
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <p aria-live="polite">
          {mode === "infinite" ? "Loading more creatures..." : "Loading page..."}
        </p>
      ) : null}

      <div ref={listRef} tabIndex={-1}>
        {items.length === 0 ? <BestiaryEmptyState /> : <BestiaryGrid items={items} />}
      </div>

      {mode === "infinite" ? (
        hasNext ? (
          <div ref={loadMoreRef}>
            <BestiaryLoadMore
              ariaLabel="Load more creatures"
              disabled={loading}
              loading={loading}
              onClick={handleLoadMore}
            />
          </div>
        ) : null
      ) : (
        <div aria-label="Pagination" role="navigation">
          <BestiaryLoadMore
            ariaLabel="Go to previous page"
            disabled={loading || !hasPrev}
            label="Prev"
            loading={loading}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {visiblePages.map((pageNumber, index) =>
            pageNumber === "ellipsis" ? (
              <span aria-hidden="true" key={`ellipsis-${index}`}>
                ...
              </span>
            ) : (
              <button
                aria-current={pageNumber === currentPage ? "page" : undefined}
                aria-label={`Go to page ${pageNumber}`}
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
    </div>
  );
};

export default BestiaryListingClient;
