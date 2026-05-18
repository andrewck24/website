# Tasks: About Page

All tasks complete. Full task history: `specs/001-about-page/tasks.md`.

## Phase 1: Setup

- [x] **T001** Add `about` collection to `source.config.ts`
- [x] **T002** Add `aboutSource` loader to `src/lib/source.ts`
- [x] **T003** Create `content/about/{zh-TW,en,ja}/` directories

## Phase 2: Tests (TDD)

- [x] **T004** E2E — basic page access and section rendering (`tests/e2e/about-page.spec.ts`)
- [x] **T005** E2E — multi-language content verification
- [x] **T006** E2E — responsive design (375 px, 768 px, 1920 px)

## Phase 3: Content

- [x] **T007** [P] `content/about/zh-TW/index.mdx` — Introduction, Skills, Education, Certifications
- [x] **T008** [P] `content/about/en/index.mdx`
- [x] **T009** [P] `content/about/ja/index.mdx`

## Phase 4: Routes

- [x] **T010** `src/app/[lang]/about/layout.tsx` using `DocsLayout` + `aboutSource`
- [x] **T011** `src/app/[lang]/about/[[...slug]]/page.tsx` — page component with `data-testid="about-page"`
- [x] **T012** Add `generateStaticParams` and `generateMetadata` to page

## Phase 5: Navigation

- [x] **T013** Add locale-aware About link to `src/lib/layout.shared.tsx`

## Phase 6: Validation

- [x] **T014** All E2E tests pass
