## 1. Tier 1: Safe minor/patch updates

- [ ] 1.1 [P] Upgrade the 16 safe minor/patch packages in `package.json` to their latest versions: `@eslint/eslintrc` ^3.3.5, `@playwright/test` ^1.60.0, `@testing-library/react` ^16.3.2, `@types/node` 25.9.0, `@types/react` ^19.2.14, `jest` ^30.4.2, `jest-environment-jsdom` ^30.4.1, `motion` ^12.39.0, `postcss` ^8.5.14, `prettier` ^3.8.3, `react` ^19.2.6, `react-dom` ^19.2.6, `tailwind-merge` ^3.6.0, `zod` ^4.4.3, `mermaid` is explicitly excluded. Verified by reading `package.json` and confirming all 16 entries show the new version ranges (satisfies spec: active dependencies are kept within one minor version of latest).

- [ ] 1.2 Run `pnpm install` (or `npm install`) after Tier 1 bumps to update the lockfile. Verified when install exits 0.

- [ ] 1.3 Run the full verification suite after Tier 1: `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`. Verified when all four commands exit 0 with no new errors or warnings (satisfies spec: breaking-change upgrades are verified before merging — baseline gate).

## 2. Tier 2: Ecosystem-coupled upgrades

- [ ] 2.1 [P] Upgrade `next` to ^16.2.6 and `eslint-config-next` to 16.2.6 together in `package.json`, keeping both versions in sync (update strategy: grouped by risk tier; Next.js and ESLint config upgrade). Verified by reading `package.json` and confirming both entries show 16.2.6.

- [ ] 2.2 [P] Upgrade the Tailwind ecosystem together in `package.json`: `tailwindcss` ^4.3.0, `@tailwindcss/postcss` ^4.3.0, `prettier-plugin-tailwindcss` ^0.8.0 (Tailwind ecosystem: upgrade as a unit). Verified by reading `package.json` and confirming all three entries show the new version ranges.

- [ ] 2.3 Run `pnpm install` after Tier 2 bumps. Verified when install exits 0 with no PostCSS version mismatch warnings.

- [ ] 2.4 Run the full verification suite after Tier 2: `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`. Verified when all four commands exit 0 (satisfies spec: ecosystem-coupled packages are upgraded together).

## 3. Tier 3: Breaking-change upgrades

- [ ] 3.1 Upgrade `lucide-react` to ^1.16.0 in `package.json` (lucide-react 0→1: upgrade with visual spot-check). Verified by reading `package.json` and confirming the entry shows ^1.16.0 (satisfies spec: breaking-change upgrades are verified before merging).

- [ ] 3.2 Run `pnpm install` after lucide-react upgrade. Verified when install exits 0.

- [ ] 3.3 Run `pnpm build` and confirm it exits 0 with no `Cannot find module` or named-export errors for any of the 11 imported lucide icons (`Check`, `ChevronsUpDown`, `Github`, `Star`, `Languages`, `ChevronDown`, `Sidebar`, `Search`, `Linkedin`, `ExternalLink`, `ArrowLeft`, `Tag`, `Airplay`, `Moon`, `Sun`). Verified by build exit code and absence of icon-related errors.

- [ ] 3.4 Visually spot-check at least one page per icon-bearing component (theme toggle, search toggle, sidebar, article header, about section) to confirm icons render correctly. Verified by manual inspection in the browser (satisfies spec: icon library major upgrade).

- [ ] 3.5 Upgrade `lint-staged` to ^17.0.5 in `package.json` (lint-staged 16→17: upgrade, re-run pre-commit). Verified by reading `package.json` and confirming the entry shows ^17.0.5.

- [ ] 3.6 Run `pnpm install` after lint-staged upgrade. Verified when install exits 0.

- [ ] 3.7 Stage a file change and run `git commit --dry-run` to confirm lint-staged 17 parses the existing config correctly and invokes eslint and prettier without errors. Verified when the dry-run completes without config parse errors or lint-staged lifecycle errors (satisfies spec: breaking-change upgrades are verified before merging).

## 4. Final verification and documentation

- [ ] 4.1 Run the complete verification suite one final time: `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`. Verified when all four commands exit 0 and no application source files have been modified (only `package.json` and lockfile changed) (satisfies spec: active dependencies are kept within one minor version of latest).

- [ ] 4.2 Confirm deferred packages are absent from this change: `eslint` (→10), `fumadocs-*`, `@orama/*`, `mermaid`, `typescript` (→6.x) SHALL NOT appear with updated versions in `package.json`. Verified by reading `package.json` and confirming their version ranges are unchanged (satisfies spec: deferred packages are explicitly documented).
