## Why

Four components (`generated-hero`, `featured-project-card`, `project-detail`, `project-detail-image`) were tightly coupled to the Projects content type. Abstracting them into generic Article components allowed Notes to share the same display system without duplicating code.

## What Changes

- `ArticleMetadata` shared type established as the common data contract
- Hero visual supports both static image and dynamic generation (gradient, solid colour, background image)
- Card variants (Hero, Compact) unified across Projects and Notes
- Notes section gains featured, list, and detail page support using the same components

## Capabilities

### New Capabilities

- `unified-article-display`: Single component set renders both Projects and Notes articles
- `hero-visual-modes`: Static image and dynamic generation modes with three background style options
- `display-contexts`: Consistent hero visual across card, detail page, and Open Graph image
- `card-variants`: Hero and Compact variants for different layout contexts
- `notes-article-display`: Notes section now has featured section, list page, and detail page

### Modified Capabilities

- `view-transition`: Now applies to Notes articles in addition to Projects

## Impact

- Affected specs: `docs/specs/article-components/spec.md`, `docs/specs/projects-page/spec.md`
- Affected code:
  - New: `src/types/article.ts`, `src/components/article/` (unified components)
  - New: `src/app/[lang]/notes/` (list, detail routes), `content/notes/` (MDX content)
  - Modified: `src/components/projects/` (refactored to use article components)
  - Removed: `src/components/generated-hero.tsx`, `src/components/featured-project-card.tsx`, `src/components/project-detail.tsx`, `src/components/project-detail-image.tsx`
