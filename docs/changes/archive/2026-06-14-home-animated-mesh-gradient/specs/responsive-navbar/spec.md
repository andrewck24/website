# responsive-navbar Specification (delta)

## MODIFIED Requirements

### Requirement: hero-grid-breakpoint

The home hero two-column grid (`grid-cols-2`) SHALL collapse to a single column at the `md` breakpoint (768 px) instead of the previous `lg` breakpoint (1024 px).

The terminal column SHALL have class `hidden md:block` — hidden below 768 px, visible at 768 px and above.

The `<h1>` name element font size SHALL use `clamp(36px, 10vw, 56px)` below 768 px, reverting to the standard `clamp(48px, 5.5vw, 80px)` above.

#### Scenario: Tablet layout (768–1023 px)

WHEN viewport width is between 768 px and 1023 px
THEN the hero SHALL render as two columns (text column + terminal column) and the terminal mockup SHALL be visible.

#### Scenario: Mobile layout (< 768 px)

WHEN viewport width is below 768 px
THEN the hero SHALL render as a single column and the terminal mockup SHALL NOT be visible (display: none).

#### Scenario: Desktop layout (≥ 1024 px)

WHEN viewport width is 1024 px or greater
THEN the hero SHALL render as two columns and the terminal mockup SHALL be visible, identical to the tablet layout.
