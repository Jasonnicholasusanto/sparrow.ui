"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";

import {
  QuoteResult,
  SearchHistoryEntry,
  SearchQuotesResponse,
} from "@/schemas/search";
import { addSearchHistoryEntry } from "@/lib/actions/search";
import {
  searchHistoryClient,
  searchQuotesClient,
} from "@/lib/data/client/search";
import { SearchHistory } from "./search-history";
import { SearchResults } from "./search-results";

function useDebouncedValue<T>(value: T, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function ExpandableSearch() {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 1000);

  const [open, setOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);
  const [results, setResults] = useState<QuoteResult[]>([]);

  const trimmedQuery = query.trim();

  const showHistory = open && trimmedQuery.length === 0;
  const showResults = open && trimmedQuery.length > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadHistory() {
    try {
      setIsLoadingHistory(true);
      const res = await searchHistoryClient(6);
      setHistory(res ?? []);
    } catch (error) {
      console.error("Failed to load search history:", error);
      setHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    if (trimmedQuery.length > 0) return;

    loadHistory();
  }, [open, trimmedQuery]);

  useEffect(() => {
    async function runSearch() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsLoadingSearch(true);
        const res: SearchQuotesResponse = await searchQuotesClient(
          debouncedQuery,
          {
            maxResult: 8,
            recommended: 8,
            enableFuzzyQuery: true,
          },
        );
        setResults(res.results ?? []);
      } catch (error) {
        console.error("Failed to search quotes:", error);
        setResults([]);
      } finally {
        setIsLoadingSearch(false);
      }
    }

    runSearch();
  }, [debouncedQuery]);

  async function handleSelectStock(item: QuoteResult) {
    try {
      await addSearchHistoryEntry(item.symbol, "stock");
    } catch (error) {
      console.error("Failed to save search history:", error);
    }

    setOpen(false);
    setQuery("");
    router.push(`/platform/ticker/${item.symbol}`);
  }

  async function handleSelectHistoryItem(item: SearchHistoryEntry) {
    try {
      await addSearchHistoryEntry(item.query, item.type || "stock");
    } catch (error) {
      console.error("Failed to save search history:", error);
    }

    setOpen(false);
    setQuery("");

    if ((item.type || "").toLowerCase() === "stock") {
      router.push(`/platform/ticker/${item.query}`);
      return;
    }

    router.push(`/platform/search?q=${encodeURIComponent(item.query)}`);
  }

  const emptyStateText = useMemo(() => {
    if (showResults && !isLoadingSearch && results.length === 0) {
      return "No stocks found.";
    }

    if (showHistory && !isLoadingHistory && history.length === 0) {
      return "No recent searches yet.";
    }

    return null;
  }, [
    showResults,
    showHistory,
    isLoadingSearch,
    isLoadingHistory,
    results.length,
    history.length,
  ]);

  return (
    <div ref={wrapperRef} className="relative hidden sm:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="Search stocks..."
        className="
          h-10 w-56 rounded-full border-border bg-background pl-9 pr-4
          transition-all duration-300 ease-out
          focus:w-sm focus:ring-2 focus:ring-ring/40
        "
      />

      {open ? (
        <div className="absolute top-13 z-50 w-sm overflow-hidden rounded-2xl border bg-popover shadow-lg">
          <div className="max-h-96 overflow-y-auto p-2">
            {showHistory ? (
              <SearchHistory
                history={history}
                isLoading={isLoadingHistory}
                onSelect={handleSelectHistoryItem}
              />
            ) : null}

            {showResults ? (
              <SearchResults
                results={results}
                isLoading={isLoadingSearch}
                onSelect={handleSelectStock}
              />
            ) : null}

            {emptyStateText ? (
              <div className="px-3 py-4 text-sm text-muted-foreground">
                {emptyStateText}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
