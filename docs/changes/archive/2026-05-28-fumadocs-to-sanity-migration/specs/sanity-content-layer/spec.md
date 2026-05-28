## ADDED Requirements

### Requirement: Sanity document schemas

The system SHALL define Sanity document types for `note`, `project`, `about`, and `tag` in the `schemas/` directory at the project root.

The `note` schema SHALL include fields: `title` (string, required), `slug` (slug, source: title, required), `description` (text), `date` (date, required), `tags` (array of reference to `tag`), `featured` (boolean, default false), `coverImage` (image with hotspot), `body` (array of Portable Text blocks including `block` and `code` types, and a custom `card` block type).

The `project` schema SHALL extend `note` fields with: `githubUrl` (url, optional), `demoUrl` (url, optional), `order` (number 1–99, optional).

The `about` schema SHALL be a singleton document with fields: `title` (string), `body` (array of Portable Text blocks). The Studio structure SHALL prevent creating more than one `about` document per locale.

The `tag` schema SHALL include fields: `title` (string, required), `slug` (slug, source: title, required).

The `card` custom block type SHALL include fields: `title` (string, required), `href` (url, required).

#### Scenario: Note document creation

- **WHEN** a user creates a new `note` document in Sanity Studio
- **THEN** all required fields (title, slug, date) are enforced before publishing is allowed

#### Scenario: Project extends note fields

- **WHEN** a user creates a new `project` document
- **THEN** all note fields are available plus `githubUrl`, `demoUrl`, and `order`

#### Scenario: About singleton enforcement

- **WHEN** one `about` document per locale already exists in Studio
- **THEN** the Studio structure prevents creating a second `about` document for the same locale

### Requirement: Document-level i18n

The system SHALL use `@sanity/document-internationalization` plugin to manage multilingual content at the document level.

The plugin SHALL inject a `language` field into `note`, `project`, and `about` document types with allowed values `["zh-TW", "en", "ja"]`.

Each language version of a document SHALL share the same `slug.current` value across locales to enable locale-switching in the Next.js app.

#### Scenario: Creating a multilingual note

- **WHEN** a user creates a note in zh-TW and then creates a linked translation in en
- **THEN** both documents share the same slug and are linked via the i18n plugin's translation metadata
- **THEN** the GROQ query `*[_type == "note" && language == "en" && slug.current == $slug][0]` returns the English version

#### Scenario: Slug consistency across locales

- **WHEN** a note with slug `react-hooks-guide` exists in zh-TW, en, and ja
- **THEN** `getAvailableLocales("react-hooks-guide", "notes")` returns `["zh-TW", "en", "ja"]`

### Requirement: Sanity Studio embedded at /studio

The system SHALL serve Sanity Studio at the `/studio` route via the `NextStudio` component from `next-sanity`.

The `/studio` route SHALL be defined at `src/app/studio/[[...tool]]/page.tsx` and SHALL be excluded from the i18n locale-prefix middleware.

#### Scenario: Studio route access

- **WHEN** a user navigates to `/studio` in a browser
- **THEN** the Sanity Studio React application loads and displays the content management interface

#### Scenario: Studio route excluded from i18n middleware

- **WHEN** a user navigates to `/studio`
- **THEN** the i18n middleware does NOT redirect to `/zh-TW/studio` or any locale-prefixed path

### Requirement: GROQ-based data fetching

The system SHALL use `@sanity/client` with GROQ queries to fetch content data in the `src/lib/data/` layer.

Queries SHALL filter by `_type`, `language`, and `slug.current` to retrieve locale-specific documents.

All tag references SHALL be expanded inline using the GROQ `->` join operator to return `{ title, slug: slug.current }`.

The Sanity client SHALL be configured with `useCdn: true` for production reads and `useCdn: false` for revalidation requests.

#### Scenario: Fetching a single note

- **WHEN** `getNote("zh-TW", "react-hooks-guide")` is called
- **THEN** the system executes `*[_type == "note" && language == "zh-TW" && slug.current == "react-hooks-guide"][0]{ title, description, slug, date, tags[]->{ title, "slug": slug.current }, featured, coverImage, body }`
- **THEN** returns a `NotePageData` object or `null` if not found

#### Scenario: Fetching featured notes

- **WHEN** `getFeaturedNotes("en")` is called
- **THEN** the system returns all notes where `language == "en" && featured == true`, ordered by `date desc`

### Requirement: Portable Text rendering

The system SHALL render Portable Text content using `@portabletext/react` with a `components` prop that maps block types to React components.

The following block type mappings SHALL be defined in `src/components/mdx/portable-text.tsx`:

- `types.code` → a syntax-highlighted code block component (language + code fields)
- `types.card` → a `CardBlock` component rendering title and href as a styled link card
- `marks.link` → an anchor element with `href` attribute

#### Scenario: Rendering a code block

- **WHEN** a note body contains a Portable Text block of type `code` with `language: "tsx"` and `code: "const x = 1"`
- **THEN** the rendered output displays a syntax-highlighted code block with the tsx language identifier

#### Scenario: Rendering a card block

- **WHEN** a note body contains a Portable Text block of type `card` with `title: "Next.js 介紹"` and `href: "https://nextjs.org/docs"`
- **THEN** the rendered output displays a styled card with the title as a clickable link

### Requirement: Cover image via Sanity CDN

The system SHALL use `@sanity/image-url` to construct image URLs from Sanity image assets.

For article card display the system SHALL use `urlFor(coverImage).width(800).url()`.

For Open Graph images the system SHALL use `urlFor(coverImage).width(1200).height(675).fit("crop").url()` and pass this URL to `ImageResponse` in `opengraph-image.tsx`.

#### Scenario: OG image generation

- **WHEN** `opengraph-image.tsx` is rendered for a note with a `coverImage` asset
- **THEN** the response is a 1200×675 PNG sourced from the Sanity CDN transformation URL

#### Scenario: Missing cover image fallback

- **WHEN** a note has no `coverImage` set
- **THEN** `opengraph-image.tsx` renders a fallback gradient background instead of attempting to construct a Sanity image URL
