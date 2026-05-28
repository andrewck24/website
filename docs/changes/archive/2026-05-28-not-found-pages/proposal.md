## Why

The notes, projects, and about routes currently have no `not-found.tsx` files, and the about page lacks a `notFound()` guard. When content is missing — either because a slug doesn't exist in a given locale or Sanity has no data for a locale — users see a blank page or an unhandled error instead of a proper 404 with navigation options. Since the site is multilingual and about/projects will have content in multiple languages, a not-found page that surfaces available language alternatives provides meaningful recovery for users who land on the wrong locale.

## What Changes

- Add `notFound()` guard to `src/app/[lang]/about/[[...slug]]/page.tsx` (finding #3 fix, consistent with notes/projects)
- Add `src/app/[lang]/notes/[slug]/not-found.tsx` using shadcn/ui `Empty` component
- Add `src/app/[lang]/projects/[slug]/not-found.tsx` using shadcn/ui `Empty` component
- Add `src/app/[lang]/about/[[...slug]]/not-found.tsx` using shadcn/ui `Empty` component
- Add `getAvailableAboutLocales()` data function to support locale detection on the about not-found page
- Install shadcn/ui `Empty` component (`npx shadcn@latest add empty`)

## Non-Goals

- Suggested/related content on not-found pages (no "you might like" recommendations)
- A global `app/not-found.tsx` catch-all — only route-specific not-found pages are in scope
- Animated or heavily styled not-found pages beyond the Empty component pattern
- Notes locale switcher is included for consistency even though notes multi-language support is not yet confirmed; it will degrade gracefully (no buttons shown if no other locales exist)

## Capabilities

### New Capabilities

- `not-found-pages`: Route-specific 404 pages for notes, projects, and about with locale-aware navigation buttons

### Modified Capabilities

- `about-page`: Add `notFound()` guard when Sanity returns no data for the requested locale
- `projects-page`: Add `not-found.tsx` with locale switcher and back-to-list button

## Impact

- Affected specs: `not-found-pages` (new), `about-page` (modified), `projects-page` (modified)
- Affected code:
  - New: `src/app/[lang]/notes/[slug]/not-found.tsx`
  - New: `src/app/[lang]/projects/[slug]/not-found.tsx`
  - New: `src/app/[lang]/about/[[...slug]]/not-found.tsx`
  - New: `src/components/ui/empty.tsx`
  - Modified: `src/app/[lang]/about/[[...slug]]/page.tsx`
  - Modified: `src/lib/data/notes.ts`
  - Modified: `src/lib/data/projects.ts`
  - Modified: `src/lib/sanity/queries.ts`
