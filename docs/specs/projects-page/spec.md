# projects-page

## Purpose

The Projects section exposes the site owner's portfolio to visitors. A curated selection of projects is promoted on the homepage; each project links through to a standalone detail page with narrative structure.

## Capabilities

### featured-projects-homepage

The system SHALL display 3–5 featured project cards on the homepage at the same navigation level as Home and About.

Each card SHALL contain: project title, short description, and a representative image.

Featured projects SHALL be ordered manually.

### project-detail-page

Each project SHALL have a dedicated detail page reachable by clicking its card.

The detail page SHALL present content in four narrative sections: **Problem** → **Thinking Process** → **Solution** → **Impact**.

### view-transition

When a visitor clicks a project card, the card image SHALL transition into the detail page hero image using the View Transitions API.

When the browser does not support View Transitions, the system SHALL fall back to direct navigation.

This transition mechanism SHALL be reused by the Notes section.

### mdx-content-management

Project content SHALL be authored in MDX files managed with fumadocs-mdx.

The system SHALL correctly render standard Markdown elements and custom MDX components (text, images, code blocks).

### responsive-layout

Project cards SHALL display in a single-column layout on mobile devices.

The first card on mobile SHALL use a tall image-above-text layout; subsequent cards SHALL use a standard image-left-text-right layout.

### multilingual-content

Content SHALL default to zh-TW with progressive support for en and ja.

##### Example:

| GIVEN                         | WHEN                           | THEN                                                             |
| ----------------------------- | ------------------------------ | ---------------------------------------------------------------- |
| Homepage loads                | Visitor visits `/`             | 3–5 project cards are visible with title, description, and image |
| Visitor clicks a project card | View Transitions supported     | Card image animates into detail page hero                        |
| Visitor clicks a project card | View Transitions not supported | Direct navigation to detail page                                 |
| Visitor views detail page     | Page loaded                    | Four sections (Problem, Thinking, Solution, Impact) are present  |
