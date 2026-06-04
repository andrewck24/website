## Why

The About page's `PersonalInfo` sidebar lacks a resume download path and uses a desktop-only sticky aside layout that fragments personal identity from contact actions. This change introduces a static BusinessCard component with a downloadable resume sourced from a global Sanity singleton.

## What Changes

- **Sanity `siteSettings` schema**: new singleton document type with `resumePdfTw`, `resumePdfEn`, `resumePdfJa` optional file fields; replaces the per-locale `resumePdfZh`/`resumePdfEn` fields that were originally added to `about`
- **Sanity `about` schema**: remove `resumePdfZh` and `resumePdfEn` fields
- **About page layout**: remove `lg:flex-row` two-column layout; BusinessCard always renders above the article on all breakpoints
- **`PersonalInfo` → `BusinessCard`**: static client component; all social links inside the gradient card; PDF dialog trigger (`<Download /> resume`) added
- **PDF download dialog**: shadcn/ui Dialog; `?resume=open` searchParam controls initial open state; closing removes the param via `router.replace` without adding a history entry; three conditional download links (Traditional Chinese, English, Japanese); wrapped in `<Suspense>`
- **Component rename**: `ResumeDialogWithParams` → `ResumeDialogTrigger`; `ResumeDialogWithParamsInner` → `ResumeDialogTriggerInner`
- **Article styling**: remove border and horizontal padding on mobile; article content spans full width on narrow viewports
- ~~**Collapsed sticky header**~~: implemented and removed after irresolvable scroll anchoring feedback loop; see design.md pitfall record

## Capabilities

### New Capabilities

- `resume-pdf-download`: Resume PDFs stored in a global Sanity `siteSettings` singleton; downloadable via a dialog with per-language links (Traditional Chinese, English, Japanese); shareable via `?resume=open` URL

### Modified Capabilities

- `about-page`: Layout changes from two-column sticky aside to single-column stack; PersonalInfo replaced by a static BusinessCard client component

## Impact

- Affected specs: `resume-pdf-download` (new), `about-page` (modified)
- Affected code:
  - New: `schemas/site-settings.ts`, `src/components/about/business-card.tsx`, `src/components/about/resume-dialog.tsx`, `src/components/about/resume-dialog-trigger.tsx`
  - Modified: `schemas/index.ts`, `schemas/about.ts`, `src/lib/sanity/queries.ts`, `src/app/(site)/[lang]/about/[[...slug]]/page.tsx`
  - Removed: `src/components/about/resume-dialog-with-params.tsx`, `src/components/about/personal-info.tsx`
