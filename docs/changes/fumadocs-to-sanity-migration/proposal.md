## Why

The project currently uses fumadocs (fumadocs-core, fumadocs-mdx, fumadocs-ui) as both a content pipeline and UI component library. This couples content management to the file system and requires a full redeploy on every content change. Migrating to Sanity.io decouples content from code, enables on-demand ISR updates, and builds hands-on Sanity integration experience for professional development.

## What Changes

- **BREAKING**: Remove `fumadocs-core`, `fumadocs-mdx`, `fumadocs-ui` and all fumadocs-dependent code
- **BREAKING**: Remove `content/` directory (MDX files) from the repository; content migrates to Sanity Cloud dataset
- **BREAKING**: Remove `source.config.ts` and `src/lib/source.ts`
- Replace `@/lib/data/notes` and `@/lib/data/projects` implementations with Sanity GROQ queries via `@sanity/client`
- Replace MDX rendering (`getMDXComponents`) with Portable Text rendering (`@portabletext/react`)
- Replace file-system-based OG image generation with Sanity CDN image URLs via `@sanity/image-url`
- Add Sanity Studio embedded at `/studio` route via `next-sanity`
- Add Sanity document schemas: `note`, `project`, `about` (singleton), `tag`
- Add `@sanity/document-internationalization` plugin for document-level i18n (zh-TW / en / ja)
- Add ISR webhook endpoint at `/api/revalidate` — triggered by Sanity publish events
- Remove `/api/search` route (search to be addressed in a separate change)
- Remove Orama search packages (`@orama/stopwords`, `@orama/tokenizers`)

## Non-Goals

- Visual redesign (minimalism / ElevenLabs-style) — separate change
- Search functionality — will be re-implemented in a follow-up change after Sanity migration stabilises
- i18next or any UI string library — current inline `Record<Locale, string>` maps are sufficient

## Capabilities

### New Capabilities

- `sanity-content-layer`: Sanity Studio embedded in Next.js, document schemas (note, project, about, tag), document-level i18n, and GROQ-based data fetching replacing the fumadocs content pipeline
- `isr-webhook`: On-demand ISR revalidation triggered by Sanity publish/unpublish webhook events

### Modified Capabilities

- `mdx-frontmatter`: Content schema moves from Zod/frontmatter to Sanity document fields; `src/types/article.ts` drops fumadocs dependency and becomes plain TypeScript interfaces derived from Sanity schema
- `about-page`: About page content migrates from MDX singleton files to a Sanity singleton document; data fetching layer replaced
- `projects-page`: Projects content migrates from MDX files to Sanity documents; data fetching layer replaced

## Impact

- Affected specs: `sanity-content-layer` (new), `isr-webhook` (new), `mdx-frontmatter` (modified), `about-page` (modified), `projects-page` (modified)
- Affected code:
  - New: `sanity.config.ts`, `schemas/index.ts`, `schemas/note.ts`, `schemas/project.ts`, `schemas/about.ts`, `schemas/tag.ts`, `schemas/block/card.ts`, `src/app/studio/[[...tool]]/page.tsx`, `src/app/api/revalidate/route.ts`, `src/lib/sanity/client.ts`, `src/lib/sanity/image.ts`, `src/lib/sanity/queries.ts`, `src/components/mdx/portable-text.tsx`
  - Modified: `src/lib/data/notes.ts`, `src/lib/data/projects.ts`, `src/lib/data/about.ts`, `src/lib/data/locales.ts`, `src/types/article.ts`, `src/app/[lang]/notes/[slug]/opengraph-image.tsx`, `src/app/[lang]/projects/[slug]/opengraph-image.tsx`, `src/app/globals.css`, `pnpm-workspace.yaml`, `package.json`
  - Removed: `source.config.ts`, `src/lib/source.ts`, `src/lib/i18n.ts`, `src/app/api/search/route.ts`, `content/`
