## Why

Four projects (`andrewck24`, `music-hits`, `go-eco`, `volleybro`) currently use npm with separate `node_modules` directories. Migrating to pnpm's content-addressable store with hard links will eliminate duplicate package storage across projects and reduce total disk usage by an estimated 700–900 MB (~25–30%).

## What Changes

- Replace `package-lock.json` with `pnpm-lock.yaml` in `andrewck24`, `music-hits`, and `go-eco`
- Add `"packageManager": "pnpm@10.33.0"` to `package.json` in all four projects
- Rebuild the pnpm content-addressable store for `volleybro` (currently empty despite using pnpm)
- Update `.husky/pre-commit` in `andrewck24` to use `pnpm exec lint-staged` instead of `npx lint-staged`

## Non-Goals

- Upgrading pnpm to v11 (tracked separately in atelier; requires `pnpm-workspace.yaml` migration)
- Updating any package versions (handled in a separate change)
- Setting up CI pipelines (no CI currently exists)
- Configuring pnpm workspaces (all four are independent single-package repos)

## Capabilities

### New Capabilities

- `package-manager`: Tooling requirements for the shared pnpm setup — version pinning, store configuration, and lockfile conventions across all four Node.js projects

### Modified Capabilities

(none)

## Impact

- Affected specs: `package-manager` (new)
- Affected code:
  - Modified: `package.json` (add `packageManager` field)
  - Modified: `.husky/pre-commit` (replace `npx lint-staged` with `pnpm exec lint-staged`)
  - Removed: `package-lock.json`
  - New: `pnpm-lock.yaml`
- External repos also modified (outside this Spectra change):
  - `music-hits/package.json`, `music-hits/package-lock.json` → `music-hits/pnpm-lock.yaml`
  - `go-eco/package.json`, `go-eco/package-lock.json` → `go-eco/pnpm-lock.yaml`
  - `volleybro/package.json` (add `packageManager` field; store rebuild via `pnpm install`)
