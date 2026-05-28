## MODIFIED Requirements

### Requirement: multilingual-content

The About page SHALL provide fully translated content in zh-TW, English, and Japanese sourced from Sanity singleton documents, one per locale, fetched via `@sanity/client` GROQ query in `src/lib/data/about.ts`.

The About page SHALL no longer source content from MDX files in `content/about/`. The `content/about/` directory SHALL be removed.

Dates SHALL be formatted according to locale conventions (e.g., `2023年1月` in zh-TW/ja; `January 2023` in en).

#### Scenario: About page served from Sanity

- **WHEN** a visitor navigates to `/zh-TW/about`
- **THEN** the page content is fetched from the Sanity singleton document with `_type == "about" && language == "zh-TW"`
- **THEN** sections Introduction, Skills, Education, Certifications are visible with zh-TW content
