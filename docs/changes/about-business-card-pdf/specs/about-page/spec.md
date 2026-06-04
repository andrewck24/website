## ADDED Requirements

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

## REMOVED

### BusinessCard collapsed sticky header _(removed)_

This requirement was removed after implementation. The collapsed sticky header feature (IntersectionObserver / scroll event detection, `data-collapsed` CSS variants, click-to-top) produced unresolvable visual artifacts (infinite flicker loop caused by scroll anchoring feedback between the card's height change and `window.scrollY`). The feature has been removed in favour of a fully static BusinessCard. The pitfall documentation is preserved in `design.md` for future reference.

### Collapsed card click-to-top _(removed)_

Removed along with the collapsed sticky header above.
