# Tasks: MDX Frontmatter Unification

All tasks complete. Full task history: `specs/004-mdx-frontmatter-1/tasks.md`.

## Phase 1: Setup

- [x] **T001** [P] Extract `baseArticleSchema` in `source.config.ts`; update `projectSchema` and `noteSchema`
- [x] **T002** [P] Update `src/types/article.ts` to derive types via `z.infer<>` (`BaseArticle`, `ProjectArticle`, `NoteArticle`)

## Phase 2: Tests (TDD)

- [x] **T003** Unit tests — `baseArticleSchema` validates shared fields; `projectSchema` validates GitHub/Demo links; `noteSchema` rejects project-only fields
- [x] **T004** Component tests — `ArticleInfo` renders date, language toggle, tags; Project variant renders GitHub/Demo links; Note variant omits them
- [x] **T005** E2E — tag filter on Notes/Projects list page via Orama

## Phase 3: Core

- [x] **T006** Mark `imageType` required in all article component prop types
- [x] **T007** Add `tags` field to `baseArticleSchema`; integrate Fumadocs Orama tag index in `src/lib/search.ts`
- [x] **T008** `src/components/article/ArticleInfo.tsx` — sidebar with date, `LanguageToggle`, tag badges, optional project links
- [x] **T009** Update Article detail page wrapper to `lg:grid-cols-[1fr_240px]` layout

## Phase 4: Navbar

- [x] **T010** Extract `src/components/layouts/navbar.tsx` from `src/components/layouts/home/index.tsx`
- [x] **T011** Add `hideLanguageToggle?: boolean` prop to Navbar
- [x] **T012** Update Notes and Projects layouts to pass `hideLanguageToggle`

## Phase 5: Integration

- [x] **T013** Update MDX content files to add `tags` frontmatter where appropriate
- [x] **T014** Build verification — no type errors, Orama search index generated correctly

## Phase 6: Validation

- [x] **T015** All E2E and unit tests pass
- [x] **T016** Article Info sidebar renders correctly at 1280 px and 375 px
