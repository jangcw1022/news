export function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-auto h-3 w-1/3 rounded bg-zinc-200 pt-1 dark:bg-zinc-800" />
    </div>
  );
}
