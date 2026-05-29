# dependency-policy Specification

## Purpose

TBD - created by archiving change 'dependency-updates'. Update Purpose after archive.

## Requirements

### Requirement: Active dependencies are kept within one minor version of latest

Direct dependencies in `website` that are actively maintained and not flagged for replacement SHALL be updated to their latest compatible version at least once per quarter. Packages pending replacement (e.g., by a planned migration) are exempt until the replacement is complete.

#### Scenario: Routine dependency update

- **WHEN** a dependency update change is executed
- **THEN** all in-scope packages are upgraded to the latest version compatible with the project's Node.js and framework versions
- **THEN** the full verification suite (build, type-check, lint, test) passes with no regressions

<!-- @trace
source: dependency-updates
updated: 2026-05-29
code:
  - src/components/layout/shared/client.tsx
  - content/projects/zh-TW/volleybro.mdx
  - content/about/ja/index.mdx
  - postcss.config.ts
  - public/images/preview.png
  - src/app/[lang]/about/[[...slug]]/not-found.tsx
  - src/components/article/card.tsx
  - src/components/home/hero/terminal-animation.tsx
  - src/components/ui/toc-clerk.tsx
  - package.json
  - content/notes/ja/index.mdx
  - src/lib/locale-from-headers.ts
  - src/proxy.ts
  - src/components/projects/index.tsx
  - src/components/home/background-animation.css
  - src/types/article.ts
  - schemas/about.ts
  - src/app/sitemap.ts
  - src/hooks/use-is-in-view.tsx
  - src/components/layout/home/index.tsx
  - schemas/block/card.ts
  - src/lib/sanity/image.ts
  - content/projects/zh-TW/meta.json
  - content/about/zh-TW/index.mdx
  - src/app/[lang]/about/[[...slug]]/page.tsx
  - content/notes/en/index.mdx
  - src/components/layout/home/menu.tsx
  - public/images/projects/og-backgrounds/common/tech-background.jpg
  - src/components/icons/linkedin-icon.tsx
  - public/images/test.png
  - public/images/projects/README.md
  - src/components/home/background-animation.tsx
  - postcss.config.mjs
  - src/lib/data/locales.ts
  - src/components/layout/home/background-animation.tsx
  - src/app/[lang]/projects/[slug]/opengraph-image.tsx
  - src/app/globals.css
  - public/images/projects/zh-TW/portfolio-website.jpg
  - src/components/mdx/mermaid.tsx
  - src/lib/data/notes.ts
  - src/components/home/hero/cta-buttons.tsx
  - jest.config.ts
  - src/app/[lang]/projects/layout.tsx
  - src/components/provider.tsx
  - src/app/api/search/route.ts
  - src/components/ui/button.tsx
  - content/projects/en/meta.json
  - src/app/[lang]/notes/layout.tsx
  - src/app/studio/layout.tsx
  - src/app/[lang]/projects/[slug]/not-found.tsx
  - src/components/article/index.tsx
  - src/components/layout/home/navbar.tsx
  - content/projects/zh-TW/music-hits.mdx
  - src/app/[lang]/projects/[slug]/page.tsx
  - src/components/layout/shared/index.tsx
  - src/app/api/revalidate/route.ts
  - src/components/about/personal-info.tsx
  - src/components/home/hero/index.tsx
  - src/components/layout/docs/client.tsx
  - src/components/mdx/portable-text.tsx
  - sanity.config.ts
  - src/lib/is-active.ts
  - src/lib/layout.shared.tsx
  - src/lib/tag-utils.ts
  - src/lib/sanity/queries.ts
  - src/lib/sanity/client.ts
  - src/app/[lang]/notes/[slug]/opengraph-image.tsx
  - src/components/article/info.tsx
  - content/projects/ja/meta.json
  - src/components/sidebar.tsx
  - src/components/layout/docs/index.tsx
  - src/lib/merge-refs.ts
  - pnpm-workspace.yaml
  - src/components/layout/home/background-animation.css
  - src/lib/i18n.ts
  - src/components/ui/navigation-menu.tsx
  - src/components/lang-setter.tsx
  - schemas/note.ts
  - src/components/language-toggle.tsx
  - src/components/search-toggle.tsx
  - LICENSE
  - next.config.ts
  - content/notes/zh-TW/index.mdx
  - src/app/[lang]/(home)/layout.tsx
  - src/app/[lang]/about/layout.tsx
  - src/components/icons/cake-icon.tsx
  - src/components/ui/popover.tsx
  - src/components/ui/empty.tsx
  - src/components/ui/toc-thumb.tsx
  - src/app/layout.tsx
  - schemas/project.ts
  - src/app/[lang]/notes/page.tsx
  - src/components/ui/toc.tsx
  - src/components/home/index.tsx
  - src/lib/data/projects.ts
  - eslint.config.ts
  - src/components/article/image.tsx
  - schemas/tag.ts
  - src/app/[lang]/notes/[slug]/page.tsx
  - src/app/studio/[[...tool]]/page.tsx
  - README.md
  - content/projects/zh-TW/portfolio-website.mdx
  - sanity.cli.ts
  - schemas/index.ts
  - src/components/ui/badge.tsx
  - tsconfig.json
  - public/images/projects/zh-TW/volleybro.jpg
  - public/images/projects/zh-TW/music-hits.jpg
  - src/app/[lang]/notes/[slug]/not-found.tsx
  - next.config.mjs
  - src/components/layout/docs/page.tsx
  - src/components/github-info.tsx
  - src/app/[lang]/layout.tsx
  - src/components/ui/collapsible.tsx
  - src/components/ui/scroll-area.tsx
  - source.config.ts
  - src/components/theme-toggle.tsx
  - src/hooks/use-view-transition.ts
  - src/lib/source.ts
  - .husky/pre-push
  - src/components/icons/github-icon.tsx
  - src/lib/mdx-components.tsx
  - content/about/en/index.mdx
  - src/components/root-toggle.tsx
  - tests/__mocks__/fumadocs-mdx-config.ts
tests:
  - src/app/[lang]/about/[[...slug]]/__tests__/page.test.tsx
  - src/components/article/__tests__/index.test.tsx
  - src/components/home/hero/__tests__/terminal-animation.test.tsx
  - src/types/__tests__/article-schema.test.ts
  - src/app/[lang]/notes/[slug]/__tests__/not-found.test.tsx
  - src/components/article/__tests__/card.test.tsx
  - src/app/[lang]/projects/[slug]/__tests__/not-found.test.tsx
  - src/components/article/__tests__/image.test.tsx
  - src/lib/sanity/__tests__/queries.test.ts
  - src/app/[lang]/about/[[...slug]]/__tests__/not-found.test.tsx
  - src/components/home/hero/__tests__/index.test.tsx
  - src/components/article/__tests__/info.test.tsx
  - src/lib/data/__tests__/notes.test.ts
  - src/components/home/hero/__tests__/cta-buttons.test.tsx
  - src/types/__tests__/project-schema.test.ts
  - src/app/__tests__/layout.test.tsx
  - src/lib/data/__tests__/locales.test.ts
  - src/lib/data/__tests__/projects.test.ts
  - src/components/about/__tests__/skill-tags.test.tsx
  - src/lib/__tests__/locale-from-headers.test.ts
-->

---

### Requirement: Breaking-change upgrades are verified before merging

Any dependency upgrade that crosses a major version boundary SHALL be individually verified by running the full verification suite and, where the package affects UI output, a manual visual spot-check of affected pages.

#### Scenario: Major version package upgrade

- **WHEN** a dependency is upgraded across a major version boundary
- **THEN** `pnpm build` exits 0 with no module resolution errors
- **THEN** `pnpm type-check` exits 0 with no new type errors
- **THEN** `pnpm lint` exits 0 with no new warnings
- **THEN** `pnpm test` exits 0 with all tests passing

#### Scenario: Icon library major upgrade

- **WHEN** `lucide-react` is upgraded across a major version boundary
- **THEN** every icon imported in the codebase resolves without error at build time
- **THEN** icons render visually on pages that use them (manual spot-check)

<!-- @trace
source: dependency-updates
updated: 2026-05-29
code:
  - src/components/layout/shared/client.tsx
  - content/projects/zh-TW/volleybro.mdx
  - content/about/ja/index.mdx
  - postcss.config.ts
  - public/images/preview.png
  - src/app/[lang]/about/[[...slug]]/not-found.tsx
  - src/components/article/card.tsx
  - src/components/home/hero/terminal-animation.tsx
  - src/components/ui/toc-clerk.tsx
  - package.json
  - content/notes/ja/index.mdx
  - src/lib/locale-from-headers.ts
  - src/proxy.ts
  - src/components/projects/index.tsx
  - src/components/home/background-animation.css
  - src/types/article.ts
  - schemas/about.ts
  - src/app/sitemap.ts
  - src/hooks/use-is-in-view.tsx
  - src/components/layout/home/index.tsx
  - schemas/block/card.ts
  - src/lib/sanity/image.ts
  - content/projects/zh-TW/meta.json
  - content/about/zh-TW/index.mdx
  - src/app/[lang]/about/[[...slug]]/page.tsx
  - content/notes/en/index.mdx
  - src/components/layout/home/menu.tsx
  - public/images/projects/og-backgrounds/common/tech-background.jpg
  - src/components/icons/linkedin-icon.tsx
  - public/images/test.png
  - public/images/projects/README.md
  - src/components/home/background-animation.tsx
  - postcss.config.mjs
  - src/lib/data/locales.ts
  - src/components/layout/home/background-animation.tsx
  - src/app/[lang]/projects/[slug]/opengraph-image.tsx
  - src/app/globals.css
  - public/images/projects/zh-TW/portfolio-website.jpg
  - src/components/mdx/mermaid.tsx
  - src/lib/data/notes.ts
  - src/components/home/hero/cta-buttons.tsx
  - jest.config.ts
  - src/app/[lang]/projects/layout.tsx
  - src/components/provider.tsx
  - src/app/api/search/route.ts
  - src/components/ui/button.tsx
  - content/projects/en/meta.json
  - src/app/[lang]/notes/layout.tsx
  - src/app/studio/layout.tsx
  - src/app/[lang]/projects/[slug]/not-found.tsx
  - src/components/article/index.tsx
  - src/components/layout/home/navbar.tsx
  - content/projects/zh-TW/music-hits.mdx
  - src/app/[lang]/projects/[slug]/page.tsx
  - src/components/layout/shared/index.tsx
  - src/app/api/revalidate/route.ts
  - src/components/about/personal-info.tsx
  - src/components/home/hero/index.tsx
  - src/components/layout/docs/client.tsx
  - src/components/mdx/portable-text.tsx
  - sanity.config.ts
  - src/lib/is-active.ts
  - src/lib/layout.shared.tsx
  - src/lib/tag-utils.ts
  - src/lib/sanity/queries.ts
  - src/lib/sanity/client.ts
  - src/app/[lang]/notes/[slug]/opengraph-image.tsx
  - src/components/article/info.tsx
  - content/projects/ja/meta.json
  - src/components/sidebar.tsx
  - src/components/layout/docs/index.tsx
  - src/lib/merge-refs.ts
  - pnpm-workspace.yaml
  - src/components/layout/home/background-animation.css
  - src/lib/i18n.ts
  - src/components/ui/navigation-menu.tsx
  - src/components/lang-setter.tsx
  - schemas/note.ts
  - src/components/language-toggle.tsx
  - src/components/search-toggle.tsx
  - LICENSE
  - next.config.ts
  - content/notes/zh-TW/index.mdx
  - src/app/[lang]/(home)/layout.tsx
  - src/app/[lang]/about/layout.tsx
  - src/components/icons/cake-icon.tsx
  - src/components/ui/popover.tsx
  - src/components/ui/empty.tsx
  - src/components/ui/toc-thumb.tsx
  - src/app/layout.tsx
  - schemas/project.ts
  - src/app/[lang]/notes/page.tsx
  - src/components/ui/toc.tsx
  - src/components/home/index.tsx
  - src/lib/data/projects.ts
  - eslint.config.ts
  - src/components/article/image.tsx
  - schemas/tag.ts
  - src/app/[lang]/notes/[slug]/page.tsx
  - src/app/studio/[[...tool]]/page.tsx
  - README.md
  - content/projects/zh-TW/portfolio-website.mdx
  - sanity.cli.ts
  - schemas/index.ts
  - src/components/ui/badge.tsx
  - tsconfig.json
  - public/images/projects/zh-TW/volleybro.jpg
  - public/images/projects/zh-TW/music-hits.jpg
  - src/app/[lang]/notes/[slug]/not-found.tsx
  - next.config.mjs
  - src/components/layout/docs/page.tsx
  - src/components/github-info.tsx
  - src/app/[lang]/layout.tsx
  - src/components/ui/collapsible.tsx
  - src/components/ui/scroll-area.tsx
  - source.config.ts
  - src/components/theme-toggle.tsx
  - src/hooks/use-view-transition.ts
  - src/lib/source.ts
  - .husky/pre-push
  - src/components/icons/github-icon.tsx
  - src/lib/mdx-components.tsx
  - content/about/en/index.mdx
  - src/components/root-toggle.tsx
  - tests/__mocks__/fumadocs-mdx-config.ts
tests:
  - src/app/[lang]/about/[[...slug]]/__tests__/page.test.tsx
  - src/components/article/__tests__/index.test.tsx
  - src/components/home/hero/__tests__/terminal-animation.test.tsx
  - src/types/__tests__/article-schema.test.ts
  - src/app/[lang]/notes/[slug]/__tests__/not-found.test.tsx
  - src/components/article/__tests__/card.test.tsx
  - src/app/[lang]/projects/[slug]/__tests__/not-found.test.tsx
  - src/components/article/__tests__/image.test.tsx
  - src/lib/sanity/__tests__/queries.test.ts
  - src/app/[lang]/about/[[...slug]]/__tests__/not-found.test.tsx
  - src/components/home/hero/__tests__/index.test.tsx
  - src/components/article/__tests__/info.test.tsx
  - src/lib/data/__tests__/notes.test.ts
  - src/components/home/hero/__tests__/cta-buttons.test.tsx
  - src/types/__tests__/project-schema.test.ts
  - src/app/__tests__/layout.test.tsx
  - src/lib/data/__tests__/locales.test.ts
  - src/lib/data/__tests__/projects.test.ts
  - src/components/about/__tests__/skill-tags.test.tsx
  - src/lib/__tests__/locale-from-headers.test.ts
-->

---

### Requirement: Deferred packages are explicitly documented

Packages that are intentionally not upgraded SHALL have their deferral reason recorded. Valid deferral reasons are: pending replacement by a migration, no stable release available, or requires a dedicated breaking-change change.

#### Scenario: Deferred package at update time

- **WHEN** a dependency update change is executed
- **THEN** each deferred package is listed with its deferral reason in the change proposal
- **THEN** no deferred package is silently left behind without documentation

##### Example: Deferral reasons by category

| Package        | Deferral reason                                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `eslint` (→10) | Blocked by `eslint-config-next` transitive dep `typescript-eslint@8.46.2` (peer dep `eslint@^8\|\|^9`); tracked in vercel/next.js#89764 |

<!-- @trace
source: dependency-updates
updated: 2026-05-29
code:
  - src/components/layout/shared/client.tsx
  - content/projects/zh-TW/volleybro.mdx
  - content/about/ja/index.mdx
  - postcss.config.ts
  - public/images/preview.png
  - src/app/[lang]/about/[[...slug]]/not-found.tsx
  - src/components/article/card.tsx
  - src/components/home/hero/terminal-animation.tsx
  - src/components/ui/toc-clerk.tsx
  - package.json
  - content/notes/ja/index.mdx
  - src/lib/locale-from-headers.ts
  - src/proxy.ts
  - src/components/projects/index.tsx
  - src/components/home/background-animation.css
  - src/types/article.ts
  - schemas/about.ts
  - src/app/sitemap.ts
  - src/hooks/use-is-in-view.tsx
  - src/components/layout/home/index.tsx
  - schemas/block/card.ts
  - src/lib/sanity/image.ts
  - content/projects/zh-TW/meta.json
  - content/about/zh-TW/index.mdx
  - src/app/[lang]/about/[[...slug]]/page.tsx
  - content/notes/en/index.mdx
  - src/components/layout/home/menu.tsx
  - public/images/projects/og-backgrounds/common/tech-background.jpg
  - src/components/icons/linkedin-icon.tsx
  - public/images/test.png
  - public/images/projects/README.md
  - src/components/home/background-animation.tsx
  - postcss.config.mjs
  - src/lib/data/locales.ts
  - src/components/layout/home/background-animation.tsx
  - src/app/[lang]/projects/[slug]/opengraph-image.tsx
  - src/app/globals.css
  - public/images/projects/zh-TW/portfolio-website.jpg
  - src/components/mdx/mermaid.tsx
  - src/lib/data/notes.ts
  - src/components/home/hero/cta-buttons.tsx
  - jest.config.ts
  - src/app/[lang]/projects/layout.tsx
  - src/components/provider.tsx
  - src/app/api/search/route.ts
  - src/components/ui/button.tsx
  - content/projects/en/meta.json
  - src/app/[lang]/notes/layout.tsx
  - src/app/studio/layout.tsx
  - src/app/[lang]/projects/[slug]/not-found.tsx
  - src/components/article/index.tsx
  - src/components/layout/home/navbar.tsx
  - content/projects/zh-TW/music-hits.mdx
  - src/app/[lang]/projects/[slug]/page.tsx
  - src/components/layout/shared/index.tsx
  - src/app/api/revalidate/route.ts
  - src/components/about/personal-info.tsx
  - src/components/home/hero/index.tsx
  - src/components/layout/docs/client.tsx
  - src/components/mdx/portable-text.tsx
  - sanity.config.ts
  - src/lib/is-active.ts
  - src/lib/layout.shared.tsx
  - src/lib/tag-utils.ts
  - src/lib/sanity/queries.ts
  - src/lib/sanity/client.ts
  - src/app/[lang]/notes/[slug]/opengraph-image.tsx
  - src/components/article/info.tsx
  - content/projects/ja/meta.json
  - src/components/sidebar.tsx
  - src/components/layout/docs/index.tsx
  - src/lib/merge-refs.ts
  - pnpm-workspace.yaml
  - src/components/layout/home/background-animation.css
  - src/lib/i18n.ts
  - src/components/ui/navigation-menu.tsx
  - src/components/lang-setter.tsx
  - schemas/note.ts
  - src/components/language-toggle.tsx
  - src/components/search-toggle.tsx
  - LICENSE
  - next.config.ts
  - content/notes/zh-TW/index.mdx
  - src/app/[lang]/(home)/layout.tsx
  - src/app/[lang]/about/layout.tsx
  - src/components/icons/cake-icon.tsx
  - src/components/ui/popover.tsx
  - src/components/ui/empty.tsx
  - src/components/ui/toc-thumb.tsx
  - src/app/layout.tsx
  - schemas/project.ts
  - src/app/[lang]/notes/page.tsx
  - src/components/ui/toc.tsx
  - src/components/home/index.tsx
  - src/lib/data/projects.ts
  - eslint.config.ts
  - src/components/article/image.tsx
  - schemas/tag.ts
  - src/app/[lang]/notes/[slug]/page.tsx
  - src/app/studio/[[...tool]]/page.tsx
  - README.md
  - content/projects/zh-TW/portfolio-website.mdx
  - sanity.cli.ts
  - schemas/index.ts
  - src/components/ui/badge.tsx
  - tsconfig.json
  - public/images/projects/zh-TW/volleybro.jpg
  - public/images/projects/zh-TW/music-hits.jpg
  - src/app/[lang]/notes/[slug]/not-found.tsx
  - next.config.mjs
  - src/components/layout/docs/page.tsx
  - src/components/github-info.tsx
  - src/app/[lang]/layout.tsx
  - src/components/ui/collapsible.tsx
  - src/components/ui/scroll-area.tsx
  - source.config.ts
  - src/components/theme-toggle.tsx
  - src/hooks/use-view-transition.ts
  - src/lib/source.ts
  - .husky/pre-push
  - src/components/icons/github-icon.tsx
  - src/lib/mdx-components.tsx
  - content/about/en/index.mdx
  - src/components/root-toggle.tsx
  - tests/__mocks__/fumadocs-mdx-config.ts
tests:
  - src/app/[lang]/about/[[...slug]]/__tests__/page.test.tsx
  - src/components/article/__tests__/index.test.tsx
  - src/components/home/hero/__tests__/terminal-animation.test.tsx
  - src/types/__tests__/article-schema.test.ts
  - src/app/[lang]/notes/[slug]/__tests__/not-found.test.tsx
  - src/components/article/__tests__/card.test.tsx
  - src/app/[lang]/projects/[slug]/__tests__/not-found.test.tsx
  - src/components/article/__tests__/image.test.tsx
  - src/lib/sanity/__tests__/queries.test.ts
  - src/app/[lang]/about/[[...slug]]/__tests__/not-found.test.tsx
  - src/components/home/hero/__tests__/index.test.tsx
  - src/components/article/__tests__/info.test.tsx
  - src/lib/data/__tests__/notes.test.ts
  - src/components/home/hero/__tests__/cta-buttons.test.tsx
  - src/types/__tests__/project-schema.test.ts
  - src/app/__tests__/layout.test.tsx
  - src/lib/data/__tests__/locales.test.ts
  - src/lib/data/__tests__/projects.test.ts
  - src/components/about/__tests__/skill-tags.test.tsx
  - src/lib/__tests__/locale-from-headers.test.ts
-->

---

### Requirement: Ecosystem-coupled packages are upgraded together

Packages that share a release cadence and have cross-package peer dependency constraints SHALL be upgraded in a single operation to prevent version mismatch warnings or plugin incompatibilities.

#### Scenario: Tailwind ecosystem upgrade

- **WHEN** `tailwindcss` is upgraded
- **THEN** `@tailwindcss/postcss` and `prettier-plugin-tailwindcss` are upgraded in the same operation
- **THEN** `pnpm build` completes without PostCSS version mismatch errors

#### Scenario: Next.js and ESLint config upgrade

- **WHEN** `next` is upgraded
- **THEN** `eslint-config-next` is upgraded to the matching version in the same operation

<!-- @trace
source: dependency-updates
updated: 2026-05-29
code:
  - src/components/layout/shared/client.tsx
  - content/projects/zh-TW/volleybro.mdx
  - content/about/ja/index.mdx
  - postcss.config.ts
  - public/images/preview.png
  - src/app/[lang]/about/[[...slug]]/not-found.tsx
  - src/components/article/card.tsx
  - src/components/home/hero/terminal-animation.tsx
  - src/components/ui/toc-clerk.tsx
  - package.json
  - content/notes/ja/index.mdx
  - src/lib/locale-from-headers.ts
  - src/proxy.ts
  - src/components/projects/index.tsx
  - src/components/home/background-animation.css
  - src/types/article.ts
  - schemas/about.ts
  - src/app/sitemap.ts
  - src/hooks/use-is-in-view.tsx
  - src/components/layout/home/index.tsx
  - schemas/block/card.ts
  - src/lib/sanity/image.ts
  - content/projects/zh-TW/meta.json
  - content/about/zh-TW/index.mdx
  - src/app/[lang]/about/[[...slug]]/page.tsx
  - content/notes/en/index.mdx
  - src/components/layout/home/menu.tsx
  - public/images/projects/og-backgrounds/common/tech-background.jpg
  - src/components/icons/linkedin-icon.tsx
  - public/images/test.png
  - public/images/projects/README.md
  - src/components/home/background-animation.tsx
  - postcss.config.mjs
  - src/lib/data/locales.ts
  - src/components/layout/home/background-animation.tsx
  - src/app/[lang]/projects/[slug]/opengraph-image.tsx
  - src/app/globals.css
  - public/images/projects/zh-TW/portfolio-website.jpg
  - src/components/mdx/mermaid.tsx
  - src/lib/data/notes.ts
  - src/components/home/hero/cta-buttons.tsx
  - jest.config.ts
  - src/app/[lang]/projects/layout.tsx
  - src/components/provider.tsx
  - src/app/api/search/route.ts
  - src/components/ui/button.tsx
  - content/projects/en/meta.json
  - src/app/[lang]/notes/layout.tsx
  - src/app/studio/layout.tsx
  - src/app/[lang]/projects/[slug]/not-found.tsx
  - src/components/article/index.tsx
  - src/components/layout/home/navbar.tsx
  - content/projects/zh-TW/music-hits.mdx
  - src/app/[lang]/projects/[slug]/page.tsx
  - src/components/layout/shared/index.tsx
  - src/app/api/revalidate/route.ts
  - src/components/about/personal-info.tsx
  - src/components/home/hero/index.tsx
  - src/components/layout/docs/client.tsx
  - src/components/mdx/portable-text.tsx
  - sanity.config.ts
  - src/lib/is-active.ts
  - src/lib/layout.shared.tsx
  - src/lib/tag-utils.ts
  - src/lib/sanity/queries.ts
  - src/lib/sanity/client.ts
  - src/app/[lang]/notes/[slug]/opengraph-image.tsx
  - src/components/article/info.tsx
  - content/projects/ja/meta.json
  - src/components/sidebar.tsx
  - src/components/layout/docs/index.tsx
  - src/lib/merge-refs.ts
  - pnpm-workspace.yaml
  - src/components/layout/home/background-animation.css
  - src/lib/i18n.ts
  - src/components/ui/navigation-menu.tsx
  - src/components/lang-setter.tsx
  - schemas/note.ts
  - src/components/language-toggle.tsx
  - src/components/search-toggle.tsx
  - LICENSE
  - next.config.ts
  - content/notes/zh-TW/index.mdx
  - src/app/[lang]/(home)/layout.tsx
  - src/app/[lang]/about/layout.tsx
  - src/components/icons/cake-icon.tsx
  - src/components/ui/popover.tsx
  - src/components/ui/empty.tsx
  - src/components/ui/toc-thumb.tsx
  - src/app/layout.tsx
  - schemas/project.ts
  - src/app/[lang]/notes/page.tsx
  - src/components/ui/toc.tsx
  - src/components/home/index.tsx
  - src/lib/data/projects.ts
  - eslint.config.ts
  - src/components/article/image.tsx
  - schemas/tag.ts
  - src/app/[lang]/notes/[slug]/page.tsx
  - src/app/studio/[[...tool]]/page.tsx
  - README.md
  - content/projects/zh-TW/portfolio-website.mdx
  - sanity.cli.ts
  - schemas/index.ts
  - src/components/ui/badge.tsx
  - tsconfig.json
  - public/images/projects/zh-TW/volleybro.jpg
  - public/images/projects/zh-TW/music-hits.jpg
  - src/app/[lang]/notes/[slug]/not-found.tsx
  - next.config.mjs
  - src/components/layout/docs/page.tsx
  - src/components/github-info.tsx
  - src/app/[lang]/layout.tsx
  - src/components/ui/collapsible.tsx
  - src/components/ui/scroll-area.tsx
  - source.config.ts
  - src/components/theme-toggle.tsx
  - src/hooks/use-view-transition.ts
  - src/lib/source.ts
  - .husky/pre-push
  - src/components/icons/github-icon.tsx
  - src/lib/mdx-components.tsx
  - content/about/en/index.mdx
  - src/components/root-toggle.tsx
  - tests/__mocks__/fumadocs-mdx-config.ts
tests:
  - src/app/[lang]/about/[[...slug]]/__tests__/page.test.tsx
  - src/components/article/__tests__/index.test.tsx
  - src/components/home/hero/__tests__/terminal-animation.test.tsx
  - src/types/__tests__/article-schema.test.ts
  - src/app/[lang]/notes/[slug]/__tests__/not-found.test.tsx
  - src/components/article/__tests__/card.test.tsx
  - src/app/[lang]/projects/[slug]/__tests__/not-found.test.tsx
  - src/components/article/__tests__/image.test.tsx
  - src/lib/sanity/__tests__/queries.test.ts
  - src/app/[lang]/about/[[...slug]]/__tests__/not-found.test.tsx
  - src/components/home/hero/__tests__/index.test.tsx
  - src/components/article/__tests__/info.test.tsx
  - src/lib/data/__tests__/notes.test.ts
  - src/components/home/hero/__tests__/cta-buttons.test.tsx
  - src/types/__tests__/project-schema.test.ts
  - src/app/__tests__/layout.test.tsx
  - src/lib/data/__tests__/locales.test.ts
  - src/lib/data/__tests__/projects.test.ts
  - src/components/about/__tests__/skill-tags.test.tsx
  - src/lib/__tests__/locale-from-headers.test.ts
-->
