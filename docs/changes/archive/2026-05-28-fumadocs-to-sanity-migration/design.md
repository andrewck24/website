## Context

The project is a Next.js 16 personal website with three content collections (notes, projects, about) served in three locales (zh-TW, en, ja). The current content pipeline uses fumadocs-mdx for MDX compilation, fumadocs-core for source loading and i18n middleware, and fumadocs-ui for the Provider, layout, and UI components. Content lives as MDX files in `content/` and is compiled at build time. Any content change requires a full redeploy.

fumadocs is not being used as a documentation site framework in the traditional sense — it was adopted for its content pipeline and component primitives. Its presence couples the project to a docs-oriented library with significant surface area (TOC, sidebar, search, i18n middleware) that the project only partially uses.

The goal of this change is to replace the fumadocs content pipeline with Sanity.io, enable on-demand ISR, and retain existing page URLs and UI behavior. fumadocs UI component dependencies are replaced with Next.js primitives and custom components.

## Goals / Non-Goals

**Goals:**

- Replace fumadocs content pipeline with Sanity.io (Sanity Cloud dataset + Studio)
- Enable on-demand ISR via Sanity webhook → `/api/revalidate`
- Retain all existing page routes and URL structure unchanged
- Support document-level i18n for zh-TW, en, ja via `@sanity/document-internationalization`
- Embed Sanity Studio at `/studio` route within the Next.js app
- Remove all fumadocs packages from the dependency tree

**Non-Goals:**

- Visual redesign (minimalism / ElevenLabs-style) — separate change
- Search functionality — separate change after Sanity migration stabilises
- Adding i18next or any UI string library — inline `Record<Locale, string>` maps are sufficient
- Generating a migration script — 9 MDX files will be migrated manually via Studio

## Decisions

### ISR with Sanity Webhook over SSG or SSR

SSG requires a full rebuild and redeploy on every content change, which conflicts with the goal of decoupling content updates from deployments. SSR adds per-request Sanity API latency and cost. ISR via on-demand revalidation (`revalidatePath`) provides static-page performance while enabling near-realtime content updates triggered by a Sanity publish webhook.

The `/api/revalidate` route validates the incoming webhook using a shared secret (`SANITY_WEBHOOK_SECRET`) and calls `revalidatePath` for the affected document's locale-prefixed URL paths.

**Alternative considered**: Keeping SSG with GitHub Actions deploy trigger — rejected because it keeps the code-deploy coupling and has a 2–5 minute latency.

### Document-Level i18n over Field-Level i18n

Field-level i18n stores all translations in a single document as `{ zh-TW: "...", en: "...", ja: "..." }` per field. This produces complex GROQ queries and a poor Studio editing experience (all languages visible simultaneously).

Document-level i18n creates one Sanity document per language version and links them via `@sanity/document-internationalization`. The plugin injects a `language` field and manages cross-document relationships. GROQ queries filter by `language == $locale`, matching the existing `Record<Locale, string>` mental model.

### Portable Text over Markdown String Field

Storing raw Markdown as a `text` field in Sanity would preserve MDX authoring syntax but lose Sanity's structured editing, custom block types, and asset management. Portable Text is Sanity's native block content format: it serialises to JSON, renders via `@portabletext/react` with per-block-type React component overrides, and supports custom block types (e.g., `card`, `code`) registered in the schema and mapped to React components at render time.

**Migration note**: The existing `<Cards>` / `<Card>` MDX component (from `fumadocs-ui`) is replaced by a `card` custom block type in Portable Text, mapped to a self-implemented `CardBlock` React component.

### Single coverImage for Card and OG Image

The current schema uses `imageType: "static" | "generated"` with separate `image` and `ogImage` fields. With Sanity, images are stored in the Sanity asset pipeline and served via Sanity CDN. `@sanity/image-url` builds transformation URLs on the fly (width, height, crop, format). A single `coverImage` field of Sanity `image` type is used for both:

- Card display: `urlFor(coverImage).width(800).url()`
- OG image: `urlFor(coverImage).width(1200).height(675).fit("crop").url()` passed to `ImageResponse`

This eliminates `imageType`, `ogImageConfig`, and the generated-OG image path entirely.

### Tags as Array of Reference to Tag Document

`array of string` loses referential integrity: renaming a tag requires updating every article. `array of reference` to a `tag` document type enables GROQ join queries (`tags[]->{ title, slug }`), centralised tag management, and future tag filtering features. The `tag` schema has `title` (string) and `slug` (slug with `source: "title"`).

### About as Singleton Document

The about page is a single page per locale, not a list. Sanity's singleton pattern (via `__experimental_actions` or Studio structure API) prevents accidental creation of multiple About documents and presents it as a settings-like entry in the Studio sidebar, distinct from list-based collections (note, project).

### fumadocs UI Components Replaced with Next.js Primitives

fumadocs-core provides `Link` (wrapping next/link), `usePathname` (wrapping next/navigation), `createI18nMiddleware` (middleware for locale routing), and TOC primitives. fumadocs-ui provides `RootProvider` (theme + search context), layout components, and CSS variables.

Replacements:

- `fumadocs-core/link` → `next/link`
- `fumadocs-core/framework` `usePathname` → `next/navigation` `usePathname`
- `fumadocs-core/i18n/middleware` `createI18nMiddleware` → custom Next.js middleware in `src/middleware.ts`
- `fumadocs-ui/provider/next` `RootProvider` → `next-themes` `ThemeProvider` (already a transitive dependency)
- `fumadocs-ui/css/shadcn.css`, `fumadocs-ui/css/preset.css` → project-owned CSS variables in `src/app/globals.css`
- fumadocs TOC primitives (`fumadocs-core/toc`) → retain custom TOC components but swap primitive source to `@radix-ui/react-scroll-area` and direct scroll tracking
- `fumadocs-ui/components/codeblock` → `@shikijs/react` or retain SyntaxHighlighter inside PortableText components
- `fumadocs-ui/components/dynamic-codeblock` (used in hero terminal animation) → replace with direct `<code>` element or custom component

## Implementation Contract

### Data Layer Interface (unchanged externally)

The following functions in `src/lib/data/notes.ts` and `src/lib/data/projects.ts` MUST retain their existing signatures. Callers (page components) are not changed:

```typescript
// notes
getNote(locale: Locale, slug: string): Promise<NotePageData | null>
getFeaturedNotes(locale: Locale): Promise<ArticleCardData[]>
generateNoteStaticParams(): Promise<{ locale: Locale; slug: string }[]>
getAvailableLocales(slug: string, contentType: "notes" | "projects"): Promise<Locale[]>

// projects
getProject(locale: Locale, slug: string): Promise<ProjectPageData | null>
getFeaturedProjects(locale: Locale): Promise<ArticleCardData[]>
generateProjectStaticParams(): Promise<{ locale: Locale; slug: string }[]>
```

`NotePageData.body` changes type from `ComponentType<MDXProps>` to `PortableTextBlock[]` (Sanity Portable Text JSON). The `Article` component is updated to render `<PortableText value={article.body} components={portableTextComponents} />` instead of `<article.body />`.

### Sanity Schema Contract

Document types and required fields:

- `note`: `title` (string, required), `slug` (slug, required), `date` (date, required), `language` (string, injected by plugin), `tags` (array of reference to `tag`), `featured` (boolean), `coverImage` (image), `body` (array of blocks)
- `project`: same as note plus `githubUrl` (url), `demoUrl` (url), `order` (number 1–99)
- `about`: singleton, `title` (string), `body` (array of blocks); one document per locale
- `tag`: `title` (string, required), `slug` (slug, required)

All document types with multilingual content MUST have the `@sanity/document-internationalization` plugin applied, injecting a `language` field with values from `["zh-TW", "en", "ja"]`.

### ISR Webhook Contract

`POST /api/revalidate`:

- Request header `sanity-webhook-signature` MUST be validated against `SANITY_WEBHOOK_SECRET` env var
- On valid signature: parse `_type` and `slug.current` from body, call `revalidatePath` for all locale variants of the affected document (`/zh-TW/notes/<slug>`, `/en/notes/<slug>`, `/ja/notes/<slug>`), return `{ revalidated: true }` with HTTP 200
- On invalid signature: return HTTP 401 with no body
- On missing env var: return HTTP 500

### Studio Route Contract

`GET /studio` and `GET /studio/*`:

- Returns Sanity Studio React application rendered via `NextStudio` from `next-sanity`
- Route defined at `src/app/studio/[[...tool]]/page.tsx`
- Must be excluded from the i18n middleware locale-prefix routing

### Acceptance Criteria

1. All existing page routes (`/[lang]/notes`, `/[lang]/notes/[slug]`, `/[lang]/projects`, `/[lang]/projects/[slug]`, `/[lang]/about`) return HTTP 200 with content sourced from Sanity
2. Publishing a document in Studio triggers a POST to `/api/revalidate`; the corresponding page shows updated content within 30 seconds without a redeploy
3. `GET /studio` returns HTTP 200 with Sanity Studio UI
4. `pnpm build` succeeds with zero fumadocs imports remaining (`grep -r "fumadocs" src/` returns no matches)
5. All three locales render correctly for all content types

**In scope**: content pipeline, data layer, ISR webhook, Studio route, fumadocs removal
**Out of scope**: visual styling, search, i18n library adoption, test suite updates beyond data layer

## Risks / Trade-offs

[fumadocs TOC primitives] `toc-thumb.tsx`, `toc-clerk.tsx`, `toc.tsx` use `fumadocs-core/toc` scroll-tracking primitives. Replacing these requires custom scroll position tracking. → Mitigation: use Intersection Observer API directly; complexity is bounded to the TOC components.

[Provider replacement] `RootProvider` from fumadocs-ui wraps theme and search context. Removing it may break theme switching if `next-themes` ThemeProvider is not substituted correctly. → Mitigation: wrap layout with `next-themes` ThemeProvider; verify dark mode toggle in acceptance testing.

[i18n middleware] `createI18nMiddleware` in `src/proxy.ts` handles locale detection and redirect. Custom replacement must replicate locale negotiation logic (accept-language header, cookie, path prefix). → Mitigation: implement minimal middleware matching fumadocs-core source; test with all three locales.

[Manual content migration] 9 MDX files with Portable Text blocks manually re-entered in Studio introduces human error risk. → Mitigation: verify each page renders correctly post-migration before proceeding to data layer replacement.

## Migration Plan

1. Create Sanity project and obtain credentials (`projectId`, `dataset`, `token`)
2. Define and validate all schemas in Studio (Phase 2)
3. Embed Studio at `/studio` and verify it loads (Phase 3)
4. Migrate all 9 content files into Sanity manually (Phase 4)
5. Replace data layer functions while keeping page components unchanged (Phase 5)
6. Replace fumadocs UI component dependencies (Phase 5)
7. Add ISR webhook route and configure Sanity webhook (Phase 6)
8. Remove all fumadocs packages and verify `pnpm build` passes (Phase 7)

Rollback: The `content/` directory and fumadocs configuration are only deleted in Phase 7. Reverting before Phase 7 restores the previous state via `git revert`.
