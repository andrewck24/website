## Why

The portfolio site needed a Projects section so visitors can browse curated work samples and read detailed case studies. The feature also establishes the View Transitions pattern that the Notes section would later reuse.

## What Changes

- 3–5 featured project cards displayed on the homepage
- Individual project detail pages with four-section narrative structure
- View Transitions API used for card-to-detail image animation (with direct-navigation fallback)
- MDX-based content authoring via fumadocs-mdx
- Projects link added to primary navigation

## Capabilities

### New Capabilities

- `featured-projects-homepage`: Curated project cards on homepage with title, description, and image
- `project-detail-page`: Dedicated page per project with Problem → Thinking → Solution → Impact narrative
- `view-transition`: Card image animates into detail hero via View Transitions API; degrades gracefully
- `mdx-content-management`: Project content authored and rendered from MDX files
- `responsive-layout`: Single-column mobile layout with hero/compact card variants

## Impact

- Affected specs: `docs/specs/projects-page/spec.md`
- Affected code:
  - New: `content/projects/` (MDX content files)
  - New: `src/components/projects/` (card and detail components)
  - New: `src/app/[lang]/projects/` (list and detail routes)
  - New: `src/types/project.ts`, `tests/e2e/projects.spec.ts`
  - Modified: `source.config.ts`, `src/lib/source.ts`, `src/lib/layout.shared.tsx`, `next.config.ts`
