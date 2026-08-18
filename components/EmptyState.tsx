import { KeywordChips } from "@/components/KeywordChips";

export function EmptyState({ onSelectKeyword }: { onSelectKeyword: (keyword: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-base text-zinc-600 dark:text-zinc-400">검색 결과가 없습니다</p>
      <div className="w-full max-w-sm">
        <KeywordChips disabled={false} onSelect={onSelectKeyword} />
      </div>
    </div>
  );
}
