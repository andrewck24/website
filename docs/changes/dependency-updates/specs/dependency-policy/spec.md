## ADDED Requirements

### Requirement: Active dependencies are kept within one minor version of latest

Direct dependencies in `andrewck24` that are actively maintained and not flagged for replacement SHALL be updated to their latest compatible version at least once per quarter. Packages pending replacement (e.g., by a planned migration) are exempt until the replacement is complete.

#### Scenario: Routine dependency update

- **WHEN** a dependency update change is executed
- **THEN** all in-scope packages are upgraded to the latest version compatible with the project's Node.js and framework versions
- **THEN** the full verification suite (build, type-check, lint, test) passes with no regressions

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

### Requirement: Deferred packages are explicitly documented

Packages that are intentionally not upgraded SHALL have their deferral reason recorded. Valid deferral reasons are: pending replacement by a migration, no stable release available, or requires a dedicated breaking-change change.

#### Scenario: Deferred package at update time

- **WHEN** a dependency update change is executed
- **THEN** each deferred package is listed with its deferral reason in the change proposal
- **THEN** no deferred package is silently left behind without documentation

##### Example: Deferral reasons by category

| Package                             | Deferral reason                                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| `eslint` (→10)                      | Requires dedicated breaking-change change; `eslint-config-next` peer dep compatibility unconfirmed |
| `fumadocs-*`, `@orama/*`, `mermaid` | Planned replacement with sanity.io migration                                                       |
| `typescript` (→6.x)                 | No stable release available as of 2026-05-19                                                       |

### Requirement: Ecosystem-coupled packages are upgraded together

Packages that share a release cadence and have cross-package peer dependency constraints SHALL be upgraded in a single operation to prevent version mismatch warnings or plugin incompatibilities.

#### Scenario: Tailwind ecosystem upgrade

- **WHEN** `tailwindcss` is upgraded
- **THEN** `@tailwindcss/postcss` and `prettier-plugin-tailwindcss` are upgraded in the same operation
- **THEN** `pnpm build` completes without PostCSS version mismatch errors

#### Scenario: Next.js and ESLint config upgrade

- **WHEN** `next` is upgraded
- **THEN** `eslint-config-next` is upgraded to the matching version in the same operation
