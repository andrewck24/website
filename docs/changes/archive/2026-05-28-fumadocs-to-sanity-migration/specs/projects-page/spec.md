## REMOVED Requirements

### Requirement: mdx-content-management

**Reason**: fumadocs-mdx is removed. Project content is migrated from MDX files to Sanity `project` documents with Portable Text body fields.
**Migration**: Project content authored in MDX is re-entered manually in Sanity Studio. The `content/projects/` directory is removed. MDX rendering via `getMDXComponents` is replaced by Portable Text rendering via `@portabletext/react`.

#### Scenario: Project content served from Sanity not MDX

- **WHEN** a project detail page is rendered after this change
- **THEN** content is sourced from Sanity Portable Text and `content/projects/` does not exist in the repository

## MODIFIED Requirements

### Requirement: multilingual-content

Content SHALL be sourced from Sanity `project` documents filtered by `language` field, with full support for zh-TW, en, and ja locales at launch.

Project content SHALL no longer be sourced from MDX files. The `content/projects/` directory SHALL be removed.

The `src/lib/data/projects.ts` data layer SHALL use `@sanity/client` GROQ queries to fetch projects, replacing fumadocs source loader calls.

#### Scenario: Projects page served from Sanity

- **WHEN** a visitor navigates to `/zh-TW/projects`
- **THEN** featured projects are fetched from Sanity via `*[_type == "project" && language == "zh-TW" && featured == true] | order(order asc)`
- **THEN** project cards render with title, description, and cover image from Sanity assets

#### Scenario: Project detail page served from Sanity

- **WHEN** a visitor navigates to `/zh-TW/projects/volleybro`
- **THEN** the project document is fetched via `*[_type == "project" && language == "zh-TW" && slug.current == "volleybro"][0]`
- **THEN** the body field is rendered via `@portabletext/react` with custom block type mappings
