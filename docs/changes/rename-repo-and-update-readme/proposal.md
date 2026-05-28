## Why

The current repository is named `andrewck24`, which matches the GitHub username and occupies the special profile README slot. This prevents using the profile README feature for a dedicated profile page. The repository's README also currently serves as a personal resume rather than describing the project itself.

## What Changes

- Rename the GitHub repository from `andrewck24` to `website`
- Create a new `andrewck24/andrewck24` repository and migrate the existing README content there as the GitHub profile README
- Rewrite `README.md` in this repository to describe the project (personal website + tech blog) with: badges, screenshot, highlights (Sanity CMS integration, View Transition API), tech stack, source tree, getting started guide, and MIT license section
- Add a `LICENSE` file (MIT) to the repository

## Non-Goals

- No changes to application source code
- No changes to Vercel deployment configuration (Vercel auto-follows GitHub repo renames)
- The new `andrewck24/andrewck24` profile repo content will not be redesigned — existing resume content is reused as-is
- No roadmap section in the new README (maintenance burden outweighs benefit)

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

(none)

## Impact

- Affected specs: none
- Affected code:
  - New: `LICENSE`
  - Modified: `README.md`
  - Removed: (none — `public/images/projects/` already removed in prior commit)
- External actions required:
  - Rename repo on GitHub (`andrewck24` → `website`)
  - Create new `andrewck24/andrewck24` repo on GitHub
  - Update local git remote URL after rename
