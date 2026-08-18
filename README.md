# 뉴스 검색

네이버 뉴스 검색 API를 활용한 키워드 기반 뉴스 검색 서비스입니다. 자세한 기획 배경은 [`docs/PRD.md`](./docs/PRD.md)를 참고하세요.

## Getting Started

### 1. 네이버 API 키 발급

[네이버 개발자센터](https://developers.naver.com/apps/#/register)에서 애플리케이션을 등록하고 "검색" API 사용권한을 추가한 뒤 Client ID / Client Secret을 발급받습니다.

### 2. 환경변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local`에 발급받은 값을 채워넣습니다.

```env
NAVER_CLIENT_ID=발급받은_클라이언트_ID
NAVER_CLIENT_SECRET=발급받은_클라이언트_시크릿
```

`.env.local`은 `.gitignore`에 포함되어 있어 커밋되지 않습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 아키텍처

브라우저는 네이버 API를 직접 호출하지 않고, 항상 자체 서버 라우트(`app/api/news/route.ts`)를 거칩니다. 네이버 Client ID/Secret은 서버 사이드에서만 사용되며 클라이언트 번들에 노출되지 않습니다.

```
[브라우저] → /api/news → [Next.js Route Handler] → [네이버 뉴스 API]
```

## Deploy on Vercel

Vercel 프로젝트 설정 → Environment Variables에 `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`을 등록해야 배포 환경에서 정상 동작합니다.
