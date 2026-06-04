## Why

The site has a crawlability bug (Googlebot receives 404 for `/zh-TW/robots.txt` due to the proxy matcher not excluding static files) and lacks foundational multilingual SEO signals (`hreflang`, canonical URLs, structured data) that affect indexing quality and AI search engine discoverability.

## What Changes

- **Bug fix**: `src/proxy.ts` matcher excludes `robots.txt` and `sitemap.xml` to prevent locale-redirect loop
- **robots.ts**: adds `/studio` to disallow, removes unreliable `*.json` wildcard
- **hreflang / canonical**: all pages emit `alternates.languages` and `alternates.canonical`; dynamic slug pages use `getAvailableLocales`; all pages include `x-default: /zh-TW`
- **sitemap**: dynamically includes notes and projects from Sanity; `lastModified` uses `_updatedAt` instead of `new Date()`
- **JSON-LD structured data**: homepage emits `Person` + `WebSite` schema; notes slug pages emit `Article`; projects slug pages emit `CreativeWork`
- **OG image**: slug pages use Sanity `coverImage` when available; fallback to Next.js `ImageResponse` generating title + site name on a simple background
- **llms.txt**: new request-time route handler at `/llms.txt` that fetches English notes and projects from Sanity and returns structured Markdown for LLM crawlers

## Capabilities

### New Capabilities

- `seo-aiseo`: proxy matcher fix, robots.txt corrections, hreflang/canonical on all pages, dynamic Sanity sitemap, JSON-LD structured data, and llms.txt route handler
- `og-image`: per-article OG image using Sanity `coverImage` with Next.js `ImageResponse` fallback

### Modified Capabilities

(none)

## Impact

- Affected specs: `seo-aiseo`, `og-image`
- Affected code:
  - Modified:
    - `src/proxy.ts`
    - `src/app/robots.ts`
    - `src/app/sitemap.ts`
    - `src/lib/sanity/queries.ts`
    - `src/app/(site)/[lang]/layout.tsx`
    - `src/app/(site)/[lang]/notes/[slug]/page.tsx`
    - `src/app/(site)/[lang]/notes/page.tsx`
    - `src/app/(site)/[lang]/projects/[slug]/page.tsx`
    - `src/app/(site)/[lang]/projects/page.tsx`
    - `src/app/(site)/[lang]/about/[[...slug]]/page.tsx`
  - New:
    - `src/app/llms.txt/route.ts`
    - `src/app/(site)/[lang]/notes/[slug]/opengraph-image.tsx`
    - `src/app/(site)/[lang]/projects/[slug]/opengraph-image.tsx`
  - Removed: none
