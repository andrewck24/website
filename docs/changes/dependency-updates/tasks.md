<!-- update strategy: grouped by risk tier — Tiers 0-6 isolate failures; see design.md -->

## 0. Pre-flight: Remove unused dependencies

- [x] 0.1 Remove `zod` from `dependencies` in `package.json` (confirmed zero imports in `src/` via grep — no file under `src/` imports from `"zod"`). Verified by reading `package.json` and confirming `zod` is absent from the dependencies section.

- [x] 0.2 Remove `@swc/jest` from `devDependencies` in `package.json` (Next.js uses its own bundled SWC transformer at `node_modules/next/dist/build/jest/../swc/jest-transformer`; `@swc/jest` is not referenced in `jest.config.ts` or any test file). Verified by reading `package.json` and confirming `@swc/jest` is absent.

- [x] 0.3 Run `pnpm install` after the two removals. Verified when install exits 0.

- [x] 0.4 Run `pnpm test` to confirm the test suite still passes without the external `@swc/jest` package. Verified when all tests exit 0 with no transformer errors.

## 1. Tier 1: Safe minor/patch updates

- [x] 1.1 [P] Upgrade the 12 safe minor/patch packages in `package.json` to their latest versions: `@playwright/test` ^1.60.0, `@testing-library/react` ^16.3.2, `@types/node` 25.9.0, `@types/react` ^19.2.14, `jest` ^30.4.2, `jest-environment-jsdom` ^30.4.1, `motion` ^12.39.0, `postcss` ^8.5.14, `prettier` ^3.8.3, `react` ^19.2.6, `react-dom` ^19.2.6, `tailwind-merge` ^3.6.0. Note: `@vercel/analytics` 2.0.1 and `package.json` name `website` are already applied. Verified by reading `package.json` and confirming all 12 entries show the new version ranges (satisfies spec: active dependencies are kept within one minor version of latest).

- [x] 1.2 Run `pnpm install` after Tier 1 bumps to update the lockfile. Verified when install exits 0.

- [x] 1.3 Run the full verification suite after Tier 1: `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`. Verified when all four commands exit 0 with no new errors or warnings (baseline gate before breaking-change tiers).

## 2. Tier 2: Ecosystem-coupled upgrades

- [x] 2.1 [P] Upgrade `next` to ^16.2.6 and `eslint-config-next` to 16.2.6 together in `package.json`, keeping both versions in sync (satisfies spec: ecosystem-coupled packages are upgraded together). Verified by reading `package.json` and confirming both entries show 16.2.6.

- [x] 2.2 [P] Upgrade the Tailwind ecosystem together in `package.json`: `tailwindcss` ^4.3.0, `@tailwindcss/postcss` ^4.3.0, `prettier-plugin-tailwindcss` ^0.8.0 (update strategy: tailwind ecosystem: upgrade as a unit — satisfies spec: ecosystem-coupled packages are upgraded together). Verified by reading `package.json` and confirming all three entries show the new version ranges.

- [x] 2.3 Run `pnpm install` after Tier 2 bumps. Verified when install exits 0 with no PostCSS version mismatch warnings.

- [x] 2.4 Run the full verification suite after Tier 2: `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`. Verified when all four commands exit 0.

## 3. Tier 3: Breaking-change upgrades

<!-- lucide-react 0→1: replace removed brand icons, then upgrade -->
<!-- lint-staged 16→17: upgrade, re-run pre-commit -->

- [x] 3.1 Replace removed brand icons before upgrading:
      a. In `src/components/icons/github-icon.tsx`: rename existing animated component from `GithubIcon`/`GithubIconHandle`/`GithubIconProps` to `GithubAnimatedIcon`/`GithubAnimatedIconHandle`/`GithubAnimatedIconProps`; add static `GithubIcon` export accepting `SVGProps<SVGSVGElement>` using the lucide SVG paths (sourced from shadcn.io/icons/lucide).
      b. In `src/components/icons/linkedin-icon.tsx`: rename existing animated component from `LinkedInIcon`/`LinkedInIconHandle`/`LinkedInIconProps` to `LinkedInAnimatedIcon`/`LinkedInAnimatedIconHandle`/`LinkedInAnimatedIconProps`; add static `LinkedinIcon` export accepting `SVGProps<SVGSVGElement>` using the lucide SVG paths.
      c. Create `src/components/icons/cake-icon.tsx` exporting `CakeIcon` with the SVG extracted from `personal-info.tsx` (same paths, accepts `SVGProps<SVGSVGElement>`).
      d. Update `src/components/home/hero/cta-buttons.tsx` to import `GithubAnimatedIcon` and `LinkedInAnimatedIcon` (the only existing usage of the animated components).
      e. Update `src/components/about/personal-info.tsx`: replace `Github`/`Linkedin` from lucide-react with `GithubIcon`/`LinkedinIcon` from their icon files; replace inline Cake SVG with `CakeIcon`.
      f. Update `src/components/github-info.tsx`: replace `Github` from lucide-react with `GithubIcon` from `@/components/icons/github-icon` (2 usages).
      Verified by running `pnpm type-check` and confirming no import errors across all 4 modified files.

- [x] 3.2 Upgrade `lucide-react` to ^1.16.0 in `package.json`. Verified by reading `package.json` and confirming the entry shows ^1.16.0.

- [x] 3.3 Run `pnpm install` after lucide-react upgrade. Verified when install exits 0.

- [x] 3.4 Run `pnpm build` and confirm it exits 0 with no `Cannot find module` or named-export errors for the 9 remaining lucide icons (`Airplay`, `Moon`, `Sun`, `ArrowLeft`, `ChevronDown`, `Languages`, `ExternalLink`, `Star`, `Search`). Verified by build exit code and absence of icon-related errors in build output (satisfies spec: breaking-change upgrades are verified before merging).

- [x] 3.5 Visually spot-check at least one page per icon-bearing component (theme toggle, search toggle, sidebar, article header, about section) in a running dev server to confirm icons render correctly.

- [x] 3.6 Upgrade `lint-staged` to ^17.0.5 in `package.json`. Verified by reading `package.json` and confirming the entry shows ^17.0.5.

- [x] 3.7 Run `pnpm install` after lint-staged upgrade. Verified when install exits 0.

- [x] 3.8 Stage a file change and run `git commit --dry-run` to confirm lint-staged 17 parses the existing `package.json` config correctly and invokes eslint and prettier without errors. Pre-conditions verified: Node 24.15.0 ≥ 22.22.1 ✓, Git 2.54.0 ≥ 2.32.0 ✓, config is in `package.json` (not YAML) ✓. Verified when dry-run exits without config parse errors or lint-staged lifecycle errors.

## 4. Tier 4: eslint upgrade

<!-- eslint 9→10: upgrade with flat-config verification -->

- [x] 4.1 Confirm the project uses flat config: verify `eslint.config.mjs` exists and exports a default array (not `.eslintrc.*` format). Verified by reading `eslint.config.mjs` and confirming it is a flat config file — required precondition for eslint v10 compatibility.

- [x] 4.2 Upgrade `eslint` to ^10.0.0 in `package.json`. Verified by reading `package.json` and confirming the entry shows ^10.0.0.

- [x] 4.3 Run `pnpm install` after eslint upgrade. Verified when install exits 0 with no peer-dependency errors about eslint version incompatibility from `eslint-config-next` or any plugin.

- [x] 4.4 Run `pnpm lint` (`eslint . --max-warnings=0`) and confirm it exits 0. If any errors about removed APIs appear (e.g., `CLIEngine`, deprecated `env` key, `Linter.verify` direct calls), identify the source plugin and either update it or remove the API call. Verified by lint exit code 0.

- [x] 4.5 Run `pnpm build` to confirm Next.js 16 build pipeline is compatible with eslint 10. Verified by build exit 0.

## 5. Tier 5: next-sanity upgrade

<!-- next-sanity 12→13: zero-impact upgrade -->

- [x] 5.1 Audit all `next-sanity` import sites: run `grep -r "next-sanity" src/` and list every file path and named export used. Verified by producing an explicit list of import sites before upgrading (required to detect any exports that moved in v13).

- [x] 5.2 Confirm no import path changes are needed: v13 breaking changes affect `SanityLive`, `sanityFetch`, `defineLive`, and hooks on `next-sanity/live` — none of which this project uses. All imports are from `next-sanity/studio` (`NextStudio`, `metadata`, `viewport`), which has no breaking changes in v13. Verified by cross-referencing the import site list from task 5.1 against the v13 migration guide (already confirmed: zero overlap).

- [x] 5.3 Upgrade `next-sanity` to ^13.0.0 in `package.json`. Verified by reading `package.json` and confirming the entry shows ^13.0.0.

- [x] 5.4 Run `pnpm install` after next-sanity upgrade. Verified when install exits 0.

- [x] 5.5 Run `pnpm type-check` (`tsc --noEmit`) and `pnpm build` after upgrade. If type errors or missing export errors appear, update import paths per the v13 migration guide (task 5.2). Verified by type-check and build both exiting 0.

## 6. Tier 6: typescript v6 upgrade

- [ ] 6.1 Upgrade `typescript` to ^6.0.3 in `package.json` (typescript 5→6: upgrade with type-check verification — 6.0.3 confirmed available via `ncu`; `tsconfig.json` already uses `moduleResolution: "bundler"` and `module: "esnext"` — no deprecated options in use). Verified by reading `package.json` and confirming the entry shows ^6.0.3.

- [ ] 6.2 Run `pnpm install` after typescript upgrade. Verified when install exits 0.

- [ ] 6.3 Run `pnpm type-check` (`tsc --noEmit`) and confirm it exits 0. If stricter inference or removed compiler options surface errors, fix at the affected call site or tsconfig entry. Verified by type-check exit code 0 (satisfies spec: breaking-change upgrades are verified before merging).

- [ ] 6.4 Run `pnpm build` to confirm the Next.js build pipeline is compatible with typescript 6. Verified by build exit 0.

## 7. Final verification

- [ ] 7.1 Run the complete verification suite one final time: `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`. All four commands must exit 0. Application source file changes (if any) must be limited to brand icon replacements (lucide-react) and any fixes forced by TypeScript 6 breaking changes. Verified when all four exit 0 (satisfies spec: active dependencies are kept within one minor version of latest).

- [ ] 7.2 Confirm deferred packages are explicitly documented (satisfies spec: deferred packages are explicitly documented): verify `design.md` states "Deferred packages: none — all remaining packages either have no pending updates or are removed from the project." Verified by reading `design.md` Context section.
