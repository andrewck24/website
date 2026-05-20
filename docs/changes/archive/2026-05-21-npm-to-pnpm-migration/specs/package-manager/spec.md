## ADDED Requirements

### Requirement: Projects use pnpm as the package manager

All Node.js projects in the workspace (`andrewck24`, `music-hits`, `volleybro`) SHALL use pnpm as their sole package manager. Each project SHALL have a `pnpm-lock.yaml` lockfile and SHALL NOT have a `package-lock.json` or `yarn.lock`.

#### Scenario: Installing dependencies

- **WHEN** a developer runs the install command in any of the three projects
- **THEN** pnpm resolves and links packages using the shared content-addressable store at `~/.pnpm/store/v10`
- **THEN** the installation completes without errors

### Requirement: pnpm version is pinned via packageManager field

Each project's `package.json` SHALL include a `"packageManager"` field set to an exact pnpm version string (e.g., `"pnpm@10.33.0"`). The pinned version SHALL be updated whenever pnpm is upgraded to a new minor release.

#### Scenario: Correct pnpm version in use

- **WHEN** a developer runs `pnpm --version` in any of the three projects
- **THEN** the version matches the value in the `packageManager` field

#### Scenario: packageManager field format

- **WHEN** the `packageManager` field is read from `package.json`
- **THEN** it matches the pattern `pnpm@<major>.<minor>.<patch>` with all three version parts present

##### Example: valid and invalid packageManager values

| Value             | Valid | Notes                        |
| ----------------- | ----- | ---------------------------- |
| `"pnpm@10.33.0"`  | Yes   | Exact semver                 |
| `"pnpm@10"`       | No    | Missing minor and patch      |
| `"pnpm@^10.33.0"` | No    | Range specifiers not allowed |

### Requirement: Shared pnpm store is active and non-empty

The pnpm content-addressable store at `~/.pnpm/store/v10` SHALL be non-empty after installation in any of the three projects. Packages shared between projects SHALL be stored once via hard links.

#### Scenario: Store populated after install

- **WHEN** `pnpm install` is run in any of the three projects
- **THEN** `du -sh ~/.pnpm/store/v10` returns a size greater than 0 B

### Requirement: Pre-commit hook uses pnpm exec

The `.husky/pre-commit` script in `andrewck24` SHALL invoke `lint-staged` via `pnpm exec lint-staged`, not via `npx lint-staged`.

#### Scenario: Pre-commit hook runs lint-staged

- **WHEN** a developer stages files and runs `git commit` in `andrewck24`
- **THEN** `lint-staged` executes via `pnpm exec` without falling back to a global or npx-resolved binary
- **THEN** the commit proceeds if all lint checks pass
