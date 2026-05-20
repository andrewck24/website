# article-components

## Purpose

A unified set of article display components shared by the Projects and Notes content types, supporting flexible hero visuals (static image or dynamic generated) and consistent presentation across list, detail, and social-share contexts.

## Capabilities

### unified-article-display

The system SHALL use a single component set to display articles from both Projects and Notes content types.

Components SHALL accept a shared `ArticleMetadata` type as their data contract.

### hero-visual-modes

The system SHALL support two hero visual modes:

- **Static image mode**: renders an uploaded image file at a specified path
- **Dynamic generation mode**: renders a generated visual from author-specified background configuration

In dynamic generation mode, the system SHALL support three background styles:

- CSS gradient (e.g., `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`)
- Solid colour (e.g., `#667eea`)
- Background image path

When a background value is invalid or an image path does not exist, the system SHALL fall back to the default gradient background.

When no hero visual configuration is provided, the system SHALL render the default style (gradient + article title).

### display-contexts

The system SHALL render the article hero visual consistently across three contexts:

1. **Article card** — list pages and featured sections
2. **Article detail page** — full-width hero at top of page
3. **Social share preview** — Open Graph image

### card-variants

The system SHALL provide two article card layout variants:

- **Hero variant** — large card for the first featured article
- **Compact variant** — standard-height card for list display

### existing-capabilities-preserved

The system SHALL preserve the following capabilities from prior implementations:

- Page transition animation from card to detail page (View Transitions)
- Multilingual support (zh-TW, en, ja)
- Responsive layout across desktop, tablet, and mobile

### notes-article-display

The Notes content type SHALL support the complete article display structure:

- Featured notes section
- Notes list page
- Notes detail page

##### Example:

| GIVEN                                                               | WHEN             | THEN                                                              |
| ------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------- |
| Article frontmatter sets `imageType: generated` and a CSS gradient  | Card is rendered | Gradient background is displayed on the card                      |
| Article image path does not exist                                   | Card is rendered | Default gradient background is used as fallback                   |
| Visitor switches language on an article with zh-TW, en, ja versions | Language toggled | Correct language content is shown; hero visual remains consistent |
