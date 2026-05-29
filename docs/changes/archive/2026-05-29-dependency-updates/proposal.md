## Why

Several direct dependencies in `website` have accumulated version lag since the last update. Keeping dependencies current reduces security exposure, ensures compatibility with upstream ecosystem changes (notably lucide-react's 1.x API stabilization and Tailwind 4.3), and prevents the gap from widening to the point where catching up requires coordinated breaking-change work.

Additionally, two packages were found to be unused (`zod`, `@swc/jest`) — removing them reduces install overhead and avoids false dependency signals in audits.

## What Changes

- **BREAKING** `lucide-react` 0.562.0 → 1.16.0: major version; icon API stabilized. Brand icons removed in v1 — `Github` and `Linkedin` (used in `github-info.tsx` and `personal-info.tsx`) must be replaced with custom SVG components before upgrading. The remaining 9 icons (`Airplay`, `Moon`, `Sun`, `ArrowLeft`, `ChevronDown`, `Languages`, `ExternalLink`, `Star`, `Search`) exist unchanged in 1.x.
- **BREAKING** `eslint` 9.x → 10.x: major version; Next.js 16 defaults to ESLint flat config format and explicitly confirms ESLint v10 compatibility. Project already uses `eslint.config.mjs` (flat config) — originally deferred, now unblocked.
- **BREAKING** `next-sanity` 12.x → 13.x: major version discovered via `ncu`; `VisualEditing` and `defineLive` exports moved to subpackages. Project uses `@sanity/client` directly with minimal `next-sanity` surface area.
- **BREAKING** `typescript` 5.x → 6.0.3: major version; 6.0.3 confirmed available via `ncu`. Requires verifying `tsc --noEmit` exits clean and no deprecated TS5 APIs are in use.
- `lint-staged` 16.2.7 → 17.0.5: major version; pre-commit hook behavior unchanged for this project's config.
- `next` 16.1.0 → 16.2.6 and `eslint-config-next` 16.1.0 → 16.2.6: minor; keep versions in sync.
- `tailwindcss` 4.1.18 → 4.3.0 and `@tailwindcss/postcss` 4.1.18 → 4.3.0: minor; must be upgraded together.
- `prettier-plugin-tailwindcss` 0.7.2 → 0.8.0: minor; aligned with Tailwind 4.3.
- **Remove** `zod`: confirmed zero imports in `src/`; pulled in speculatively, never used.
- **Remove** `@swc/jest`: Next.js uses its own bundled SWC transformer (`next/dist/build/jest/../swc/jest-transformer`); external package is redundant and not referenced in `jest.config.ts`.
- **Already done** `@vercel/analytics` 2.0.1: installed and wired up during exploration session.
- **Already done** `package.json` name `andrewck24` → `website`: changed to match folder name and fix Turbopack absolute-path resolution.
- Low-risk minor/patch updates: `@playwright/test`, `@testing-library/react`, `@types/node`, `@types/react`, `jest`, `jest-environment-jsdom`, `motion`, `postcss`, `prettier`, `react`, `react-dom`, `tailwind-merge`.

## Capabilities

### New Capabilities

- `dependency-policy`: Version constraints and deferral rationale for `website` dependencies — documents which packages are actively maintained, which are deferred, and why.

### Modified Capabilities

(none)

## Impact

- Affected specs: `dependency-policy` (new)
- Affected code:
  - Modified: `package.json` (version bumps across 27+ packages, 2 removals, name already changed)
  - Modified: `pnpm-lock.yaml` (resolved versions)
  - Modified: `src/components/icons/github-icon.tsx` (rename animated export to `GithubAnimatedIcon`; add static `GithubIcon`)
  - Modified: `src/components/icons/linkedin-icon.tsx` (rename animated export to `LinkedInAnimatedIcon`; add static `LinkedinIcon`)
  - Created: `src/components/icons/cake-icon.tsx` (extracts inline Cake SVG from `personal-info.tsx`)
  - Modified: `src/components/home/hero/cta-buttons.tsx` (update to `GithubAnimatedIcon`/`LinkedInAnimatedIcon`)
  - Modified: `src/components/github-info.tsx` (replace `Github` from lucide-react with `GithubIcon`)
  - Modified: `src/components/about/personal-info.tsx` (replace `Github`/`Linkedin` from lucide-react and inline Cake SVG with icon components)
