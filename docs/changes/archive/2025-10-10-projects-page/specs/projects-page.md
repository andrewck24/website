# @trace 2025-10-10-projects-page

## featured-projects-homepage [ADD]

The system SHALL display 3–5 manually ordered featured project cards on the homepage.

Each card SHALL contain: title, short description, and a representative image.

## project-detail-page [ADD]

Each project SHALL have a dedicated detail page with four narrative sections: Problem → Thinking Process → Solution → Impact.

## view-transition [ADD]

The card image SHALL animate into the detail page hero using the View Transitions API, with direct-navigation fallback.

This mechanism SHALL be reusable by the Notes section.

## mdx-content-management [ADD]

Project content SHALL be authored in MDX files via fumadocs-mdx and rendered with standard Markdown and custom component support.

## responsive-layout [ADD]

Mobile card layout: single-column. First card uses tall image-above-text; subsequent cards use image-left-text-right.
