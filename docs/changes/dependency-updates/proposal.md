## Why

Several direct dependencies in `andrewck24` have accumulated version lag since the last update. Keeping dependencies current reduces security exposure, ensures compatibility with upstream ecosystem changes (notably lucide-react's 1.x API stabilization and Tailwind 4.3), and prevents the gap from widening to the point where catching up requires coordinated breaking-change work.

## What Changes

- **BREAKING** `lucide-react` 0.562.0 → 1.16.0: major version; icon API stabilized. All 11 import sites use common icons (`Check`, `ChevronsUpDown`, `Github`, `Star`, `Languages`, `ChevronDown`, `Sidebar`, `Search`, `Linkedin`, `ExternalLink`, `ArrowLeft`, `Tag`, `Airplay`, `Moon`, `Sun`) that exist unchanged in 1.x.
- `lint-staged` 16.2.7 → 17.0.5: major version; pre-commit hook behavior unchanged for this project's config.
- `next` 16.1.0 → 16.2.6 and `eslint-config-next` 16.1.0 → 16.2.6: minor; keep versions in sync.
- `tailwindcss` 4.1.18 → 4.3.0 and `@tailwindcss/postcss` 4.1.18 → 4.3.0: minor; must be upgraded together.
- `prettier-plugin-tailwindcss` 0.7.2 → 0.8.0: minor; aligned with Tailwind 4.3.
- Low-risk minor/patch updates: `@eslint/eslintrc`, `@playwright/test`, `@testing-library/react`, `@types/node`, `@types/react`, `jest`, `jest-environment-jsdom`, `motion`, `postcss`, `prettier`, `react`, `react-dom`, `tailwind-merge`, `zod`.

## Capabilities

### New Capabilities

- `dependency-policy`: Version constraints and deferral rationale for `andrewck24` dependencies — documents which packages are actively maintained, which are deferred, and why.

### Modified Capabilities

(none)

## Impact

- Affected specs: `dependency-policy` (new)
- Affected code:
  - Modified: `package.json` (version bumps across 21 packages)
  - Modified: `package-lock.json` (resolved versions; or `pnpm-lock.yaml` if Change 1 lands first)
