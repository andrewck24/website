<!--
Each task description MUST state:
- the behavior or contract being delivered (what is observably true when the
  task is complete), and
- the verification target that proves completion (test, CLI invocation,
  analyzer check, manual assertion, or content review).

File paths are supporting context for locating the work, never the task
itself. "Edit file X" is not a valid task — it is missing both behavior and
verification.
-->

## 1. Prepare andrewck24

- [ ] 1.1 Record the pre-migration disk baseline: run `du -sh andrewck24/node_modules music-hits/node_modules volleybro/node_modules ~/.pnpm/store/v10` and save the output. Required for post-migration comparison in task 7.1. Verified when the baseline numbers are noted. (migration order: andrewck24 first — this step establishes the baseline before any changes)

- [ ] 1.2 [P] Add `"packageManager": "pnpm@10.33.0"` to `andrewck24/package.json` so corepack enforces the correct version (packageManager field: pin exact version, update on minor bumps). Verified by reading `package.json` and confirming the field value is `pnpm@10.33.0` (satisfies spec: packageManager field format).

- [ ] 1.3 [P] Update `.husky/pre-commit` in `andrewck24` to invoke `pnpm exec lint-staged` instead of `npx lint-staged` (husky pre-commit: `pnpm exec lint-staged` over `npx lint-staged`). Verified by reading the file and confirming `pnpm exec lint-staged` is present and `npx lint-staged` is absent (satisfies spec: pre-commit hook uses pnpm exec).

## 2. Migrate andrewck24 lockfile

- [ ] 2.1 Delete `andrewck24/package-lock.json` so pnpm does not encounter a conflicting lockfile format. Verified when the file no longer exists in the repo.

- [ ] 2.2 Run `pnpm import` in `andrewck24` to produce `pnpm-lock.yaml` from the deleted `package-lock.json`, preserving resolved versions (lockfile migration strategy: `pnpm import` over fresh install). Verified when `pnpm-lock.yaml` exists and `package-lock.json` is absent.

- [ ] 2.3 Run `pnpm install` in `andrewck24` to link packages into the shared store. Verified when the command exits 0 and `du -sh ~/.pnpm/store/v10` returns > 0 B (satisfies spec: shared pnpm store is active and non-empty).

## 3. Validate andrewck24

- [ ] 3.1 Run `pnpm build` (`next build`) in `andrewck24` and confirm it exits 0 with no `Cannot find module` errors. This validates that pnpm's strict `node_modules` does not surface phantom dependency issues. Verified by build exit code and absence of module resolution errors.

- [ ] 3.2 Run `pnpm test` (`jest`) in `andrewck24` and confirm all tests pass. Verified when jest exits 0 with no failures.

- [ ] 3.3 Stage a file change and run `git commit --dry-run` in `andrewck24` to confirm the husky pre-commit hook invokes `lint-staged` via `pnpm exec` without errors. Verified when lint-staged completes with no fallback to a global binary (satisfies spec: pre-commit hook uses pnpm exec).

## 4. Migrate music-hits

- [ ] 4.1 [P] Add `"packageManager": "pnpm@10.33.0"` to `music-hits/package.json` (packageManager field: pin exact version, update on minor bumps). Verified by reading the file (satisfies spec: pnpm version is pinned via packageManager field).

- [ ] 4.2 Delete `music-hits/package-lock.json`. Verified when the file no longer exists.

- [ ] 4.3 Run `pnpm import` in `music-hits` to produce `pnpm-lock.yaml` (lockfile migration strategy: `pnpm import` over fresh install). Verified when `pnpm-lock.yaml` exists.

- [ ] 4.4 Run `pnpm install` in `music-hits` and confirm it exits 0. Verified by exit code and absence of error output.

## 5. Migrate go-eco

- [ ] 5.1 Add `"packageManager": "pnpm@10.33.0"` to `go-eco/package.json` (packageManager field: pin exact version, update on minor bumps). Note: `go-eco` has no husky hooks, so no pre-commit changes are needed. Verified by reading the file (satisfies spec: pnpm version is pinned via packageManager field).

- [ ] 5.2 Delete `go-eco/package-lock.json`. Verified when the file no longer exists.

- [ ] 5.3 Run `pnpm import` in `go-eco` to produce `pnpm-lock.yaml` from the existing `package-lock.json` (177 KB, present without a prior `node_modules` install) (lockfile migration strategy: `pnpm import` over fresh install). Verified when `pnpm-lock.yaml` exists and `package-lock.json` is absent.

- [ ] 5.4 Run `pnpm install` in `go-eco` and confirm it exits 0. Verified by exit code and absence of error output.

- [ ] 5.5 Run `pnpm build` (Vite build) in `go-eco` and confirm it exits 0 with no module resolution errors. Verified by build exit code.

## 6. Rebuild volleybro store

- [ ] 6.1 Add `"packageManager": "pnpm@10.33.0"` to `volleybro/package.json` (packageManager field: pin exact version, update on minor bumps). Verified by reading the file (satisfies spec: pnpm version is pinned via packageManager field).

- [ ] 6.2 Run `pnpm install` in `volleybro` to re-link all packages into the shared store (volleybro store fix: `pnpm install` only, no config changes). Verified when the command exits 0 and `du -sh ~/.pnpm/store/v10` shows a size larger than before task 6.2.

## 7. Post-migration verification

- [ ] 7.1 Run `du -sh andrewck24/node_modules music-hits/node_modules go-eco/node_modules volleybro/node_modules ~/.pnpm/store/v10` and compare against baseline from task 1.1. Verified when the combined total is measurably smaller (satisfies spec: projects use pnpm as the package manager; satisfies spec: shared pnpm store is active and non-empty).

- [ ] 7.2 Confirm `package-lock.json` is absent and `pnpm-lock.yaml` is present in `andrewck24`, `music-hits`, and `go-eco` by listing repo files. Verified by filesystem check.
