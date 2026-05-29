## Context

`website` (formerly `andrewck24`) uses pnpm. The dependency list had not been updated in bulk since the project's initial setup. This change covers 27+ packages: 5 with major version bumps requiring manual verification (`lucide-react`, `eslint`, `next-sanity`, `typescript`, `lint-staged`), 3 with minor version bumps requiring grouped upgrade (Tailwind ecosystem), 12 with safe minor/patch bumps, and 2 unused packages to remove.

During a discovery session (2026-05-29), additional scope was identified beyond the original plan:

- `eslint` 9→10: originally deferred; now unblocked. Next.js 16 defaults to ESLint flat config (`eslint.config.mjs`) and explicitly states ESLint v10 compatibility. Project already uses flat config.
- `next-sanity` 12→13: new major update discovered via `ncu`; `VisualEditing` and `defineLive` exports moved to subpackages.
- `typescript` 5→6: 6.0.3 confirmed available via `ncu`; originally mismarked as deferred due to incorrect assumption that no stable release existed.
- `zod`: confirmed unused (zero imports in `src/`); remove.
- `@swc/jest`: confirmed unused; Next.js uses its own bundled SWC transformer — remove.
- `@vercel/analytics` 2.0.1: already installed.
- `package.json` `name` changed from `andrewck24` → `website`: already applied to fix Turbopack absolute-path resolution.
- `postcss.config.mjs` → `postcss.config.ts` and `next.config.mjs` → `next.config.ts`: renamed as part of this change. Previously blocked by fumadocs ESM-only constraint; fumadocs has since been migrated to Sanity, removing the constraint. `next.config.ts` gains static typing via `import type { NextConfig } from "next"`.

Deferred packages (not in this change): `eslint` 9→10 — blocked by `eslint-config-next@16.2.6`'s transitive dependency `typescript-eslint@8.46.2`, which declares peer dep `eslint: "^8.57.0 || ^9.0.0"` and fails at runtime with ESLint 10 (`Class extends value undefined`). `typescript-eslint@8.60.0` adds ESLint 10 support, but `eslint-config-next` must ship it as its own dependency before the upgrade is viable without pnpm overrides. Tracked in vercel/next.js#89764. Upgrade once `eslint-config-next` ships with `typescript-eslint ≥ 8.60.0`.

## Goals / Non-Goals

**Goals:**

- Remove unused dependencies: `zod`, `@swc/jest`
- Upgrade all in-scope packages to their latest compatible versions (27+ packages)
- Validate that breaking-change packages (`lucide-react` 1.x, `lint-staged` 17.x, `eslint` 10.x, `next-sanity` 13.x, `typescript` 6.x) require no or minimal code changes
- Keep the Tailwind ecosystem (`tailwindcss`, `@tailwindcss/postcss`, `prettier-plugin-tailwindcss`) on matching versions
- Run the full verification suite (`pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`) to confirm no regressions

**Non-Goals:**

- Any application code changes beyond import path fixes forced by next-sanity v13 API moves or TypeScript 6 breaking changes
- Updating dependencies in other repositories

## Decisions

### Update strategy: grouped by risk tier

Packages are upgraded in seven tiers to isolate failures:

- **Tier 0 (cleanup)**: Remove unused packages (`zod`, `@swc/jest`), verify test suite passes.
- **Tier 1 (safe)**: 12 minor/patch packages — upgrade all at once, run verification suite.
- **Tier 2 (verify)**: `next` + `eslint-config-next` together (must stay in sync); `tailwindcss` + `@tailwindcss/postcss` + `prettier-plugin-tailwindcss` together (ecosystem lock-step).
- **Tier 3 (breaking)**: `lucide-react` 0→1, `lint-staged` 16→17 — upgrade individually, verify after each.
- **Tier 4 (breaking)**: `eslint` 9→10 — verify flat config compatibility, run lint.
- **Tier 5 (breaking)**: `next-sanity` 12→13 — audit import sites, run type-check + build.
- **Tier 6 (breaking)**: `typescript` 5→6 — verify `tsc --noEmit` exits clean, check for removed TS5 APIs.

Alternatives considered: Upgrading all at once — rejected because a single build failure would require bisecting 27+ packages to identify the cause.

### lucide-react 0→1: replace removed brand icons, then upgrade

v1 removes all brand icons. This project imports `Github` (used in `github-info.tsx` lines 64, 93 and `personal-info.tsx` line 28) and `Linkedin` (used in `personal-info.tsx` line 33) from lucide-react. Both must be replaced with static SVG components before upgrading. SVG paths sourced from shadcn.io/icons/lucide. Static exports are added directly to the existing icon files (`github-icon.tsx`, `linkedin-icon.tsx`); the existing animated variants are renamed with an `Animated` suffix (`GithubAnimatedIcon`, `LinkedInAnimatedIcon`) to distinguish them. The inline Cake SVG in `personal-info.tsx` is extracted to `src/components/icons/cake-icon.tsx` in the same pass to keep all brand SVGs in one directory. The remaining 9 lucide icons (`Airplay`, `Moon`, `Sun`, `ArrowLeft`, `ChevronDown`, `Languages`, `ExternalLink`, `Star`, `Search`) exist unchanged in 1.x and require no changes. After replacing brand icons: `next build` catching `Cannot find module` errors plus a visual spot-check is sufficient.

Alternatives considered: Using `simple-icons` package — rejected; adds a dependency for two icons, and an inline SVG is self-contained and zero-overhead.

### lint-staged 16→17: upgrade, re-run pre-commit

The project's lint-staged config is defined in `package.json` (not a YAML file) — the v17 optional `yaml` dependency change does not apply. The v17 breaking changes are: Node.js 22.22.1+ required (project runs Node 24.15.0 ✓), Git 2.32.0+ required (project uses Git 2.54.0 ✓). The glob pattern and command format in `package.json` are unchanged between major versions.

Alternatives considered: Staying on 16.x — rejected because 16.x will lose maintenance; upgrading now avoids a larger gap later.

### Tailwind ecosystem: upgrade as a unit

`tailwindcss`, `@tailwindcss/postcss`, and `prettier-plugin-tailwindcss` share a release cadence. Upgrading them together prevents version mismatch warnings and ensures PostCSS plugin compatibility.

### eslint 9→10: upgrade with flat-config verification

Next.js 16 documentation states: "`@next/eslint-plugin-next` now defaults to ESLint Flat Config format, aligning with ESLint v10 which will drop legacy config support." The project already uses `eslint.config.mjs` (flat config). Verification: `pnpm lint` (`eslint . --max-warnings=0`) must exit 0 after upgrade. If any plugin uses a removed API (e.g., `CLIEngine`), identify and fix it.

Alternatives considered: Keeping eslint on 9.x — rejected because 10.x is now confirmed compatible with the project's flat config setup; continuing to defer widens the gap unnecessarily.

### next-sanity 12→13: zero-impact upgrade

The v13 breaking changes affect `SanityLive` props (`revalidateSyncTags` renamed to `action`, `refreshOnFocus`/`refreshOnReconnect`/`refreshOnMount` removed), `sanityFetch`/`defineLive` options (`fetchOptions`/`stega` removed), and hooks removed from `next-sanity/live` (`useDraftModePerspective`, `useIsLivePreview`, `useDraftModeEnvironment`). This project imports only from `next-sanity/studio` — `NextStudio`, `metadata`, `viewport` — which has no breaking changes in v13. No import path updates are needed. Verification: `pnpm type-check` and `pnpm build` must exit 0.

Alternatives considered: Separate change for next-sanity v13 — rejected because the upgrade footprint is small and including it keeps the dependency-update change complete.

### typescript 5→6: upgrade with type-check verification

TypeScript 6.0.3 is available and stable (confirmed via `ncu`). The original deferral reason ("no stable release") was incorrect. TypeScript 6 deprecates `baseUrl`, `moduleResolution: node/node10`, `module: AMD`, and removes `preserveValueImports`. This project's `tsconfig.json` uses `module: "esnext"` and `moduleResolution: "bundler"` — none of the deprecated options are in use, so no tsconfig changes are expected. The remaining risk is stricter type inference surfacing latent type errors. Verification: `pnpm type-check` (`tsc --noEmit`) must exit 0; fix any new type errors at the call site.

Alternatives considered: Staying on 5.x — rejected because 6.x is stable and the project's tsconfig is already fully compatible.

### Remove unused dependencies

`zod` (0 imports in `src/`): added speculatively, never used. `@swc/jest`: Next.js bundles its own SWC transformer; the external package adds install overhead without benefit. Removing both reduces `pnpm install` time and eliminates false positives in future dependency audits.

## Implementation Contract

**Observable outcomes after all tiers complete:**

1. `pnpm build` exits 0 — no build regressions
2. `pnpm type-check` (`tsc --noEmit`) exits 0 — no new type errors
3. `pnpm lint` (`eslint . --max-warnings=0`) exits 0 with eslint 10 — no new lint warnings
4. `pnpm test` (`jest`) exits 0 — all tests pass
5. Icons render correctly on pages that use `lucide-react` (visual spot-check)
6. Pre-commit hook fires `lint-staged` without errors after `lint-staged` upgrade
7. `zod` and `@swc/jest` are absent from `package.json`

**Acceptance criteria:**

- `package.json` shows updated version ranges for all in-scope packages and absence of `zod` and `@swc/jest`
- All four verification commands exit 0
- No application source files are modified beyond import path fixes forced by next-sanity v13 or TypeScript 6 breaking changes (if required)

**Scope boundaries:**

- In scope: `package.json` version bumps and lockfile update for `website` only; `src/` fixes if next-sanity v13 or typescript 6 require them
- Out of scope: source code feature changes, config file restructuring, other repositories

## Risks / Trade-offs

- [`lucide-react` brand icon removal] `Github` and `Linkedin` are removed in v1 — replaced by `GithubBrandIcon`/`LinkedinBrandIcon` inline SVGs in `src/components/icons/brand-icons.tsx` as part of task 3.1 before the package upgrade.
- [Tailwind CSS class renames] Tailwind 4.3 may deprecate class names used in the codebase → `pnpm build` catches PostCSS errors; `pnpm lint` catches deprecated utility warnings if the tailwindcss plugin is configured.
- [lint-staged 17 config format change] If config format changed between 16→17 → `git commit --dry-run` after upgrade will reveal any config parse errors immediately.
- [eslint 10 deprecated API usage] If any eslint plugin uses a removed API (e.g., `CLIEngine`, `Linter.verify`) → `pnpm lint` will fail with a descriptive error naming the plugin; fix by upgrading the affected plugin or removing the deprecated call.
- [next-sanity 13 import moves] This project only uses `next-sanity/studio` — no breaking changes in v13. If `pnpm type-check` or `pnpm build` fails with missing exports, it indicates an import outside `next-sanity/studio` that was missed during the grep audit.
- [typescript 6 stricter inference] TypeScript 6 tightens some inference rules → `pnpm type-check` will surface any latent type errors; fix at the call site. No tsconfig changes expected — project already uses modern options (`moduleResolution: bundler`, `module: esnext`).
