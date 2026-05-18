## Why

Projects and Notes used separate, diverging frontmatter schemas that caused type drift and duplicated Zod definitions. The Article component interfaces also redeclared types already expressible from Zod inference. A unified schema removes duplication, enables tag-based filtering via Fumadocs Orama, and adds an Article Info sidebar for richer metadata display.

## What Changes

- `baseArticleSchema` extracted in `source.config.ts`; Projects and Notes schemas extend it
- `imageType` promoted to required in article component interfaces
- TypeScript types derived from Zod schemas via `z.infer<>` (using `type`, not `interface`)
- `tags` field added to frontmatter; Fumadocs Orama tag filter integrated
- Article detail page gains an info sidebar (date, language toggle, tags, project links) at ≥ 1024 px
- `Header` component extracted to `src/components/layouts/navbar.tsx`; Notes/Projects layouts can disable language toggle via props

## Capabilities

### New Capabilities

- `unified-schema`: `baseArticleSchema` shared by Projects and Notes with type-specific extensions
- `tag-system`: `tags` frontmatter field with Fumadocs Orama tag filter support
- `article-info-sidebar`: Right-column info panel at ≥ 1024 px with date, language toggle, tags, and project links
- `navbar-refactoring`: Standalone Navbar component with per-layout language toggle control

### Modified Capabilities

- `required-image-type`: `imageType` is now required in article component interfaces
- `zod-type-inference`: Types inferred from Zod schemas via `z.infer<>`

## Impact

- Affected specs: `docs/specs/mdx-frontmatter/spec.md`, `docs/specs/article-components/spec.md`
- Affected code:
  - Modified: `source.config.ts` (unified schema), `src/lib/source.ts`
  - Modified: `src/types/article.ts` (Zod-inferred types)
  - Modified: `src/components/article/` (Article Info sidebar added)
  - New: `src/components/layouts/navbar.tsx`
  - Removed: `src/components/layouts/home/index.tsx` (merged into navbar.tsx)
