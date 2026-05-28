## Context

Three route segments — `[lang]/notes/[slug]`, `[lang]/projects/[slug]`, and `[lang]/about/[[...slug]]` — lack `not-found.tsx` files. The about page additionally has no `notFound()` guard, causing a blank page rather than a 404 when Sanity returns no data.

The existing data layer already supports locale discovery for slug-based routes via `getAvailableLocales(slug, contentType)` in `src/lib/data/locales.ts`. The about page is a singleton per locale, so locale discovery requires a separate query.

The site is multilingual (zh-TW, en, ja). About and projects content will exist in multiple languages. Notes may follow suit. Locale-aware 404 pages allow users to recover by switching to an available language rather than dead-ending.

## Goals / Non-Goals

**Goals:**

- Render a proper HTTP 404 for missing notes, projects, and about content
- Surface available locale alternatives when the content exists in other languages
- Use shadcn/ui `Empty` component for consistent visual presentation
- Add `notFound()` guard to the about page

**Non-Goals:**

- A global `app/not-found.tsx` catch-all (out of scope)
- Related/suggested content recommendations on 404 pages
- Animations or custom illustrations beyond the `Empty` component
- Locale detection for the root layout — already handled by the `x-pathname` header approach

## Decisions

### Use `not-found.tsx` as async Server Components

`not-found.tsx` in Next.js App Router supports async data fetching. The locale lookup for available alternatives requires a Sanity fetch, so each not-found file is an async Server Component. No client component wrapper is needed.

Alternative considered: pass locale data via search params or error state — rejected because not-found pages don't receive props beyond `params`, which are not accessible in `not-found.tsx`.

### About locale discovery via a new `getAvailableAboutLocales()` function

The slug-based `getAvailableLocales(slug, contentType)` cannot be used for about because about documents have no meaningful slug — they are keyed by locale. A new GROQ query fetches all locales that have an about document: `*[_type == "about" && defined(language)].language`.

This function lives in `src/lib/data/locales.ts` alongside the existing `getAvailableLocales` function, and in `src/lib/sanity/queries.ts` for the GROQ query.

### Locale buttons only for other locales, not current

The not-found page is triggered because the current locale has no content. Showing the current locale as a button would link back to a 404. Locale buttons SHALL only render locales that are not the current request locale.

However, `not-found.tsx` does not receive route params. The locale must be derived from the request URL. Use `headers()` from `next/headers` to read the `x-pathname` header (set by `proxy.ts`) and extract the first path segment.

Alternative considered: reading `NEXT_LOCALE` cookie — rejected because the proxy sets `x-pathname` reliably for all routes.

### Shared locale extraction utility

Both the root layout and not-found pages need to extract locale from `x-pathname`. Extract into a small helper `getLocaleFromHeaders(): Promise<string>` in `src/lib/locale-from-headers.ts` to avoid duplication.

### No `not-found.tsx` at `[lang]` segment level

Route-specific not-found files are placed at the deepest matching segment (`[slug]/not-found.tsx`, `[[...slug]]/not-found.tsx`). This keeps the 404 message contextual (e.g., "Note not found" vs "Project not found") rather than generic.

## Implementation Contract

**Behavior:**

- `GET /zh-TW/notes/nonexistent` → HTTP 404, renders Notes not-found page with "返回筆記列表" button; locale buttons appear only if the slug exists in other locales
- `GET /en/projects/my-project` where `my-project` only has `zh-TW` → HTTP 404, renders Projects not-found page with "Back to Projects" button and a "中文" locale button linking to `/zh-TW/projects/my-project`
- `GET /en/about` where Sanity has no English about document → HTTP 404, renders About not-found page with "Back to Home" button and available locale buttons
- `GET /zh-TW/about/random-slug` → HTTP 404, same About not-found page (the `[[...slug]]` catch-all collapses all unmatched paths to the same handler)

**Interfaces:**

- `getAvailableAboutLocales(): Promise<Locale[]>` — returns all locales with an about document; wrapped in React `cache()`
- `getLocaleFromHeaders(): Promise<string>` — reads `x-pathname` header, splits on `/`, returns first segment; falls back to `"zh-TW"` if header is absent
- Each `not-found.tsx` is an async Server Component with no props; it uses `getLocaleFromHeaders()` to determine the current locale

**Failure modes:**

- If `getAvailableLocales` or `getAvailableAboutLocales` throws, the not-found page should still render without locale buttons (the Sanity call failure must not produce a 500)
- If `x-pathname` header is absent (e.g., direct server render without proxy), locale falls back to `"zh-TW"`

**Acceptance criteria:**

- Navigating to a nonexistent note/project slug returns HTTP 404 (verify via `curl -I`)
- Navigating to `/en/about` when no English about exists returns HTTP 404
- Locale buttons link to the correct alternate URL and are absent when no other locales have the content
- `pnpm type-check` passes with no errors

**Scope boundaries:**

- In scope: the three route segments listed above, the two data functions, the shared locale helper
- Out of scope: global `app/not-found.tsx`, notes/projects list pages, homepage

### Locale switcher UX: section label and human-readable locale names

The initial implementation renders locale buttons with raw locale codes (`zh-TW`, `en`, `ja`) and no contextual label, which is not meaningful to users who may not recognize IETF language tags.

Two improvements are required:

1. **Section label**: when `otherLocales.length > 0`, display a locale-aware introductory sentence above the buttons so the user understands what the buttons do.
   - zh-TW: `"此內容也提供以下語言版本："`
   - en: `"This content is also available in:"`
   - ja: `"このコンテンツは以下の言語でもご覧いただけます："`

2. **Human-readable locale names**: replace the raw locale code in each button with the display name of that locale:
   - `"zh-TW"` → `"繁體中文"`
   - `"en"` → `"English"`
   - `"ja"` → `"日本語"`

These labels are static — no data fetch needed. A shared `LOCALE_NAMES` constant (e.g., `Record<string, string>`) MAY be defined in each not-found file inline, or extracted to a shared module if reuse warrants it.

The section label is **only shown when `otherLocales.length > 0`** (same condition as the buttons wrapper). The failure mode for an unrecognised locale code is to fall back to the raw code string.

Updated Implementation Contract behavior example:

- `GET /en/projects/my-project` where `my-project` only has `zh-TW` → HTTP 404, renders Projects not-found page with "Back to Projects" button, the label "This content is also available in:", and a "繁體中文" button linking to `/zh-TW/projects/my-project`

## Risks / Trade-offs

- [Risk] `not-found.tsx` with `headers()` makes the route dynamic (no static export for 404 pages). → Acceptable: these are error paths, not hot paths. ISR still applies to the happy-path pages.
- [Risk] `getAvailableAboutLocales()` adds a Sanity round-trip on every about 404 render. → Mitigated by React `cache()` and the rarity of about 404s in production.
