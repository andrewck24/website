# home-mesh-gradient Specification

## Purpose

Defines the topographic-contour SVG mesh gradient background for the home hero section.

## ADDED Requirements

### Requirement: server-component-mesh

`MeshGradientBackground` SHALL be a React Server Component (no `"use client"` directive) that renders an inline SVG absolutely positioned to fill the hero `<section>`.

#### Scenario: Server render with no JS

WHEN the page is rendered server-side AND JavaScript is disabled in the browser
THEN the SVG markup SHALL be present in the HTML response and the mesh shapes SHALL be visible without any client-side hydration.

### Requirement: topographic-shape-set

The mesh gradient SVG SHALL contain exactly six shape elements in one blurred `<g>` group, corresponding to the six DESIGN.md gradient token pairs:

- Outer organic loop — `var(--alt-grad-dev-s)` (blue)
- Inner organic loop — `var(--alt-grad-prev-s)` (violet)
- Cross-sweep diagonal band — `var(--alt-grad-dev-e)` (teal)
- Focal inner core — `var(--alt-grad-prev-e)` (magenta)
- Accent polygon — `var(--alt-grad-ship-e)` (amber)
- Coral ellipse — `var(--alt-grad-ship-s)` (coral)

Each shape fill SHALL use `var(--alt-grad-*)` CSS variables — never hardcoded hex values.

#### Scenario: Shape fill tokens

WHEN the rendered SVG is inspected
THEN each shape element's `fill` attribute SHALL reference a `var(--alt-grad-*)` token, not a literal color value.

### Requirement: css-keyframe-animation

Each SVG shape SHALL have a CSS `@keyframes` animation applied via inline `style` prop. Shapes SHALL animate independently with different durations (9–13 s), translate offsets (±68 px), scale factors (0.93–1.09), and optional rotation (±8°). Animations SHALL loop infinitely.

#### Scenario: Animation without JS

WHEN JavaScript is disabled
THEN the CSS animations SHALL still play because they are driven by stylesheet rules, not RAF loops.

#### Scenario: Reduced motion

WHEN `@media (prefers-reduced-motion: reduce)` applies (already in `globals.css`)
THEN animation duration SHALL collapse to near-zero and animations SHALL play at most once, per the existing global rule.

### Requirement: css-var-theme-switching

The mesh gradient SHALL switch between dark and light rendering via CSS custom properties only — no `useTheme()` hook and no conditional React rendering.

Required CSS vars (already in `globals.css`):

- `--alt-mesh-blend`: `multiply` in `:root`, `normal` in `.dark`
- `--alt-mesh-bg`: `oklch(0.985 0 0)` (light page) in `:root`, `oklch(0.051 0 0)` (dark page) in `.dark`

The SVG background `<rect>` SHALL use `fill="var(--alt-mesh-bg)"`.
The shape `<g>` SHALL have `style={{ mixBlendMode: 'var(--alt-mesh-blend)' }}`.

#### Scenario: Theme switch flash-free

WHEN next-themes applies the `.dark` class to `<html>` synchronously before paint
THEN the mesh gradient colors SHALL switch without a flash of wrong background, because the transition is CSS-only.

### Requirement: hero-section-scope

`MeshGradientBackground` SHALL be mounted as a direct child of the `ProfileHero` `<section>` element. The `<section>` SHALL have `position: relative; overflow: hidden`. The SVG SHALL have `position: absolute; inset: 0; width: 100%; height: 100%`.

The component SHALL NOT be mounted at page level or as a `fixed` overlay.

#### Scenario: Mesh scrolls with hero

WHEN the user scrolls past the hero section
THEN the mesh gradient SHALL scroll off-screen with the hero content, not remain fixed on the page.

### Requirement: right-focal-composition

The topographic shapes SHALL be concentrated in the right half of the hero (x ≥ 650 in a 1400-unit viewBox), matching the terminal mockup column position. The left text column SHALL remain largely dark with minimal colour bleed from the mesh.

σ = 66 (feGaussianBlur stdDeviation). The filter region SHALL use `filterUnits="userSpaceOnUse"` with oversized bounds (x="-1200" y="-1200" width="3800" height="3000") to prevent clipping artefacts.

#### Scenario: Left column readability

WHEN the mesh gradient is active on a dark background
THEN the left quarter of the hero (x < 350 px at 1400 px viewport) SHALL have no visible colour bleed from the mesh shapes, verified visually.
