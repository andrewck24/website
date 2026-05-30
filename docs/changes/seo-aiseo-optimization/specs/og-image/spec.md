## ADDED Requirements

### Requirement: Article OG image uses Sanity coverImage when available

Note and project pages SHALL use the Sanity `coverImage` field as the Open Graph image when it is present on the document. The image SHALL be served at 1200×630 resolution.

#### Scenario: coverImage present

- **WHEN** a note or project document has a non-null `coverImage` in Sanity
- **THEN** the page's `og:image` meta tag SHALL reference that image URL
- **THEN** the image dimensions SHALL be 1200×630

---

### Requirement: Article OG image falls back to ImageResponse when coverImage is absent

When a note or project document has no `coverImage`, the page SHALL serve a dynamically generated image via Next.js `ImageResponse`. The generated image SHALL contain the article title and the site owner name "Andrew Tseng" on a simple background.

#### Scenario: No coverImage, fallback generated

- **WHEN** a note or project document has no `coverImage`
- **THEN** the page SHALL serve an `ImageResponse`-generated image at 1200×630
- **THEN** the generated image SHALL display the article title and the text "Andrew Tseng"

#### Scenario: Generated image is locale-aware title

- **WHEN** the note page is in `zh-TW` locale with a Chinese title
- **THEN** the generated image SHALL display the Chinese title as-is

---

### Requirement: OG image is registered via Next.js file-based convention

The OG image for note and project slug routes SHALL be registered by placing an `opengraph-image.tsx` file inside the respective route segment directory, using the Next.js file-based metadata convention.

#### Scenario: OG image file location

- **WHEN** the Next.js app builds
- **THEN** `src/app/(site)/[lang]/notes/[slug]/opengraph-image.tsx` SHALL be resolved as the OG image for note slug pages
- **THEN** `src/app/(site)/[lang]/projects/[slug]/opengraph-image.tsx` SHALL be resolved as the OG image for project slug pages
