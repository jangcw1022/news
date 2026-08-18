export type SortOption = "sim" | "date";

export interface NewsItem {
  title: string;
  link: string;
  originallink: string;
  description: string;
  pubDate: string;
}

export interface NewsSearchResponse {
  items: NewsItem[];
  total: number;
  start: number;
  display: number;
}

export interface NewsApiError {
  message: string;
  code: "NETWORK" | "RATE_LIMIT" | "SERVER";
}
