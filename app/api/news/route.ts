import { NextRequest, NextResponse } from "next/server";
import { stripHtmlTags } from "@/lib/format";
import type { NewsItem, SortOption } from "@/lib/types";

const NAVER_NEWS_ENDPOINT = "https://naverapihub.apigw.ntruss.com/search/v1/news";

function isSortOption(value: string | null): value is SortOption {
  return value === "sim" || value === "date";
}

export async function GET(request: NextRequest) {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { message: "서버에 네이버 API 키가 설정되어 있지 않습니다.", code: "SERVER" },
      { status: 500 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json(
      { message: "검색어가 필요합니다.", code: "SERVER" },
      { status: 400 },
    );
  }

  const displayParam = Number(searchParams.get("display") ?? "10");
  const startParam = Number(searchParams.get("start") ?? "1");
  const sortParam = searchParams.get("sort");

  const display = Number.isFinite(displayParam)
    ? Math.min(Math.max(Math.trunc(displayParam), 1), 100)
    : 10;
  const start = Number.isFinite(startParam)
    ? Math.min(Math.max(Math.trunc(startParam), 1), 1000)
    : 1;
  const sort: SortOption = isSortOption(sortParam) ? sortParam : "sim";

  const upstreamUrl = new URL(NAVER_NEWS_ENDPOINT);
  upstreamUrl.searchParams.set("query", query);
  upstreamUrl.searchParams.set("display", String(display));
  upstreamUrl.searchParams.set("start", String(start));
  upstreamUrl.searchParams.set("sort", sort);

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": clientId,
        "X-NCP-APIGW-API-KEY": clientSecret,
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "네이버 API에 연결할 수 없습니다.", code: "NETWORK" },
      { status: 502 },
    );
  }

  if (upstreamResponse.status === 429) {
    return NextResponse.json(
      { message: "요청이 많아 잠시 후 이용해주세요.", code: "RATE_LIMIT" },
      { status: 429 },
    );
  }

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      { message: "일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.", code: "SERVER" },
      { status: upstreamResponse.status },
    );
  }

  const data = await upstreamResponse.json();

  const items: NewsItem[] = (data.items ?? []).map((item: NewsItem) => ({
    title: stripHtmlTags(item.title),
    link: item.link,
    originallink: item.originallink,
    description: stripHtmlTags(item.description),
    pubDate: item.pubDate,
  }));

  return NextResponse.json({
    items,
    total: data.total ?? 0,
    start: data.start ?? start,
    display: data.display ?? display,
  });
}
