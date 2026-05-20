## Context

`andrewck24` uses npm (or pnpm after Change 1 lands). The dependency list has not been updated in bulk since the project's initial setup. This change covers 21 packages: 2 with major version bumps requiring manual verification, 3 with minor version bumps requiring grouped upgrade (Tailwind ecosystem), and 16 with safe minor/patch bumps.

Deferred packages (not in this change):

- `eslint` 9→10: `eslint-config-next` peer dep is `>=9.0.0` but ESLint 10 removes deprecated APIs; requires separate validation.
- `fumadocs-core`, `fumadocs-mdx`, `fumadocs-ui`, `@orama/*`, `mermaid`: planned replacement with sanity.io; updating now wastes effort.
- `typescript`: 6.x has no stable release as of 2026-05-19.

## Goals / Non-Goals

**Goals:**

- Upgrade all 21 in-scope packages to their latest compatible versions
- Validate that breaking-change packages (`lucide-react` 1.x, `lint-staged` 17.x) require no code changes
- Keep the Tailwind ecosystem (`tailwindcss`, `@tailwindcss/postcss`, `prettier-plugin-tailwindcss`) on matching versions
- Run the full verification suite (build, type-check, lint, test) to confirm no regressions

**Non-Goals:**

- Updating `eslint`, `fumadocs-*`, `@orama/*`, `mermaid`, or `typescript` (all explicitly deferred)
- Migrating to ESLint 10 flat-config API changes
- Any application code changes beyond what version bumps require
- Updating dependencies in `music-hits`, `go-eco`, or `volleybro`

## Decisions

### Update strategy: grouped by risk tier

Packages are upgraded in three tiers to isolate failures:

- **Tier 1 (safe)**: 16 minor/patch packages — upgrade all at once, run verification suite.
- **Tier 2 (verify)**: `next` + `eslint-config-next` together (must stay in sync); `tailwindcss` + `@tailwindcss/postcss` + `prettier-plugin-tailwindcss` together (ecosystem lock-step).
- **Tier 3 (breaking)**: `lucide-react` 0→1, `lint-staged` 16→17 — upgrade individually, verify after each.

Alternatives considered: Upgrading all at once — rejected because a single build failure would require bisecting 21 packages to identify the cause.

### lucide-react 0→1: upgrade with visual spot-check

All 11 import sites use icons confirmed present in 1.x (`Check`, `ChevronsUpDown`, `Github`, `Star`, `Languages`, `ChevronDown`, `Sidebar`, `Search`, `Linkedin`, `ExternalLink`, `ArrowLeft`, `Tag`, `Airplay`, `Moon`, `Sun`). No import-path or prop-API changes are needed. A `next build` catching `Cannot find module` errors plus a visual spot-check of icon-bearing pages is sufficient.

Alternatives considered: Auditing the full lucide-react 1.x changelog — done; no relevant renames for the icons in use.

### lint-staged 16→17: upgrade, re-run pre-commit

The project's lint-staged config is a plain `*.{js,jsx,ts,tsx}` → `[eslint, prettier]` glob pattern, which is unchanged between major versions. The 17.x breaking changes affect Node.js version requirements (now requires Node 20+; project uses Node 20+) and internal lifecycle hooks not used here.

Alternatives considered: Staying on 16.x — rejected because 16.x will lose maintenance; upgrading now avoids a larger gap later.

### Tailwind ecosystem: upgrade as a unit

`tailwindcss`, `@tailwindcss/postcss`, and `prettier-plugin-tailwindcss` share a release cadence. Upgrading them together prevents version mismatch warnings and ensures PostCSS plugin compatibility.

## Implementation Contract

**Observable outcomes after all tiers complete:**

1. `pnpm build` (or `npm run build`) exits 0 — no build regressions
2. `pnpm type-check` (`tsc --noEmit`) exits 0 — no new type errors
3. `pnpm lint` (`eslint . --max-warnings=0`) exits 0 — no new lint warnings
4. `pnpm test` (`jest`) exits 0 — all tests pass
5. Icons render correctly on pages that use `lucide-react` (visual spot-check)
6. Pre-commit hook fires `lint-staged` without errors after `lint-staged` upgrade

**Acceptance criteria:**

- `package.json` shows updated version ranges for all 21 in-scope packages
- All four verification commands exit 0
- No application source files are modified (version bumps only)

**Scope boundaries:**

- In scope: `package.json` version bumps and lockfile update for `andrewck24` only
- Out of scope: source code changes, config file changes, other repos

## Risks / Trade-offs

- [`lucide-react` icon removal] If any imported icon was silently removed in 1.x → Mitigation: `next build` will throw `Cannot find module` or a named export error; fix by finding the renamed icon in 1.x docs.
- [Tailwind CSS class renames] Tailwind 4.3 may deprecate class names used in the codebase → Mitigation: `pnpm build` catches PostCSS errors; `pnpm lint` catches deprecated utility warnings if eslint-plugin-tailwindcss is configured.
- [lint-staged 17 config format change] If config format changed between 16→17 → Mitigation: `git commit --dry-run` after upgrade will reveal any config parse errors immediately.
