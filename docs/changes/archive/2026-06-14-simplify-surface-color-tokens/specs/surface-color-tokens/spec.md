## ADDED Requirements

### Requirement: two-surface-role-model

The site SHALL define exactly two surface color roles: `--background` (the page canvas, used by global layout and the home mesh-gradient background) and `--card` (the elevated container surface, shared by `Card`, `Popover`, and `Empty`-style components). No other surface role SHALL be introduced for general container backgrounds; components requiring a container background SHALL use one of these two roles.

#### Scenario: Global layout uses the page canvas role

- **WHEN** the root layout, navbar scrim, or home mesh-gradient background renders
- **THEN** it SHALL resolve its background color from `--background`

#### Scenario: Container components use the elevated-surface role

- **WHEN** `Card`, `PopoverContent`, or an `Empty` state container renders
- **THEN** it SHALL resolve its background color from `--card` (directly, or via `--popover`, which holds an identical value)

### Requirement: card-elevation-contrast

In both light mode and dark mode, `--card` SHALL resolve to a color that is perceptibly lighter than `--background`, so that card-family surfaces always read as visually elevated ("popped above") relative to the page behind them — the relationship SHALL NOT invert or collapse between modes.

#### Scenario: Light mode elevation

- **WHEN** the site renders in light mode
- **THEN** `--background` SHALL resolve to `#fafafa` (near-white) AND `--card`/`--popover` SHALL resolve to `#ffffff` (pure white), making the card lighter/brighter than the page

#### Scenario: Dark mode elevation

- **WHEN** the site renders in dark mode
- **THEN** `--background` SHALL resolve to `#080808` (near-black) AND `--card`/`--popover` SHALL resolve to `#171717` (a lighter near-black), making the card lighter than the page — preserving the same "card is lighter than page" relationship as light mode

##### Example: surface values by mode

| Token                  | Light mode | Dark mode |
| ---------------------- | ---------- | --------- |
| `--background`         | `#fafafa`  | `#080808` |
| `--card` / `--popover` | `#ffffff`  | `#171717` |

### Requirement: card-popover-value-parity

`--card` and `--popover` SHALL resolve to identical color values in both light and dark mode. They SHALL remain distinct CSS custom properties (not merged into one) to follow shadcn/ui's per-component semantic-slot convention, and this intentional value parity SHALL be documented in code comments and in the design specification so it is not mistaken for an inconsistency.

#### Scenario: Popover and Card render with the same resolved color

- **WHEN** a `PopoverContent` and a `Card` render in the same theme mode
- **THEN** their resolved background colors SHALL be identical, because `--popover` and `--card` are defined with the same value in that mode

### Requirement: no-redundant-background-tokens

The surface-color system SHALL NOT define CSS custom properties whose value is always identical to `--background` or `--card` and which exist solely to provide an alternate name for the same role. Components needing the page-canvas color SHALL reference `--background` directly.

#### Scenario: Mesh-gradient background references the canonical token

- **WHEN** the home mesh-gradient SVG renders its background rectangle
- **THEN** its fill SHALL resolve from `var(--background)` directly, with no intermediate alias token (e.g., no `--alt-mesh-bg`) in between
