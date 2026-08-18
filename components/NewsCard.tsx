import { formatPubDate, getSourceName } from "@/lib/format";
import type { NewsItem } from "@/lib/types";

export function NewsCard({ item }: { item: NewsItem }) {
  const href = item.originallink || item.link;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h3 className="line-clamp-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {item.title}
      </h3>
      <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
        {item.description}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-1 text-xs text-zinc-500 dark:text-zinc-500">
        <span>{getSourceName(item.originallink, item.link)}</span>
        <span aria-hidden="true">·</span>
        <span>{formatPubDate(item.pubDate)}</span>
      </div>
    </a>
  );
}
