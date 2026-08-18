"use client";

import { useCallback, useRef, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { KeywordChips } from "@/components/KeywordChips";
import { NewsCard } from "@/components/NewsCard";
import { SearchBar } from "@/components/SearchBar";
import { SkeletonCard } from "@/components/SkeletonCard";
import { SortToggle } from "@/components/SortToggle";
import type { NewsItem, SortOption } from "@/lib/types";

const DISPLAY_COUNT = 10;
const NETWORK_ERROR_MESSAGE = "네트워크 연결을 확인해주세요";

type Status = "idle" | "loading" | "loading-more" | "success" | "empty" | "error";

export default function Home() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("sim");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [total, setTotal] = useState(0);
  const requestId = useRef(0);

  const runSearch = useCallback(
    async (searchQuery: string, searchSort: SortOption, start: number, append: boolean) => {
      const currentRequestId = ++requestId.current;
      setStatus(append ? "loading-more" : "loading");
      setErrorMessage("");

      try {
        const params = new URLSearchParams({
          query: searchQuery,
          sort: searchSort,
          display: String(DISPLAY_COUNT),
          start: String(start),
        });
        const response = await fetch(`/api/news?${params.toString()}`);
        const data = await response.json();

        if (currentRequestId !== requestId.current) return;

        if (!response.ok) {
          setErrorMessage(data.message ?? NETWORK_ERROR_MESSAGE);
          setStatus("error");
          return;
        }

        const newItems: NewsItem[] = data.items ?? [];
        setItems((prev) => (append ? [...prev, ...newItems] : newItems));
        setTotal(data.total ?? 0);

        const combinedCount = append ? items.length + newItems.length : newItems.length;
        setStatus(combinedCount === 0 ? "empty" : "success");
      } catch {
        if (currentRequestId !== requestId.current) return;
        setErrorMessage(NETWORK_ERROR_MESSAGE);
        setStatus("error");
      }
    },
    [items.length],
  );

  const handleSearch = useCallback(
    (nextQuery: string) => {
      setQuery(nextQuery);
      void runSearch(nextQuery, sort, 1, false);
    },
    [runSearch, sort],
  );

  const handleSortChange = useCallback(
    (nextSort: SortOption) => {
      setSort(nextSort);
      if (query) void runSearch(query, nextSort, 1, false);
    },
    [query, runSearch],
  );

  const handleLoadMore = useCallback(() => {
    void runSearch(query, sort, items.length + 1, true);
  }, [query, sort, items.length, runSearch]);

  const handleRetry = useCallback(() => {
    void runSearch(query, sort, 1, false);
  }, [query, sort, runSearch]);

  const isBusy = status === "loading" || status === "loading-more";
  const hasMore = items.length > 0 && items.length < total && items.length < 1000;

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10 sm:px-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">뉴스 검색</h1>
          <SearchBar
            initialQuery={query}
            disabled={status === "loading"}
            onSearch={handleSearch}
          />
          <KeywordChips disabled={status === "loading"} onSelect={handleSearch} />
        </div>

        {status !== "idle" && status !== "error" && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              {status !== "loading" && `총 ${total.toLocaleString()}건`}
            </p>
            <SortToggle value={sort} disabled={isBusy} onChange={handleSortChange} />
          </div>
        )}

        {status === "loading" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: DISPLAY_COUNT }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {status === "error" && <ErrorState message={errorMessage} onRetry={handleRetry} />}

        {status === "empty" && <EmptyState onSelectKeyword={handleSearch} />}

        {(status === "success" || status === "loading-more") && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <NewsCard key={`${item.link}-${index}`} item={item} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={status === "loading-more"}
                  className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  {status === "loading-more" ? "불러오는 중..." : "더보기"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
