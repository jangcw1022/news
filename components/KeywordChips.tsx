"use client";

export const POPULAR_KEYWORDS = ["AI", "부동산", "환율", "반도체", "금리", "주식"];

interface KeywordChipsProps {
  disabled: boolean;
  onSelect: (keyword: string) => void;
}

export function KeywordChips({ disabled, onSelect }: KeywordChipsProps) {
  return (
    <div className="flex w-full gap-2 overflow-x-auto pb-1">
      {POPULAR_KEYWORDS.map((keyword) => (
        <button
          key={keyword}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(keyword)}
          className="shrink-0 rounded-full border border-zinc-300 bg-white px-4 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {keyword}
        </button>
      ))}
    </div>
  );
}
