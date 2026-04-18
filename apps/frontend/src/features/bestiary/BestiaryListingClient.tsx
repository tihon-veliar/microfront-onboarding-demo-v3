"use client";

import { useEffect, useRef, useState } from "react";

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

const BestiaryListingClient = ({
  initialItems,
  initialPagination,
  selectedTerms,
}: BestiaryListingClientProps) => {
  const [mode, setMode] = useState<PaginationMode>("infinite");
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(initialPagination.total);
  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setItems(initialItems);
    setTotal(initialPagination.total);
    setLoading(false);
    setCurrentPage(initialPagination.page);
  }, [initialItems, initialPagination.total, selectedTerms]);

  const hasNext =
    mode === "infinite"
      ? items.length < total
      : currentPage * initialPagination.limit < total;
  const hasPrev = currentPage > 1;

  async function fetchItems(offset: number, nextMode: PaginationMode) {
    const params = new URLSearchParams({
      limit: String(initialPagination.limit),
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

    setItems((currentItems) =>
      nextMode === "infinite" ? [...currentItems, ...data.items] : data.items,
    );
    setTotal(data.total);
  }

  async function handleLoadMore() {
    if (loading || !hasNext) {
      return;
    }

    setLoading(true);

    try {
      await fetchItems(items.length, "infinite");
    } finally {
      setLoading(false);
    }
  }

  async function handlePageChange(nextPage: number) {
    if (loading || nextPage < 1) {
      return;
    }

    setLoading(true);

    try {
      await fetchItems((nextPage - 1) * initialPagination.limit, "prev-next");
      setCurrentPage(nextPage);
    } finally {
      setLoading(false);
    }
  }

  function handleModeChange(nextMode: PaginationMode) {
    setMode(nextMode);
    setItems(initialItems);
    setTotal(initialPagination.total);
    setCurrentPage(initialPagination.page);
    setLoading(false);
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

  return (
    <div>
      <div>
        <button disabled={mode === "infinite"} onClick={() => handleModeChange("infinite")} type="button">
          Infinite
        </button>
        <button disabled={mode === "prev-next"} onClick={() => handleModeChange("prev-next")} type="button">
          Prev / Next
        </button>
      </div>

      {items.length === 0 ? <BestiaryEmptyState /> : <BestiaryGrid items={items} />}

      {mode === "infinite" ? (
        hasNext ? (
          <div ref={loadMoreRef}>
            <BestiaryLoadMore disabled={loading} loading={loading} onClick={handleLoadMore} />
          </div>
        ) : null
      ) : (
        <div>
          <BestiaryLoadMore
            disabled={loading || !hasPrev}
            label="Prev"
            loading={loading}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          <span>Page {currentPage}</span>
          <BestiaryLoadMore
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
