# @trace 2025-10-19-article-components

## unified-article-display [ADD]

The system SHALL use a single component set (`ArticleCard`, `ArticleHero`, `ArticleDetail`) to display articles from both Projects and Notes.

Components SHALL accept `ArticleMetadata` as their shared data contract.

## hero-visual-modes [ADD]

The system SHALL support static image and dynamic generation hero visual modes.

Dynamic mode SHALL support CSS gradient, solid colour, and background image styles.

Invalid or missing configurations SHALL fall back to the default gradient background.

## display-contexts [ADD]

Hero visual SHALL render consistently in article cards, detail pages, and Open Graph images.

## card-variants [ADD]

`ArticleCard` SHALL support `variant="hero"` (large, first featured) and `variant="compact"` (standard list).

## notes-article-display [ADD]

Notes content type SHALL have featured section, list page, and detail page using the unified article components.

## view-transition [MODIFY]

View Transitions animation now applies to Notes articles in addition to Projects.
