## 1. Infrastructure

- [x] [P] 1.1 Install shadcn/ui `Empty` component by running `npx shadcn@latest add empty` and confirming `src/components/ui/empty.tsx` is created with `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, and `EmptyContent` exports. Verify: `pnpm type-check` passes.

- [x] [P] 1.2 Create shared locale extraction utility implementing not-found locale derivation: `getLocaleFromHeaders(): Promise<string>` in `src/lib/locale-from-headers.ts`. The function reads the `x-pathname` header via `headers()` from `next/headers`, splits on `/`, and returns the first path segment, falling back to `"zh-TW"` when the header is absent. Both locale-aware not-found page files and the root layout use this helper (no `not-found.tsx` at `[lang]` segment level means each deep segment must self-derive its locale). Verify: calling the function in a test Server Component returns `"en"` for `x-pathname: /en/notes/foo` and `"zh-TW"` when the header is absent.

## 2. Data Layer

- [x] [P] 2.1 Add `getAvailableAboutLocalesQuery` GROQ query to `src/lib/sanity/queries.ts`: `*[_type == "about" && defined(language)].language`. This supports about locale discovery via a new `getAvailableAboutLocales()` function (the slug-based `getAvailableLocales` cannot be used because about has no slug). Verify: query string is present in the file and matches the pattern.

- [x] [P] 2.2 Add `getAvailableAboutLocales(): Promise<Locale[]>` to `src/lib/data/locales.ts`, wrapping the query from 2.1 in React `cache()`. This is the data layer for about locale discovery via a new `getAvailableAboutLocales()` function required by the about not-found page. Verify: `pnpm type-check` passes; function signature matches `() => Promise<Locale[]>`.

## 3. About Page Guard

- [x] 3.1 Add `notFound()` guard to `src/app/[lang]/about/[[...slug]]/page.tsx`: after `client.fetch(getAboutQuery)`, if the result is `null`, call `notFound()`. This satisfies the about-page not-found guard requirement. Verify: navigating to a locale with no about document returns HTTP 404 (confirm via `curl -I`); blank-page regression is gone.

## 4. Not-Found Pages

Per design decision, use `not-found.tsx` as async Server Components placed at the deepest matching segment (no `not-found.tsx` at `[lang]` segment level). Each file uses `getLocaleFromHeaders()` (shared locale extraction utility) and enforces locale buttons only for other locales, not current.

- [x] [P] 4.1 Create locale-aware not-found page at `src/app/[lang]/notes/[slug]/not-found.tsx` as an async Server Component (use `not-found.tsx` as async Server Components). It SHALL call `getLocaleFromHeaders()` (shared locale extraction utility) implementing not-found locale derivation, call `getAvailableLocales(slug, "notes")` with not-found data fetch resilience (try/catch, empty array on error), then apply locale buttons only for other locales, not current (filter out the current locale from results). Render the `Empty` component with: locale switcher buttons for remaining locales (hidden when empty), and a "return to notes list" button linking to `/<locale>/notes`. UI labels SHALL be locale-aware (zh-TW: "找不到這篇筆記" / "返回筆記列表", en: "Note not found" / "Back to Notes", ja: "このノートは見つかりません" / "ノート一覧に戻る"). Verify: `curl -I /en/notes/nonexistent` returns 404; locale button appears for zh-TW when slug exists only in zh-TW.

- [x] [P] 4.2 Create the project detail not-found page at `src/app/[lang]/projects/[slug]/not-found.tsx` as a locale-aware not-found page and async Server Component (use `not-found.tsx` as async Server Components), following the same pattern as 4.1. Call `getAvailableLocales(slug, "projects")` with not-found data fetch resilience (try/catch, empty array on error) and apply locale buttons only for other locales, not current. Return-to-list button links to `/<locale>/projects`. UI labels: zh-TW: "找不到這個專案" / "返回專案列表", en: "Project not found" / "Back to Projects", ja: "このプロジェクトは見つかりません" / "プロジェクト一覧に戻る". Verify: `curl -I /en/projects/nonexistent` returns 404; `pnpm type-check` passes.

- [ ] 4.3 Create locale-aware not-found page at `src/app/[lang]/about/[[...slug]]/not-found.tsx` as an async Server Component (use `not-found.tsx` as async Server Components). It SHALL call `getLocaleFromHeaders()` (shared locale extraction utility, implementing not-found locale derivation), call `getAvailableAboutLocales()` (about locale discovery via a new `getAvailableAboutLocales()` function) with not-found data fetch resilience (try/catch, empty array on error), then apply locale buttons only for other locales, not current (filter out the current locale). Render the `Empty` component with: locale switcher buttons (hidden when empty), and a "return to home" button linking to `/<locale>`. UI labels: zh-TW: "找不到關於頁面" / "返回首頁", en: "About page not found" / "Back to Home", ja: "Aboutページが見つかりません" / "ホームに戻る". Verify: `curl -I /en/about` returns 404 when no English about document exists; locale buttons render for available locales.

## 5. Root Layout Refactor

- [ ] 5.1 Replace the inline locale-extraction logic in `src/app/layout.tsx` with a call to `getLocaleFromHeaders()` from `src/lib/locale-from-headers.ts` (shared locale extraction utility). This removes duplication introduced in the previous PR. Verify: `pnpm type-check` passes; `lang` attribute on `<html>` is still correctly set per locale in SSR output.
