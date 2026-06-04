## Context

The site uses Next.js 16 with file-based i18n routing (`/[lang]/...`) and a custom proxy (`src/proxy.ts`) that redirects locale-less paths to the default locale (`zh-TW`). Content (notes, projects) is served from Sanity via GROQ queries in `src/lib/sanity/queries.ts`. The proxy matcher currently does not exclude `robots.txt` or `sitemap.xml`, causing a redirect loop that produces cached 404s for Googlebot. No hreflang, canonical, structured data, or llms.txt signals currently exist.

## Goals / Non-Goals

**Goals:**

- Fix the `/zh-TW/robots.txt` 404 by excluding static SEO files from the proxy matcher
- Emit correct `hreflang` + canonical tags on every page
- Extend the sitemap with dynamic Sanity content and accurate `lastModified`
- Add JSON-LD structured data to homepage, note pages, and project pages
- Serve a dynamic `/llms.txt` for LLM crawlers
- Add per-article OG images with Sanity `coverImage` and `ImageResponse` fallback

**Non-Goals:**

- Custom domain setup (site remains on `andrewck24.vercel.app`)
- Sitemap index / multi-sitemap splitting
- Per-locale `llms.txt` variants
- Server-side rendering changes (all existing ISR/SSG behavior is unchanged)

## Decisions

### Proxy matcher excludes static SEO files via filename pattern

The matcher regex is extended with `robots\\.txt|sitemap\\.xml` rather than a broad `.*\\..*` extension wildcard. A broad wildcard would also exclude `_next/image` URLs that contain dots in query params, causing image optimization to break.

Alternatives considered: adding a `next.config.ts` rewrite as a second layer — rejected because fixing the root cause in the matcher is sufficient and avoids two-layer indirection.

### hreflang emitted via Next.js `alternates` in `generateMetadata`

Next.js natively serialises `alternates.languages` to `<link rel="alternate" hreflang="...">` tags. This is preferred over manual `<head>` injection because it participates in the metadata merge tree and is type-safe.

Static pages (listing pages, about, homepage): all three locales (`zh-TW`, `en`, `ja`) plus `x-default: /zh-TW` are hardcoded. Dynamic slug pages: `getAvailableLocales` determines which locales to include, preventing hreflang entries that point to 404s.

### Sitemap extended in-place, not split

The existing `src/app/sitemap.ts` is extended to call `getAllNotes` and `getAllProjects` for all three locales. A separate `sitemap-dynamic.ts` is not introduced — the single file is simpler and the total URL count remains well under the 50,000 sitemap limit.

`lastModified` is sourced from Sanity `_updatedAt`. Queries that currently omit `_updatedAt` are updated.

### JSON-LD injected via `<script type="application/ld+json">` in page components

Each page component that needs structured data renders a `<script>` tag with `dangerouslySetInnerHTML`. This is the Next.js-idiomatic approach (used in official docs) and avoids a third-party schema library dependency.

Schema types: `Person` + `WebSite` on the `[lang]` layout (applies to all pages via inheritance); `Article` override on `notes/[slug]/page.tsx`; `CreativeWork` override on `projects/[slug]/page.tsx`.

### llms.txt served as a Next.js Route Handler

`src/app/llms.txt/route.ts` exports a `GET` handler that fetches `en` locale notes and projects from Sanity at request time and returns `text/plain` Markdown. Request-time fetch ensures content is always current without requiring a rebuild. No caching header is set beyond Vercel's default edge cache.

### OG image uses Next.js file-based convention (`opengraph-image.tsx`)

Placing `opengraph-image.tsx` inside a route segment registers it as the OG image for that segment. The file exports a default function returning `ImageResponse`. It receives the route params, fetches the article from Sanity, and returns the `coverImage` URL if present or renders a fallback canvas with the article title and site name.

## Implementation Contract

**Proxy fix**

- Before: `GET /robots.txt` → proxy redirects → `GET /zh-TW/robots.txt` → 404
- After: `GET /robots.txt` → proxy skips (no locale check) → `GET /robots.txt` → 200
- Verification: `curl -I https://andrewck24.vercel.app/robots.txt` returns 200; `curl -I https://andrewck24.vercel.app/zh-TW/robots.txt` returns 404 (no route, no redirect)

**hreflang**

- Every page `<head>` includes `<link rel="canonical">` and at least one `<link rel="alternate" hreflang>` tag
- Slug pages only include hreflang entries for locales returned by `getAvailableLocales`
- All pages include `hreflang="x-default"` pointing to the `zh-TW` variant
- Verification: inspect `<head>` on `/zh-TW/notes/<slug>` and `/en/notes/<slug>`; confirm tags are present and URLs resolve

**Sitemap**

- `GET /sitemap.xml` includes entries for all published notes and projects across all three locales
- Each dynamic entry's `lastModified` matches the Sanity `_updatedAt` value for that document
- Verification: fetch `/sitemap.xml` and confirm note/project URLs appear with non-build-time `lastModified` dates

**JSON-LD**

- Homepage `<head>` contains a `<script type="application/ld+json">` with `@type: "Person"` and `@type: "WebSite"`
- Note pages contain `@type: "Article"` with `headline`, `datePublished`, `dateModified`, `author`
- Project pages contain `@type: "CreativeWork"` with `name`, `description`, `author`
- Verification: use Google's Rich Results Test on each page type

**llms.txt**

- `GET /llms.txt` returns `Content-Type: text/plain` with Markdown listing all English notes and projects
- Format: `# Andrew Tseng\n\n## Notes\n- [title](url): description\n\n## Projects\n- [title](url): description`
- Verification: `curl https://andrewck24.vercel.app/llms.txt` returns valid Markdown

**OG image**

- Note and project pages with a Sanity `coverImage` serve that image as the OG image (1200×630)
- Pages without `coverImage` serve a dynamically generated image containing the article title and "Andrew Tseng"
- Verification: use `og:image` meta tag inspector on a note page with and without a cover image

**Scope boundaries**

- In scope: all files listed in the proposal Impact section
- Out of scope: Sanity Studio schema changes, ISR revalidation logic, homepage content changes

## Risks / Trade-offs

- [Risk] `opengraph-image.tsx` adds a Sanity fetch per OG image request → Mitigation: Vercel caches the response at the edge; the fetch only runs on cache miss
- [Risk] `getAllNotes`/`getAllProjects` in `sitemap.ts` fetches all locales on every build → Mitigation: acceptable at current content volume; revisit if build time exceeds 30s
- [Risk] `dangerouslySetInnerHTML` for JSON-LD could introduce XSS if Sanity content contains `</script>` → Mitigation: JSON-encode all values with `JSON.stringify`; do not interpolate raw strings
