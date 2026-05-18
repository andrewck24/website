# Tasks: Article Components

All tasks complete. Full task history: `specs/003-article-components/tasks.md`.

## Phase 1: Type System

- [x] **T001** [P] Define `ArticleMetadata` base interface in `src/types/article.ts`
- [x] **T002** [P] Define `OGImageConfig` interface and Zod schema in `src/types/article.ts`
- [x] **T003** [P] Define `ImageType` union type

## Phase 2: Tests (TDD)

- [x] **T004** Unit tests — hero visual background resolution logic
- [x] **T005** Component tests — `ArticleCard` Hero and Compact variants
- [x] **T006** Component tests — `ArticleHero` static and generated modes, fallback
- [x] **T007** E2E — Notes featured section, list page, detail page
- [x] **T008** E2E — View Transitions on Notes article card click

## Phase 3: Components

- [x] **T009** `src/components/article/ArticleHero.tsx` — static image and dynamic generation modes
- [x] **T010** `src/components/article/ArticleCard.tsx` — Hero and Compact variants
- [x] **T011** `src/components/article/ArticleDetail.tsx` — detail page shell
- [x] **T012** Update Open Graph image generation to use `ArticleMetadata` and background resolution logic

## Phase 4: Routes

- [x] **T013** `src/app/[lang]/notes/page.tsx` — Notes list page
- [x] **T014** `src/app/[lang]/notes/[slug]/page.tsx` — Notes detail page

## Phase 5: Refactor

- [x] **T015** Migrate Projects components to use unified article components
- [x] **T016** Remove deprecated `generated-hero.tsx`, `featured-project-card.tsx`, `project-detail.tsx`, `project-detail-image.tsx`
- [x] **T017** Update homepage featured section to accept both Projects and Notes articles

## Phase 6: Validation

- [x] **T018** All E2E and component tests pass
- [x] **T019** Build passes with no type errors
