"use client";

import type { SortOption } from "@/lib/types";

interface SortToggleProps {
  value: SortOption;
  disabled: boolean;
  onChange: (sort: SortOption) => void;
}

const OPTIONS: { label: string; value: SortOption }[] = [
  { label: "정확도순", value: "sim" },
  { label: "최신순", value: "date" },
];

export function SortToggle({ value, disabled, onChange }: SortToggleProps) {
  return (
    <div
      role="group"
      aria-label="정렬 기준"
      className="inline-flex rounded-lg border border-zinc-300 p-0.5 dark:border-zinc-700"
    >
      {OPTIONS.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
