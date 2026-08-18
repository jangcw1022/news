export function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
}

export function formatPubDate(pubDate: string): string {
  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) return pubDate;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

export function getSourceName(originallink: string, link: string): string {
  const target = originallink || link;
  try {
    const host = new URL(target).hostname.replace(/^www\./, "");
    return host;
  } catch {
    return "네이버 뉴스";
  }
}
