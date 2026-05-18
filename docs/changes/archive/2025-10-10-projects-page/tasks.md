# Tasks: Projects Page

All tasks complete. Full task history: `specs/002-projects-page/tasks.md`.

## Phase 1: Setup

- [x] **T001** Enable `experimental.viewTransition` in `next.config.ts`
- [x] **T002** Add `projects` collection to `source.config.ts`
- [x] **T003** Add `projectSource` loader to `src/lib/source.ts`
- [x] **T004** Define `Project` and `FeaturedProject` types in `src/types/project.ts`

## Phase 2: Tests (TDD)

- [x] **T005** E2E — homepage displays 3–5 featured project cards
- [x] **T006** E2E — card click with View Transitions (image animates to detail hero)
- [x] **T007** E2E — detail page four-section narrative structure
- [x] **T008** Component tests — `FeaturedProjectCard` Hero and Compact variants
- [x] **T009** Unit tests — `getFeaturedProjects` ordering

## Phase 3: Core

- [x] **T010** `src/components/projects/FeaturedProjectCard.tsx` — Hero and Compact variants
- [x] **T011** `src/components/projects/ProjectDetail.tsx` — detail page shell
- [x] **T012** `src/lib/projects.ts` — `getFeaturedProjects`, `getProject` data functions

## Phase 4: Routes

- [x] **T013** `src/app/[lang]/projects/page.tsx` — list page
- [x] **T014** `src/app/[lang]/projects/[slug]/page.tsx` — detail page with `generateStaticParams`

## Phase 5: Homepage Integration

- [x] **T015** Add featured projects section to `src/app/[lang]/(home)/page.tsx`
- [x] **T016** Add Projects link to `src/lib/layout.shared.tsx`

## Phase 6: Content

- [x] **T017** [P] Create initial MDX content files in `content/projects/`

## Phase 7: Polish

- [x] **T018** Responsive layout verified (mobile single-column, first card hero style)
- [x] **T019** View Transitions fallback verified on unsupported browsers
- [x] **T020** All E2E and component tests pass
