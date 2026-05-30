## ADDED Requirements

### Requirement: Proxy excludes static SEO files from locale redirect

The proxy (`src/proxy.ts`) matcher SHALL exclude `robots.txt` and `sitemap.xml` from the locale-redirect logic so that these files are served directly without being prefixed with a locale path.

#### Scenario: Googlebot requests robots.txt

- **WHEN** a request arrives for `/robots.txt`
- **THEN** the proxy SHALL pass the request through without redirecting, and the response SHALL be 200 with valid robots.txt content

#### Scenario: Locale-prefixed robots.txt request

- **WHEN** a request arrives for `/<locale>/robots.txt` (e.g., `/zh-TW/robots.txt`)
- **THEN** the app SHALL return 404 (no route exists), and the proxy SHALL NOT redirect this path further

---

### Requirement: robots.txt disallows Sanity Studio and omits unreliable wildcard

The `robots.txt` response SHALL include `/studio` in the disallow list and SHALL NOT include a `*.json` wildcard pattern.

#### Scenario: Disallow list content

- **WHEN** a crawler fetches `/robots.txt`
- **THEN** the response SHALL contain `Disallow: /studio/` and SHALL NOT contain `*.json`

---

### Requirement: All pages emit hreflang and canonical link tags

Every page SHALL include `<link rel="canonical">` pointing to its own locale URL and `<link rel="alternate" hreflang="...">` entries for each available locale plus `hreflang="x-default"` pointing to the `zh-TW` variant.

#### Scenario: Static listing page includes all locales

- **WHEN** a crawler inspects the `<head>` of a listing page (e.g., `/zh-TW/notes`)
- **THEN** the page SHALL contain hreflang entries for `zh-TW`, `en`, `ja`, and `x-default`
- **THEN** the canonical tag SHALL point to the current locale URL

#### Scenario: Dynamic slug page includes only available locales

- **WHEN** a note exists only in `zh-TW` and `en` (not `ja`)
- **THEN** the `/zh-TW/notes/<slug>` page SHALL contain hreflang entries for `zh-TW`, `en`, and `x-default` only
- **THEN** no `ja` hreflang entry SHALL be present

##### Example: partial locale coverage

| Available locales   | Expected hreflang entries                |
| ------------------- | ---------------------------------------- |
| `zh-TW`, `en`, `ja` | `zh-TW`, `en`, `ja`, `x-default → zh-TW` |
| `zh-TW`, `en`       | `zh-TW`, `en`, `x-default → zh-TW`       |
| `zh-TW` only        | `zh-TW`, `x-default → zh-TW`             |

---

### Requirement: Sitemap includes all published Sanity notes and projects

The sitemap SHALL include a URL entry for every published note and project across all three locales (`zh-TW`, `en`, `ja`). Each entry's `lastModified` SHALL reflect the Sanity document's `_updatedAt` field.

#### Scenario: Sitemap contains dynamic content

- **WHEN** a crawler fetches `/sitemap.xml`
- **THEN** the response SHALL include URLs for all published notes and projects in all locales
- **THEN** each dynamic entry SHALL have a `lastModified` value matching the document's `_updatedAt`, not the build time

#### Scenario: Unpublished document omitted

- **WHEN** a Sanity document has no `slug` defined
- **THEN** it SHALL NOT appear in the sitemap

---

### Requirement: Homepage emits Person and WebSite JSON-LD

The homepage layout (`src/app/(site)/[lang]/layout.tsx`) SHALL render a `<script type="application/ld+json">` tag containing a `Person` schema (name, jobTitle, url, sameAs) and a `WebSite` schema (name, url).

#### Scenario: JSON-LD present on homepage

- **WHEN** a crawler or rich-results tool inspects any `/<lang>` page
- **THEN** the page SHALL contain a valid JSON-LD block with `@type: "Person"` and `@type: "WebSite"`

---

### Requirement: Note pages emit Article JSON-LD

Each note page SHALL render a `<script type="application/ld+json">` tag containing an `Article` schema with `headline`, `datePublished`, `dateModified` (from Sanity `_updatedAt`), and `author`.

#### Scenario: Article JSON-LD on note page

- **WHEN** a crawler inspects a `/[lang]/notes/[slug]` page
- **THEN** the page SHALL contain a JSON-LD block with `@type: "Article"`, `headline` matching the note title, and `author` referencing the site owner

---

### Requirement: Project pages emit CreativeWork JSON-LD

Each project page SHALL render a `<script type="application/ld+json">` tag containing a `CreativeWork` schema with `name`, `description`, and `author`.

#### Scenario: CreativeWork JSON-LD on project page

- **WHEN** a crawler inspects a `/[lang]/projects/[slug]` page
- **THEN** the page SHALL contain a JSON-LD block with `@type: "CreativeWork"`, `name` matching the project title

---

### Requirement: /llms.txt serves LLM-readable site index

`GET /llms.txt` SHALL return `Content-Type: text/plain` with a Markdown document listing all English notes and projects fetched from Sanity at request time.

#### Scenario: llms.txt format

- **WHEN** an LLM crawler requests `/llms.txt`
- **THEN** the response SHALL be plain text with the following structure:
  - An H1 heading with the site owner's name
  - A brief description line
  - An `## Notes` section listing each English note as `- [title](url): description`
  - A `## Projects` section listing each English project as `- [title](url): description`

#### Scenario: Content is current at request time

- **WHEN** a new note is published in Sanity and `/llms.txt` is requested
- **THEN** the new note SHALL appear in the response without requiring a site rebuild
