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
