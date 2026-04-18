"use client";

import { useEffect, useState } from "react";

import BestiaryEmptyState from "./components/BestiaryEmptyState";
import BestiaryGrid from "./components/BestiaryGrid";
import BestiaryLoadMore from "./components/BestiaryLoadMore";
import type { BestiaryPageViewData } from "@/services/cms/pages/getBestiaryPageData";

type BestiaryListingClientProps = {
  initialItems: BestiaryPageViewData["creatures"];
  initialPagination: BestiaryPageViewData["pagination"];
  selectedTerms: BestiaryPageViewData["selectedTerms"];
};

const BestiaryListingClient = ({
  initialItems,
  initialPagination,
  selectedTerms,
}: BestiaryListingClientProps) => {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(initialPagination.total);

  useEffect(() => {
    setItems(initialItems);
    setTotal(initialPagination.total);
    setLoading(false);
  }, [initialItems, initialPagination.total, selectedTerms]);

  const hasNext = items.length < total;

  async function handleLoadMore() {
    if (loading || !hasNext) {
      return;
    }

    setLoading(true);

    const params = new URLSearchParams({
      limit: String(initialPagination.limit),
      offset: String(items.length),
    });

    if (selectedTerms.length > 0) {
      params.set("selectedTerms", selectedTerms.join(","));
    }

    try {
      const response = await fetch(`/api/bestiary?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to load creatures");
      }

      const data = (await response.json()) as {
        items: BestiaryPageViewData["creatures"];
        total: BestiaryPageViewData["pagination"]["total"];
      };

      setItems((currentItems) => [...currentItems, ...data.items]);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return <BestiaryEmptyState />;
  }

  return (
    <div>
      <BestiaryGrid items={items} />

      {hasNext ? (
        <BestiaryLoadMore disabled={loading} loading={loading} onClick={handleLoadMore} />
      ) : null}
    </div>
  );
};

export default BestiaryListingClient;
