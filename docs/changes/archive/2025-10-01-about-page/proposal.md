## Why

The portfolio site needed a dedicated About page to present professional background — education, certifications, and skills — to technical recruiters and hiring managers evaluating the candidate for full-stack roles.

## What Changes

- New route `/[lang]/about` serving MDX-based content in zh-TW, en, and ja
- New `about` collection defined in `source.config.ts` via `defineDocs`
- New `aboutSource` loader in `src/lib/source.ts`
- Primary navigation updated to include the About link at the same hierarchy level as Home

## Capabilities

### New Capabilities

- `page-access`: About page accessible at `/[lang]/about` for all three supported locales
- `content-sections`: Structured display of Introduction, Skills, Education, and Certifications
- `multilingual-content`: Fully translated content in zh-TW, en, ja with locale-aware date formatting
- `responsive-layout`: Mobile-first layout with ≥ 14 px body font and no horizontal scroll at 320 px+

## Impact

- Affected specs: `docs/specs/about-page/spec.md`
- Affected code:
  - New: `content/about/zh-TW/index.mdx`, `content/about/en/index.mdx`, `content/about/ja/index.mdx`
  - New: `src/app/[lang]/about/layout.tsx`, `src/app/[lang]/about/[[...slug]]/page.tsx`
  - New: `tests/e2e/about-page.spec.ts`
  - Modified: `source.config.ts`, `src/lib/source.ts`, `src/lib/layout.shared.tsx`
