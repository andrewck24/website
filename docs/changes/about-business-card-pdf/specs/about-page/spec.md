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

### Requirement: BusinessCard collapsed sticky header

The BusinessCard component SHALL use an IntersectionObserver to detect when it has been scrolled past. Once scrolled past, the card SHALL snap to a condensed sticky state at the top of the viewport using CSS `position: sticky`.

On large viewports (≥ 1024px), the collapsed state SHALL display the owner name and job title on a single row alongside all social icon buttons.

On small viewports (< 1024px), the collapsed state SHALL display the owner name only.

The card SHALL use CSS `transition` properties to animate the visual change (opacity, padding, font-size). The layout direction change (block to flex-row) is not animated.

#### Scenario: card collapses on scroll — large viewport

- **WHEN** the user scrolls past the BusinessCard on a viewport ≥ 1024px
- **THEN** the card becomes sticky at the top of the viewport in a single-row condensed layout showing name, title, and social buttons

#### Scenario: card collapses on scroll — small viewport

- **WHEN** the user scrolls past the BusinessCard on a viewport < 1024px
- **THEN** the card becomes sticky at the top of the viewport showing only the owner name

#### Scenario: card re-expands on scroll up

- **WHEN** the user scrolls back to the top of the page
- **THEN** the BusinessCard returns to its full expanded layout

### Requirement: collapsed card click-to-top

When the BusinessCard is in the collapsed sticky state, clicking anywhere on the card SHALL call `window.scrollTo({ top: 0, behavior: 'smooth' })` to scroll the page to the top.

The card SHALL display `cursor-pointer` in the collapsed state only.

When the card is in the expanded state, clicking the card SHALL have no scroll effect.

#### Scenario: click collapsed card scrolls to top

- **WHEN** the BusinessCard is in the collapsed state and the user clicks it
- **THEN** the page scrolls smoothly to the top

#### Scenario: click expanded card does nothing

- **WHEN** the BusinessCard is in the expanded state and the user clicks it
- **THEN** no scroll effect occurs
