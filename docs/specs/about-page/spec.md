# about-page

## Purpose

The About page presents the site owner's professional profile — education, certifications, skills, and work history — to technical recruiters, hiring managers, and other visitors.

## Capabilities

### page-access

The system SHALL serve an About page at `/[lang]/about` for each supported locale (`zh-TW`, `en`, `ja`).

The page SHALL be reachable via the primary navigation at the same hierarchy level as Home and Projects.

### content-sections

The page SHALL display the following sections in order:

1. **Introduction** — professional summary
2. **Skills & Technologies** — categorised by domain (frontend, backend, cloud, tools)
3. **Education** — National Taiwan University (2017–2023), BA in Japanese Language & Literature, minor in Economics
4. **Certifications** — GCP (2025), TOEIC 965/990 (May 2024), USCPA (May 2023), JLPT N1 (July 2019)

Each certification entry SHALL include: full name, issuing organisation, date obtained, and score or level where applicable.

### multilingual-content

The page SHALL provide fully translated content in zh-TW, English, and Japanese.

Dates SHALL be formatted according to locale conventions (e.g., `2023年1月` in zh-TW/ja; `January 2023` in en).

### responsive-layout

The page SHALL render correctly at all viewport widths ≥ 320px with a minimum body font size of 14px.

### performance

The page SHALL achieve a Lighthouse performance score > 90 and fully load within 2 seconds on standard connections.

##### Example:

| GIVEN                               | WHEN                         | THEN                                                                 |
| ----------------------------------- | ---------------------------- | -------------------------------------------------------------------- |
| Visitor navigates to `/zh-TW/about` | Page loads                   | Sections Introduction, Skills, Education, Certifications are visible |
| Viewer switches language to `ja`    | Language toggle is activated | URL becomes `/ja/about` and all content is in Japanese               |
| Page is viewed on a 375 px viewport | Page loads                   | No horizontal scroll; font size ≥ 14 px                              |

## Requirements

### Requirement: BusinessCard above-article layout

The About page layout SHALL render the BusinessCard component above the article on all viewport widths. The two-column sticky aside layout (PersonalInfo as `lg:aside`) SHALL NOT be used.

The BusinessCard component SHALL contain the gradient name card and all social link buttons (GitHub, LinkedIn, Cake). The social link buttons SHALL be rendered inside the gradient card, not in a separate row below it.

#### Scenario: layout on large viewport

- **WHEN** the About page is viewed at viewport width ≥ 1024px
- **THEN** the BusinessCard renders as a full-width block above the article content
- **THEN** all social icon buttons are inside the gradient card

#### Scenario: layout on small viewport

- **WHEN** the About page is viewed at viewport width < 1024px
- **THEN** the BusinessCard renders above the article content with the same structure

---

### Requirement: about-page not-found guard

When the Sanity client returns no about document for the requested locale, the system SHALL call `notFound()` to return HTTP 404 instead of rendering a blank page.

#### Scenario: no about document for locale

- **WHEN** the about page is requested for a locale and `client.fetch(getAboutQuery)` returns `null`
- **THEN** `notFound()` is called and the request results in HTTP 404
- **THEN** the `about/[[...slug]]/not-found.tsx` page is rendered
