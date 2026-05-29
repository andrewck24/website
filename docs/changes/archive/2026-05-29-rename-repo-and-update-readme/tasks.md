## 1. GitHub Repository Actions

- [x] [P] 1.1 Rename the GitHub repository from `andrewck24` to `website` via GitHub Settings → Repository name; verify the new URL `github.com/andrewck24/website` resolves correctly
- [x] [P] 1.2 Create a new public repository `andrewck24/andrewck24` on GitHub; verify it appears as the GitHub profile README repo on `github.com/andrewck24`
- [x] 1.3 Copy the current `README.md` content to the new `andrewck24/andrewck24` repo as its README; verify it renders on the GitHub profile page
- [x] 1.4 Update the local git remote URL to `https://github.com/andrewck24/website.git` by running `git remote set-url origin https://github.com/andrewck24/website.git`; verify with `git remote -v`

## 2. Add MIT License

- [x] 2.1 Create `LICENSE` file at project root containing MIT License text with author name "Li-Wei Tseng" and year 2025; verify the file exists and contains correct text

## 3. Rewrite README.md

- [x] [P] 3.1 Add shields.io badges at the top: one for the live site (`andrewck24.vercel.app`) and one for LinkedIn (`linkedin.com/in/li-wei-tseng-andrew`); verify both badges render and link correctly on GitHub
- [x] [P] 3.2 Add a collapsible Table of Contents linking to all sections; verify all anchor links resolve correctly on GitHub
- [x] 3.3 Add the About the Project section with a one-sentence description and the preview screenshot at `public/images/preview.png` linked to the live site; verify the image renders on GitHub
- [x] 3.4 Add the Highlights section with detailed descriptions of: (1) Sanity CMS — how it manages content and enables article publishing via `@sanity/client`, and (2) View Transition API — how it enables native-like page transitions; verify each entry explains the problem solved, not just the technology name
- [x] 3.5 Add the Built With section listing the main tech stack with shields.io badges: Next.js, TypeScript, Tailwind CSS, Sanity, Fumadocs; verify all badges render correctly
- [x] 3.6 Add the Source Tree section showing the directory structure to two levels deep under `src/`, with a one-line description for each directory (`src/app/`, `src/components/`, `src/hooks/`, `src/lib/`, `src/types/`, `src/assets/`, `docs/`); verify accuracy against actual directory structure
- [x] 3.7 Add the Getting Started section with: prerequisites (Node.js v20+, pnpm 11+), clone and install steps, and the following env var names listed without values: `NEXT_PUBLIC_APP_URL`, `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN`, `SANITY_WEBHOOK_SECRET`; verify steps can be followed from a fresh clone
- [x] 3.8 Add the License section referencing MIT and linking to `LICENSE`; add back-to-top anchor links at the bottom of every section; verify all back-to-top links scroll to the page top on GitHub

## 4. Verify No Behavioral Changes

- [x] 4.1 Confirm that no behavioral changes were introduced by running `pnpm build` and verifying it completes without errors; all existing application features remain identical to before this change
