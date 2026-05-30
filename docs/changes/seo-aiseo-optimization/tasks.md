## 1. Crawlability Fixes

- [x] 1.1 [P] Proxy matcher excludes static SEO files via filename pattern: update the `matcher` regex in `src/proxy.ts` to add `robots\\.txt|sitemap\\.xml` exclusions so that "proxy excludes static SEO files from locale redirect" — requests to `/robots.txt` pass through without a locale prefix being added. Verify: `curl -I <host>/robots.txt` returns 200; `curl -I <host>/zh-TW/robots.txt` returns 404 with no redirect chain.
- [x] 1.2 [P] robots.txt disallows Sanity Studio and omits unreliable wildcard: add `"/studio/"` to the disallow array and remove the `"*.json"` entry in `src/app/robots.ts`. Verify: `curl <host>/robots.txt` response contains `Disallow: /studio/` and does not contain `*.json`.

## 2. Sanity Query Updates

- [x] 2.1 Add `_updatedAt` field to all note and project queries in `src/lib/sanity/queries.ts` that will feed the sitemap (`getAllNotesQuery`, `getAllProjectsQuery`). Each returned document object SHALL include `_updatedAt` as an ISO date string. Verify: TypeScript compilation passes and the sitemap task (5.1) can reference `_updatedAt` without type errors.
- [x] 2.2 Add `llms.txt` GROQ queries to `src/lib/sanity/queries.ts`: new exported constants `getLlmsNotesQuery` and `getLlmsProjectsQuery` that fetch `title`, `slug.current`, `description`, and `language == "en"` notes/projects. Verify: queries are importable and return the expected shape in local development.

## 3. Layout and Static Pages — hreflang and JSON-LD

- [x] 3.1 Implement hreflang emitted via Next.js `alternates` in `generateMetadata` and homepage emits Person and WebSite JSON-LD in `src/app/(site)/[lang]/layout.tsx`: extend `generateMetadata` to return `alternates.canonical` (current locale URL) and `alternates.languages` with hardcoded `zh-TW`, `en`, `ja`, and `x-default: /zh-TW` entries. Also render a JSON-LD injected via `<script type="application/ld+json">` in page components containing `Person` and `WebSite` schemas. Verify: inspect `<head>` on `/<lang>` — canonical, three hreflang tags, x-default, and JSON-LD script are all present.
- [x] 3.2 [P] Add alternates (canonical + hreflang) to `src/app/(site)/[lang]/notes/page.tsx` `generateMetadata` so "all pages emit hreflang and canonical link tags" — hardcode all three locales plus `x-default`. Verify: `<head>` of `/zh-TW/notes` contains four hreflang entries and a canonical tag.
- [x] 3.3 [P] Add alternates (canonical + hreflang) to `src/app/(site)/[lang]/projects/page.tsx` `generateMetadata`, same pattern as 3.2. Verify: `<head>` of `/zh-TW/projects` contains four hreflang entries and a canonical tag.
- [x] 3.4 [P] Add alternates (canonical + hreflang) to `src/app/(site)/[lang]/about/[[...slug]]/page.tsx` `generateMetadata`, same pattern as 3.2. Verify: `<head>` of `/zh-TW/about` contains four hreflang entries and a canonical tag.

## 4. Dynamic Slug Pages — hreflang and JSON-LD

- [x] 4.1 [P] Note pages emit Article JSON-LD: in `src/app/(site)/[lang]/notes/[slug]/page.tsx`, extend `generateMetadata` with dynamic hreflang using `getAvailableLocales` (only available locales plus `x-default: /zh-TW`). In the page component, render a JSON-LD injected via `<script type="application/ld+json">` in page components with `@type: "Article"`, `headline` (note title), `datePublished` (note date), `dateModified` (Sanity `_updatedAt`), and `author` (name: "Andrew Tseng"). Verify: a note that exists only in `zh-TW` and `en` produces exactly two hreflang entries (plus x-default); JSON-LD script contains `@type: "Article"`.
- [x] 4.2 [P] Project pages emit CreativeWork JSON-LD: in `src/app/(site)/[lang]/projects/[slug]/page.tsx`, extend `generateMetadata` with dynamic hreflang (same pattern as 4.1). Render a JSON-LD injected via `<script type="application/ld+json">` in page components with `@type: "CreativeWork"`, `name`, `description`, and `author`. Verify: project page `<head>` has hreflang only for available locales; JSON-LD script contains `@type: "CreativeWork"`.

## 5. Dynamic Sitemap

- [x] 5.1 Extend `src/app/sitemap.ts` so "sitemap includes all published Sanity notes and projects": call `getAllNotes` and `getAllProjects` for each of the three locales and append entries to the returned array. Each entry's `lastModified` SHALL use the document's `_updatedAt` value (not `new Date()`). "Sitemap extended in-place, not split" — no new sitemap file is created. Verify: `curl <host>/sitemap.xml` contains at least one `/notes/` and one `/projects/` URL; `lastModified` values differ between documents.

## 6. llms.txt Route Handler

- [ ] 6.1 /llms.txt serves LLM-readable site index: create `src/app/llms.txt/route.ts` as llms.txt served as a Next.js Route Handler — export a `GET` function that fetches English notes and projects from Sanity at request time via `getLlmsNotesQuery` and `getLlmsProjectsQuery` and returns `Content-Type: text/plain` Markdown with `# Andrew Tseng`, `## Notes`, and `## Projects` sections. Verify: `curl <host>/llms.txt` returns `Content-Type: text/plain`, contains both sections with populated entries, and reflects newly published Sanity content without a rebuild.

## 7. OG Image

- [ ] 7.1 [P] OG image is registered via Next.js file-based convention for notes — create `src/app/(site)/[lang]/notes/[slug]/opengraph-image.tsx` using OG image uses Next.js file-based convention (`opengraph-image.tsx`): export `size` (`{ width: 1200, height: 630 }`) and a default async function returning `ImageResponse`. Article OG image uses Sanity coverImage when available: fetch the note from Sanity and return the `coverImage` URL as the image source when present. Article OG image falls back to ImageResponse when coverImage is absent: render a fallback layout with the note title and "Andrew Tseng" on a plain background. Verify: a note with `coverImage` — `og:image` resolves to the Sanity image; a note without `coverImage` — `og:image` resolves to the generated route and renders the fallback.
- [ ] 7.2 [P] OG image is registered via Next.js file-based convention for projects — create `src/app/(site)/[lang]/projects/[slug]/opengraph-image.tsx` with the same logic as 7.1, fetching a project instead of a note. Verify: same coverImage-present and coverImage-absent scenarios as 7.1, applied to a project page.
