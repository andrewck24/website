## Context

Four active Node.js repos maintain independent `node_modules` directories under npm: `andrewck24` (Next.js, ~748 MB), `music-hits` (~652 MB), `go-eco` (Vite, no `node_modules` currently installed), and `volleybro` (pnpm, ~1.5 GB). The combined installed footprint is ~2.9 GB. `volleybro` already has a `pnpm-lock.yaml` but its content-addressable store (`~/.pnpm/store/v10`) is empty (0 B), meaning no hard-link deduplication is occurring. `andrewck24`, `music-hits`, and `go-eco` are fully on npm with `package-lock.json`. pnpm v10.33.0 is installed globally. No CI pipelines exist.

## Goals / Non-Goals

**Goals:**

- Migrate `andrewck24`, `music-hits`, and `go-eco` from npm to pnpm (replace lockfile, add `packageManager` field)
- Rebuild the pnpm store for `volleybro` so hard-link deduplication takes effect across all four repos
- Pin pnpm version in all four `package.json` files via the `packageManager` field
- Update `andrewck24`'s pre-commit hook to use `pnpm exec` instead of `npx`

**Non-Goals:**

- Upgrading pnpm to v11 (config migration to `pnpm-workspace.yaml` is a separate effort)
- Changing any dependency versions
- Monorepo / workspace setup
- CI pipeline changes

## Decisions

### Lockfile migration strategy: `pnpm import` over fresh install

`pnpm import` converts an existing `package-lock.json` to `pnpm-lock.yaml` while preserving resolved versions. This is preferred over a fresh `pnpm install` (which would re-resolve all versions) because it produces a deterministic result consistent with what npm was using.

Alternatives considered: Fresh `pnpm install` — rejected because it may silently upgrade patch versions, making it harder to attribute any behaviour change to the package manager switch vs. version drift.

### packageManager field: pin exact version, update on minor bumps

The `package.json` `packageManager` field SHALL be set to `pnpm@10.33.0` (exact version). This allows corepack to enforce the correct version and prevents lockfile format divergence between machines. The field SHALL be updated whenever pnpm is upgraded to a new minor version (e.g., 10.34.x → update to the new exact version), but not on every patch release.

Alternatives considered: Pinning only the major version — rejected because `packageManager` requires an exact semver string; a bare major is not valid.

### Husky pre-commit: `pnpm exec lint-staged` over `npx lint-staged`

The `.husky/pre-commit` script SHALL call `pnpm exec lint-staged` instead of `npx lint-staged`. Under pnpm's strict `node_modules` structure, `npx` resolves packages differently and may fall back to a global install. `pnpm exec` is explicit and scoped to the project's pnpm store. `go-eco` has no husky hooks and requires no pre-commit changes.

Alternatives considered: Keeping `npx lint-staged` — acceptable if npx is globally available, but `pnpm exec` is the idiomatic choice and avoids ambiguity.

### volleybro store fix: `pnpm install` only, no config changes

`volleybro` already has a valid `pnpm-lock.yaml`. Running `pnpm install` in that directory will re-link all packages into the shared store. No lockfile changes or code changes are needed.

### Migration order: andrewck24 first

`andrewck24` contains the Spectra change and is the primary development repo. It SHALL be migrated first so the change can be validated end-to-end (install, build, lint, test) before applying the same steps to `music-hits` and `go-eco`. `volleybro` store rebuild is last (lowest risk).

## Implementation Contract

**Observable outcomes after migration:**

1. Running `pnpm install` in `andrewck24` completes without errors; `next build` and `jest` pass
2. `pnpm install` in `music-hits` completes without errors
3. `pnpm install` in `go-eco` completes without errors; `pnpm build` (Vite) passes
4. `pnpm install` in `volleybro` completes and `du -sh ~/.pnpm/store/v10` shows a non-zero size
5. `git commit` in `andrewck24` triggers lint-staged via the pre-commit hook without errors
6. The combined `node_modules` footprint across all repos is measurably reduced vs. the pre-migration baseline

**Acceptance criteria:**

- `pnpm-lock.yaml` exists and `package-lock.json` is absent in `andrewck24`, `music-hits`, and `go-eco`
- `package.json` in all four repos contains `"packageManager": "pnpm@10.33.0"`
- `pnpm store path` returns `~/.pnpm/store/v10` and the directory size is > 0 B
- Pre-commit hook runs `lint-staged` successfully on a staged file change in `andrewck24`

**Scope boundaries:**

- In scope: lockfile replacement, `packageManager` field, pre-commit hook, store rebuild across all four repos
- Out of scope: any `package.json` dependency version changes, `.npmrc` creation, pnpm workspace configuration

## Risks / Trade-offs

- [Phantom dependencies] pnpm's strict `node_modules` may surface implicit dependencies that npm hoisting hid → Mitigation: run build and full test suite after each repo migration; check for `Cannot find module` errors
- [fumadocs-mdx postinstall] `postinstall` script runs `fumadocs-mdx`; pnpm v9+ runs lifecycle scripts by default, but if it fails → Mitigation: add `enable-pre-post-scripts=true` to `.npmrc`
- [volleybro store rebuild] If `volleybro` has unresolvable packages in its lockfile, `pnpm install` may fail → Mitigation: run `pnpm install --no-frozen-lockfile` as a fallback; investigate any resolution errors before updating the lockfile
- [go-eco no prior install] `go-eco` has no `node_modules` on this machine; `pnpm import` requires only the `package-lock.json` (present at 177 KB), so import should succeed without a prior install
