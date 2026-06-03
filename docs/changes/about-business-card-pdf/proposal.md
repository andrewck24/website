## Why

The About page's `PersonalInfo` sidebar lacks a resume download path and uses a desktop-only sticky aside layout that fragments personal identity from contact actions. This change introduces a BusinessCard component with a downloadable resume and a scroll-aware collapsed header.

## What Changes

- **Sanity `about` schema**: add `resumePdfZh` and `resumePdfEn` optional file fields
- **About page layout**: remove `lg:flex-row` two-column layout; PersonalInfo always renders above the article on all breakpoints
- **`PersonalInfo` → `BusinessCard`**: refactored as a client component; all social links move inside the gradient card; PDF dialog trigger added
- **Collapsed sticky header**: IntersectionObserver detects when card scrolls out of view and snaps to a condensed sticky state; clicking the collapsed card scrolls to top
- **PDF download dialog**: shadcn/ui Dialog; `?resume=open` searchParam controls initial open state; closing removes the param via `router.replace` without adding a history entry; two conditional download links (Traditional Chinese, English); wrapped in `<Suspense>`
- **Article styling**: remove border and horizontal padding on mobile; article content spans full width on narrow viewports

## Capabilities

### New Capabilities

- `resume-pdf-download`: Resume PDF stored in Sanity as file assets; downloadable via a dialog with per-locale links; shareable via `?resume=open` URL

### Modified Capabilities

- `about-page`: Layout changes from two-column sticky aside to single-column stack; PersonalInfo becomes a client component with scroll-driven collapsed state

## Impact

- Affected specs: `resume-pdf-download` (new), `about-page` (modified)
- Affected code:
  - New: `src/components/about/business-card.tsx`, `src/components/about/resume-dialog.tsx`
  - Modified: `src/sanity/schemas/about.ts`, `src/lib/sanity/queries.ts`, `src/app/(site)/[lang]/about/[[...slug]]/page.tsx`, `src/components/about/personal-info.tsx`
  - Removed: none (personal-info.tsx will be replaced in-place)
